# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduino's via serial monitor (USB) and
# works with the data to display it as an http server.

import serial


def readfromserial(port):
    comPort = ''

    if port == 0:
        comPort = '/dev/ttyUSB0'
    elif port == 1:
        comPort = '/dev/ttyUSB1'

    with serial.Serial(comPort, 9600, timeout=1) as ser:
        s = ser.read(100)  # Read the first 100 bytes

    return (s)


while True:
    readfromserial(1)
