#ifndef FIREBASE_SETUP_H
#define FIREBASE_SETUP_H

#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

void checkMedicines() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "https://firestore.googleapis.com/v1/projects/" + String(FIREBASE_PROJECT_ID) + "/databases/(default)/documents/medicines";
    http.begin(url);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      Serial.println("Firebase Sync OK");
      
      DynamicJsonDocument doc(4096);
      DeserializationError error = deserializeJson(doc, payload);
      
      if (error) {
        Serial.print("JSON parse failed: ");
        Serial.println(error.c_str());
      } else {
        // Get current time string formatted to match our React app
        struct tm timeinfo;
        if (!getLocalTime(&timeinfo)) {
          Serial.println("Failed to obtain time from NTP");
        } else {
          char timeStringBuff[15];
          strftime(timeStringBuff, sizeof(timeStringBuff), "%I:%M %p", &timeinfo); // e.g. "08:00 AM"
          String currentTime = String(timeStringBuff);

          char dateStringBuff[15];
          strftime(dateStringBuff, sizeof(dateStringBuff), "%Y-%m-%d", &timeinfo); // e.g. "2026-07-16"
          String currentDate = String(dateStringBuff);

          bool shouldBuzz = false;

          JsonArray documents = doc["documents"];
          for (JsonObject document : documents) {
            JsonObject fields = document["fields"];
            
            // Extract Firestore fields
            String medDate = fields["date"]["stringValue"].as<String>();
            String medTime = fields["time"]["stringValue"].as<String>();
            bool taken = fields["taken"]["booleanValue"].as<bool>();

            // Check if there is a pending medicine right now
            if (medDate == currentDate && medTime == currentTime && !taken) {
              shouldBuzz = true;
              Serial.println("TIME TO TAKE MEDICINE!");
              break;
            }
          }

          if (shouldBuzz) {
            triggerAlarm();
          }
        }
      }
    } else {
      Serial.println("Error on HTTP request");
    }
    http.end();
  }
}

#endif
