#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// WiFi
const char* ssid = "GUGAN";
const char* password = "123456789";

// Firebase
#define DATABASE_URL "https://smarttrafficiot-1a05e-default-rtdb.firebaseio.com"
#define API_KEY "AIzaSyA1oCW9Z8yF5mUfVfdrwBWV_RVw5TJynyU"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// IR Sensor Pins
int ir[4] = {34, 35, 32, 33};

// LED Pins
int red[4]    = {25, 14, 18, 4};
int yellow[4] = {26, 12, 19, 16};
int green[4]  = {27, 13, 21, 17};

int density[4];

void setup() {
  Serial.begin(115200);

  // Pin setup
  for(int i=0; i<4; i++){
    pinMode(ir[i], INPUT);

    pinMode(red[i], OUTPUT);
    pinMode(yellow[i], OUTPUT);
    pinMode(green[i], OUTPUT);
  }

  // WiFi connect
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected!");

  // Firebase setup
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

// Read IR Sensors
void readDensity(){
  for(int i=0; i<4; i++){
    if(digitalRead(ir[i]) == LOW){
      density[i] = 1; // vehicle present
    } else {
      density[i] = 0;
    }
  }
}

// Send data to Firebase
void sendToFirebase(){
  for(int i=0;i<4;i++){
    String path = "/trafficSystem/road" + String(i+1) + "/density";
    Firebase.RTDB.setInt(&fbdo, path, density[i]);
  }
}

// Control signals
void controlSignals(){
  int maxRoad = 0;

  for(int i=1;i<4;i++){
    if(density[i] > density[maxRoad]){
      maxRoad = i;
    }
  }

  for(int i=0;i<4;i++){
    if(i == maxRoad){
      digitalWrite(green[i], HIGH);
      digitalWrite(red[i], LOW);

      Firebase.RTDB.setString(&fbdo,
        "/trafficSystem/road" + String(i+1) + "/signal",
        "GREEN");
    } else {
      digitalWrite(green[i], LOW);
      digitalWrite(red[i], HIGH);

      Firebase.RTDB.setString(&fbdo,
        "/trafficSystem/road" + String(i+1) + "/signal",
        "RED");
    }
  }
}

void loop() {

  readDensity();

  // Print data
  for(int i=0;i<4;i++){
    Serial.print("Road ");
    Serial.print(i+1);
    Serial.print(": ");
    Serial.println(density[i]);
  }

  sendToFirebase();

  controlSignals();

  delay(5000);
}