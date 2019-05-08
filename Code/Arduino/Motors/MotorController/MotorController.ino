// Ben 2019, Partially composed of public code for motor control and shift registry
// This talks over serial to the python script and accepts commands for motors & lights.
// Runs on port /dev/ttyACM0
// BITS SOMETIMES GET LOST! SEND EXTRA 0'S BEFORE COMMANDS!

// Motors & Pump
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

// Light relay
#define LIGHT1 40
#define LIGHT2 41

// State vars
bool light1on = false;
bool light2on = false;
bool fan1on = false;
bool fan2on = false;


void setup() {
  Serial.begin(9600);
  Serial.println("GO"); // Might cause issues with comms

  // Make the lights controllable
  pinMode(LIGHT1, OUTPUT);
  pinMode(LIGHT2, OUTPUT);
  // turn off lights
  digitalWrite(LIGHT1, LOW);
  digitalWrite(LIGHT2, LOW);
  
}

void loop() {
  // testing
  
//  motor(1, FORWARD, 255);
//  delay(2000);
//  // Be friendly to the motor: stop it before reverse. 
//  motor(1, RELEASE, 0);
//  delay(100);
//  motor(1, BACKWARD, 128);
//  delay(2000);
//  motor(1, RELEASE, 0);

  
  // First step is to get profile data from pi,
  // commands are received as int's for simplicity, they match below:
  // -----lights------
  // 00 = light 1 on
  // 01 = light 2 on
  // 02 = light 1 off
  // 03 = light 2 off
  // -----fans--------
  // 10 = fan 1 on
  // 11 = fan 2 on
  // 12 = fan 1 off
  // 13 = fan 2 off
  // -----pump--------
  // 20 = pump on for 1s
  // 21 = pump on for 2s
  // 22 = pump on for 3s
  // (more is dangerous territory)
  
  if (Serial.available()){
    int command = Serial.parseInt();
    switch(command){
      case 0:
        // light 1 on
        if (!light1on){
          digitalWrite(LIGHT1, HIGH);
          Serial.println("light 1 on");
          light1on = true;
        }
        break;
      case 1:
        // light 2 on
        if (!light2on){
          digitalWrite(LIGHT2, HIGH);
          Serial.println("light 2 on");
          light2on = true;
        }
        break;
      case 2:
        // light 1 off
        if(light1on){
          digitalWrite(LIGHT1, LOW);
          Serial.println("light 1 off");
          light1on = false;
        }
        break;
      case 3:
        // light 2 off
        if(light2on){
          digitalWrite(LIGHT2, LOW);
          Serial.println("light 2 off");
          light2on = false;
        }
        break;
      case 10:
        // fan 1 on
        if (!fan1on){
          // MAKE SURE TO STOP BEFORE STARTING AGAIN!
          motor(1, FORWARD, 255);
          Serial.println("fan 1 on");
          fan1on = true;
        }
        break;
      case 11:
        // fan 2 on
        if (!fan2on){
          // MAKE SURE TO STOP BEFORE STARTING AGAIN!
          motor(2, FORWARD, 255);
          Serial.println("fan 2 on");
          fan2on = true;
        }
        break;
      case 12:
        // fan 1 off
        if (fan1on){
          motor(1, RELEASE, 0);
          Serial.println("fan 1 off");
          fan1on = false;
        }
        break;
      case 13:
        // fan 2 off
        if (fan2on){
          motor(2, RELEASE, 0);
          Serial.println("fan 2 off");
          fan2on = false;
        }
        break;
      case 20:
        // pump on for 1s
        motor(3, FORWARD, 255);
        Serial.println("pump on 1s");
        delay(1000)
        motor(3, RELEASE, 0);
        
        break;
      case 21:
        // pump on for 2s
        motor(3, FORWARD, 255);
        Serial.println("pump on 2s");
        delay(2000)
        motor(3, RELEASE, 0);
        
        break;
      case 22:
        // pump on for 3s
        motor(3, FORWARD, 255);
        Serial.println("pump on 3s");
        delay(3000)
        motor(3, RELEASE, 0);
        
        break;
      default:
        //ask again?
        break;
    }
  }
  

  
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
