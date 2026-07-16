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
- **Backend / Database**: Firebase Firestore
- **Hardware**: ESP32 DevKit V1
- **Hardware Libraries**: WiFi.h, HTTPClient.h, ArduinoJson.h, NTPClient.h

## Folder Structure
- `/frontend`: Contains the React + Vite web application.
- `/hardware`: Contains the Arduino sketch (`.ino`) for the ESP32.

## Getting Started

### 1. Web Application Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### 2. Firebase Setup
1. Create a Firebase project and a Firestore database.
2. Update the credentials in `frontend/src/firebase/firebase.js`.
3. Create a collection named `medicines`.

### 3. ESP32 Hardware Setup
1. Open `hardware/medicine_reminder.ino` in the Arduino IDE.
2. Install required libraries: `ArduinoJson`, `NTPClient`.
3. Update Wi-Fi and Firebase credentials inside the `.ino` file.
4. Flash the code to the ESP32 DevKit V1.
