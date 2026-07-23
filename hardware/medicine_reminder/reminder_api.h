#ifndef REMINDER_API_H
#define REMINDER_API_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include "config.h"
#include "buzzer.h"

void checkMedicines() {

  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    return;
  }

  // Get current date and time
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time from NTP");
    return;
  }

  // Format current time (Example: 08:30 PM)
  char timeStringBuff[15];
  strftime(timeStringBuff, sizeof(timeStringBuff), "%I:%M %p", &timeinfo);

  // Format current date (Example: 2026-07-23)
  char dateStringBuff[15];
  strftime(dateStringBuff, sizeof(dateStringBuff), "%Y-%m-%d", &timeinfo);

  // Create HTTP client
  HTTPClient http;

  // Build API URL
  String url = String(REMINDER_API_BASE_URL) +
               "/api/device/reminders/current?date=" +
               String(dateStringBuff) +
               "&time=" +
               String(timeStringBuff);

  // Replace spaces in URL
  url.replace(" ", "%20");

  Serial.println("----------------------------------------");
  Serial.println("Checking Medicine Reminder...");
  Serial.print("Request URL: ");
  Serial.println(url);

  // Start HTTP request
  http.begin(url);

  // Add authentication header
  http.addHeader("X-Device-Token", DEVICE_API_TOKEN);

  // Send GET request
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {

    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);

    String payload = http.getString();

    Serial.print("Server Response: ");
    Serial.println(payload);

    // If medicine is due
    if (payload.indexOf("\"due\":true") >= 0) {

      Serial.println("************************");
      Serial.println("TIME TO TAKE MEDICINE!");
      Serial.println("************************");

      triggerAlarm();

    } else {

      Serial.println("No medicine due.");

    }

  } else {

    Serial.print("HTTP Request Failed. Error Code: ");
    Serial.println(httpResponseCode);

  }

  http.end();
}

#endif
