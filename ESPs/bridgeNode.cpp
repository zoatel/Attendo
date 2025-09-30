#include <Arduino.h>
#include <painlessMesh.h>
#include <ArduinoJson.h>
#include <freertos/FreeRTOS.h>
#include <freertos/queue.h>

// Mesh configuration
#define MESH_PREFIX     "AttendanceMesh"
#define MESH_PASSWORD   "meshpassword123"
#define MESH_PORT       5555
#define MESH_CHANNEL    6

// UART configuration for communication with Gateway Node
#define UART_BAUD_RATE  9600
#define RX_BUFFER_SIZE  2048
#define MAX_JSON_SIZE   512

// UART pins for ESP32 - Gateway communication (UART2)
#define UART_RX 16
#define UART_TX 17

// Status LED pins
#define LED_MESH_ACTIVITY 12
#define LED_UART_ACTIVITY 13

// Message queue configuration
#define MAX_MESSAGE_QUEUE_SIZE 50
struct QueuedMessage {
    char json[MAX_JSON_SIZE];
    uint32_t messageId; // Unique message ID
    unsigned long timestamp; // Time last sent
    uint8_t retryCount; // Number of retries
};
QueueHandle_t messageQueue;

// ACK tracking
#define ACK_TIMEOUT 5000 // 5 seconds timeout for ACK
#define MAX_RETRIES 10 // Max retries for critical messages
#define SEND_INTERVAL 100 // Delay between send attempts (ms)

// Mesh network instance
painlessMesh mesh;
bool meshInitialized = false;
bool targetNodeConnected = false;
#define TARGET_NODE_ID 2662109189

// Buffer for UART reception
char uartRxBuffer[RX_BUFFER_SIZE];
int uartRxIndex = 0;

// JSON message handling
String jsonAccumulator = "";
bool jsonMessageInProgress = false;
bool jsonStartMarkerSeen = false;
unsigned long lastJsonCharTime = 0;
#define JSON_TIMEOUT 1000

// Function declarations
void receivedCallback(uint32_t from, String &msg);
void newConnectionCallback(uint32_t nodeId);
void droppedConnectionCallback(uint32_t nodeId);
void sendToGateway(const String &message);
void processSerialInput();
void processCompleteJson(const String &jsonString);
bool isValidJson(const String &jsonString);
void sendQueuedMessages();
void checkAckTimeouts();
String addMessageId(String jsonString, uint32_t messageId);
void checkTargetNodeConnection();

// Global message ID counter
uint32_t messageIdCounter = 0;

void setup() {
  Serial.begin(UART_BAUD_RATE);
  Serial2.begin(UART_BAUD_RATE, SERIAL_8N1, UART_RX, UART_TX);
  while (Serial2.available()) Serial2.read(); // Clear stray data
  delay(500);
  Serial.println("\n\n=== Bridge Node Starting ===");
  
  // Wait for READY message from Gateway
  String received;
  unsigned long startTime = millis();
  while (millis() - startTime < 5000) {
    if (Serial2.available()) {
      received = Serial2.readStringUntil('\n');
      received.trim();
      if (received == "READY") {
        Serial.println("Received READY from Gateway");
        break;
      }
    }
  }

    pinMode(LED_MESH_ACTIVITY, OUTPUT);
    pinMode(LED_UART_ACTIVITY, OUTPUT);
    digitalWrite(LED_MESH_ACTIVITY, LOW);
    digitalWrite(LED_UART_ACTIVITY, LOW);

    messageQueue = xQueueCreate(MAX_MESSAGE_QUEUE_SIZE, sizeof(QueuedMessage));
    if (messageQueue == NULL) {
        Serial.println("Error creating message queue");
        while(1);
    }

    mesh.setDebugMsgTypes(ERROR | STARTUP);
    mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT, WIFI_AP_STA, MESH_CHANNEL);
    mesh.onReceive(&receivedCallback);
    mesh.onNewConnection(&newConnectionCallback);
    mesh.onDroppedConnection(&droppedConnectionCallback);

    meshInitialized = true;
    Serial.println("Mesh network initialized");

    memset(uartRxBuffer, 0, RX_BUFFER_SIZE);

    checkTargetNodeConnection();

    for (int i = 0; i < 3; i++) {
        digitalWrite(LED_MESH_ACTIVITY, HIGH);
        digitalWrite(LED_UART_ACTIVITY, HIGH);
        delay(100);
        digitalWrite(LED_MESH_ACTIVITY, LOW);
        digitalWrite(LED_UART_ACTIVITY, LOW);
        delay(100);
    }
    Serial.println("Bridge Node ready");
}

void loop() {
    if (meshInitialized) {
        mesh.update();
    }

    processSerialInput();

    if (jsonMessageInProgress && millis() - lastJsonCharTime > JSON_TIMEOUT) {
        Serial.println("JSON message timed out, reset accumulator");
        jsonAccumulator = "";
        jsonMessageInProgress = false;
        jsonStartMarkerSeen = false;
    }

    checkTargetNodeConnection();
    if (targetNodeConnected && uxQueueMessagesWaiting(messageQueue) > 0) {
        sendQueuedMessages();
        checkAckTimeouts();
    }

    delay(10);
}

bool isValidJson(const String &jsonString) {
    DynamicJsonDocument doc(2048);
    DeserializationError error = deserializeJson(doc, jsonString);
    if (error) {
        Serial.printf("JSON validation failed: %s\n", error.c_str());
        return false;
    }
    return true;
}

String addMessageId(String jsonString, uint32_t messageId) {
    DynamicJsonDocument doc(2048);
    DeserializationError error = deserializeJson(doc, jsonString);
    if (error) {
        Serial.printf("Failed to parse JSON for adding messageId: %s\n", error.c_str());
        return jsonString;
    }
    doc["messageId"] = messageId;
    String output;
    serializeJson(doc, output);
    return output;
}

void checkTargetNodeConnection() {
    std::list<uint32_t> nodeList = mesh.getNodeList();
    bool found = false;
    for (auto &node : nodeList) {
        if (node == TARGET_NODE_ID) {
            found = true;
            break;
        }
    }

    bool stateChanged = (found != targetNodeConnected);
    targetNodeConnected = found;

    if (stateChanged) {
        if (targetNodeConnected) {
            Serial.printf("Target node %u connected\n", TARGET_NODE_ID);
            QueuedMessage queuedMessage;
            UBaseType_t queueSize = uxQueueMessagesWaiting(messageQueue);
            for (UBaseType_t i = 0; i < queueSize; i++) {
                if (xQueueReceive(messageQueue, &queuedMessage, 0) == pdTRUE) {
                    queuedMessage.retryCount = 0;
                    queuedMessage.timestamp = 0;
                    xQueueSend(messageQueue, &queuedMessage, 0);
                }
            }
            Serial.println("Reset retry counts for queued messages");
        } else {
            Serial.printf("Target node %u disconnected\n", TARGET_NODE_ID);
        }
    }
}

void sendQueuedMessages() {
    if (!targetNodeConnected) {
        Serial.printf("Target node %u not connected, buffering messages\n", TARGET_NODE_ID);
        return;
    }

    QueuedMessage queuedMessage;
    if (xQueuePeek(messageQueue, &queuedMessage, 0) == pdTRUE) {
        // Only send if the message hasn't been sent recently
        if (queuedMessage.timestamp == 0 || (millis() - queuedMessage.timestamp >= ACK_TIMEOUT)) {
            if (xQueueReceive(messageQueue, &queuedMessage, 0) == pdTRUE) {
                String jsonStr = String(queuedMessage.json);
                if (jsonStr.length() > 0 && isValidJson(jsonStr)) {
                    Serial.printf("Sending queued message ID %u: %s\n", queuedMessage.messageId, jsonStr.c_str());
                    mesh.sendSingle(TARGET_NODE_ID, jsonStr);
                    queuedMessage.timestamp = millis();
                    queuedMessage.retryCount++;
                    xQueueSend(messageQueue, &queuedMessage, 0);
                } else {
                    Serial.printf("Skipping invalid or empty queued message: %s\n", jsonStr.c_str());
                }
            }
            delay(SEND_INTERVAL); // Pause to allow ACK response
        }
    }
}

void checkAckTimeouts() {
    if (!targetNodeConnected) {
        Serial.printf("Target node %u not connected, pausing ACK timeout checks\n", TARGET_NODE_ID);
        return;
    }

    QueuedMessage queuedMessage;
    UBaseType_t queueSize = uxQueueMessagesWaiting(messageQueue);
    for (UBaseType_t i = 0; i < queueSize; i++) {
        if (xQueueReceive(messageQueue, &queuedMessage, 0) == pdTRUE) {
            if (queuedMessage.timestamp == 0) {
                xQueueSend(messageQueue, &queuedMessage, 0);
                continue;
            }
            if (queuedMessage.retryCount >= MAX_RETRIES) {
                Serial.printf("Message ID %u exceeded max retries (%d), discarding\n", queuedMessage.messageId, MAX_RETRIES);
                continue;
            }
            if (millis() - queuedMessage.timestamp > ACK_TIMEOUT) {
                Serial.printf("Message ID %u timed out, retrying (%d/%d)\n", queuedMessage.messageId, queuedMessage.retryCount, MAX_RETRIES);
                String jsonStr = String(queuedMessage.json);
                if (jsonStr.length() > 0 && isValidJson(jsonStr)) {
                    mesh.sendSingle(TARGET_NODE_ID, jsonStr);
                    Serial.printf("Retransmitted message ID %u: %s\n", queuedMessage.messageId, jsonStr.c_str());
                }
                queuedMessage.timestamp = millis();
                queuedMessage.retryCount++;
                if (queuedMessage.retryCount < MAX_RETRIES) {
                    xQueueSend(messageQueue, &queuedMessage, 0);
                } else {
                    Serial.printf("Message ID %u exceeded max retries, discarding\n", queuedMessage.messageId);
                }
            } else {
                xQueueSend(messageQueue, &queuedMessage, 0);
            }
        }
    }
}

void processSerialInput() {
    while (Serial2.available() > 0) {
        char c = Serial2.read();
        digitalWrite(LED_UART_ACTIVITY, HIGH);
        lastJsonCharTime = millis();

        if (c == '\n' || c == '\r') {
            uartRxBuffer[uartRxIndex] = '\0';
            String line = String(uartRxBuffer);
            line.trim();

            if (line.length() > 0) {
                Serial.printf("Received from Gateway: %s\n", line.c_str());
                if (line.startsWith("START_JSON:")) {
                    if (jsonMessageInProgress) {
                        Serial.println("Warning: New START_JSON received while message in progress, resetting");
                        jsonAccumulator = "";
                    }
                    jsonMessageInProgress = true;
                    jsonStartMarkerSeen = true;
                    jsonAccumulator = line.substring(11);
                } else if (line == "END_JSON") {
                    if (jsonMessageInProgress && jsonStartMarkerSeen) {
                        processCompleteJson(jsonAccumulator);
                    } else {
                        Serial.println("Ignoring END_JSON: No valid START_JSON received");
                    }
                    jsonAccumulator = "";
                    jsonMessageInProgress = false;
                    jsonStartMarkerSeen = false;
                } else if (jsonMessageInProgress && jsonStartMarkerSeen) {
                    jsonAccumulator += line;
                } else {
                    Serial.println("Ignoring unexpected line: Not in JSON message");
                }
            }
            memset(uartRxBuffer, 0, RX_BUFFER_SIZE);
            uartRxIndex = 0;
        } else if (uartRxIndex < RX_BUFFER_SIZE - 1) {
            uartRxBuffer[uartRxIndex++] = c;
        }
        digitalWrite(LED_UART_ACTIVITY, LOW);
    }
}

void processCompleteJson(const String &jsonString) {
    Serial.printf("Processing complete JSON: %s\n", jsonString.c_str());
    int startPos = jsonString.indexOf('{');
    if (startPos == -1) {
        Serial.println("No valid JSON opening brace found");
        return;
    }
    int endPos = jsonString.lastIndexOf('}');
    if (endPos == -1 || endPos <= startPos) {
        Serial.println("No valid JSON closing brace found");
        return;
    }
    String cleanJson = jsonString.substring(startPos, endPos + 1);
    Serial.printf("Clean JSON: %s\n", cleanJson.c_str());

    if (cleanJson.length() > 0 && isValidJson(cleanJson)) {
        uint32_t currentMessageId = messageIdCounter++;
        String jsonWithId = addMessageId(cleanJson, currentMessageId);

        QueuedMessage queuedMessage;
        strncpy(queuedMessage.json, jsonWithId.c_str(), MAX_JSON_SIZE - 1);
        queuedMessage.json[MAX_JSON_SIZE - 1] = '\0';
        queuedMessage.messageId = currentMessageId;
        queuedMessage.timestamp = 0;
        queuedMessage.retryCount = 0;
        if (xQueueSend(messageQueue, &queuedMessage, 0) == pdTRUE) {
            Serial.printf("Queued message ID %u\n", currentMessageId);
        } else {
            Serial.println("Failed to queue JSON message, queue full");
        }

        if (targetNodeConnected) {
            mesh.sendSingle(TARGET_NODE_ID, jsonWithId);
            Serial.println("Forwarded clean JSON to mesh network");
            queuedMessage.timestamp = millis();
            queuedMessage.retryCount++;
            xQueueSend(messageQueue, &queuedMessage, 0);
        } else {
            Serial.printf("Target node %u not connected, buffering message ID %u\n", TARGET_NODE_ID, currentMessageId);
        }
    } else {
        Serial.println("Invalid or empty JSON after cleaning, not forwarding or queueing");
    }
}

void sendToGateway(const String &message) {
    digitalWrite(LED_UART_ACTIVITY, HIGH);
    Serial2.println(message);
    Serial.printf("Sent to Gateway: %s\n", message.c_str());
    digitalWrite(LED_UART_ACTIVITY, LOW);
}

void receivedCallback(uint32_t from, String &msg) {
    digitalWrite(LED_MESH_ACTIVITY, HIGH);
    Serial.printf("Mesh message from %u: %s\n", from, msg.c_str());

    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, msg);
    if (error) {
        Serial.printf("JSON parsing failed: %s\n", error.c_str());
        digitalWrite(LED_MESH_ACTIVITY, LOW);
        return;
    }

    if (doc.containsKey("ack") && doc.containsKey("messageId")) {
        uint32_t ackMessageId = doc["messageId"].as<uint32_t>();
        Serial.printf("Received ACK for message ID %u from node %u\n", ackMessageId, from);

        QueuedMessage queuedMessage;
        UBaseType_t queueSize = uxQueueMessagesWaiting(messageQueue);
        for (UBaseType_t i = 0; i < queueSize; i++) {
            if (xQueueReceive(messageQueue, &queuedMessage, 0) == pdTRUE) {
                if (queuedMessage.messageId != ackMessageId) {
                    xQueueSend(messageQueue, &queuedMessage, 0);
                } else {
                    Serial.printf("Removed acknowledged message ID %u from queue\n", ackMessageId);
                }
            }
        }
    } else if (doc.containsKey("card") && doc.containsKey("attendance")) {
        sendToGateway(msg);
        Serial.println("Forwarded attendance data to Gateway");
    } else {
        Serial.println("Non-attendance message, not forwarding");
    }
    digitalWrite(LED_MESH_ACTIVITY, LOW);
}

void newConnectionCallback(uint32_t nodeId) {
    Serial.printf("New connection: Node %u joined the mesh\n", nodeId);
    checkTargetNodeConnection();
    if (targetNodeConnected && uxQueueMessagesWaiting(messageQueue) > 0) {
        sendQueuedMessages();
    }
    for (int i = 0; i < 2; i++) {
        digitalWrite(LED_MESH_ACTIVITY, HIGH);
        delay(100);
        digitalWrite(LED_MESH_ACTIVITY, LOW);
        delay(100);
    }
}

void droppedConnectionCallback(uint32_t nodeId) {
    Serial.printf("Lost connection: Node %u left the mesh\n", nodeId);
    checkTargetNodeConnection();
    for (int i = 0; i < 4; i++) {
        digitalWrite(LED_MESH_ACTIVITY, HIGH);
        delay(50);
        digitalWrite(LED_MESH_ACTIVITY, LOW);
        delay(50);
    }
}