/*
    Actions that require api calls
*/

import { FormEvent } from "react";

type ResType = {[key : string] : string};


/*
    Authenticates the user through username and password
    :param username: username
    :param password: password
    :returns: jwt token 
*/
export async function authAction(username : string, password : string) : Promise<string>{
    return new Promise( (res) => {
        res(username+password)}); // needs to be replaced by an api call to the server to get jwt session token
}

/*
    Set custom attributes on a list of uuids given a server
    :param uuid:  a list of uuids
    :param attr: object with key value pairing of attr id and value
    :param server: server string
    :returns: custom response object
*/
export async function setCustomAttributes(uuids : string[], attr : {[i : string] : string}, server : string){
    const res = await fetch("http://localhost:5000/api/mi/setcustomattr/", {
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json',
            "From": localStorage.getItem("Token") + "_User"
        },
        body: JSON.stringify({
            "uuids" : uuids,
            "attr" : attr,
            "server" : server

        })
    }).then((res) => {return res.json()}).catch(
        () =>{
            return new Promise((res)=>res({"res" : "error", "error" : "Server not responding!"}));
        }
    );
    
    return res;
}

/*
    Add new webclips to the server
    :param e: form event
    :returns: boolean value whether successful or not
*/
export async function addWebclips(e : FormEvent<HTMLFormElement>){
    let dtype = (e.currentTarget.CORP.checked ? "CORP" : "") +  "," + (e.currentTarget.OUD.checked ? "OUD," : "") + (e.currentTarget.COPE.checked ? "COPE" : "")
    if (dtype.charAt(0) == ","){
        dtype = dtype.slice(1);
    }
    if (dtype.charAt(dtype.length-1) == ","){
        dtype = dtype.slice(0,dtype.length-1);
    }
    if (dtype.length == 0){
        alert("Please select at least 1 device type.")
        return false;
    }

    // trim values
    const labels = e.currentTarget.labels.value.split(",");
    for (let i=0; i< labels.length; i++){
        labels[i] = labels[i].trim();
    }
    const labelids = e.currentTarget.labelids.value.split(",");
    for (let i=0; i < labelids.length; i++){
        labelids[i] = labelids[i].trim();
    }

    const cleanLabels = labels.join(",");
    const cleanLabelids = labelids.join(",");



    const res = await fetch("http://localhost:5000/api/addwebclips/", {
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json',
            "From": localStorage.getItem("Token") + "_User"
        },
        body: JSON.stringify({
            "models" : e.currentTarget.model.value,
            "dtypes": dtype,
            "pt": e.currentTarget.platform.value,
            "labels": cleanLabels,
            "oses": e.currentTarget.os.value,
            "webclip": e.currentTarget.webclip.value,
            "server": e.currentTarget.server.value,
            "labelids": cleanLabelids

        })
    }).then((res : Response) =>{
        return res.json()
    }).catch((error : any)=>{console.log(error); alert("Server not responding."); return false;});

    if (res.status == "error"){
        alert(JSON.stringify(res["error"]));
        return false;
    }

    return true;
}

/*
    Updates the webclip on the postgresql database, have three modes,
    delete - delete the webclip
    active - switch from inactive to active
    inactive - switch from active to inactive
    :param item: webclip table entry
    :returns: custom response object

*/
export async function updateWebclip(item : ResType, update : string){
    let mode : string = "";
    if (update == "delete"){
        mode = "delete";
    } else if (update == "active"){
        mode = "active"
    } else if (update == "inactive"){
        mode = "inactive"
    } else {
        console.log("?");
        return {res : "error"};
    }
    
    const res = await fetch("http://localhost:5000/api/updatewebclip/", {
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json',
            "From": localStorage.getItem("Token") + "_User"
        },
        body: JSON.stringify({
            "data" : item,
            "to" : mode
        })
    }).then((res : Response) =>{
        return res.json()
    }).catch((error : any)=>{console.log(error); return new Promise(res=>res({res : "error"}))});;

    if (!res){
        return {res : "error"};
    }

    return res;
}
/*
    Rejects the request
    :param data: request table entry
    :returns: custom response object
*/
export async function rejectRequest(data : ResType[]){
    const res = await fetch("http://localhost:5000/api/rejectrequest/", {
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            "From": localStorage.getItem("Token") + "_User", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({"data": data})
    }).then((res : Response) => {return res.json()}).catch(()=>{
        alert("Server Not Responding!");
    });
    if (res["status"] == 'error'){
        alert("ERROR! " + res["error"]);
    }
    return res;
}
/*
    Fetch webclips based on activity
    :param active: string either "active" or "inactive"
    :returns: a list of webclips entries
*/
export async function fetchWebclips(active : string){
    const res = await fetch("http://localhost:5000/api/fetchwebclips/" + "?active="+active, {
        method: "GET",
        headers: {
            "Key" : localStorage.getItem("Token") ?? ""
        }
    }).then((res : Response) =>{
        return res.json()
    }).catch((error : any)=>{console.log(error); return new Promise(res=>res([]))});
    
    // might need error checking here so if !res then return an error msg
    if (!res){
        return [];
    }
    return res;
}
/*
    Logouts the user
*/
export async function logout() : Promise<boolean>{
    localStorage.removeItem("Token");
    return new Promise( (res) => { // need to remove jwt here
        res(true)});
}

// returns true if date1 later than date2
function compareDates(d1 : string, d2 : string){
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    console.log(date1, date2);
    return date1 > date2;
}

async function validateAddRequest(data : ResType){
    let res = await fetch("http://localhost:5000/api/mi/fetchdevice/?sn=" + data["serial"], {
        headers: {
            "Key": localStorage.getItem("Token") ?? ""
        },
        method: "GET"}
    ).then((res : Response) =>{
        return res.json()
    }).catch((err) =>{
        console.log(err);
        alert("Server not responding.");
        return [false, data["id"], data["serial"]];
    });
    res = res["data"];
    if (res.length == 0){
        return [false, data["id"], data["serial"]];
    }
    let latestEntry : {[index : string] : string} = res[0];
    let latestdate = latestEntry["common.creation_date"];
    if (res.length > 1){
        for (let i = 0; i<res.length;i++){
            if (compareDates(res[i]["common.creation_date"], latestdate)){
                latestEntry = res[i];
                latestdate = res[i]["common.creation_date"];
            }
        }
    }
    let reqDateString = (data["date"].split("/").reverse().join("-")) + "T" + data["time"];
    console.log(reqDateString);
    if (compareDates(reqDateString, latestdate)){
        return [false, data["id"], data["serial"]]
    }
    return [true, data["id"], data["serial"]]
}

export async function processRequests(data : ResType[], force : boolean = false){
    // validate that add new device is actually complete
    console.log(data);
    const addRequests = [] as ResType[];
    let tempData = JSON.parse(JSON.stringify(data));
    const erroredData = [] as string[];

    for (let i = 0; i < tempData.length;i++){
        if (tempData[i]["requestType"] == "Add new device record"){
            addRequests.push(tempData[i]);
        }
    }
    if (addRequests.length > 0 && !force){
        const Promises = addRequests.map(
            async (val : ResType) =>{
                return validateAddRequest(val);
            }
        )
        const responses = await Promise.all(Promises);
        const filter = [] as string[];
        responses.forEach(
            (val : (string | boolean)[]) =>{
                if (!val[0]){
                    filter.push(val[1] as string);
                    erroredData.push(val[2] as string);
                }
            }
        )
        tempData = tempData.filter((val : ResType) => {
            if (val["requestType"] != "Add new device record"){
                return true;
            } else if (filter.includes(val["id"])){
                return false;
            }
            return true
        })
    }

    let val : {[index : string] : any} = {};
    await fetch("http://localhost:5000/api/processrequests/", {
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            "From": localStorage.getItem("Token") + "_User", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(tempData)
    }).then(async (res : any) =>{
        await res.json().then((res : any) =>{
            val = res;
        }
        );
        
    }).catch(()=>{
        val["res"] = "error";
        val["error"] = "Server not responding.";
    });

    if (erroredData.length > 0 && val['res'] != "error"){
        alert("Adding devices with these serial numbers are not valid, turn on force if you want to mark as complete");
        val["res"] = "error";
        val["error"] = "Some of the results were not processed. Including SN(s): " + erroredData.join(", "); 
    } else if (erroredData.length > 0 && val['res'] == "error"){
        alert("Adding devices with these serial numbers are not valid, turn on force if you want to mark as complete");
        val["error"] += "\n Some of the results were not processed. Including SN(s): " + erroredData.join(", "); 
    }
    return val;
}



export async function fetchFromServerRaw({rtype='',sn='',stat='Pending',uid='', date='',dtype='', ctype='',from='',mac='',app='',wc='' ,tm='',processed=''}) : Promise<ResType[]>{
    let queryParams = "?";
    queryParams += "requestType="+ rtype+"&";
    queryParams += "serial=" + sn + "&";
    queryParams += "cluster=" + "&";
    queryParams += "status=" + stat + "&";
    queryParams += "uuid=" + uid +"&";
    queryParams += "date=" + date+"&";
    queryParams += "device=" +dtype+ "&";
    queryParams += "change=" +ctype + "&";
    queryParams += "from=" +from  + "&";
    queryParams += "mac=" + mac + "&";
    queryParams += "app=" + app  + "&";
    queryParams += "webclip=" + wc + "&";
    queryParams += "time=" + tm + "&";
    queryParams += "processed=" + processed; 

    const res = await fetch("http://localhost:5000/api/requests/" + queryParams, {
        method : "GET",
        headers : {
            "key" : localStorage.getItem("Token") ?? ""
        }
    }).then((res : Response) =>{
        return res.json().then((res : any) =>{
            console.log(res);
            return new Promise((resolve : any) =>{
                resolve(res.data ?? [] as ResType[]);
            })
        })
    }).catch((error : any)=>{console.log(error); return new Promise((res)=>res([] as ResType[]))});

    if (!res){
        return [] as ResType[];
    }
    return res as ResType[];
}


export async function fetchFromServer(e : FormEvent<HTMLFormElement>){
    let queryParams = "?";
    queryParams += "requestType=" + e.currentTarget.requestfilter.value + "&";
    queryParams += "serial=" + e.currentTarget.snfilter.value + "&";
    queryParams += "cluster=" + e.currentTarget.clusterfilter.value + "&";
    queryParams += "status=" + e.currentTarget.statusfilter.value + "&";
    queryParams += "uuid=" + e.currentTarget.uuidfilter.value + "&";
    queryParams += "date=" + e.currentTarget.datefilter.value + "&";
    queryParams += "device=" + e.currentTarget.devicefilter.value + "&";
    queryParams += "change=" + e.currentTarget.changefilter.value + "&";
    queryParams += "from=" + e.currentTarget.fromfilter.value + "&";
    queryParams += "mac=" + e.currentTarget.macfilter.value + "&";
    queryParams += "app=" + e.currentTarget.appfilter.value + "&";
    queryParams += "webclip=" + e.currentTarget.webclipfilter.value + "&";
    queryParams += "time=" + e.currentTarget.timefilter.value + "&";
    queryParams += "processed=" + e.currentTarget.processfilter.value;

    const res = await fetch("http://localhost:5000/api/requests/" + queryParams, {
        method : "GET",
        headers : {
            "key" : localStorage.getItem("Token") ?? "" // temp val
        }
    }).then((res : Response) =>{
        return res.json().then((res : any) =>{
            return new Promise((resolve : any) =>{
                resolve(res.data ?? []);
            })
        })
    }).catch((error : any)=>{console.log(error); return new Promise((res)=>res([] as ResType[]))});
    if (!res){
        return [] as ResType[];
    }
    return res as ResType[];
}

export async function setBulkLabels(server : string, uuids : string[], labels : {[index : string] : string}){
    const res : {[ind : string] : any} = await fetch("http://localhost:5000/api/mi/addlabels/",{
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            "From": localStorage.getItem("Token") + "_User", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(
            {
                "server" : server,
                "uuids" : uuids,
                "labels" : labels
            }
        )
    }
    ).then(
        (res) =>res.json()
    ).catch(() =>{
        return new Promise<{[ind : string] : string | string[]}>((res)=>res(
            {
                "res" : "error",
                "error" : "Server not responding!",
                "data" : []
            }  
        ))}
    )
    return res;
}