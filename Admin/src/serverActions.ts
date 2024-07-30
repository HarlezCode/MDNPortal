import { FormEvent } from "react";

export async function authAction(username : string, password : string) : Promise<string>{
    return new Promise( (res) => {
        res(username+password)});
}

export async function logout() : Promise<boolean>{
    localStorage.removeItem("Token");
    return new Promise( (res) => {
        res(true)});
}

type ResType = {[key : string] : string};

export async function processRequests(data : ResType[]){
    let val : string = "";
    await fetch("http://localhost:5000/api/processrequests", {
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
            if (res.status == "error"){
                val = res.error ?? "Error has occurred!"
            } else {
                if (res.data.length > 0){
                    val = "Some requests are already processed!";
                } else {
                    val = "Successfully processed!"
                }
                
            }
            
        }
        );
        
    })

    return val;
}



export async function fetchFromServerRaw({rtype='',sn='',stat='Pending',uid='', date='',dtype='', ctype='',from='',mac='',app='',wc='' ,tm='',processed=''}){
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
    let data : ResType[] = [];
    const res = await fetch("http://localhost:5000/api/requests" + queryParams, {
        method : "GET",
        headers : {
            "key" : localStorage.getItem("Token") ?? ""
        }
    });
    
    await res.json().then((res)=>{
        data = res.data ?? [];
    });

    return data;
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
    let data : ResType[] = [];
    const res = await fetch("http://localhost:5000/api/requests" + queryParams, {
        method : "GET",
        headers : {
            "key" : localStorage.getItem("Token") ?? "" // temp val
        }
    });
    
    await res.json().then((res)=>{
        console.log(res?.data);
        data = res.data ?? [];
    });

    return data;
}
