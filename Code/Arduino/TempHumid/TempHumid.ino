// Ben Rose 2018
// This is a program for measuring the light and humidity of the greenhouse environment
// 

#include <dht.h>
dht DHT;

#define DHT11_PIN 2
int L1Pin = 1;     // the cell and 1K pulldown are connected to a0
int L2Pin = 2;
String L1Read;     // the analog reading from the analog resistor divider
String L2Read;

void setup(){
  Serial.begin(9600);
}

void loop()
{
  int chk = DHT.read11(DHT11_PIN);

  // raw analogue readings saved to array
  Serial.println("***"); // this makes error checking easier
  Serial.println(DHT.temperature);
  Serial.println(DHT.humidity);
  Serial.println((double(analogRead(L1Pin))/1023)*100); // percentages
  Serial.println((double(analogRead(L2Pin))/1023)*100); 
  Serial.println("");

  delay(2000);
}

