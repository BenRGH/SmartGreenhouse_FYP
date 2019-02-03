#!/usr/bin/env python

# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial, time, sys, psycopg2, datetime
from weather import Weather, Unit

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

    try:  # sometimes there's a read error and the array is made wrong
        tempIn = readFromSerial(1).split('/')
        print(tempIn)

        soilVal = readFromSerial(0).split()[0]
        print(soilVal)
        if soilVal == '':
            soilVal = 511

        # Python dict of the data
        export = {
            "soil": soilVal,
            "temp": float(tempIn[0]),
            "humid": float(tempIn[1]),
            "L1": float(tempIn[2]),
            "L2": float(tempIn[3])
        }
    except Exception:
        export = {}
        pass


    print(export)

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
def addToDB(dtime, soil, temp, humid, L1, L2):
    # Database connection goodness
    conn = psycopg2.connect('dbname=test user=pi')
    cur = conn.cursor()

    query = "INSERT INTO sensors (dtime, soil, temp, humid, l1, l2) VALUES  (%s, %s, %s, %s, %s, %s)"
    cur.execute(query, (dtime, soil, temp, humid, L1, L2))

    # Commit changes to db and close connection
    conn.commit()
    cur.close()
    conn.close()


def addWeather():
    weather = Weather(unit=Unit.CELSIUS)
    location = weather.lookup_by_location('portsmouth')
    condition = location.condition

    conn = psycopg2.connect('dbname=test user=pi')
    cur = conn.cursor()

    query = "INSERT INTO weather (dtime, temp) VALUES (%s, %s)"
    cur.execute(query, (datetime.datetime.now(), condition.temp))

    # Commit changes to db and close connection
    conn.commit()
    cur.close()
    conn.close()



def main():
    while 1:
        # Check db
        # print(getAllDB("sensors"))  # if this doesn't work then db is down

        try:
            sensorData = formattedRead()  # A dictionary of the latest sensor data

            print(sensorData)

            addToDB(
                datetime.datetime.now(),
                sensorData['soil'],
                sensorData['temp'],
                sensorData['humid'],
                sensorData['L1'],
                sensorData['L2']
            )

            if datetime.datetime.now().minute % 2 == 0:
                addWeather()  # Add current temp to db

        except Exception:
            print("it couldn't get a sensor val")
            pass

        time.sleep(10000)  # Update db every 10m

    return "this shouldn't appear anywhere"

# to daemonize:
# nohup python main.py &
# to check if daemon is running:
# ps ax | grep main.py
# to stop daemon:
# sudo kill -9 process_pid


if __name__ == "__main__":
    main()
