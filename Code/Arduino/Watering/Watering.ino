//Ben Rose
//2018
// This program is to measure the moisture of the soils with given sensors
// Each sensor should use less than 20ma, nano 5v max is 500ma (3v3 max is 200ma)
// 20ma * 4 sensors = 80ma   5v / 0.08a = _62.5ohms_ resistance could be used
// https://www.quora.com/What-is-the-way-to-connect-multiple-sensor-with-arduino-board


int numberOfSensors = 4; //Analogue pin!
int oldVal = 0; 

String outVal = "";

void setup()
{
  Serial.begin(9600);
}

void loop()
{
    if (millis() % 1000 <= 100){ // 1000000 <= 100    =16mins/1000 seconds
      int value = 0;
      for (int i = 0; i < numberOfSensors; i++){
        //Loop over all sensors
        int sensorVal = analogRead(i); // get value, lower is wetter, 1023 max
        value = value + sensorVal; 
      }
      value = value/numberOfSensors; //avg
      
      if(((oldVal>=value) && ((oldVal - value) > 10)) || ((oldVal<value) && ((value - oldVal) > 10))){
        // If the current val is at least 10 higher or lower than before then output
        
        outVal = String("\n") + value;
        Serial.print(outVal);
        oldVal = value;
      }
    }
}
