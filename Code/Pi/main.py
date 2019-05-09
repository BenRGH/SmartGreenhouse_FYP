#!/usr/bin/env python

# Ben Rose 2018
# This is the main python program running on the raspberry pi,
# It reads from the arduinos via serial monitor (USB) and
# works with the data to display it as an http server.

import serial, time, sys, psycopg2, datetime, pyowm

owm = pyowm.OWM('2ba12dc7a5682ea8eb7831e1b996fe5d')  # API Key

# global counter for main
ticks = 0


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
def getAllDB(query):
    # Database connection goodness
    conn = psycopg2.connect('dbname=test user=pi')
    cur = conn.cursor()

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


def lightOn(light):
    # light is int, 0=left, 1=right and 2=both

    # // -----lights------
    # // 00 = light 1 on
    # // 01 = light 2 on
    # // 02 = light 1 off
    # // 03 = light 2 off

    # send command to control arduino -> relay
    with serial.Serial('/dev/ttyACM0', 9600, timeout=5) as ser:
        if light == 0:
            ser.write(b'0000')  # send light 1 on command (with extra 0's for padding)
        elif light == 1:
            ser.write(b'0001')  # send light 2 on command (with extra 0's for padding)
        elif light == 2:
            ser.write(b'0000')  # send light 2 on
            time.sleep(3)
            ser.write(b'0001')  # send light 2 on

    return 1


def lightOff(light):
    # light is int, 0=left, 1=right and 2=both

    # send command to control arduino -> relay
    with serial.Serial('/dev/ttyACM0', 9600, timeout=5) as ser:
        if light == 0:
            ser.write(b'0002')  # send light 1 off command (with extra 0's for padding)
        elif light == 1:
            ser.write(b'0003')  # send light 2 off command (with extra 0's for padding)
        elif light == 2:
            ser.write(b'0002')  # send light 2 off
            time.sleep(3)
            ser.write(b'0003')  # send light 2 off


def fanOn(fan):
    # fan is 0=first fan, 1=second fan and 2=both

    # // -----fans--------
    # // 10 = fan 1 on
    # // 11 = fan 2 on
    # // 12 = fan 1 off
    # // 13 = fan 2 off

    # send command to control arduino -> motor shield
    with serial.Serial('/dev/ttyACM0', 9600, timeout=5) as ser:
        if fan == 0:
            ser.write(b'0010')  # send fan 1 on command (with extra 0's for padding)
        elif fan == 1:
            ser.write(b'0011')  # send fan 2 on command (with extra 0's for padding)
        elif fan == 2:
            ser.write(b'0010')  # send fan 2 on
            time.sleep(3)
            ser.write(b'0011')  # send fan 2 on

    return 1


def fanOff(fan):
    # fan is 0=first fan, 1=second fan and 2=both

    # send command to control arduino -> motor shield
    with serial.Serial('/dev/ttyACM0', 9600, timeout=5) as ser:
        if fan == 0:
            ser.write(b'0012')  # send fan 1 off command (with extra 0's for padding)
        elif fan == 1:
            ser.write(b'0013')  # send fan 2 off command (with extra 0's for padding)
        elif fan == 2:
            ser.write(b'0012')  # send fan 2 off
            time.sleep(3)
            ser.write(b'0013')  # send fan 2 off

    return 1


def pumpOn(duration):
    # same as above, VERY IMPORTANT TO NOT OVERDO!!!
    # amount is just the time spent watering in ms, keep this low

    # // -----pump--------
    # // 20 = pump on for 1s
    # // 21 = pump on for 2s
    # // 22 = pump on for 3s

    # send command to control arduino -> motor shield
    with serial.Serial('/dev/ttyACM0', 9600, timeout=5) as ser:
        if duration == 0:
            ser.write(b'0020')  # send pump 1s command (with extra 0's for padding)
        elif duration == 1:
            ser.write(b'0021')  # send pump 2s command (with extra 0's for padding)
        elif duration == 2:
            ser.write(b'0022')  # send pump 3s command
    return 1


def main():

    while 1:
        # This is an endless loop that iterates every 30s so that manual controls can be implemented,
        # a counter variable exists to track time passed and run appropriate scheduled commands

        try:
            # Now we have the sensor values, we run them through the thresholds of automation,
            # the limits are defined by the chosen profile. Yes I am aware that 'try' statements shouldn't
            # be used like this but since a missed update isn't critical I'm okay with it.
            profileData = getAllDB("SELECT * FROM profile")[-1]

            print(profileData)

            # get profile values from db
            print("current profile: " + str(profileData[0]))
            lightCtrl = profileData[1]
            lightDelay = profileData[2]
            if lightDelay <= 1:
                print("light delay has low value, defaulting to 8h")
                lightDelay = 8
            fanCtrl = profileData[3]
            fanDelay = profileData[4]
            pumpAmount = profileData[5]
            pumpDelay = profileData[6]

            currentTimeHour = datetime.datetime.now().hour
            currentTimeMinute = datetime.datetime.now().minute

            # use delay set in db to set start and end time
            print("light delay is " + str(lightDelay))
            lightOnStartTime = (12 - (lightDelay//2)) % 24  # has to be in 24h format, half the delay before 12am
            print("light starttime is " + str(lightOnStartTime))
            lightOnEndTime = (12 + (lightDelay//2)) % 24  # half the delay past 12am
            print("light endtime is " + str(lightOnEndTime))

            # webserver should validate lightctrl, arduinos don't like confusing data
            print("current hour is: " + str(currentTimeHour))
            if currentTimeHour >= lightOnStartTime and currentTimeHour < (lightOnStartTime + (lightDelay//2)):
                # time to turn on
                lightOn(lightCtrl)
                print("light " + str(lightCtrl) + " on")

            elif currentTimeHour >= lightOnEndTime or currentTimeHour < lightOnStartTime:
                lightOff(lightCtrl)
                print("light " + str(lightCtrl) + " off")


            # Same as above but for the fans
            # use delay set in db to set start and end time
            print("fan delay is " + str(fanDelay))
            fanOnStartTime = (12 - (fanDelay//2)) % 24  # has to be in 24h format, half the delay before 12am
            print("fan starttime is " + str(fanOnStartTime))
            fanOnEndTime = (12 + (fanDelay//2)) % 24  # half the delay past 12am
            print("fan endtime is " + str(fanOnEndTime))

            if currentTimeHour >= fanOnStartTime and currentTimeHour < (fanOnStartTime + (fanDelay//2)):
                # time to turn on
                fanOn(fanCtrl)
                print("fan " + str(fanCtrl) + " on")

            elif currentTimeHour >= fanOnEndTime or currentTimeHour < fanOnStartTime:
                fanOff(fanCtrl)
                print("fan " + str(fanCtrl) + " off")


            # add pump control here


            global ticks  # to access global var
            print("ticks is currently " + str(ticks))
            if ticks >= 20:
                # 10 minutes should have passed
                sensorData = formattedRead()  # A dictionary of the latest sensor data

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

                ticks = 0


        except Exception:
            print("Main loop failure, see error:")
            print(str(Exception))
            pass

        time.sleep(30)  # Each loop takes ~30s
        ticks += 1  # increment ticks every loop


    return "this shouldn't appear anywhere"


# to daemonize:
# PGPASSWORD="" pm2 start main.py --watch

if __name__ == "__main__":
    main()
