from flask import Flask, jsonify, request, g
from flask_cors import CORS
from helper import *
import logging
from datetime import date, datetime
import threading
import requests


processMutex = threading.Lock()
updateMutex = threading.Lock()
updateReqMutex = threading.Lock()
app = Flask("Admin Api")
# logging
app.logger.setLevel(logging.INFO)
logHandle = logging.FileHandler('server'+'.log')
formatter = logging.Formatter(fmt='%(asctime)s %(levelname)-8s From [%(threadName)s] [%(thread)d]: %(message)s',
                              datefmt='%Y-%m-%d %H:%M:%S')
logHandle.setFormatter(formatter)
app.logger.addHandler(logHandle)

# enable cross origin resource sharing
CORS(app)

# error wrapper for default errors
def defaultErrorHandler(f):
    async def wrapper(*args, **kwargs):
        try:
            val = await f(*args, **kwargs)
            return val
        except Exception as e:
            app.logger.error(repr(e))
            return jsonify({"res": "error", "error": "An error has occurred"})
    return wrapper

@app.route('/api/rejectrequest/', methods=['POST'], endpoint='updaterequest')
@defaultErrorHandler
async def rejectrequest():
    Responses = responses()
    data = request.json["data"][0]
    valid = await validateKey(request.headers["Key"])
    user = request.headers["From"]
    if not valid:
        return Responses.keyError
    app.logger.info("Attempting to reject requests by " + user + " : " + str(data))
    cursor, conn = createCursor()
    cursor.execute(
        '''
        SELECT * FROM entries WHERE
        id=%s
        '''
    , (data["id"],))
    fetched = cursor.fetchone()
    if fetched == None:
        app.logger.info("Error (Request does not exist on db) attempting to reject requests by " + user + " : " + str(data))
        return Responses.customError("Request does not exist on db.")
    fetched = list(fetched)
    fetched.pop(13) # pop id from result

    with updateReqMutex:

        for ind, key in enumerate(params):
            if data[key] != fetched[ind]:
                app.logger.info(
                    "Error (Request does not match db entry) attempting to reject requests by " + user + " : " + str(data))
                return Responses.customError("Request does not match db entry.")
        cursor.execute('''
        UPDATE entries 
        SET 
        status='Rejected',
        processed=%s
        WHERE id=%s
        ''', (user,data['id']))
    app.logger.info("Successfully rejected requests by " + user + " : " + str(data))
    return Responses.ok()

# make some helper functions
def addAllLabels(labels, uuid, server, logger):
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    finished = []
    if not validateServer(server):
        return finished
    for i in labels:
        r = requests.get(server + "api/v2/labels/" + str(i), auth=(user, password), params={"adminDeviceSpaceId": spaceID}).json()["results"]
        if r["name"] != labels[i]:
            logger.info("Failed to apply label " + labels[i] + " to " + uuid + " because name does not match.")
            continue

        r = requests.get(server + "api/v2/devices", auth=(user, password),params={"adminDeviceSpaceId" : spaceID, "fields": "common.uuid" ,"query" : 'common.uuid="' + uuid + '"'}).json()["results"]
        if len(r) == 0:
            logger.info("Failed to apply label " + labels[i] + " to " + uuid + " serial number does not exist.")
            continue
        # appying label here
        r = requests.put(server+"api/v2/devices/labels/" + labels[i] + "/add", auth=(user, password), params={"adminDeviceSpaceId" : spaceID}, json={"deviceUuids" : [uuid]}, headers={"Content-Type" : "application/json"}).json()
        if (not r["successful"]):
            logger.info("Failed to apply label " + labels[i] + " to " + uuid + " MI Error.")
            continue
        finished.append((i, labels[i]))
    return finished


def removeAllLabels(labels, uuid, server, logger):
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    finished = []
    if not validateServer(server):
        return finished
    for i in labels:
        r = requests.get(server + "api/v2/labels/" + str(i), auth=(user, password),
                         params={"adminDeviceSpaceId": spaceID}).json()["results"]
        if r["name"] != labels[i]:
            logger.info("Failed to remove label " + labels[i] + " to " + uuid + " because name does not match.")
            continue

        r = requests.get(server + "api/v2/devices", auth=(user, password),
                         params={"adminDeviceSpaceId": spaceID, "fields": "common.uuid",
                                 "query": 'common.uuid="' + uuid + '"'}).json()["results"]
        if len(r) == 0:
            logger.info("Failed to remove label " + labels[i] + " to " + uuid + " serial number does not exist.")
            continue
        # appying label here
        r = requests.put(server + "api/v2/devices/labels/" + labels[i] + "/remove", auth=(user, password),
                         params={"adminDeviceSpaceId": spaceID}, json={"deviceUuids": [uuid]},
                         headers={"Content-Type": "application/json"}).json()
        if (not r["successful"]):
            logger.info("Failed to remove label " + labels[i] + " to " + uuid + " MI Error.")
            continue
        finished.append((i, labels[i]))
    return finished


@app.route('/api/processrequests/', methods=['POST'], endpoint='processrequests')
@defaultErrorHandler
async def processrequests():
    Responses = responses()
    data = request.json
    valid = await validateKey(request.headers["Key"])
    user = request.headers["From"]
    if not valid:
        return Responses.keyError

    cursor, conn = createCursor()

    # ensure atomic property
    with processMutex:
        pending = []
        repeatedCounts = []
        app.logger.info("Processing requests by " + user + " : " + str(data))
        # check that requests are not complete already
        for i in data:
            if not checkProcessParams(i):
                conn.close()
                return Responses.customError("Error: Payload incomplete!", [i])
            cursor.execute('''
                SELECT * FROM entries WHERE id = %(id)s
            
            ''', {"id" : i["id"]})
            entry = cursor.fetchone()
            if entry == None:
                app.logger.warning("Processing requests encounter entry not exists in DB for " + str(entry))
                conn.close()
                return Responses.customError("Error: Entry does not exist in database!", [i])
            if entry[3] == "Completed":
                repeatedCounts.append(entry)
            else:
                for ind, key in enumerate(paramsProcess):
                    if i[key] != entry[ind]:
                        app.logger.warning("Processing requests encounter DB mismatch for " + str(entry))
                        conn.close()
                        return Responses.customError("Error: Entry mismatch with database records!", [i])
                pending.append(i)
        # based on different request do api calls here &
        # finish request by setting pending -> complete
        for i in pending:
            if i["requestType"] == "Add 4G VPN Profile":
                pass
            elif i["requestType"] == "Add new device record":
                pass
            elif i["requestType"] == "Add Trial Certificate":
                pass
            elif i["requestType"] == "Add Webclip":
                pass
            elif i["requestType"] == "App Update":
                pass
            elif i["requestType"] == "Change of Device Type":
                pass
            elif i["requestType"] == "Look for last location":
                pass
            elif i["requestType"] == "Remove 4G VPN profile":
                pass
            elif i["requestType"] == "Remove Trial Certificate":
                pass
            elif i["requestType"] == "Retire device":
                pass

        cursor.execute('''
                            UPDATE entries
                            SET
                                status=%(status)s,
                                processed=%(processed)s
                            WHERE 
                                id=%(id)s
                        ''', {"id": i["id"], "status": "Completed", "processed" : user})

        # put your email api here the user is the email

        # logging
        app.logger.info("Completed requests by " + user + " : " + str(data))
    return Responses.ok(repeatedCounts)



@app.route('/api/addrequests/', methods=["POST"], endpoint='addrequests')
@defaultErrorHandler
async def addrequests():
    Responses = responses()
    data = request.json
    valid = await validateClientKey(request.headers["Key"])
    if not valid:
        return Responses.keyError
    if len(request.headers["Fromuser"]) == 0:
        return Responses.customError("Error: Header missing!")

    #assert request data before putting into database
    if not checkRequestType(data["RequestType"][0]):
        return Responses.customError("Error: Request type invalid!")

    req = data["RequestType"][0]
    entries = []
    skippedEntries = []
    cursor, conn = createCursor()
    app.logger.info("Attempting to add requests by " + request.headers["Fromuser"] + " : " + str(data))
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
            entry["server"] = ''
            if (req == "Add 4G VPN Profile" or req == "Remove 4G VPN profile" or req == "Remove Trial Certificate" or
                    req == "Add Trial Certificate" or req == "Retire device"): # type | uuid
                if len(data[i]) < 3:
                    skippedEntries.append(i)
                    continue
                entry["device"] = data[i][0]
                entry["uuid"] = data[i][1]
                entry["server"] = data[i][2]
            elif req == "Add new device record": # type | clusterid
                if len(data[i]) < 2:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["cluster"] = data[i][1]

            elif req == "Add Webclip": # type | webclip | uuid
                if len(data[i]) < 4 or not "wcp_" in data[i][1]:
                    skippedEntries.append(data[i])
                    continue

                data[i][1] = data[i][1][4:]
                cursor.execute('''
                    SELECT * FROM webclips WHERE webclip=%s
                ''',(data[i][1],));
                fetched = cursor.fetchone()
                if fetched == None:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["webclip"] = data[i][1]
                entry["uuid"] = data[i][2]
                entry["server"] = data[i][3]

            elif req == "App Update": # type | app | uuid
                if len(data[i]) < 4 or not "app_" in data[i][1]:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["app"] = data[i][1][4:]
                entry["uuid"] = data[i][2]
                entry["server"] = data[i][3]
            elif req == "Change of Device Type": # type | change to | uuid
                if len(data[i]) < 4:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["change"] = data[i][1]
                entry["uuid"] = data[i][2]
                entry["server"] = data[i][3]
            elif req == "Look for last location": # type | mac | uuid
                if len(data[i]) < 4:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["mac"] = data[i][1]
                entry["uuid"] = data[i][2]
                entry["server"] = data[i][3]
            entries.append(entry)

    app.logger.info("Successfully added requests by " + request.headers["Fromuser"] + " : " + str(entries))
    for i in entries:
        cursor.execute(
            '''
            INSERT INTO entries(rtype, sn, clusterid, status, uid, cdate, dtype, totype, fuser, mac, app,webclip,timecreated,processed,server)
            Values(%(requestType)s,%(serial)s,%(cluster)s,%(status)s,%(uuid)s,%(date)s,%(device)s,%(change)s,%(from)s,%(mac)s,%(app)s,%(webclip)s,%(time)s,'',%(server)s)
            '''
        , i)


    return Responses.ok(skippedEntries)

@app.route('/api/requests/', methods=['GET'], endpoint='getrequests')
@defaultErrorHandler
async def getrequests():
    Responses = responses()
    key = request.headers["Key"]
    # validate session key here
    valid = await validateKey(key)
    if not valid:
        return Responses.keyError

    # parse data
    data = request.args.to_dict()
    if not checkQueryParams(data):
        return Responses.defaultError

    # connect to db
    cursor, conn = createCursor()

    if data["date"] != "":
        l = data["date"].split("-")
        newdate = ""
        for i in reversed(l):
            newdate += i
            newdate += "/"
        newdate = newdate[:len(newdate)-1]
        data["date"] = newdate

    data["date"] = '%' + data["date"] + '%'
    data["time"] = '%' + data["time"] + '%'
    data["serial"] = '%' + data["serial"] + '%'
    data['mac'] = '%' + data['mac'] + '%'
    data["webclip"] = '%' + data["webclip"] + '%'
    data['app'] = '%' + data['app'] + '%'
    data['from'] = '%' + data['from'] + '%'
    data['uuid'] = '%' + data['uuid'] + '%'
    data['processed'] = '%' + data['processed'] + '%'
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
        (TIMECREATED LIKE %(time)s OR %(time)s = '%%') AND
        (PROCESSED LIKE %(processed)s OR %(processed)s = '%%')''', data)
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
        # if you added/removed another column in the db, you have to change the index here
        items[-1]["id"] = i[len(i)-3]
        items[-1]["processed"] = i[-2]

    return Responses.ok(items)

@app.route('/api/updatewebclip/', methods=["POST"], endpoint='updateWebclip')
@defaultErrorHandler
async def updateWebclip():
    Responses = responses()
    valid = await validateKey(request.headers["Key"])
    if not valid:
        return Responses.keyError

    data = request.json
    if data["to"] != "active" and data["to"] != "inactive" and data["to"] != "delete":
        return Responses.defaultError

    key = data["data"]["id"]
    user = request.headers["From"]
    cursor, conn = createCursor()
    app.logger.info("Attempting to update webclips by" + user + " : " + str(data['data']))
    cursor.execute('''
    SELECT * FROM webclips
    WHERE id=%(id)s
    ''', {"id": key})
    fetched = cursor.fetchone()
    if fetched == None:
        app.logger.warning("Error (Webclip does not exist on DB) when updating webclips by" + user + " : " + str(data['data']))
        return Responses.customError("Entry id does not exist on database!")
    item = webclipToDict(fetched)
    for i in item.keys():
        if data["data"][i] != item[i]:
            app.logger.warning("Error (item mismatch with entry on DB) when updating webclips by" + user + " : " + str(data['data']))
            return Responses.customError("Item mismatch with entry in database!")
    with updateMutex:
        if data["to"] == "active":
            cursor.execute('''
            UPDATE webclips
            SET active='active'
            WHERE id=%s
            ''', (key,))
        elif data["to"] == "inactive":
            cursor.execute('''
            UPDATE webclips
            SET active='inactive'
            WHERE id=%s
            ''', (key,))
        else:
            cursor.execute('''
            DELETE FROM webclips
            WHERE id=%s            
            ''', (key,))
    app.logger.info("Successfully updated webclips by" + user + " : " + str(data['data']))
    return Responses.ok()

@app.route('/api/addwebclips/', methods=["POST"])
@defaultErrorHandler
async def addWebclips():
    Responses = responses()
    valid = await validateKey(request.headers["Key"])
    if not valid:
        return Responses.keyError

    settings = apiSettings()
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    username = env["apiUsername"]
    password = env["apiPassword"]
    user = request.headers["From"]
    data = request.json
    models = data["models"].split(',')
    dtypes = data["dtypes"].split(',')
    platform = data["pt"].split(',')
    labels = data['labels']
    labelids = data["labelids"]
    oses = data['oses'].split(',')
    webclip = [data['webclip']]
    server = settings.domain
    if int(data["server"]) == 0:
        if len(settings.fallback) == 0:
            return Responses.customError("No fallback server.")
        server = settings.fallback[int(data["server"])-1]


    # validate data here
    if len(dtypes) > 3:
        return Responses.defaultError
    for i in dtypes:
        if i.upper() != "CORP" and i.upper() != "OUD" and i.upper() != "COPE":
            return Responses.defaultError
    if len(webclip) > 100:
        return Responses.defaultError


    # verify labels
    labellist = labels.split(",")
    for v, i in enumerate(labelids.split(",")):
        print(server + "api/v2/labels/" + i)
        r = requests.get(server + "api/v2/labels/" + i, auth=(username, password),
                         params={"adminDeviceSpaceId": spaceID}).json()
        if r == {}:
            return Responses.customError("Label id does not exist on mi server.",[i])
        if r["results"]["name"] != labellist[v]:
            return Responses.customError("Label name does not match id provided.", [i])

    # slap into db
    app.logger.info("Attempting to add webclips by " + user + " : " + str(data))


    entries = combinations([models, dtypes,platform,oses,webclip])
    cursor, conn = createCursor()
    for i in entries:
        entry = i[:3] + [labels] + i[3:] + [server] + [labelids]
        print(entry)
        cursor.execute('''
        INSERT INTO  webclips(model, dtype, platform, labels, os, webclip, active, server, labelids) VALUES(
            %s,%s,%s,%s,%s,%s,'active',%s,%s
        )
        ''', tuple(entry))
    app.logger.info("Successfully added webclips by " + user + " : " + str(data))
    return Responses.ok()

# this is the client api
@app.route('/api/getwebclips/', methods=["GET"], endpoint='getWebclips')
@defaultErrorHandler
async def getWebclips():
    Responses = responses()
    valid = await validateClientKey(request.headers["Key"])
    if not valid:
        return Responses.keyError

    data = request.args.to_dict()

    if (data["model"] == '' or data["dtype"] == '' or data["platform"] == '' or not 'os' in data.keys() or data["server"] == ''):
        return Responses.defaultError
    cursor, conn = createCursor()
    cursor.execute('''
            SELECT * FROM webclips 
            WHERE (active='active') AND
            (model ~* ANY(string_to_array(%(model)s, ' '))) AND
            (dtype=%(dtype)s) AND
            (%(platform)s LIKE platform OR platform='') AND
            (os=%(os)s OR %(os)s = '' OR os='') AND
            (server=%(server)s)
        ''', data)
    fetched = cursor.fetchone()
    listofitems = []
    while fetched:
        item = webclipToDict(fetched)
        if (item["model"].lower() in data["model"].lower()):
            listofitems.append("wcp_"+item["webclip"])
        fetched = cursor.fetchone()

    return Responses.ok(listofitems)


# this is the server api
@app.route('/api/fetchwebclips/', methods=["GET"], endpoint='fetchWebclips')
@defaultErrorHandler
async def fetchWebclips():
    Responses = responses()
    valid = await validateKey(request.headers["Key"])
    if not valid:
        return Responses.keyError

    data = request.args.to_dict()
    cursor, conn = createCursor()

    cursor.execute('''
        SELECT * FROM webclips WHERE (active=%(active)s OR %(active)s = '')
    ''', data)
    fetched = cursor.fetchone()
    listofitems = []
    while fetched:
        item = webclipToDict(fetched)
        listofitems.append(item)
        fetched = cursor.fetchone()

    return Responses.ok(listofitems)

@app.route('/api/mi/fetchapps/', methods=["GET"], endpoint='fetchMiApps')
@defaultErrorHandler
async def fetchMiApps():
    Responses = responses()
    settings = apiSettings()
    # valid = await validateKey(request.headers["Key"])
    # if not valid:
    #     return Responses.keyError
    uuid = request.args.to_dict()["uuid"]
    server = request.args.to_dict()["server"]
    if not validateServer(server):
        return Responses.customError("Invalid server.")
    if len(uuid) == 0:
        return Responses.customError("Please enter a uuid.")

    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    r = requests.get(server+"api/v2/devices/appinventory",auth=(user,password), params={"adminDeviceSpaceId" : spaceID, 'deviceUuids' : uuid}).json()

    return Responses.ok(r["results"][0]["appInventory"])

@app.route('/api/mi/getdevicelabels/', methods=["GET"], endpoint='fetchDeviceLabels')
@defaultErrorHandler
async def fetchDeviceLabels():
    settings = apiSettings()
    Responses = responses()
    # valid = await validateKey(request.headers["Key"])
    # if not valid:
    #     return Responses.keyError
    args = request.args.to_dict()
    uuid = args["uuid"]
    server = args["server"]

    if server == '':
        server = settings.domain
    if not validateServer(server):
        return Responses.customError("Invalid server.")
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    r = requests.get(server + "api/v2/devices", auth=(user, password),
                     params={"adminDeviceSpaceId": spaceID, "fields": "common.uuid",
                             "query": 'common.uuid="' + uuid + '"'}).json()["results"]
    if len(r) == 0:
        return Responses.customError("The uuid is not in the records.")

    r = requests.get(server + "api/v2/devices/" + uuid + "/labels",auth=(user, password), params={"adminDeviceSpaceId": spaceID}).json()["results"]

    return Responses.ok(r)

@app.route('/api/mi/fetchdevice/', methods=["GET"], endpoint='fetchMi')
@defaultErrorHandler
async def fetchMi():
    Responses = responses()
    settings = apiSettings()
    # valid = await validateKey(request.headers["Key"])
    # if not valid:
    #     return Responses.keyError

    sn = request.args.to_dict()["sn"]
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    r = requests.get(settings.domain + 'api/v2/devices', auth=(user, password),params={"adminDeviceSpaceId" : spaceID, "fields": settings.getSearchFields(),"query" : 'common.SerialNumber="' + sn + '"'}).json()["results"]
    filtered = [x for x in r if x["common.status"] == "ACTIVE"]
    for i in filtered:
        i["server"] = settings.domain
    if len(filtered) == 0:
        # check fallback servers
        for i in settings.fallback:
            r = requests.get(i + 'api/v2/devices', auth=(user, password),
                             params={"adminDeviceSpaceId": spaceID, "fields": settings.getSearchFields(),
                                     "query": 'common.SerialNumber="' + sn + '"'}).json()["results"]
            newfiltered =  [x for x in r if x["common.status"] == "ACTIVE"]
            for v in newfiltered:
                v["server"] = i
            filtered += newfiltered

    return Responses.ok(filtered)
'''
Removes a label from a device
'''
@app.route('/api/mi/removelabel/', methods=["GET"], endpoint='removeLabelMi')
async def removeLabelMi():
    settings = apiSettings()
    Responses = responses()
    # valid = await validateKey(request.headers["Key"])
    # if not valid:
    #     return Responses.keyError
    # user = request.headers["From"]
    # app.logger.info("Attempting to remove label by " + user + " : " + request.args.to_dict()["labelname"] + " on " + request.args.to_dict()["uuid"])

    args = request.args.to_dict()
    uuid = args["uuid"]
    labelid = args["labelid"]
    labelname = args["labelname"]
    server = args["server"]
    if not validateServer(server):
        return Responses.customError("Invalid server.")

    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    labelid = int(labelid)  # throws error if id is not int
    r = requests.get(server + "api/v2/labels/" + str(labelid), auth=(user, password),
                     params={"adminDeviceSpaceId": spaceID}).json()["results"]
    if r["name"] != labelname:
        # app.logger.warning("Error (Label id does not match label name!) attempting to remove label by " + user + " : " + labelname + " on " + uuid)
        return Responses.customError("Label id does not match label name!")

    r = requests.get(server + "api/v2/devices", auth=(user, password),
                     params={"adminDeviceSpaceId": spaceID, "fields": "common.uuid",
                             "query": 'common.uuid="' + uuid + '"'}).json()["results"]
    if len(r) == 0:
        # app.logger.warning("Error (The uuid is not in the records.) attempting to remove label by " + user + " : " + labelname + " on " + uuid)
        return Responses.customError("The uuid is not in the records.")

    r = requests.get(server + "api/v2/devices/" + uuid + "/labels", auth=(user, password),params={"adminDeviceSpaceId" : spaceID}).json()["results"]
    found = False
    for i in r:
        if i["name"] == labelname and i["id"] == str(labelid):
            found = True
            break
    if not found:
        # app.logger.warning("Error (The label does not exists on device with this uuid) attempting to remove label by " + user + " : " + labelname + " on " + uuid)
        return Responses.customError("The label does not exists on device with this uuid.", [labelname, uuid])

    # Removing label here
    r = requests.put(server + "api/v2/devices/labels/" + labelname + "/remove", auth=(user, password),params={"adminDeviceSpaceId" : spaceID}, json={
        "deviceUuids" : [uuid]
    }, headers={"Content-Type": "application/json"}).json()
    if (not r["successful"]):
        # app.logger.warning("Error (Failed to remove label for this uuid.) attempting to remove label by " + user + " : " + labelname + " on " + uuid)
        return Responses.customError("Failed to remove label for this uuid.", [labelname, uuid])
    # app.logger.info("Successfully removed label by " + user + " : " + labelname + " on " + uuid)
    return Responses.ok(r)
'''
Adds label to device
'''
@app.route('/api/mi/addlabel/', methods=["GET"], endpoint='addLabelMi')
async def addLabelMi():
    settings = apiSettings()
    Responses = responses()
    # valid = await validateKey(request.headers["Key"])
    # if not valid:
    #     return Responses.keyError
    # user = request.headers["From"]
    # app.logger.info("Attempting to add label by " + user + " : " + request.args.to_dict()["labelname"] + " on " + request.args.to_dict()["uuid"])
    args = request.args.to_dict()
    uuid = args["uuid"]
    labelid = args["labelid"]
    labelname = args["labelname"]
    server = args["server"]
    if not validateServer(server):
        return Responses.customError("Invalid server.")
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    labelid = int(labelid) # throws error if id is not int
    r = requests.get(server + "api/v2/labels/" + str(labelid), auth=(user, password), params={"adminDeviceSpaceId": spaceID}).json()["results"]
    if r["name"] != labelname:
        # app.logger.warning("Error (Label id does not match label name!) attempting to remove label by " + user + " : " + labelname + " on " + uuid)
        return Responses.customError("Label id does not match label name!")

    r = requests.get(server + "api/v2/devices", auth=(user, password),params={"adminDeviceSpaceId" : spaceID, "fields": "common.uuid" ,"query" : 'common.uuid="' + uuid + '"'}).json()["results"]
    if len(r) == 0:
        # app.logger.warning("Error (The uuid is not in the records) attempting to remove label by " + user + " : " + labelname + " on " + uuid)
        return Responses.customError("The uuid is not in the records.")

    # appying label here
    r = requests.put(server+"api/v2/devices/labels/" + labelname + "/add", auth=(user, password), params={"adminDeviceSpaceId" : spaceID}, json={"deviceUuids" : [uuid]}, headers={"Content-Type" : "application/json"}).json()
    if not r["successful"]:
        # app.logger.warning("Error (Error in adding this label on this uuid.) attempting to remove label by " + user + " : " + labelname + " on " + uuid)
        return Responses.customError("Error in adding this label on this uuid.", [labelname, uuid])

    # app.logger.info("Successfully added label by " + user + " : " + labelname + " on " + uuid)
    return Responses.ok(r)


# closes connection automatically, get the connection using createCursor() method
@app.teardown_appcontext
def teardown_conn(exception):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()

if __name__ == "__main__":
    app.run(port=5000, threaded=True)


