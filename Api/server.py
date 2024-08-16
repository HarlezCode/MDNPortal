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
            app.logger.error("Error: "+repr(e))
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

    cursor, conn = createCursor()
    cursor.execute(
        '''
        SELECT * FROM entries WHERE
        id=%s
        '''
    , (data["id"],))
    fetched = cursor.fetchone()
    if fetched == None:
        return Responses.customError("Request does not exist on db.")
    fetched = list(fetched)
    fetched.pop(13) # pop id from result

    with updateReqMutex:
        for ind, key in enumerate(params):
            if data[key] != fetched[ind]:
                return Responses.customError("Request does not match db entry.")
        cursor.execute('''
        UPDATE entries 
        SET 
        status='Rejected',
        processed=%s
        WHERE id=%s
        ''', (user,data['id']))
    return Responses.ok()


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
                conn.close()
                return Responses.customError("Error: Entry does not exist in database!", [i])
            if entry[3] == "Completed":
                repeatedCounts.append(entry)
            else:
                for ind, key in enumerate(paramsProcess):
                    if i[key] != entry[ind]:
                        conn.close()
                        return Responses.customError("Error: Entry mismatch with database records!", [i])
                pending.append(i)
        # based on different request do api calls here


        # finish request by setting pending -> complete
        for i in pending:
            cursor.execute('''
                            UPDATE entries
                            SET
                                status=%(status)s,
                                processed=%(processed)s
                            WHERE 
                                id=%(id)s
                        ''', {"id": i["id"], "status": "Completed", "processed" : user})

    return Responses.ok(repeatedCounts)



@app.route('/api/addrequests/', methods=["POST"], endpoint='addrequests')
@defaultErrorHandler
async def addrequests():
    Responses = responses()
    data = request.json
    print(data)
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
            if req == "Add 4G VPN Profile" or req == "Remove 4G VPN profile" or req == "Remove Trial Certificate" or req == "Add Trial Certificate" or req == "Retire device": # type | uuid
                if len(data[i]) < 2:
                    skippedEntries.append(i)
                    continue
                entry["device"] = data[i][0]
                entry["uuid"] = data[i][1]
            elif req == "Add new device record": # type | clusterid
                if len(data[i]) < 2:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["cluster"] = data[i][1]
            elif req == "Add Webclip": # type | webclip | uuid
                if len(data[i]) < 3 or not "wcp_" in data[i][1]:
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

            elif req == "App Update": # type | app | uuid
                if len(data[i]) < 3 or not "app_" in data[i][1]:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["app"] = data[i][1][4:]
                entry["uuid"] = data[i][2]
            elif req == "Change of Device Type": # type | change to | uuid
                if len(data[i]) < 3:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["change"] = data[i][1]
                entry["uuid"] = data[i][2]
            elif req == "Look for last location": # type | mac | uuid
                if len(data[i]) < 3:
                    skippedEntries.append(data[i])
                    continue
                entry["device"] = data[i][0]
                entry["mac"] = data[i][1]
                entry["uuid"] = data[i][2]
            entries.append(entry)


    for i in entries:
        cursor.execute(
            '''
            INSERT INTO entries(rtype, sn, clusterid, status, uid, cdate, dtype, totype, fuser, mac, app,webclip,timecreated,processed)
            Values(%(requestType)s,%(serial)s,%(cluster)s,%(status)s,%(uuid)s,%(date)s,%(device)s,%(change)s,%(from)s,%(mac)s,%(app)s,%(webclip)s,%(time)s,'')
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
        items[-1]["id"] = i[len(i)-2]
        items[-1]["processed"] = i[-1]
    print(items)
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

    cursor, conn = createCursor()
    cursor.execute('''
    SELECT * FROM webclips
    WHERE id=%(id)s
    ''', {"id": key})
    fetched = cursor.fetchone()
    if fetched == None:
        return Responses.customError("Entry id does not exist on database!")
    item = webclipToDict(fetched)
    for i in item.keys():
        if data["data"][i] != item[i]:
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
    return Responses.ok()

@app.route('/api/addwebclips/', methods=["POST"])
@defaultErrorHandler
async def addWebclips():
    Responses = responses()
    valid = await validateKey(request.headers["Key"])
    if not valid:
        return Responses.keyError
    data = request.json
    models = data["models"].split(',')
    dtypes = data["dtypes"].split(',')
    platform = data["pt"].split(',')
    clusters = data['clstr'].split(',')
    oses = data['oses'].split(',')
    webclip = [data['webclip']]

    # validate data here
    if len(dtypes) > 3:
        return Responses.defaultError
    for i in dtypes:
        if i.upper() != "CORP" and i.upper() != "OUD" and i.upper() != "COPE":
            return Responses.defaultError
    if len(webclip) > 100:
        return Responses.defaultError
    # slap into db
    entries = combinations([models, dtypes,platform,clusters,oses,webclip])
    cursor, conn = createCursor()
    for i in entries:
        cursor.execute('''
        INSERT INTO  webclips(model, dtype, platform, clstr, os, webclip, active) VALUES(
            %s,%s,%s,%s,%s,%s,'active'
        )
        ''', tuple(i))
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
    if (data["model"] == '' or data["dtype"] == '' or data["platform"] == '' or not 'os' in data.keys()):
        return Responses.defaultError

    cursor, conn = createCursor()
    cursor.execute('''
            SELECT * FROM webclips 
            WHERE (active='active') AND
            (model ~* ANY(string_to_array(%(model)s, ' '))) AND
            (dtype=%(dtype)s) AND
            (%(platform)s LIKE platform OR platform='') AND
            (os=%(os)s OR %(os)s = '' OR os='') AND
            (clstr=%(clstr)s OR %(clstr)s='' OR clstr='')
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

    if len(uuid) == 0:
        return Responses.customError("Please enter a uuid.")

    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    r = requests.get(settings.domain+"api/v2/devices/appinventory",auth=(user,password), params={"adminDeviceSpaceId" : spaceID, 'deviceUuids' : uuid}).json()

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
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]

    r = requests.get(settings.domain + "api/v2/devices", auth=(user, password),
                     params={"adminDeviceSpaceId": spaceID, "fields": "common.uuid",
                             "query": 'common.uuid="' + uuid + '"'}).json()["results"]
    if len(r) == 0:
        return Responses.customError("The uuid is not in the records.")
    print(uuid)
    r = requests.get(settings.domain + "api/v2/devices/" + uuid + "/labels",auth=(user, password), params={"adminDeviceSpaceId": spaceID}).json()["results"]

    return Responses.ok(r)

@app.route('/api/mi/fetchdevice/', methods=["GET"], endpoint='fetchMi')
@defaultErrorHandler
async def fetchMi():
    print("recieved")
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

    return Responses.ok(filtered)

@app.route('/api/mi/removelabel/', methods=["GET"], endpoint='removeLabelMi')
async def removeLabelMi():
    settings = apiSettings()
    Responses = responses()
    valid = await validateKey(request.headers["Key"])
    if not valid:
        return Responses.keyError
    args = request.args.to_dict()
    uuid = args["uuid"]
    labelid = args["labelid"]
    labelname = args["labelname"]
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    labelid = int(labelid)  # throws error if id is not int
    r = requests.get(settings.domain + "api/v2/labels/" + str(labelid), auth=(user, password),
                     params={"adminDeviceSpaceId": spaceID}).json()["results"]
    if r["name"] != labelname:
        return Responses.customError("Label id does not match label name!")

    r = requests.get(settings.domain + "api/v2/devices", auth=(user, password),
                     params={"adminDeviceSpaceId": spaceID, "fields": "common.uuid",
                             "query": 'common.uuid="' + uuid + '"'}).json()["results"]
    if len(r) == 0:
        return Responses.customError("The uuid is not in the records.")

    r = requests.get(settings.domain + "api/v2/devices/" + uuid + "/labels", auth=(user, password),params={"adminDeviceSpaceId" : spaceID}).json()["results"]
    found = False
    for i in r:
        if i["name"] == labelname and i["id"] == str(labelid):
            found = True
            break
    if not found:
        return Responses.customError("The label does not exists on device with this uuid.", [labelname, uuid])

    # Removing label here
    # r = requests.put(settings.domain + "api/v2/devices/labels/" + labelname + "/remove", auth=(user, password),params={"adminDeviceSpaceId" : spaceID}, data={
    #     "deviceUuids" : [uuid]
    # }).json()
    # if (not r["successful"]):
    #     return Responses.customError("Failed to remove label for this uuid.", [labelname, uuid])
    #
    # return Responses.ok(r)

    return Responses.ok()

@app.route('/api/mi/addlabel/', methods=["GET"], endpoint='addLabelMi')
async def addLabelMi():
    settings = apiSettings()
    Responses = responses()
    valid = await validateKey(request.headers["Key"])
    if not valid:
        return Responses.keyError
    args = request.args.to_dict()
    uuid = args["uuid"]
    labelid = args["labelid"]
    labelname = args["labelname"]
    env = loadEnv()
    spaceID = env["adminDeviceSpaceId"]
    user = env["apiUsername"]
    password = env["apiPassword"]
    labelid = int(labelid) # throws error if id is not int
    r = requests.get(settings.domain + "api/v2/labels/" + str(labelid), auth=(user, password), params={"adminDeviceSpaceId": spaceID}).json()["results"]
    if r["name"] != labelname:
        return Responses.customError("Label id does not match label name!")

    r = requests.get(settings.domain + "api/v2/devices", auth=(user, password),params={"adminDeviceSpaceId" : spaceID, "fields": "common.uuid" ,"query" : 'common.uuid="' + uuid + '"'}).json()["results"]
    if len(r) == 0:
        return Responses.customError("The uuid is not in the records.")

    # appying label here
    # r = requests.put(settings.domain+"api/v2/devices/labels/" + labelname + "/add", auth=(user, password), params={"adminDeviceSpaceId" : spaceID}, data={"deviceUuids" : [uuid]}).json()
    # if not r["successful"]:
    #     return Responses.customError("Error in updating this label on this uuid.", [labelname, uuid])
    #
    # return Responses.ok(r)

    return Responses.ok()

# closes connection automatically, get the connection using createCursor() method
@app.teardown_appcontext
def teardown_conn(exception):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()

if __name__ == "__main__":
    app.run(port=5000, threaded=True)


