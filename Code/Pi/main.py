# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial
import time
import sys
import psycopg2
import datetime


def readFromSerial(port, valType='s'):
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
        ser.write(valType.encode('utf-8'))
        time.sleep(3)
        s = ser.read(bytesToRead)  # Read the first 100 bytes

    return s.decode("utf-8")


def formattedRead():
    # This takes the data read by readFromSerial and formats it for export to the web.
    export = (readFromSerial(0) + "\n" + readFromSerial(1)).split("\n")

    # Python dict of the data
    export = {
        "soil": export[0],
        "temp": export[1],
        "humid": export[2],
        "L1": export[3],
        "L2": export[4]
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
def addToDB(cTime, soil, temp, humid, L1, L2):
    # Database connection goodness
    conn = psycopg2.connect('dbname=test user=pi')  # !rename to actual!
    cur = conn.cursor()

    query = "INSERT INTO sensors (cTime, soil, temp, humid, l1, l2) VALUES  (%s, %s, %s, %s, %s, %s)"
    cur.execute(query, (cTime, soil, temp, humid, L1, L2))

    # Commit changes to db and close connection
    conn.commit()
    cur.close()
    conn.close()


def main():
    while 1:
        # Check db
        print(getAllDB("sensors"))

        sensorData = formattedRead()  # A dictionary of the latest sensor data

        try:
            addToDB(
                str(datetime.datetime.now()),
                sensorData["soil"],
                sensorData["temp"],
                sensorData["humid"],
                sensorData["L1"],
                sensorData["L2"]
            )
        except():
            print("it couldn't get a sensor val")

        time.sleep(10)

    return "this shouldn't appear anywhere"


if __name__== "__main__":
    main()
