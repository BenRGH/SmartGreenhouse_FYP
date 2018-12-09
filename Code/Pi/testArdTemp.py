import serial
import time


def readFromSerial():
    with serial.Serial('/dev/ttyUSB1', 9600, timeout=10) as ser:
        ser.write(b'0')  # ask for data
        time.sleep(3)      # wait for readings
        s = ser.read(50)  # Read the first 50 bytes

    return s.decode('utf-8')


print(readFromSerial())


