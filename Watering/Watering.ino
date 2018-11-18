//Ben Rose
//2018

int sensorAPIN = 0;
String outVal = "";
int oldVal = 0;

void setup()
{
  Serial.begin(9600);
}

void loop()
{
    if (millis() % 1000 <= 100){ // 1000000 <= 100    =16mins/1000 seconds
      int value = analogRead(sensorAPIN); // get value, lower is wetter, 1023 max
      
      if(((oldVal>=value) && ((oldVal - value) > 10)) || ((oldVal<value) && ((value - oldVal) > 10))){
        // If the current val is at least 10 higher or lower than before then output
        
        outVal = String("\n") + value;
        Serial.print(outVal);
        oldVal = value;
      }
    }
}
