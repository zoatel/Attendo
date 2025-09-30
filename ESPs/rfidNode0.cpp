#include <Arduino.h>
#include <BTScanner.h>
#include <SPI.h>
#include <MFRC522.h>
#include <painlessMesh.h>
#include <ArduinoJson.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>

// Mesh configuration
#define MESH_PREFIX     "AttendanceMesh"
#define MESH_PASSWORD   "meshpassword123"
#define MESH_PORT       5555
#define MESH_CHANNEL    6

// Node configuration
#define NODE_ID         1
#define TARGET_NODE_ID  4072092745

// RC522 configuration
#define RFID_SS_PIN 5
#define RFID_RST_PIN 4
MFRC522 rfid(RFID_SS_PIN, RFID_RST_PIN);

// Bluetooth scanner
BTScanner scanner;
#define SCAN_DURATION 8
#define MAX_DISTANCE 1.0
#define MAX_RETRY_COUNT 3

// Timing and state tracking
unsigned long scanStartTime = 0;
unsigned long lastCardReadTime = 0;
#define CARD_DEBOUNCE_DELAY 1500
bool cardPresent = false;

// Card and phone linking
#define MAX_CARDS 50
#define UID_SIZE 11
#define MAC_SIZE 18
#define SESSION_ID_SIZE 30

// Session management
struct SessionData {
    bool active;
    char sessionId[SESSION_ID_SIZE];
    char sessionName[50];
    struct CardEntry {
        char uid[UID_SIZE];
        char mac[MAC_SIZE];
        bool attendanceRecorded;
    } cards[MAX_CARDS];
    int cardCount;
};
SessionData currentSession = {false, "", "", {}, 0};

// Event data structure for attendance reports
struct AttendanceEvent {
    char uid[UID_SIZE];
    char sessionId[SESSION_ID_SIZE];
    bool present;
};

// Queue for storing events
QueueHandle_t eventQueue;
#define MAX_QUEUE_SIZE 100

// Status and debug LEDs
#define LED_SUCCESS 12
#define LED_FAILURE 13
#define LED_SCANNING 14
#define LED_SESSION 15

// Mesh network instance
painlessMesh mesh;
bool targetNodeConnected = false;

// Task handles
TaskHandle_t rfidTaskHandle = NULL;
TaskHandle_t meshTaskHandle = NULL;

// Track received message IDs to prevent duplicates
#define MAX_MESSAGE_IDS 50
uint32_t receivedMessageIds[MAX_MESSAGE_IDS];
int messageIdCount = 0;

void rfidTask(void *pvParameters);
void meshTask(void *pvParameters);
void receivedCallback(uint32_t from, String &msg);
void processSessionMessage(JsonDocument &doc);
void newConnectionCallback(uint32_t nodeId);
void droppedConnectionCallback(uint32_t nodeId);
String createAttendanceJson(const AttendanceEvent &event);
void sendQueuedEvents();
void checkTargetNodeConnection();
int findCardIndex(const char* uid);
bool verifyAttendance(int cardIndex);
void sendAck(uint32_t from, uint32_t messageId);
bool isMessageIdProcessed(uint32_t messageId);
void addMessageId(uint32_t messageId);

String uidToString(byte *uid, byte uidSize) {
    String uidStr = "";
    for (byte i = 0; i < uidSize; i++) {
        if (uid[i] < 0x10) uidStr += "0";
        uidStr += String(uid[i], HEX);
    }
    uidStr.toUpperCase();
    return uidStr;
}

int findCardIndex(const char* uid) {
    for (int i = 0; i < currentSession.cardCount; i++) {
        if (strncmp(currentSession.cards[i].uid, uid, UID_SIZE-1) == 0) {
            return i;
        }
    }
    return -1;
}

bool verifyAttendance(int cardIndex) {
    if (cardIndex < 0 || cardIndex >= currentSession.cardCount) {
        return false;
    }
    
    const char* linkedMac = currentSession.cards[cardIndex].mac;
    int deviceIndex = scanner.findDeviceByMac(linkedMac);
    if (deviceIndex < 0) {
        Serial.printf("Phone %s not found nearby\n", linkedMac);
        return false;
    }
    
    float distance = scanner.getDeviceDistance(deviceIndex);
    if (distance <= MAX_DISTANCE) {
        Serial.printf("Attendance verified! Phone %s at %.2fm\n", linkedMac, distance);
        return true;
    } else {
        Serial.printf("Phone %s too far away (%.2fm)\n", linkedMac, distance);
        return false;
    }
}

String createAttendanceJson(const AttendanceEvent &event) {
    StaticJsonDocument<192> doc;
    doc["node"] = NODE_ID;
    doc["sessionId"] = event.sessionId;
    doc["card"] = event.uid;
    doc["attendance"] = event.present;
    String output;
    serializeJson(doc, output);
    return output;
}

void sendAck(uint32_t from, uint32_t messageId) {
    StaticJsonDocument<128> doc;
    doc["ack"] = true;
    doc["messageId"] = messageId;
    doc["node"] = NODE_ID;
    String ackMsg;
    serializeJson(doc, ackMsg);
    mesh.sendSingle(from, ackMsg);
    Serial.printf("Sent ACK for message ID %u to node %u\n", messageId, from);
}

bool isMessageIdProcessed(uint32_t messageId) {
    for (int i = 0; i < messageIdCount; i++) {
        if (receivedMessageIds[i] == messageId) {
            return true;
        }
    }
    return false;
}

void addMessageId(uint32_t messageId) {
    if (messageIdCount < MAX_MESSAGE_IDS) {
        receivedMessageIds[messageIdCount++] = messageId;
    } else {
        // Shift array and add new ID
        for (int i = 1; i < MAX_MESSAGE_IDS; i++) {
            receivedMessageIds[i-1] = receivedMessageIds[i];
        }
        receivedMessageIds[MAX_MESSAGE_IDS-1] = messageId;
    }
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
            Serial.printf("Target node %u connected, will send queued events\n", TARGET_NODE_ID);
            sendQueuedEvents();
        } else {
            Serial.printf("Target node %u disconnected, buffering events\n", TARGET_NODE_ID);
        }
    }
    
    if (targetNodeConnected && uxQueueMessagesWaiting(eventQueue) > 0) {
        sendQueuedEvents();
    }
}

void sendQueuedEvents() {
    if (targetNodeConnected) {
        AttendanceEvent event;
        int eventsSent = 0;
        while (xQueueReceive(eventQueue, &event, 0) == pdTRUE) {
            String jsonData = createAttendanceJson(event);
            mesh.sendBroadcast(jsonData);
            Serial.printf("Sent attendance event: %s\n", jsonData.c_str());
            eventsSent++;
            delay(10);
        }
        if (eventsSent > 0) {
            Serial.printf("Sent %d queued events\n", eventsSent);
        }
    } else {
        Serial.printf("Target node %u not connected, buffering events (%u in queue)\n", 
                   TARGET_NODE_ID, uxQueueMessagesWaiting(eventQueue));
    }
}

void processSessionMessage(JsonDocument &doc) {
    if (!doc.containsKey("node") || doc["node"].as<int>() != NODE_ID) {
        Serial.println("Ignoring message - not addressed to this node");
        return;
    }
    
    bool state = doc["state"];
    String sessionName = doc["session"].as<String>();
    String sessionId = doc["sessionId"].as<String>();
    
    if (state) {
        if (currentSession.active) {
            Serial.println("Ignoring session start - a session is already active");
            return;
        }
        Serial.printf("Starting new session: %s (ID: %s)\n", sessionName.c_str(), sessionId.c_str());
        strncpy(currentSession.sessionName, sessionName.c_str(), sizeof(currentSession.sessionName)-1);
        currentSession.sessionName[sizeof(currentSession.sessionName)-1] = '\0';
        strncpy(currentSession.sessionId, sessionId.c_str(), sizeof(currentSession.sessionId)-1);
        currentSession.sessionId[sizeof(currentSession.sessionId)-1] = '\0';
        currentSession.cardCount = 0;
        
        JsonObject data = doc["data"];
        for (JsonPair kv : data) {
            const char* uid = kv.key().c_str();
            const char* mac = kv.value().as<const char*>();
            if (currentSession.cardCount >= MAX_CARDS) {
                Serial.println("Warning: Maximum number of cards reached for session");
                break;
            }
            strncpy(currentSession.cards[currentSession.cardCount].uid, uid, UID_SIZE-1);
            currentSession.cards[currentSession.cardCount].uid[UID_SIZE-1] = '\0';
            strncpy(currentSession.cards[currentSession.cardCount].mac, mac, MAC_SIZE-1);
            currentSession.cards[currentSession.cardCount].mac[MAC_SIZE-1] = '\0';
            currentSession.cards[currentSession.cardCount].attendanceRecorded = false;
            currentSession.cardCount++;
            Serial.printf("Added card %s with MAC %s\n", uid, mac);
        }
        currentSession.active = true;
        digitalWrite(LED_SESSION, HIGH);
        Serial.printf("Session %s (ID: %s) started with %d cards\n", 
                     currentSession.sessionName, currentSession.sessionId, currentSession.cardCount);
    } else {
        if (strncmp(currentSession.sessionName, sessionName.c_str(), sizeof(currentSession.sessionName)) == 0 &&
            strncmp(currentSession.sessionId, sessionId.c_str(), sizeof(currentSession.sessionId)) == 0) {
            Serial.printf("Ending session: %s (ID: %s)\n", sessionName.c_str(), sessionId.c_str());
            currentSession.active = false;
            digitalWrite(LED_SESSION, LOW);
        } else {
            Serial.printf("Received end command for unknown or different session: %s (ID: %s)\n", 
                        sessionName.c_str(), sessionId.c_str());
        }
    }
}

void receivedCallback(uint32_t from, String &msg) {
    Serial.printf("Received from %u: %s\n", from, msg.c_str());
    
    StaticJsonDocument<1024> doc;
    DeserializationError error = deserializeJson(doc, msg);
    if (error) {
        Serial.printf("JSON parsing failed: %s\n", error.c_str());
        return;
    }

    // Check for messageId
    uint32_t messageId = 0;
    if (doc.containsKey("messageId")) {
        messageId = doc["messageId"].as<uint32_t>();
        if (isMessageIdProcessed(messageId)) {
            Serial.printf("Message ID %u already processed, sending ACK and ignoring\n", messageId);
            sendAck(from, messageId);
            return;
        }
        addMessageId(messageId);
    }

    // Process session message
    if (doc.containsKey("session") && doc.containsKey("state") && doc.containsKey("sessionId")) {
        processSessionMessage(doc);
        if (messageId > 0) {
            sendAck(from, messageId);
        }
    }
}

void newConnectionCallback(uint32_t nodeId) {
    Serial.printf("New connection: %u\n", nodeId);
    if (nodeId == TARGET_NODE_ID) {
        targetNodeConnected = true;
        Serial.printf("Target node %u connected\n", TARGET_NODE_ID);
        sendQueuedEvents();
    }
}

void droppedConnectionCallback(uint32_t nodeId) {
    Serial.printf("Dropped connection: %u\n", nodeId);
    if (nodeId == TARGET_NODE_ID) {
        targetNodeConnected = false;
        Serial.printf("Target node %u disconnected\n", TARGET_NODE_ID);
    }
}

void rfidTask(void *pvParameters) {
    while (1) {
        if (currentSession.active) {
            if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
                unsigned long currentTime = millis();
                if (!cardPresent || (currentTime - lastCardReadTime > CARD_DEBOUNCE_DELAY)) {
                    cardPresent = true;
                    lastCardReadTime = currentTime;
                    String uidStr = uidToString(rfid.uid.uidByte, rfid.uid.size);
                    char currentUid[UID_SIZE];
                    strncpy(currentUid, uidStr.c_str(), UID_SIZE-1);
                    currentUid[UID_SIZE-1] = '\0';
                    Serial.printf("Card detected: %s\n", currentUid);
                    int cardIndex = findCardIndex(currentUid);
                    if (cardIndex >= 0) {
                        if (currentSession.cards[cardIndex].attendanceRecorded) {
                            Serial.printf("Attendance for card %s already recorded in this session\n", currentUid);
                            digitalWrite(LED_SUCCESS, HIGH);
                            delay(200);
                            digitalWrite(LED_SUCCESS, LOW);
                            rfid.PICC_HaltA();
                            rfid.PCD_StopCrypto1();
                            continue;
                        }
                        digitalWrite(LED_SCANNING, HIGH);
                        Serial.println("Starting Bluetooth scan...");
                        scanner.clearDevices();
                        if (!scanner.startScan(SCAN_DURATION)) {
                            Serial.println("ERROR: Bluetooth scan failed to start");
                            digitalWrite(LED_SCANNING, LOW);
                            digitalWrite(LED_FAILURE, HIGH);
                            delay(500);
                            digitalWrite(LED_FAILURE, LOW);
                            rfid.PICC_HaltA();
                            rfid.PCD_StopCrypto1();
                            continue;
                        }
                        scanStartTime = currentTime;
                        while (millis() - scanStartTime < SCAN_DURATION * 1000) {
                            digitalWrite(LED_SCANNING, !digitalRead(LED_SCANNING));
                            delay(100);
                        }
                        digitalWrite(LED_SCANNING, LOW);
                        if (verifyAttendance(cardIndex)) {
                            currentSession.cards[cardIndex].attendanceRecorded = true;
                            AttendanceEvent event;
                            strncpy(event.uid, currentUid, UID_SIZE-1);
                            event.uid[UID_SIZE-1] = '\0';
                            strncpy(event.sessionId, currentSession.sessionId, SESSION_ID_SIZE-1);
                            event.sessionId[SESSION_ID_SIZE-1] = '\0';
                            event.present = true;
                            xQueueSend(eventQueue, &event, 0);
                            if (targetNodeConnected) {
                                sendQueuedEvents();
                            }
                            digitalWrite(LED_SUCCESS, HIGH);
                            delay(500);
                            digitalWrite(LED_SUCCESS, LOW);
                        } else {
                            digitalWrite(LED_FAILURE, HIGH);
                            delay(500);
                            digitalWrite(LED_FAILURE, LOW);
                        }
                    } else {
                        Serial.printf("Card %s not registered for this session\n", currentUid);
                        digitalWrite(LED_FAILURE, HIGH);
                        delay(500);
                        digitalWrite(LED_FAILURE, LOW);
                    }
                    rfid.PICC_HaltA();
                    rfid.PCD_StopCrypto1();
                }
            }
        } else {
            if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
                Serial.println("Card detected but no active session");
                digitalWrite(LED_FAILURE, HIGH);
                delay(500);
                digitalWrite(LED_FAILURE, LOW);
                rfid.PICC_HaltA();
                rfid.PCD_StopCrypto1();
            }
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

void meshTask(void *pvParameters) {
    unsigned long lastConnectionCheck = 0;
    const unsigned long CONNECTION_CHECK_INTERVAL = 10000;
    while (1) {
        mesh.update();
        unsigned long currentTime = millis();
        if (currentTime - lastConnectionCheck > CONNECTION_CHECK_INTERVAL) {
            lastConnectionCheck = currentTime;
            checkTargetNodeConnection();
            UBaseType_t queueItems = uxQueueMessagesWaiting(eventQueue);
            if (queueItems > 0) {
                Serial.printf("Events in buffer: %u\n", queueItems);
            }
        }
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void setup() {
    Serial.begin(115200);
    delay(500);
    Serial.println("\n\n=== Session-Based Attendance System Starting ===");
    Serial.printf("Node ID: %d\n", NODE_ID);
    Serial.printf("Target Node ID: %u\n", TARGET_NODE_ID);

    eventQueue = xQueueCreate(MAX_QUEUE_SIZE, sizeof(AttendanceEvent));
    if (eventQueue == NULL) {
        Serial.println("Error creating event queue");
        while(1);
    }

    pinMode(LED_SUCCESS, OUTPUT);
    pinMode(LED_FAILURE, OUTPUT);
    pinMode(LED_SCANNING, OUTPUT);
    pinMode(LED_SESSION, OUTPUT);
    digitalWrite(LED_SUCCESS, LOW);
    digitalWrite(LED_FAILURE, LOW);
    digitalWrite(LED_SCANNING, LOW);
    digitalWrite(LED_SESSION, LOW);

    SPI.begin();
    rfid.PCD_Init();
    Serial.println("RFID reader initialized");
    byte version = rfid.PCD_ReadRegister(rfid.VersionReg);
    Serial.printf("RFID reader firmware version: 0x%02X\n", version);
    if (version == 0x00 || version == 0xFF) {
        Serial.println("WARNING: RFID reader not responding correctly");
        for (int i = 0; i < 5; i++) {
            digitalWrite(LED_FAILURE, HIGH);
            delay(100);
            digitalWrite(LED_FAILURE, LOW);
            delay(100);
        }
    }

    Serial.println("Initializing Bluetooth scanner...");
    bool btInitialized = false;
    for (int retry = 0; retry < MAX_RETRY_COUNT && !btInitialized; retry++) {
        if (retry > 0) {
            Serial.printf("Bluetooth init retry %d of %d...\n", retry + 1, MAX_RETRY_COUNT);
            delay(1000);
        }
        digitalWrite(LED_SCANNING, HIGH);
        delay(100);
        digitalWrite(LED_SCANNING, LOW);
        btInitialized = scanner.begin("AttendanceSystem");
        if (!btInitialized) {
            Serial.println("Bluetooth initialization failed, retrying...");
            delay(500);
        }
    }
    
    if (!btInitialized) {
        Serial.println("ERROR: All Bluetooth initialization attempts failed");
        while (1) {
            digitalWrite(LED_FAILURE, HIGH);
            delay(300);
            digitalWrite(LED_FAILURE, LOW);
            delay(300);
        }
    }
    Serial.println("Bluetooth scanner ready");

    mesh.setDebugMsgTypes(ERROR | STARTUP);
    mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT, WIFI_AP_STA, MESH_CHANNEL);
    mesh.onReceive(&receivedCallback);
    mesh.onNewConnection(&newConnectionCallback);
    mesh.onDroppedConnection(&droppedConnectionCallback);

    std::list<uint32_t> nodeList = mesh.getNodeList();
    for (auto &node : nodeList) {
        if (node == TARGET_NODE_ID) {
            targetNodeConnected = true;
            Serial.printf("Target node %u already connected on startup\n", TARGET_NODE_ID);
            break;
        }
    }

    xTaskCreatePinnedToCore(rfidTask, "RFIDTask", 4096, NULL, 1, &rfidTaskHandle, 0);
    xTaskCreatePinnedToCore(meshTask, "MeshTask", 4096, NULL, 1, &meshTaskHandle, 1);

    digitalWrite(LED_SUCCESS, HIGH);
    delay(1000);
    digitalWrite(LED_SUCCESS, LOW);
    Serial.println("System ready. Waiting for session start command.");
}

void loop() {
    vTaskDelay(pdMS_TO_TICKS(1000));
}