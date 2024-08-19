from flask import jsonify, g
import psycopg2
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
def loadEnv():
    env = dict()
    with open(".env", "r") as file:
        lines = file.readlines()
        for line in lines:
            kv = line.split('=')
            if len(kv) == 2:
                env[kv[0]] = kv[1].strip()
        file.close()
    return env
def createCursor():
    env = loadEnv()

    g.conn = psycopg2.connect(
        database="request", user=env["dbUser"], password=env["dbPassword"], host="127.0.0.1", port="5432"
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

class apiSettings:
    def __init__(self):
        self.domain = 'https://emmdev2.ha.org.hk/' # your main server eg. emmdev1
        self.fallback = [] # add your older servers here, eg. emmdev
        self.fetchDeviceFields = [
            'common.uuid',
            'common.model',
            'common.platform',
            'common.os_version',
            'common.creation_date',
            'common.status'
        ]

        '''
        If you have a backup server say mdm, you have to add another type here eg.
        {
             self.domain : {
                "default" : {},
                "CORP" : {
                    'add' : {},
                    'remove' : {}
                },
                ...
            },
            self.fallback[0] : {
                "default" :{},
                "CORP" : {
                    'add' : {},
                    'remove' : {}
                },
                ...    
        
            }
        }
        '''
        self.typelabels = {
            self.domain : {
                "default" : {
                    "12" : "11. WiFi BCK - CORP COPE",
                    "13" : "2. Filter - CORP",
                    "10" : "11. Public Apps VPP",
                    "3" : "1. Filter - Assigned",
                    "16" : "2. Profile - CORP 2018 (A1)",
                    "202"  : "11. Fonts - 2024"
                },
                "CORP" : {
                    "add" : {
                        "14" : "2. Global Proxy - CORP",
                        "18" : "2. WiFi 256 - CORP",
                        "65" : "66. Web Clip - VIS portal",
                        "4" : "1. Registration Completed"
                    },
                    "remove" : {

                    }
                },
                "COPE" : {
                    "add" : {
                        "19" : "3. Filter - COPE",
                        "20" : "3. Global Proxy - COPE",
                        "21" : "3. Profile - COPE 2018 (A2)",
                        "23" : "3. WiFi 256 - COPE",
                        "84" : "66. Web Clip - DPMS",
                        "4" : "1. Registration Completed"
                    },
                    "remove" : {
                        "13" : "2. Filter - CORP",
                        "16" : "2. Profile - CORP 2018 (A1)"
                    }
                },
                "OUD" : {
                    "add" : {
                        "25" : "4. Filter - OUD",
                        "28" : "4. WiFi BCK - OUD",
                        "27" : "4. WiFi 256 - OUD",
                        "26" : "4. Profile - OUD 2018",
                        "24" : "4. App - MI App VPP",
                        "4" : "1. Registration Completed"
                    },
                    "remove" : {
                        "12": "11. WiFi BCK - CORP COPE",
                        "13": "2. Filter - CORP",
                        "10": "11. Public Apps VPP",
                        "16": "2. Profile - CORP 2018 (A1)",
                        "202": "11. Fonts - 2024"
                    }
                }
            }
        }
    def getSearchFields(self):
        return ",".join(self.fetchDeviceFields)
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
def validateServer(url):
    settings = apiSettings()
    if url == settings.domain:
        return True
    for i in settings.fallback:
        if i == url:
            return True
    return False
if __name__ == "__main__":
    a = [["a","b","c"],[],["1","2","3"],[],['q','w','e']]
    b = [[],[]]
    print(combinations(a))
    # print(combinations(b))