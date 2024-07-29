from flask import Flask, jsonify, request
from flask_cors import CORS
from helper import *
import psycopg2
from datetime import date, datetime
import db

app = Flask("Admin Api")
# enable cross origin
CORS(app)

@app.route('/api/addrequests', methods=["POST"])
async def addrequests():
    data = request.json
    error = jsonify("error")

    #validate user here assume to be api call
    if not "Key" in request.headers.keys():
        return error
    if not "Fromuser" in request.headers.keys():
        return error

    valid = await validateKey(request.headers["Key"])
    if not valid:
        return jsonify("Key invalid")
    if len(request.headers["Fromuser"]) == 0:
        return error

    #assert request data before putting into database
    if not checkRequestType(data["RequestType"][0]):
        return error

    req = data["RequestType"][0]
    entries = []
    skippedEntries = False

    for i in data.keys():
        if i != "RequestType" and i != "Headers":
            entry = dict()
            for v in params:
                entry[v] = ''
            entry["requestType"] = req
            entry["serial"] = i
            entry["from"] = request.headers["Fromuser"]
            entry["date"] = date.today().strftime("%d/%m/%Y")
            entry["time"] = datetime.now().strftime("%H:%M:%S")
            entry["status"] = "Pending"
            if req == "Add 4G VPN Profile" or req == "Remove 4G VPN profile" or req == "Remove Trial Certificate" or req == "Add Trial Certificate": # Type | vpn | uuid
                if len(data[i]) < 3:
                    skippedEntries = True
                    continue
                entry["device"] = data[i][0]
                entry["uuid"] = data[i][2]
            elif req == "Retire device": # type | uuid
                if len(data[i]) < 2:
                    skippedEntries = True
                    continue
                entry["device"] = data[i][0]
                entry["uuid"] = data[i][1]
            elif req == "Add new device record": # type
                if len(data[i]) == 0:
                    skippedEntries = True
                    continue
                entry["device"] = data[i][0]
            elif req == "Add Webclip": # type | webclip | uuid
                if len(data[i]) < 3:
                    skippedEntries = True
                    continue
                entry["device"] = data[i][0]
                entry["webclip"] = data[i][1]
                entry["uuid"] = data[i][2]
            elif req == "App Update": # type | app | uuid
                if len(data[i]) < 3:
                    skippedEntries = True
                    continue
                entry["device"] = data[i][0]
                entry["app"] = data[i][1]
                entry["uuid"] = data[i][2]
            elif req == "Change of Device Type": # type | change to | uuid
                if len(data[i]) < 3:
                    skippedEntries = True
                    continue
                entry["device"] = data[i][0]
                entry["change"] = data[i][1]
                entry["uuid"] = data[i][2]
            elif req == "Look for last location": # type | mac | uuid
                if len(data[i]) < 3:
                    skippedEntries = True
                    continue
                entry["device"] = data[i][0]
                entry["mac"] = data[i][1]
                entry["uuid"] = data[i][2]

            entries.append(entry)
    conn = psycopg2.connect(
        database="request", user='postgres', password="123", host="127.0.0.1", port="5432"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute(
        '''
        SELECT * FROM CLUSTERID
        '''
    )
    clusterid = cursor.fetchone()
    if clusterid == None:
        clusterid = ''
    else:
        clusterid = clusterid[0]

    for i in entries:
        i["cluster"] = clusterid
        cursor.execute(
            '''
            INSERT INTO entries
            Values(%(requestType)s,%(serial)s,%(cluster)s,%(status)s,%(uuid)s,%(date)s,%(device)s,%(change)s,%(from)s,%(mac)s,%(app)s,%(webclip)s,%(time)s)
            '''
        , i)
    cursor.execute(
        '''
        UPDATE CLUSTERID
        SET
        val = %(cid)s
        '''
    , {"cid": int(clusterid)+1})
    conn.close()
    if skippedEntries:
        return jsonify("skipped entries")
    return jsonify("true")


@app.route('/api/requests', methods=['GET'])
async def getrequests():
    error = jsonify({"data" : [], "response" : "no"})
    # get key
    if not "key" in request.headers:
        return error
    key = request.headers["Key"]
    # validate session key here
    if len(key) > 0:
        valid = await validateKey(key)
        if not valid:
            return jsonify("Invalid key")
    else:
        return error

    # parse data
    data = request.args.to_dict()
    if not checkQueryParams(data):
        return error

    # connect to db here
    conn = psycopg2.connect(
        database="request", user='postgres', password="123", host="127.0.0.1", port="5432"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    if data["date"] != "":
        l = data["date"].split("-")
        newdate = ""
        for i in reversed(l):
            newdate += i
            newdate += "/"
        newdate = newdate[:len(newdate)-1]
        data["date"] = newdate
    print(data["date"])
    data["date"] = '%' + data["date"] + '%'

    data["time"] = '%' + data["time"] + '%'
    data["serial"] = '%' + data["serial"] + '%'
    data['mac'] = '%' + data['mac'] + '%'
    data["webclip"] = '%' + data["webclip"] + '%'
    data['app'] = '%' + data['app'] + '%'
    data['from'] = '%' + data['from'] + '%'
    data['uuid'] = '%' + data['uuid'] + '%'
    cursor.execute('''
    SELECT
        *
    FROM
        entries
    WHERE
        (RTYPE = %(requestType)s OR %(requestType)s = '') AND
        (SN LIKE %(serial)s OR %(serial)s = '%%') AND
        (CLUSTERID = %(cluster)s OR %(cluster)s = '') AND
        (STATUS = %(status)s OR %(status)s = '') AND
        (UID LIKE %(uuid)s OR %(uuid)s = '%%') AND
         (CDATE LIKE %(date)s OR %(date)s = '%%') AND
        (DTYPE = %(device)s OR %(device)s = '') AND
         (TOTYPE = %(change)s OR %(change)s = '') AND
        (FUSER LIKE %(from)s OR %(from)s = '%%') AND
         (MAC LIKE %(mac)s OR %(mac)s = '%%') AND
        (APP LIKE %(app)s OR %(app)s = '%%') AND
        (WEBCLIP LIKE %(webclip)s OR %(webclip)s = '%%') AND
        (TIMECREATED LIKE %(time)s OR %(time)s = '%%')''', data)
    fetch = cursor.fetchone()
    fetched = []
    while fetch:
        fetched.append(fetch)
        fetch = cursor.fetchone()
    items = []
    for i in fetched:
        if i[1] == "" or i[1] == None:
            continue
        items.append(dict())
        for index, key in enumerate(params):
            items[-1][key] = i[index]
        items[-1]["id"] = i[-1]
    print(items)
    conn.close()
    return jsonify({"data" : items, "response" : "yes"})


if __name__ == "__main__":
    # db.initializeDB()
    app.run(port=5000)

