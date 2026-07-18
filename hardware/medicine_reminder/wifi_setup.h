#ifndef WIFI_SETUP_H
#define WIFI_SETUP_H

#include <WiFi.h>
#include "config.h"

#include <time.h>

void setupWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  
  // Set Timezone to IST (UTC +5:30) = 19800 seconds
  configTime(19800, 0, "pool.ntp.org");
  Serial.println("Time synced via NTP");
}

#endif
