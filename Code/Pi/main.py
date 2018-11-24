# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial
import time
import sys


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
    # fix this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    listedData = ["","","","","",""]
    print(listedData)
    listedData = (readfromserial(1) + " " + readfromserial(0)).split()
    # listedData = [***, temp(c), humidity(relative), L1%, L2%, soil moisture (avg of reading out of 1023*4)]
    print(listedData)
    export = "<br>temp: " + listedData[1] + "*c<br>humidity: " + listedData[2] + "<br>L1: " + listedData[3] + "%<br>L2: " + listedData[4] + "%<br>Soil: " + listedData[5]

    time.sleep(4)
    return export


def main():
    print(readfromserial(1) + readfromserial(0))

    return "this shouldn't appear anywhere"

    # while True:
    #     time.sleep(4)
    #     print(readfromserial(1) + readfromserial(0))


if __name__== "__main__":
    main()
