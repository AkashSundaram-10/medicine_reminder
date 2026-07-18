#ifndef FIREBASE_SETUP_H
#define FIREBASE_SETUP_H

#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h"
#include "buzzer.h"

void checkMedicines() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
      Serial.println("Failed to obtain time from NTP");
      return;
    }

    char timeStringBuff[15];
    strftime(timeStringBuff, sizeof(timeStringBuff), "%I:%M %p", &timeinfo);
    char dateStringBuff[15];
    strftime(dateStringBuff, sizeof(dateStringBuff), "%Y-%m-%d", &timeinfo);

    String url = String(REMINDER_API_BASE_URL) + "/api/device/reminders/current?date=" + String(dateStringBuff) + "&time=" + String(timeStringBuff);
    url.replace(" ", "%20");
    http.begin(url);
    http.addHeader("X-Device-Token", DEVICE_API_TOKEN);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      Serial.print("Checking Date: ");
      Serial.print(dateStringBuff);
      Serial.print(" | Time: ");
      Serial.print(timeStringBuff);
      Serial.print(" => Response: ");
      Serial.println(payload);

      if (payload.indexOf("\"due\":true") >= 0) {
        Serial.println("TIME TO TAKE MEDICINE!");
        triggerAlarm();
      }
    } else {
      Serial.printf("Reminder API request failed: %d\n", httpResponseCode);
    }
    http.end();
  }
}

#endif
