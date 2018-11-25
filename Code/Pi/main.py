# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial
import time
import sys


def readFromSerial(port):
    # This opens up the local serial monitor ports and communicates with the arduinos,
    # sending a request for sensor data '?' and reading it.

    comPort = ''
    bytesToRead = 1  # (mostly arbitrary)

    if port == 0:
        comPort = '/dev/ttyUSB0'  # usb port for the soil sensor
        bytesToRead = 10
    elif port == 1:
        comPort = '/dev/ttyUSB1'  # usb port for the temp sensor
        bytesToRead = 50

    with serial.Serial(comPort, 9600, timeout=1) as ser:
        ser.write(b'?')
        time.sleep(3)
        s = ser.read(bytesToRead)  # Read the first 100 bytes

    return s.decode("utf-8")


def formattedRead():
    # This takes the data read by readFromSerial and formats it for export to the web.

    preExport = readFromSerial(0) + "\n" + readFromSerial(1)
    preExport = preExport.split("\n")

    # export is currently [soil, temp, humid, L1, L2]
    preExport[0] = "Soil Moisture: " + str(preExport[0]) + "/1023 <br>"
    preExport[1] = "Temperature  : " + str(preExport[1]) + "*C <br>"
    preExport[2] = "Humidity     : " + str(preExport[2]) + " RH <br>"
    preExport[3] = "Light 1      : " + str(preExport[3]) + "% <br>"
    preExport[4] = "Light 2      : " + str(preExport[4]) + "% <br>"

    export = ""
    for i in preExport:
        export += i

    return export


def main():
    try:
        print(formattedRead())
    except:
        print("Display older data here")

    return "this shouldn't appear anywhere"

    # while True:
    #     time.sleep(4)
    #     print(readfromserial(1) + readfromserial(0))


if __name__== "__main__":
    main()
