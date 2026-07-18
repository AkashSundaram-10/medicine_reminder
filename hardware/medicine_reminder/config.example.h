#ifndef CONFIG_H
#define CONFIG_H

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Use your computer's LAN address so the ESP32 can call the local backend.
// Example: "http://192.168.1.25:5000"
#define REMINDER_API_BASE_URL "http://192.168.X.X:5000"
#define DEVICE_API_TOKEN "YOUR_DEVICE_API_TOKEN"
#define BUZZER_PIN 2

#endif
