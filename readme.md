## Installation & Setup
Run `npm i` inside both webpack folders  
Install **postgresql**  
Install python dependencies with `pip install -r requirements.txt`  
Create a database in postgresql named `request` with either through pgadmin or pgcli using `CREATE DATABASE request`  
Set db key, password & admin space key in .env  
Run `db.py`

## Running Development Server
Run `npm run dev` inside both webpack folders within separate terminals  
Run `server.py`  
Request Page hosted on port 5175, eg. localhost:5175  
Admin Page hosted on port 5176, eg. localhost:5176  

## Building
**instruction applies to both webpack folders*  
Change mode in `webpack.config.js` to `production`  
Run `npm run build`  
Uncomment Styling for `main.css` in `public/index.html`  



## to do
- add invalid data response during crsvalidation with mi
