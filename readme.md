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
```

## Running Development Server
1. Run `npm run dev` inside both webpack folders within separate terminals  
2. Run `server.py`  
3. Request Page hosted on port 5175, eg. localhost:5175  
4. Admin Page hosted on port 5176, eg. localhost:5176  

## Building
**instruction applies to both webpack folders*  
Change mode in `webpack.config.js` to `production`  
Run `npm run build`  
Uncomment Styling for `main.css` in `public/index.html`  



## to do
- add invalid data response during crsvalidation with mi
