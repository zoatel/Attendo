#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>

const char* ssid = "Yaseen";
const char* password = "12345678abcdef";

// MQTT configuration
const char* mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;
const char* mqtt_username = "yaseen";
const char* mqtt_password = "1234";

// MQTT topics
const char* control_topic = "iot/sessions/control";
const char* data_topic = "iot/sessions/data";

// UART configuration
#define UART_BAUD_RATE  9600  // Reduced baud rate for better stability
#define RX_BUFFER_SIZE  2048

// Software Serial pins for communication with Bridge Node
#define BRIDGE_RX       D2  // GPIO4 (D2)
#define BRIDGE_TX       D1  // GPIO5 (D1)

// Status LED pins
#define LED_WIFI        D5  // GPIO14
#define LED_MQTT        D6  // GPIO12
#define LED_UART        D7  // GPIO13

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient mqtt(espClient);

// Software Serial for Bridge communication
SoftwareSerial bridgeSerial(BRIDGE_RX, BRIDGE_TX);

// Buffer for bridge UART reception
char bridgeRxBuffer[RX_BUFFER_SIZE];
int bridgeRxIndex = 0;

// Connection state tracking
bool mqttConnected = false;
unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 5000;  // 5 seconds between reconnection attempts

// Function declarations
void setupWiFi();
void reconnectMQTT();
void mqttCallback(char* topic, byte* payload, unsigned int length);
void processBridgeInput();
bool isValidJson(const String &jsonString);

void setup() {
  Serial.begin(UART_BAUD_RATE);
  bridgeSerial.begin(UART_BAUD_RATE, SWSERIAL_8N1);
  while (bridgeSerial.available()) bridgeSerial.read(); // Clear stray data
  bridgeSerial.println("READY"); // Send READY signal
  delay(500);
  Serial.println("\n\n=== Gateway Node Starting ===");
  
  // Setup status LEDs
  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_MQTT, OUTPUT);
  pinMode(LED_UART, OUTPUT);
  
  digitalWrite(LED_WIFI, LOW);
  digitalWrite(LED_MQTT, LOW);
  digitalWrite(LED_UART, LOW);
  
  // Initialize bridge buffer
  memset(bridgeRxBuffer, 0, RX_BUFFER_SIZE);
  
  // Setup WiFi
  setupWiFi();
  
  // Setup MQTT client
  mqtt.setServer(mqtt_server, mqtt_port);
  mqtt.setCallback(mqttCallback);
  
  // Connect to MQTT broker
  reconnectMQTT();
  
  Serial.println("Gateway Node ready");
}

void loop() {
  // Maintain WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_WIFI, LOW);
    Serial.println("WiFi disconnected, reconnecting...");
    setupWiFi();
  }
  
  // Maintain MQTT connection
  if (!mqtt.connected()) {
    digitalWrite(LED_MQTT, LOW);
    mqttConnected = false;
    
    // Try to reconnect periodically
    unsigned long now = millis();
    if (now - lastReconnectAttempt > reconnectInterval) {
      lastReconnectAttempt = now;
      reconnectMQTT();
    }
  } else {
    // Process MQTT messages
    mqtt.loop();
  }
  
  // Process incoming data from Bridge Node
  processBridgeInput();
  
  // Short delay to prevent watchdog issues
  delay(10);
}

// Initialize WiFi connection
void setupWiFi() {
  delay(10);
  Serial.printf("Connecting to WiFi: %s\n", ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  // Wait for connection with timeout
  int connectionAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && connectionAttempts < 20) {
    delay(500);
    Serial.print(".");
    connectionAttempts++;
    
    // Blink WiFi LED during connection
    digitalWrite(LED_WIFI, !digitalRead(LED_WIFI));
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(LED_WIFI, HIGH);  // Solid LED when connected
    Serial.println("");
    Serial.print("WiFi connected - IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi connection failed");
    digitalWrite(LED_WIFI, LOW);
  }
}

// Connect to MQTT broker
void reconnectMQTT() {
  if (WiFi.status() != WL_CONNECTED) {
    return;  // Don't try MQTT if WiFi is not connected
  }
  
  Serial.print("Attempting MQTT connection...");
  
  // Create a random client ID
  String clientId = "ESP8266Client-";
  clientId += String(random(0xffff), HEX);
  
  // Attempt to connect
  if (mqtt.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
    Serial.println("connected");
    mqttConnected = true;
    digitalWrite(LED_MQTT, HIGH);
    
    // Subscribe to control topic
    mqtt.subscribe(control_topic);
    Serial.printf("Subscribed to %s\n", control_topic);
  } else {
    Serial.printf("failed, rc=%d\n", mqtt.state());
    digitalWrite(LED_MQTT, LOW);
  }
}

// MQTT message handler
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  digitalWrite(LED_MQTT, HIGH);
  
  // Create a null-terminated string from the payload
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  
  Serial.printf("MQTT message received [%s]: %s\n", topic, message);
  
  // Check if this is a control message
  if (strcmp(topic, control_topic) == 0) {
    // Check if valid JSON
    if (isValidJson(message)) {
      // Prepare bridge serial for sending
      bridgeSerial.flush();  // Flush any outgoing data
      delay(10);             // Small delay to ensure stability
      
      // Add a marker for the start of a complete message
      bridgeSerial.print("START_JSON:");
      delay(5);  // Small delay between marker and message
      
      // Forward to Bridge Node via Software Serial
      bridgeSerial.println(message);
      
      // Wait a moment for transmission to complete
      delay(10);
      
      // Send end marker
      bridgeSerial.println("END_JSON");
      
      Serial.println("Forwarded control message to Bridge Node");
    } else {
      Serial.println("Invalid JSON format, not forwarding");
    }
  }
  
  digitalWrite(LED_MQTT, mqttConnected ? HIGH : LOW);
}

// Process incoming data from Bridge Node
void processBridgeInput() {
  while (bridgeSerial.available() > 0) {
    char c = bridgeSerial.read();
    
    // Blink LED for activity
    digitalWrite(LED_UART, HIGH);
    
    // Handle incoming character
    if (c == '\n') {
      // End of message
      bridgeRxBuffer[bridgeRxIndex] = '\0'; // Null terminate
      
      String message = String(bridgeRxBuffer);
      message.trim(); // Remove any whitespace
      
      if (message.length() > 0) {
        Serial.printf("Received from Bridge: %s\n", message.c_str());
        
        // Check if valid JSON and MQTT connected
        if (isValidJson(message) && mqttConnected) {
          // Publish to MQTT
          if (mqtt.publish(data_topic, message.c_str())) {
            Serial.printf("Published to %s\n", data_topic);
          } else {
            Serial.println("Failed to publish to MQTT");
          }
        } else if (!mqttConnected) {
          Serial.println("MQTT not connected, can't publish");
        } else {
          Serial.println("Invalid JSON received, not publishing");
        }
      }
      
      // Reset buffer
      memset(bridgeRxBuffer, 0, RX_BUFFER_SIZE);
      bridgeRxIndex = 0;
    } 
    else if (bridgeRxIndex < RX_BUFFER_SIZE - 1) {
      // Add to buffer if space available
      bridgeRxBuffer[bridgeRxIndex++] = c;
    }
    
    // Turn off UART LED after processing
    digitalWrite(LED_UART, LOW);
  }
}

// Check if string is valid JSON
bool isValidJson(const String &jsonString) {
  DynamicJsonDocument doc(2048);
  DeserializationError error = deserializeJson(doc, jsonString);
  return !error;
}