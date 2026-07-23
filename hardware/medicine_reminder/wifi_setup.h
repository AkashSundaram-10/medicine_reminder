#ifndef WIFI_SETUP_H
#define WIFI_SETUP_H

void setupWiFi() {
  Serial.print("Connecting to WiFi");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");

  // Using multiple robust NTP servers to prevent syncing issues
  configTime(19800, 0, "time.google.com", "time.windows.com", "pool.ntp.org");

  struct tm timeinfo;

  Serial.print("Syncing time");

  int ntpRetry = 0;
  while (!getLocalTime(&timeinfo)) {
    Serial.print(".");
    delay(1000);
    ntpRetry++;
    if (ntpRetry > 15) {
      Serial.println("\nNTP Sync failed! Restarting ESP32 to try again...");
      ESP.restart();
    }
  }

  Serial.println("\nTime synced via NTP");
}

#endif
