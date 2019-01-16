#define MOTORLATCH 12 
#define MOTORCLK 4 
#define MOTORENABLE 7 
#define MOTORDATA 8 
#define MOTOR1_A 2
#define MOTOR1_B 3
#define MOTOR1_PWM 11
#define FORWARD 1 
#define BACKWARD 2 
#define BRAKE 3 
#define RELEASE 4 

void setup() {
  Serial.begin(9600);
  Serial.println("Simple Adafruit Motor Shield sketch"); 

}

void loop() {
  motor(1, FORWARD, 255);
  delay(2000);
  // Be friendly to the motor: stop it before reverse. 
  motor(1, RELEASE, 0);
  delay(100);
  motor(1, BACKWARD, 128);
  delay(2000);
  motor(1, RELEASE, 0);
  
}

void motor(int nMotor, int command, int speed) 
{ 
  int motorA, motorB; 
    if (nMotor >= 1 && nMotor <= 4) 
    { 
      switch (nMotor) 
      { 
        case 1: 
          motorA = MOTOR1_A;
          motorB = MOTOR1_B;
          break; 
        default: 
          break; 
      } 
      switch (command) 
      { 
        case FORWARD: 
          motor_output (motorA, HIGH, speed); 
          motor_output (motorB, LOW, -1); //-1: no PWM set 
          break; 
        case BACKWARD: 
          motor_output (motorA, LOW, speed); 
          motor_output (motorB, HIGH, -1); //-1: no PWM set 
          break; 
        case BRAKE: 
          motor_output (motorA, LOW, 255); // 255: fully on.
          motor_output (motorB, LOW, -1); //-1: no PWM set 
          break; 
        case RELEASE: 
          motor_output (motorA, LOW, 0); // 0: output floating.
          motor_output (motorB, LOW, -1); //-1: no PWM set 
          break; 
        default: 
          break; 
      } 
    } 
} 

void motor_output (int output, int high_low, int speed) 
{ 
  int motorPWM; 
  switch (output) 
  { 
    case MOTOR1_A: 
    case MOTOR1_B: 
      motorPWM = MOTOR1_PWM;
      break; 
    default: 
      speed = -3333;
      break; 
  } 
  if (speed != -3333) 
  { 
    shiftWrite(output, high_low); 
    // set PWM only if it is valid 
    if (speed >= 0 && speed <= 255) 
    { 
      analogWrite(motorPWM, speed); 
    } 
  } 
} 

void shiftWrite(int output, int high_low) 
{ 
  static int latch_copy; 
  static int shift_register_initialized = false; 
  // Do the initialization on the fly, 
  // at the first time it is used. 
  if (!shift_register_initialized) 
  { 
    // Set pins for shift register to output 
    pinMode(MOTORLATCH, OUTPUT); 
    pinMode(MOTORENABLE, OUTPUT); 
    pinMode(MOTORDATA, OUTPUT); 
    pinMode(MOTORCLK, OUTPUT); 
    // Set pins for shift register to default value (low); 
    digitalWrite(MOTORDATA, LOW); 
    digitalWrite(MOTORLATCH, LOW); 
    digitalWrite(MOTORCLK, LOW); 
    // Enable the shift register, set Enable pin Low. 
    digitalWrite(MOTORENABLE, LOW); 
    // start with all outputs (of the shift register) low 
    latch_copy = 0;
    shift_register_initialized = true; 
  } 
  // The defines HIGH and LOW are 1 and 0. 
  // So this is valid. 
  bitWrite(latch_copy, output, high_low); 
  shiftOut(MOTORDATA, MOTORCLK, MSBFIRST, latch_copy); 
  delayMicroseconds(5); // For safety, not really needed.
  digitalWrite(MOTORLATCH, HIGH); 
  delayMicroseconds(5); // For safety, not really needed.
  digitalWrite(MOTORLATCH, LOW); 
} 

