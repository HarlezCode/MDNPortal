// please change this if the mapping of labels are updated
const labeltodtype : {[index : string] : string[]} = { 
    "CORP" : [
        "11. WiFi BCK - CORP COPE",
        "2. Filter - CORP",
        "11. Public Apps VPP",
        "11. Fonts - 2024",
        "1. Filter - Assigned",
        "2. Profile - CORP 2018 (A1)",
        "2. Global Proxy - CORP",
        "2. WiFi 256 - CORP",
        "66. Web Clip - VIS portal",
        "1. Registration Completed"
    ],
    "COPE" :[
        "11. WiFi BCK - CORP COPE",
        "11. Public Apps VPP",
        "11. Fonts - 2024",
        "1. Filter - Assigned",
        "3. Filter - COPE",
        "3. Global Proxy - COPE",
        "3. Profile - COPE 2018 (A2)",
        "3. WiFi 256 - COPE",
        "66. Web Clip - DPMS",
        "1. Registration Completed"

    ],
    "OUD" : [
        "1. Filter - Assigned",
        "4. Filter - OUD",
        "4. WiFi BCK - OUD",
        "4. WiFi 256 - OUD",
        "4. Profile - OUD 2018",
        "4. App - MI App VPP",
        "1. Registration Completed"
    ]
};


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

export async function getDeviceLabels(uuid : string, server : string){
    const res = await fetch("http://localhost:5000/api/mi/getdevicelabels/?uuid=" +uuid + "&server="+server, {
        headers: {
            "Key": localStorage.getItem("Token") ?? ""
        },
        method: "GET"}
    ).then((res : Response) =>{
        return res.json()
    }).catch(() => {
        return new Promise((res)=>res({'res' : "error"}));
    });

    if (res["res"] == "ok"){
        const labels : string[] = [];
        res["data"].map((val : {[index : string] : any}) =>{
            labels.push(val["name"])
        })
        return {res: "ok", data : labels};
    } else {
        return {res: "error", data : []};;
    }
}



export function checkDeviceType(labels : string[]){

    // mapping labels to dtype
    const dtype : boolean[] = [true, true, true]; // CORP COPE OUD

    for (let v=0; v < Object.keys(labeltodtype).length; v++){
        const name = Object.keys(labeltodtype)[v];
        for (let i=0; i< labeltodtype[name].length;i++){
            if (!labels.includes(labeltodtype[name][i])){
                dtype[v] = false;
                break;
            }
        }
    }
    let atype = "";
    let count = 0;
    dtype.forEach((val : boolean, ind : number) =>{
        if (val){
            atype = Object.keys(labeltodtype)[ind];
            count++;
        }
    })
    if (count != 1){
        ///// MUST CHANGE TO "error" AFTER TESTING
        return "CORP"
    }
    return atype;
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

    const prefixedData : string[] = [];
    webres["data"].forEach((val : string)=>{
        prefixedData.push("wcp_" + val);
    })

    return {"data" : prefixedData, "res" : webres["res"], "error" : webres["error"]} ?? {"data" : [], "error": ""};
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
