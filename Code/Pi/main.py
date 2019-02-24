#!/usr/bin/env python

# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial, time, sys, psycopg2, datetime, pyowm

owm = pyowm.OWM('2ba12dc7a5682ea8eb7831e1b996fe5d') # API Key


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
    conn = psycopg2.connect('dbname=test user=pi')
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
    observation = owm.weather_at_place('Portsmouth,GB')
    w = observation.get_weather()  # does what it says on the tin
    print(w)  # debugging
    currTemp = w.get_temperature('celsius')['temp']
    currHumidity = w.get_humidity()

    conn = psycopg2.connect('dbname=test user=pi')
    cur = conn.cursor()

    query = "INSERT INTO weather (dtime, temp, humidity) VALUES (%s, %s, %s)"
    cur.execute(query, (datetime.datetime.now(), currTemp, currHumidity))

    # Commit changes to db and close connection
    conn.commit()
    cur.close()
    conn.close()

def lightTiming(light,delay):
    # light is int, 0=left, 1=right and 2=both
    # delay is the duration light should be on in ms

    # send command to control arduino -> relay
    return 1

def fanTiming(fan,delay):
    # sets the delay between the fans being on, in ms
    # fan can be 0=first fan, 1=second fan and 2=both
    # this could be calculated in main on as an hourly timing

    # send command to control arduino -> motor shield
    return 1

def pumpTiming(amount,delay):
    # same as above, VERY IMPORTANT TO NOT OVERDO!!!
    # amount is just the time spent watering in ms, keep this low

    # send command to control arduino -> motor shield
    return 1

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

            addWeather()  # Add current temp to db
            # LIMITED TO 60 TIMES A MINUTE!


            # Now we have the sensor values, we run them through the thresholds of automation,
            # the limits are defined by the chosen profile
            profileData = getAllDB("profile")[1]

            lightTiming(profileData['light'], profileData['lightdelay'])
            fanTiming(profileData['fan'], profileData['fandelay'])
            pumpTiming(profileData['pumpamount'], profileData['pumpdelay'])





        except Exception:
            print("it couldn't get a sensor val")
            pass

        time.sleep(600)  # Update db every 10m

    return "this shouldn't appear anywhere"


# to daemonize:
# pm2 start main.py --watch

if __name__ == "__main__":
    main()
