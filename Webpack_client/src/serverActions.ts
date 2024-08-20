export async function authAction(username : string, password : string) : Promise<string>{
    return new Promise( (res) => {
        res(username+password)});
}

export async function getDeviceInfo(sn : string){
    let res = await fetch("http://localhost:5000/api/mi/fetchdevice/?sn=" +sn, {
        headers: {
            "Key": localStorage.getItem("Token") ?? ""
        },
        method: "GET"}
    ).then((res : Response) =>{
        return res.json()
    }).catch(
        () =>{
            return new Promise<{[index : string] : (string | [])}>((res) =>{
                res({
                    "res" : "error",
                    "data": [],
                    "error": "Server not responding"
                })
            })
        }
    )
    if (res["res"] == "error"){
        return {"data" : [], "error": ("An error occurred ("+res["error"]+") for this SN: " + sn)};
    }
    if (res["data"].length == 0){
        return {"data" : [], "error": ("No ACTIVE entries found for this SN on mobile iron: " + sn)};
    } else if (res["data"].length > 1){
        return {"data" : [], "error" : ("Multiple ACTIVE entries found for this SN on mobile iron: " + sn)}
    }
    return {"data" : res["data"], "error" : ""}
}

export async function getDeviceType(uuid : string, server : string){
    const res = await fetch("http://localhost:5000/api/mi/getdevicelabels/?uuid=" +uuid + "&server="+server, {
        headers: {
            "Key": localStorage.getItem("Token") ?? ""
        },
        method: "GET"}
    ).then((res : Response) =>{
        return res.json()
    });
    if (res["res"] == "ok"){
        // some algorithm here to map labels to device type
        console.log(res);
        return "CORP";
    } else {
        return "error";
    }
} 



export async function fetchWebClips(metadata : {[index : string] : string}, data : string[]){
    const fetchParams = {
        "model" : metadata["common.model"] ?? "",
        "dtype" : data[0] ?? "",
        "platform" : metadata["common.platform"] ?? "",
        "os": metadata["common.os"] ?? "",
        "server": data[3] ?? ""
    };

    const webres = await fetch("http://localhost:5000/api/getwebclips/?" + new URLSearchParams(fetchParams).toString(), {
        headers: {
            "Key": localStorage.getItem("Token") ?? ""
        },
        method: "GET"
    }).then((res : Response) =>{
        return res.json();
    }).catch(()=>{
        return new Promise<{[index : string] : string[] | string}>((res)=>{
            res({"data" : [] as string[], "res" : "error", "error" : "Server not responding."})});
    }); 

    return {"data" : webres["data"], "res" : webres["res"], "error" : webres["error"]} ?? {"data" : [], "error": ""};
}

export async function fetchApps(uuid : string, server : string){
    const res = await fetch("http://localhost:5000/api/mi/fetchapps/?uuid="+ uuid + "&server=" + server).then(
        (res : Response) =>{
            return res.json();
        }
    ).catch(
        () =>{
            return new Promise<{[index : string] : string}>((res) => {
                res({"error" : "yes"});
            })
        }
    );
    if (res["error"] == "yes"){
        return ["error"];
    }
    const data = [] as string[];
    res["data"].forEach(
        (val : {[index : string] : any}) =>{
            data.push('app_'+val["identifier"]);
        }
    )
    return data;

}
