# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduino's via serial monitor (USB) and
# works with the data to display it as an http server.

import serial
import time
from flask import Flask

app = Flask(__name__)

def readfromserial(port):
    comPort = ''
    bytesToRead = 1

    if port == 0:
        comPort = '/dev/ttyUSB0'
        bytesToRead = 10
    elif port == 1:
        comPort = '/dev/ttyUSB1'
        bytesToRead = 100

    with serial.Serial(comPort, 9600, timeout=1) as ser:
        s = ser.read(bytesToRead)  # Read the first 100 bytes

    return s.decode("utf-8")

@app.route('/')
def homepage():
    time.sleep(4)
    return readfromserial(1) + readfromserial(0)


if __name__ == '__main__':
    app.run(use_reloader=True)

while False:
    time.sleep(4)
    print(readfromserial(1) + readfromserial(0))
