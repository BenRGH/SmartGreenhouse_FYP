#!/usr/bin/env python

# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial
import time
import sys
import psycopg2
import datetime
from daemonize import Daemonize

pid = "/tmp/sensorscript.pid"  # needed for daemonizing


def readFromSerial(port):
    # This opens up the local serial monitor ports and communicates with the arduinos,
    # sending a request for sensor data 'valType' and reading it.

    comPort = ''

    if port == 0:
        comPort = '/dev/ttyUSB0'  # usb port for the soil sensor
    elif port == 1:
        comPort = '/dev/ttyUSB1'  # usb port for the temp sensor

    with serial.Serial(comPort, 9600, timeout=5) as ser:
        ser.write(b'0')  # ask for data
        time.sleep(3)      # wait for readings
        s = ser.read(50)  # Read the first 50 bytes

    return s


def formattedRead():
    # This takes the data read by readFromSerial and formats it for export to the db.

    tempIn = readFromSerial(1).split('/')
    print(tempIn)

    # Python dict of the data
    export = {
        "soil": readFromSerial(0),
        "temp": tempIn[0],
        "humid": tempIn[1],
        "L1": tempIn[2],
        "L2": tempIn[3]
    }

    return export


# Used to get all values of a table in DB
def getAllDB(table):
    # Database connection goodness
    conn = psycopg2.connect('dbname=test user=pi') # !rename to actual!
    cur = conn.cursor()

    query = "SELECT * FROM " + table
    cur.execute(query)  # run query
    tableData = cur.fetchall()

    # Close up
    cur.close()
    conn.close()

    return tableData


# Used by the UpdateDB function to add values to a table
def addToDB(dTime, soil, temp, humid, L1, L2):
    # Database connection goodness
    conn = psycopg2.connect('dbname=test user=pi')  # !rename to actual!
    cur = conn.cursor()

    query = "INSERT INTO sensors (dTime, soil, temp, humid, l1, l2) VALUES  (%s, %s, %s, %s, %s, %s)"
    cur.execute(query, (dTime, soil, temp, humid, L1, L2))

    # Commit changes to db and close connection
    conn.commit()
    cur.close()
    conn.close()


def main():
    while 1:
        # Check db
        print(getAllDB("sensors"))  # if this doesn't work then db is down

        try:
            sensorData = formattedRead()  # A dictionary of the latest sensor data

            addToDB(
                datetime.datetime.now(),
                sensorData["soil"],
                sensorData["temp"],
                sensorData["humid"],
                sensorData["L1"],
                sensorData["L2"]
            )
        except():
            print("it couldn't get a sensor val")

        time.sleep(10)  # Update db every 10s

    return "this shouldn't appear anywhere"


# Daemonizing
# daemon = Daemonize(app="sensorscript", pid=pid, action=main)
# daemon.start()

# to check if daemon is running:
# ps ax | grep sensorscript
# to stop daemon:
# sudo kill -9 process_pid


if __name__ == "__main__":
    main()
