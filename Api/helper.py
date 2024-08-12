from flask import jsonify, g
import psycopg2
from keys import user, password
params = [
    "requestType",
    "serial",
    "cluster",
    "status",
    "uuid",
    "date",
    "device",
    "change",
    "from",
    "mac",
    "app",
    "webclip",
    "time",
    "processed"
]
paramsProcess = [
    "requestType",
    "serial",
    "cluster",
    "status",
    "uuid",
    "date",
    "device",
    "change",
    "from",
    "mac",
    "app",
    "webclip",
    "time",
    "id",
    "processed"
]
requests = [
    "Add 4G VPN Profile",
     "Add new device record",
     "Add Trial Certificate",
     "Add Webclip",
    "App Update",
    "Change of Device Type",
    "Look for last location",
    "Remove 4G VPN profile",
    "Remove Trial Certificate",
    "Retire device"
]


def checkRequestType(req):
    if not req in requests:
        return False
    return True
def checkProcessParams(data):
    for i in params:
        if not i in data.keys():
            return False
    if not "id" in data.keys():
        return False
    return True

def checkQueryParams(data):
    for i in params:
        if not i in data.keys():
            return False
    for i in data.keys():
        if not i in params:
            return False
    return True

async def validateKey(key):
    if "Admin" not in key:
        return False
    return True
async def validateClientKey(key):
    if "Admin" not in key:
        return False
    return True
def createCursor():
    g.conn = psycopg2.connect(
        database="request", user=user, password=password, host="127.0.0.1", port="5432"
    )
    g.conn.autocommit = True
    g.cursor = g.conn.cursor()
    return (g.cursor, g.conn)
def webclipToDict(fetched):
    item = dict()
    item['model'] = fetched[0]
    item['dtype'] = fetched[1]
    item['platform'] = fetched[2]
    item['clstr'] = fetched[3]
    item['os'] = fetched[4]
    item['webclip'] = fetched[5]
    item['id'] = fetched[6]
    item['active'] = fetched[7]
    return item
def combinations(ls):
    ans = []
    if len(ls) == 1:
        for i in ls[0]:
            ans.append([i])
        return ans
    comb = combinations(ls[1:])

    if len(comb) == 0:
        for i in ls[0]:
            ans.append([i])
        return ans
    elif len(ls[0]) == 0:
        return comb
    for i in ls[0]:
        for v in comb:
            ans.append([i] + v)
    return ans




class responses:
    def __init__(self):
        self.defaultError = jsonify({
            "res" : "error",
            "data": [],
            "error": "Something went wrong"
        })
        self.keyError = jsonify({
            "res" : "error",
            "data": [],
            "error": "Invalid key"
        })
    def customError(self, msg, data=[]):
        return jsonify({
            "res" : "error",
            "data": data,
            "error": msg
        })
    def ok(self, data=[]):
        return jsonify({
            "res": "ok",
            "data": data,
            "error": ""
        })

if __name__ == "__main__":
    a = [["a","b","c"],[],["1","2","3"],[],['q','w','e']]
    b = [[],[]]
    print(combinations(a))
    # print(combinations(b))