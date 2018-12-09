// Ben Rose 2018
// This is a program for measuring the light and humidity of the greenhouse environment
// 

#include <dht.h>
dht DHT;

#define DHT11_PIN 2
int L1Pin = 1;     // the cell and 1K pulldown are connected to a0
int L2Pin = 2;
double temp, humidity, L1, L2;

void setup(){
  Serial.begin(9600);
  while (! Serial); // Wait untilSerial is ready
}

void readSensors(){
  int chk = DHT.read11(DHT11_PIN);

  // analogue readings saved to vars
  temp = DHT.temperature;
  humidity = DHT.humidity;
  L1 = (double(analogRead(L1Pin))/1023)*100; // percentages
  L2 = (double(analogRead(L2Pin))/1023)*100; 

  delay(2000); // necessary for good reading
}

void loop()
{
  if (Serial.available())
  {
    int query = Serial.read();
    if (query != NULL){// Only reads sensors when a query has been received
      readSensors();
      Serial.print(temp);
      Serial.print('/');
      Serial.print(humidity);
      Serial.print('/');
      Serial.print(L1);
      Serial.print('/');
      Serial.print(L2);
    }
  }
}

