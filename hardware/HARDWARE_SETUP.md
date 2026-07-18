# 🔌 Hardware Wiring & Setup Guide (ESP32 + Active Buzzer)

This guide provides detailed instructions on wiring the ESP32 DevKit V1 board to an Active Buzzer, configuring the firmware, and testing physical medicine reminder alarms.

---

## 🛠️ Required Components

1. **ESP32 DevKit V1 Board**
2. **Active Buzzer** (2-pin component or 3-pin module)
3. **Jumper Wires** (Female-to-Male / Male-to-Male)
4. **Breadboard**
5. **Micro-USB Cable**

---

## 📌 Wiring Diagram & Pinouts (Using Breadboard & Male-to-Male Wires)

### 🔌 Breadboard Setup Instructions:
1. **Mount ESP32**: Plug the ESP32 board straddling the center divide of your breadboard so its left and right pins sit in separate rows.
2. **Mount Active Buzzer**: 
   - *2-Pin Buzzer Component*: Insert the positive leg `(+)` into an unused row and the negative leg `(-)` into another row.
   - *3-Pin Buzzer Module*: Plug the module's 3 header pins into 3 separate adjacent rows.
3. **Connect Male-to-Male Jumper Wires**: Insert one pin end into the breadboard row aligned with the ESP32 pin, and the other pin end into the corresponding Buzzer row.

---

### Option A: 2-Pin Active Buzzer (Standard Component)
| Active Buzzer Pin (Row) | ESP32 Pin (Row) | Wire Type |
| :--- | :--- | :--- |
| **Positive (+) / Longer Leg** | **GPIO 5** (CS Female Socket) | Male-to-Male Jumper Wire |
| **Negative (-) / Shorter Leg** | **GND** (GND Female Socket) | Male-to-Male Jumper Wire |

### Option B: 3-Pin Active Buzzer Module (VCC, GND, I/O)
| Buzzer Module Pin (Row) | ESP32 Pin (Row) | Wire Type |
| :--- | :--- | :--- |
| **I/O** or **S (Signal)** | **GPIO 5** (CS Female Socket) | Male-to-Male Jumper Wire |
| **VCC / (+)** | **3V3** (3V3 Female Socket) | Male-to-Male Jumper Wire |
| **GND / (-)** | **GND** (GND Female Socket) | Male-to-Male Jumper Wire |

```
                            +-----------------------+
                            |      BREADBOARD       |
                            +-----------------------+
 [ESP32 GND Socket]    ====== Male-to-Male Wire ======> [Buzzer (-) Row]
 [ESP32 CS Socket(5)]  ====== Male-to-Male Wire ======> [Buzzer (+) / I/O Row]
 [ESP32 3V3 Socket]   ====== Male-to-Male Wire ======> [Buzzer VCC Row (3-pin)]
```

---

## 💻 Arduino IDE Setup & Flashing

1. **Connect Board**: Plug your ESP32 into your laptop using the Micro-USB cable.
2. **Open Sketch**: Open `hardware/medicine_reminder/medicine_reminder.ino` in the Arduino IDE.
3. **Configure Settings**: Open `hardware/medicine_reminder/config.h` and update your Wi-Fi & Backend credentials:
   ```cpp
   #define WIFI_SSID "Your_WiFi_SSID"
   #define WIFI_PASSWORD "Your_WiFi_Password"
   #define REMINDER_API_BASE_URL "http://192.168.X.X:5000" // Your laptop LAN IP
   #define DEVICE_API_TOKEN "FREEFIRE 26"                  // Matches backend .env
   #define BUZZER_PIN 2                                    // GPIO Pin 2
   ```
4. **Install Libraries**:
   - Go to **Tools** -> **Manage Libraries...**
   - Search for **`ArduinoJson`** (by Benoit Blanchon) and install it.
5. **Select Board & Upload**:
   - Go to **Tools** -> **Board** -> **ESP32 Arduino** -> **ESP32 Dev Module**.
   - Go to **Tools** -> **Port** -> Select your ESP32 COM port (e.g. `COM3`).
   - Click the **Upload (➡️)** button.

---

## 🧪 Testing Hardware Alarms

1. Open **Serial Monitor** in Arduino IDE (**Tools** -> **Serial Monitor**) set to **`115200 baud`**.
2. Observe serial output:
   ```text
   Connecting to WiFi.....
   WiFi connected!
   Time synced via NTP
   Smart Medicine Reminder System Initialized
   ```
3. Open `http://localhost:5173` in your browser.
4. Schedule a dose for **1-2 minutes from current time** on the **Add Medicine** page.
5. When NTP time hits the exact minute:
   - Serial Monitor prints: `TIME TO TAKE MEDICINE!` and `ALARM TRIGGERED!`.
   - The **Active Buzzer** beeps 5 times! 🔊
