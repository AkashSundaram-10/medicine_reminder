#include <WiFi.h>
#include "config.h"
#include "buzzer.h"
#include "wifi_setup.h"
#include "firebase.h"


unsigned long lastCheckTime = 0;
const unsigned long CHECK_INTERVAL = 10000; // 10 seconds (fast testing)

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
