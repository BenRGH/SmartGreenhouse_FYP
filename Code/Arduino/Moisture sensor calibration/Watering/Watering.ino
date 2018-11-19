//Ben Rose
//2018
// This is a basic program to return the analogue signal from a single moisture sensor,
// I used this to correctly calibrate each sensor to be as equal as possible

int sensorAPIN = 3; //Pin sensor is attached to
String outVal = "";
int oldVal = 0;

void setup()
{
  Serial.begin(9600);
}

void loop()
{
    if (millis() % 10000 <= 100){ // 1000000 <= 100    =16mins/1000 seconds
      int value = analogRead(sensorAPIN); // get value, lower is wetter, 1023 max
        
      outVal = String("\n") + value;
      Serial.print(outVal);
      oldVal = value;
    }
}
