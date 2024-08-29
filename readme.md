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

## Libraries used
*Python*
psycopg2
flask CORS
flask[async] (flask dependencies: Werkzeug, asgiref)
requests 
*Javascript*
bootstrap (approved)
exceljs (approved)
react (approved)
react-dom (approved)
react-router-dom (approved)
@babel/core (approved)
@babel/plugin-transform-runtime (approved)
@babel/preset-env (approved)
@babel/preset-react (approved)
@babel/runtime (approved)
@types/bootstrap (approved)
@types/react (approved)
@types/react-dom (approved)
babel-loader (approved)
typescript (approved)
webpack (approved)
*Dev Tools*
css-loader (no need to include after build)
mini-css-extract-plugin (no need to include after build)
webpack-cli (no need to include after build)
webpack-dev-server (no need to include after build)
*Not approved yet*
@babel/preset-typescript
style-loader
## Todo
- mailing system details (need for an interface?)
- retire device api
- Authentication
- update msg api testing
- mailing api
- process requests, most requests are not tested, eg. add 4g vpn profile
- MI tools
- second api username and password for two servers, for this add 2 more kv pairs to .env file
- More complex server logging
- Batch request sending from the client request portal
- Thread limiting on the server api