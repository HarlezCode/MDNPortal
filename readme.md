## Installation & Setup
1. Run `npm i` inside both webpack folders  
2. Install **postgresql**  
3. Install python dependencies with `pip install -r requirements.txt`  
4. Create a database in postgresql named `request` with either through pgadmin or pgcli using `CREATE DATABASE request`  
5. Run `db.py` to setup database & `.env` file  

`.env` file template
```
dbUser=admin
dbPassword=admin
adminDeviceSpaceId=something
apiUsername=something
apiPassword=something
```

## Running Development Server
1. Run `npm run dev` inside both webpack folders within separate terminals  
2. Run `server.py`  
3. Request Page hosted on port 5175, eg. localhost:5175  
4. Admin Page hosted on port 5176, eg. localhost:5176  

## Building
**instruction applies to both webpack folders*  
1. Change mode in `webpack.config.js` to `production`  
2. Run `npm run build`  
3. Uncomment Styling for `main.css` in `public/index.html`  



## Todo
- add invalid data response during crsvalidation with mi
- add enroll device export into excel/csv, check time of request and latest enrollment time if there is two records
if so, warn the user that it will take the latest record. After export, clicking process will prompt the user to apply
labels to new device record if there is one that fits the restrictions. Adding new devices CANNOT be bulk.
- retire device api
- Look for last location
- Authentication
- App update -> update msg