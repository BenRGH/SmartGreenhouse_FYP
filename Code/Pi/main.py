# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial
import time
from flask import Flask, render_template

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
        # look for *** here

    return s.decode("utf-8")


def formattedinput():
    listedData = {"","","","","",""}
    # figure out how to get avg and memory here

    listedData = (readfromserial(1) + " " + readfromserial(0)).split()
    # listedData = [***, temp(c), humidity(relative), L1%, L2%, soil moisture (avg of reading out of 1023*4]
    webExport = "<br>temp: " + listedData[1] + "*c<br>humidity: " + listedData[2] + "<br>L1: " + listedData[3] + "%<br>L2: " + listedData[4] + "%<br>Soil: " + listedData[5]

    time.sleep(4)
    return webExport


@app.route('/')
def home():
    return render_template("home.html")


if __name__ == '__main__':
    app.run(use_reloader=True)

while False:
    time.sleep(4)
    print(readfromserial(1) + readfromserial(0))
