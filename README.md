# Smart Medicine Reminder System

An AIoT-based Smart Medicine Reminder System that reminds users to take medicines on time using an ESP32 buzzer, stores medication schedules in Firebase Firestore, and provides AI-powered adherence insights through a React web application.

## Features
- **Dashboard**: Overview of today's schedule and next reminder.
- **Medicine Management**: Add, edit, and delete medications.
- **History**: Track past medication adherence.
- **AI Insights**: Visualize adherence rates, most missed times, and get smart recommendations based on habits.
- **Hardware Integration**: ESP32 syncs with Firebase and triggers a buzzer alarm when it's time to take medication.

## Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend / Database**: Node.js, Express, Firebase Firestore
- **Hardware**: ESP32 DevKit V1
- **Hardware**: ESP32 DevKit V1
- **Hardware Libraries**: WiFi.h, HTTPClient.h, ArduinoJson.h, NTPClient.h

## Folder Structure
- `/frontend`: Contains the React + Vite web application.
- `/hardware`: Contains the Arduino sketch (`.ino`) for the ESP32.

## Getting Started

See [SETUP.md](file:///d:/smart%20medicine/medicine_reminder/SETUP.md) for full step-by-step setup instructions.

### 1. Web Application Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Copy `frontend/.env.example` to `frontend/.env` if your API is not on `http://localhost:5000`.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

### 2. Backend Setup
1. Navigate to the `backend` directory and copy `.env.example` to `.env`.
2. Add a Firebase Admin service-account JSON value to `FIREBASE_SERVICE_ACCOUNT_JSON` and set a long `DEVICE_API_TOKEN`.
3. Install dependencies with `npm install`, then start the API using `npm run dev`.

### 3. Firebase Setup
1. Create a Firebase project and a Firestore database.
2. Create a collection named `medicines`.
3. The server uses Firebase Admin credentials from `backend/.env`; do not put service-account credentials in the frontend.

### 4. ESP32 Hardware Setup
1. Open `hardware/medicine_reminder.ino` in the Arduino IDE.
2. Install required libraries: `ArduinoJson`, `NTPClient`.
3. Update Wi-Fi credentials, `REMINDER_API_BASE_URL` (the computer's LAN IP), and `DEVICE_API_TOKEN` in `hardware/medicine_reminder/config.h`.
4. Flash the code to the ESP32 DevKit V1.

The ESP32 now calls the authenticated backend endpoint instead of Firestore directly. Keep the backend running on the same network as the device.
