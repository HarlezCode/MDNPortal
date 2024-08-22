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
    item['labels'] = fetched[3]
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
        self.domain = 'https://emmdev2.ha.org.hk/' # your main/newest server eg. put mdm-1 here
        self.fallback = [] # add your older servers here, eg. put mdm here
        self.fetchDeviceFields = [
            'common.uuid',
            'common.model',
            'common.platform',
            'common.os_version',
            'common.creation_date',
            'common.status'
        ]
        self.typechangeremove = {
            self.domain : {
                "12": "11. WiFi BCK - CORP COPE",
                "13": "2. Filter - CORP",
                "10": "11. Public Apps VPP",
                "3": "1. Filter - Assigned",
                "16": "2. Profile - CORP 2018 (A1)",
                "202": "11. Fonts - 2024",
                "14": "2. Global Proxy - CORP",
                "18": "2. WiFi 256 - CORP",
                "65": "66. Web Clip - VIS portal",
                "4": "1. Registration Completed",
                "19": "3. Filter - COPE",
                "20": "3. Global Proxy - COPE",
                "21": "3. Profile - COPE 2018 (A2)",
                "23": "3. WiFi 256 - COPE",
                "84": "66. Web Clip - DPMS",
                "25": "4. Filter - OUD",
                "28": "4. WiFi BCK - OUD",
                "27": "4. WiFi 256 - OUD",
                "26": "4. Profile - OUD 2018",
                "24": "4. App - MI App VPP"
            },
            'mdm': {
                "55": "11. WiFi BCK - CORP COPE",
                "59": "2. Filter - CORP",
                "66": "11. Public Apps VPP",
                "76": "1. Filter - Assigned",
                "109": "2. Profile - CORP 2018 (A1)",
                "368": "11. Fonts - 2024",
                "63": "2. Global Proxy - CORP",
                "105": "2. WiFi 256 - CORP",
                "230": "66. Web Clip - VIS portal",
                "323": "1. Registration Completed",
                "60": "3. Filter - COPE",
                "64": "3. Global Proxy - COPE",
                "110": "3. Profile - COPE 2018 (A2)",
                "106": "3. WiFi 256 - COPE",
                "255": "66. Web Clip - DPMS",
                "39": "4. Filter - OUD",
                "56": "4. WiFi BCK - OUD",
                "104": "4. WiFi 256 - OUD",
                "111": "4. Profile - OUD 2018",
                "181": "4. App - MI App VPP",
            }
        }

        self.typelabels = {
            self.domain : { # mdm-1 labels
                "default" : {
                    'add' : {
                        "12": "11. WiFi BCK - CORP COPE",
                        "13": "2. Filter - CORP",
                        "10": "11. Public Apps VPP",
                        "3": "1. Filter - Assigned",
                        "16": "2. Profile - CORP 2018 (A1)",
                        "202": "11. Fonts - 2024"
                    },
                    'remove' : {}
                },
                "CORP" : {
                    "add" : {
                        "14": "2. Global Proxy - CORP",
                        "18": "2. WiFi 256 - CORP",
                        "65": "66. Web Clip - VIS portal",
                        "4": "1. Registration Completed"
                    },
                    "remove" : {}
                },
                "COPE" : {
                    "add" : {
                        "19": "3. Filter - COPE",
                        "20": "3. Global Proxy - COPE",
                        "21": "3. Profile - COPE 2018 (A2)",
                        "23": "3. WiFi 256 - COPE",
                        "84": "66. Web Clip - DPMS",
                        "4": "1. Registration Completed"
                    },
                    "remove" : {
                        "13": "2. Filter - CORP",
                        "16": "2. Profile - CORP 2018 (A1)"
                    }
                },
                "OUD" : {
                    "add" : {
                        "25": "4. Filter - OUD",
                        "28": "4. WiFi BCK - OUD",
                        "27": "4. WiFi 256 - OUD",
                        "26": "4. Profile - OUD 2018",
                        "24": "4. App - MI App VPP",
                        "4": "1. Registration Completed"
                    },
                    "remove" : {
                        "12": "11. WiFi BCK - CORP COPE",
                        "13": "2. Filter - CORP",
                        "10": "11. Public Apps VPP",
                        "16": "2. Profile - CORP 2018 (A1)",
                        "202": "11. Fonts - 2024"
                    }
                }
            },
            # change mdm to your fallback server eg. self.fallback[0] : {...}
            "mdm" : {
                "default" : {
                    "add" : {
                        "55": "11. WiFi BCK - CORP COPE",
                        "59": "2. Filter - CORP",
                        "66": "11. Public Apps VPP",
                        "76": "1. Filter - Assigned",
                        "109": "2. Profile - CORP 2018 (A1)",
                        "368": "11. Fonts - 2024"
                    },
                    'remove' : {

                    }
                },
                "CORP" : {
                    "add" : {
                        "63": "2. Global Proxy - CORP",
                        "105": "2. WiFi 256 - CORP",
                        "230": "66. Web Clip - VIS portal",
                        "323": "1. Registration Completed"
                    },
                    "remove" : {}
                },
                "COPE" : {
                    "add" : {
                        "60": "3. Filter - COPE",
                        "64": "3. Global Proxy - COPE",
                        "110": "3. Profile - COPE 2018 (A2)",
                        "106": "3. WiFi 256 - COPE",
                        "255": "66. Web Clip - DPMS",
                        "323": "1. Registration Completed"
                    },
                    "remove" : {
                        "59": "2. Filter - CORP",
                        "109": "2. Profile - CORP 2018 (A1)"
                    }
                },
                "OUD" : {
                    "add" : {
                        "39": "4. Filter - OUD",
                        "56": "4. WiFi BCK - OUD",
                        "104": "4. WiFi 256 - OUD",
                        "111": "4. Profile - OUD 2018",
                        "181": "4. App - MI App VPP",
                        "323": "1. Registration Completed"
                    },
                    "remove" : {
                        "55": "11. WiFi BCK - CORP COPE",
                        "59": "2. Filter - CORP",
                        "66": "11. Public Apps VPP",
                        "109": "2. Profile - CORP 2018 (A1)",
                        "368": "11. Fonts - 2024"
                    }
                }
            }
        }

        self.vpnlabels = {
            self.domain : {
                "addprofile" : {
                    "default" : {
                        "add" : {
                            "38": "66. Filter - 4G VPN",
                            "59": "66. VPN - 4G VPN",
                            "60": "66. VPN - 4G VPN Safari"
                        },
                        "remove": {

                        }
                    },
                    "CORP" : {
                        'add' : {},
                        'remove' : {"14": "2. Global Proxy - CORP"}
                    },
                    "COPE" : {
                        'add' : {},
                        'remove' : {"20": "3. Global Proxy - COPE"}
                    },
                    "OUD" : {
                        'add' : {},
                        'remove' : {}
                    }

                },
                "removeprofile" : {
                    "default" : {
                        'add' : {},
                        'remove' : {
                            "38": "66. Filter - 4G VPN",
                            "59": "66. VPN - 4G VPN",
                            "60": "66. VPN - 4G VPN Safari"
                        }
                    },
                    "CORP" : {
                        "add" : {"14": "2. Global Proxy - CORP"},
                        "remove" : {}
                    },
                    "COPE" : {
                        'add' : {"20": "3. Global Proxy - COPE"},
                        'remove' : {}
                    },
                    "OUD": {
                        'add': {},
                        'remove': {}
                    }
                },
            },
            "mdm" : {
                "addprofile": {
                    "default": {
                        "add": {
                            "128": "66. Filter - 4G POC",
                            "129": "66. VPN - 4G POC",
                            "222": "66. VPN - 4G POC Safari"
                        },
                        "remove": {

                        }
                    },
                    "CORP": {
                        'add': {},
                        'remove': {"63": "2. Global Proxy - CORP"}
                    },
                    "COPE": {
                        'add': {},
                        'remove': {"64": "3. Global Proxy - COPE"}
                    }

                },
                "removeprofile": {
                    "default": {
                        'add': {},
                        'remove': {
                            "128": "66. Filter - 4G POC",
                            "129": "66. VPN - 4G POC",
                            "222": "66. VPN - 4G POC Safari"
                        }

                    },
                    "CORP": {
                        "add": {"63": "2. Global Proxy - CORP"},
                        "remove": {}
                    },
                    "COPE": {
                        'add': {"64": "3. Global Proxy - COPE"},
                        'remove': {}
                    }
                }
            }
        }
    def getSearchFields(self):
        return ",".join(self.fetchDeviceFields)
    '''
    ls : a dict of labels in the format of
    {
        'default' : {
            'add' :{
                id : label
                ...
            },
            'remove' : {...}
        },    
        'CORP' : {
            'add' : {},
            'remove' : {}    
        },
            ...
    },
    * must have 'default' 'corp' 'cope' keys and within must have 'add' 'remove' keys even if it is empty
    * priorities remove labels
    returns 2 dicts, a dict for labels to add and a dict for labels to remove
    eg. [{id:l1, id1:l2,...},{...}] : [adddict, removedict]
    '''
    def getlabels(self, ls, type):
        if type != 'CORP' and type != 'COPE' and type != 'OUD':
            return []
        addls = set()
        removels = set()
        [addls.add((i,ls['default']['add'][i])) for i in ls['default']['add']]
        [addls.add((i, ls[type]['add'][i])) for i in ls[type]['add']]
        [removels.add((i, ls['default']['remove'][i])) for i in ls['default']['remove']]
        [removels.add((i, ls[type]['remove'][i])) for i in ls[type]['remove']]

        filteredls = []
        removels = list(removels)
        for i in addls:
            if not i in removels:
                filteredls.append(i)
        # convert to dict
        a, b = dict(), dict()
        for i in filteredls:
            a[i[0]] = i[1]
        for i in removels:
            b[i[0]] = i[1]

        return [a,b]
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
    # a = [["a","b","c"],[],["1","2","3"],[],['q','w','e']]
    # b = [[],[]]
    # print(combinations(a))
    # print(combinations(b))
    settings = apiSettings()
    # print(settings.getlabels({'default': {'add': {'38': '66. Filter - 4G VPN', '59': '66. VPN - 4G VPN', '60': '66. VPN - 4G VPN Safari'}, 'remove': {}}, 'CORP': {'add': {}, 'remove': {'14': '2. Global Proxy - CORP'}}, 'COPE': {'add': {}, 'remove': {'20': '3. Global Proxy - COPE'}}},'CORP'))
    print(str(settings.getlabels(settings.typelabels[settings.domain],"COPE")))