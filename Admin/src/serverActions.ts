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

export async function fetchFromServer(e : FormEvent<HTMLFormElement>){
    console.log(e.currentTarget);
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
    queryParams += "time=" + e.currentTarget.timefilter.value;
    let data : ResType[] = [];
    const res = await fetch("http://localhost:5000/api/requests" + queryParams, {
        method : "GET",
        headers : {
            "key" : localStorage.getItem("Token") ?? ""
        }
    });
    
    await res.json().then((res)=>{
        console.log(res?.data);
        data = res.data ?? [];
    });

    return data;
}
