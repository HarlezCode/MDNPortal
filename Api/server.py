from flask import Flask, jsonify, request
from flask_cors import CORS
import db

app = Flask("Admin Api")
# enable cross origin
CORS(app)
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



@app.route('/api/addrequest', methods=["POST"])
async def addrequest():
    data = request.json
    #validate user here assume to be api call
    if not "yo" in data["userkey"]:
        return jsonify("key invalid")

    #assert request data before putting into database
    if not data["type"] in requests:
        return jsonify("invalid request type")
    requestBody = data["requests"]
    print(requestBody)

    #query db

    return jsonify()
if __name__ == "__main__":
    db.initializeDB()
    app.run(port=5000)

