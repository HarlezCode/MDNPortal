import { FormEvent } from "react";

type ResType = {[key : string] : string};
export async function authAction(username : string, password : string) : Promise<string>{
    return new Promise( (res) => {
        res(username+password)});
}

export async function addWebclips(e : FormEvent<HTMLFormElement>){
    let dtype = (e.currentTarget.CORP.checked ? "CORP" : "") +  "," + (e.currentTarget.OUD.checked ? "OUD," : "") + (e.currentTarget.COPE.checked ? "COPE" : "")
    if (dtype.charAt(0) == ","){
        dtype = dtype.slice(1);
    }
    if (dtype.charAt(dtype.length-1) == ","){
        dtype = dtype.slice(0,dtype.length-1);
    }
    if (dtype.length == 0){
        alert("Please select atleast 1 device type.")
        return false;
    }

    const res = await fetch("http://localhost:5000/api/addwebclips/", {
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            "models" : e.currentTarget.model.value,
            "dtypes": dtype,
            "pt": e.currentTarget.platform.value,
            "clstr": e.currentTarget.cluster.value,
            "oses": e.currentTarget.os.value,
            "webclip": e.currentTarget.webclip.value 
        })
    }).then((res : Response) =>{
        return res.json()
    }).catch((error : any)=>console.log(error));

    if (res.status == "error"){
        alert(JSON.stringify(res["error"]));
    }

    return true;
}


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
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            "data" : item,
            "to" : mode
        })
    }).then((res : Response) =>{
        return res.json()
    }).catch((error : any)=>console.log(error));;

    if (!res){
        return {res : "error"};
    }

    return res;
}

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

export async function fetchWebclips(active : string){
    const res = await fetch("http://localhost:5000/api/fetchwebclips/" + "?active="+active, {
        method: "GET",
        headers: {
            "Key" : localStorage.getItem("Token") ?? ""
        }
    }).then((res : Response) =>{
        return res.json()
    }).catch((error : any)=>console.log(error));
    
    if (!res){
        return [];
    }
    return res;
}
export async function logout() : Promise<boolean>{
    localStorage.removeItem("Token");
    return new Promise( (res) => {
        res(true)});
}



export async function processRequests(data : ResType[]){
    let val;
    await fetch("http://localhost:5000/api/processrequests/", {
        method: "POST",
        headers: {
            "Key": localStorage.getItem("Token") ?? "", // temp val
            "From": localStorage.getItem("Token") + "_User", // temp val
            'Accept' : 'application/json', 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    }).then(async (res : any) =>{
        await res.json().then((res : any) =>{
            val = res;
        }
        );
        
    }).catch((error : any)=>console.log(error));

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
            return new Promise((resolve : any) =>{
                resolve(res.data ?? [] as ResType[]);
            })
        })
    }).catch((error : any)=>console.log(error));

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
    }).catch((error : any)=>console.log(error));;
    if (!res){
        return [] as ResType[];
    }
    return res as ResType[];
}
