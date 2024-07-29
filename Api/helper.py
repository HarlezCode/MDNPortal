import re

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
    "time"
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


def checkQueryParams(data):
    for i in params:
        if not i in data.keys():
            return False
    for i in data.keys():
        if not i in params:
            return False
    return True

