#include "config.h"
#include "wifi.h"
#include "firebase.h"
#include "buzzer.h"

unsigned long lastCheckTime = 0;
const unsigned long CHECK_INTERVAL = 60000; // 1 minute

void setup() {
  Serial.begin(115200);
  
  setupBuzzer();
  setupWiFi();
  
  Serial.println("Smart Medicine Reminder System Initialized");
}

void loop() {
  if (millis() - lastCheckTime >= CHECK_INTERVAL) {
    lastCheckTime = millis();
    checkMedicines();
  }
}
