# 🛠️ Smart Medicine Reminder System - Step-by-Step Setup Guide

This guide details the complete setup process for the **Smart Medicine Reminder System** across Cloud (Firebase), Backend (Node.js/Express), Local AI (Ollama Llama 3.2), Frontend (React + Vite), and IoT Hardware (ESP32).

---

## 📋 System Prerequisites

1. **Node.js** v18+ installed on your laptop.
2. **Arduino IDE** (with ESP32 board support installed).
3. **Ollama** installed from [ollama.com](https://ollama.com/).
4. A **Firebase Account** for cloud database storage.
5. Hardware: **ESP32 DevKit V1**, **Active Buzzer**, Breadboard, and Jumper Wires.

---

## ☁️ Step 1: Firebase Firestore Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project named `Smart-Medicine-Reminder`.
2. Navigate to **Build** -> **Firestore Database** and click **Create Database**.
   - Select **Start in test mode** for initial development.
3. Create a collection named `medicines`.
4. Generate Service Account Credentials:
   - Go to **Project Settings** (gear icon) -> **Service Accounts**.
   - Click **Generate new private key** (this downloads a `.json` key file).

---

## ⚙️ Step 2: Backend Setup (Node.js + Express)

1. Open the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file inside `backend/` by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open `backend/.env` in a text editor:
   - Minify the downloaded Firebase JSON file into a **single line string** and paste it into `FIREBASE_SERVICE_ACCOUNT_JSON`.
   - Set a custom secret for `DEVICE_API_TOKEN` (e.g. `secret_device_token_987`).

   Example `backend/.env`:
   ```env
   PORT=5000
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"smart-medicine","private_key_id":"...","private_key":"...","client_email":"..."}
   DEVICE_API_TOKEN=secret_device_token_987
   ```
4. Install dependencies and start the backend:
   ```bash
   npm install
   npm run dev
   ```
   *The backend runs at `http://localhost:5000`.*

---

## 🦙 Step 3: Local AI Setup (Ollama + Llama 3.2)

Node.js calculates raw adherence statistics (total, taken, missed, adherence rate) and prompts local Llama 3.2 to generate human-like health recommendations, pattern analysis, and risk levels.

1. Open your terminal and pull the Llama 3.2 model:
   ```bash
   ollama pull llama3.2
   ```
2. Start the Ollama background service:
   ```bash
   ollama serve
   ```
   *(Note: If Ollama is offline, the backend automatically falls back to deterministic rule-based recommendations.)*

---

## 💻 Step 4: Frontend Setup (React + Vite)

1. Open a new terminal in the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Create a `.env` file (optional if backend is running on `http://localhost:5000`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## 🔌 Step 5: ESP32 Hardware Wiring & Flashing

### 1. Hardware Connections
- **Active Buzzer VCC / (+) Pin** -> ESP32 **GPIO 25**
- **Active Buzzer GND / (-) Pin** -> ESP32 **GND**

### 2. Configure Firmware
1. Open `hardware/medicine_reminder/medicine_reminder.ino` in the Arduino IDE.
2. Open the `config.h` tab/file and configure:
   - `WIFI_SSID`: Your Wi-Fi network name.
   - `WIFI_PASSWORD`: Your Wi-Fi password.
   - `REMINDER_API_BASE_URL`: The local LAN IP address of your laptop (e.g., `http://192.168.1.100:5000`).
   - `DEVICE_API_TOKEN`: Must match `DEVICE_API_TOKEN` set in `backend/.env`.

3. Install required Arduino libraries via Library Manager:
   - `ArduinoJson`
   - `NTPClient`

4. Select Board **ESP32 Dev Module**, select your COM port, and click **Upload**.

---

## 🧪 Step 6: End-to-End System Verification

1. Open `http://localhost:5173` in your browser.
2. Go to **Add Medicine** and schedule a dose for **1 minute from current time**.
3. Observe:
   - The medicine appears in the **Dashboard**.
   - The ESP32 polls `/api/device/check` via Wi-Fi.
   - When time matches, the **Active Buzzer rings**.
   - Mark dose as taken/missed on the dashboard.
   - Check **Insights** tab to view Llama 3.2 AI-generated patterns and adherence risk levels.
