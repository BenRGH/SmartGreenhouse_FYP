// Ben Rose
// 2018
// This program is to measure the moisture of the soils with given sensors
// Each sensor should use less than 6ma, nano 5v max is 500ma (3v3 max is 200ma)
// https://www.quora.com/What-is-the-way-to-connect-multiple-sensor-with-arduino-board


int numberOfSensors = 4; //Analogue pins!
int oldVal = 0; 
int outVal = 511;
// Sensor range appears ot be as follows:
// water - min : 320
// air - max   : 700
unsigned long startMillis;
unsigned long currMillis;
const unsigned long timeDelay = 900000;  // = 15 mins


void setup()
{
  Serial.begin(9600);
  startMillis = millis();  // start time
  
}

void readSensors(){
  int value = 0;
  for (int i = 0; i < numberOfSensors; i++){
    //Loop over all sensors
    int sensorVal = analogRead(i); // get value, lower is wetter, 1023 max
    delay(1000); // required for a good reading
    value = value + sensorVal; 
  }
  value = value/numberOfSensors; //avg
  
  //if(((oldVal>=value) && ((oldVal - value) > 5)) || ((oldVal<value) && ((value - oldVal) > 5))){
    // If the current val is at least 5 higher or lower than before then output
    
  outVal = value;
  //oldVal = value;
  //}
    
}

void loop()
{
  readSensors(); //have to read often otherwise nothing will change
  if (Serial.available())
  {
    int query = Serial.parseInt();
    if (query == 0) // output sensor data
    {
      Serial.println(outVal);
    }
    
    
  }
}
