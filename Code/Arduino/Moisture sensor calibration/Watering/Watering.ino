// Ben Rose
// 2018
// This is a basic program to return the analogue signal from a single moisture sensor,
// I used this to correctly calibrate each sensor to be as equal as possible

int sensorAPIN = 0; //Pin sensor is attached to
String outVal = "";

// Recorded max moisture val:700 dry
// Recorded min moisture val:321 wet

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  int value = analogRead(sensorAPIN); // get value, lower is wetter, 1023 max  
  outVal = String("\n") + value;
  Serial.print(outVal);
  delay(500);
}
