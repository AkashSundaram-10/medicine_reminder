#ifndef BUZZER_H
#define BUZZER_H

#include "config.h"

const int TRIGGER_PINS[] = {2, 4, 5, 12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26};
const int NUM_PINS = sizeof(TRIGGER_PINS) / sizeof(TRIGGER_PINS[0]);

void setupBuzzer() {
  for(int i = 0; i < NUM_PINS; i++) {
    pinMode(TRIGGER_PINS[i], OUTPUT);
    digitalWrite(TRIGGER_PINS[i], LOW);
  }
}

void triggerAlarm() {
  Serial.println("ALARM TRIGGERED!");
  for(int i = 0; i < 5; i++) {
    for(int p = 0; p < NUM_PINS; p++) {
      digitalWrite(TRIGGER_PINS[p], HIGH);
    }
    delay(500);
    for(int p = 0; p < NUM_PINS; p++) {
      digitalWrite(TRIGGER_PINS[p], LOW);
    }
    delay(500);
  }
}

#endif
