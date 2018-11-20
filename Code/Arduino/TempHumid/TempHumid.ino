#include <dht.h>

dht DHT;

#define DHT11_PIN 2
int photocellPin = 1;     // the cell and 10K pulldown are connected to a0
int photocellReading;     // the analog reading from the analog resistor divider

void setup(){
  Serial.begin(9600);
}

void loop()
{
  int chk = DHT.read11(DHT11_PIN);
  Serial.print("Temperature = ");
  Serial.println(DHT.temperature);
  Serial.print("Humidity = ");
  Serial.println(DHT.humidity);

  photocellReading = analogRead(photocellPin); 
  Serial.println(photocellReading);     // the raw analog reading
  
  delay(2000);
}

