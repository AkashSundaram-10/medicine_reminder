#ifndef BUZZER_H
#define BUZZER_H

#include "config.h"

void setupBuzzer() {
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
}

void triggerAlarm() {
  Serial.println("ALARM TRIGGERED!");
  for(int i = 0; i < 5; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(500);
    digitalWrite(BUZZER_PIN, LOW);
    delay(500);
  }
}

#endif
