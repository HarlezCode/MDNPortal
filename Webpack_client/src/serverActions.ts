export async function authAction(username : string, password : string) : Promise<string>{
    return new Promise( (res) => {
        res(username+password)});
}

export async function fetchWebClips(sn : string){
    const fetchParams = {
        "model" : '',
        "dtype" : '',
        "platform" : '',
        "os": '',
        "clstr": ''
    };
    // fetch from mobile iron api
    // temp testing params
    if (sn.startsWith("ipad")){
        fetchParams.model = "Apple Ipad Pro";
        fetchParams.dtype = "CORP";
        fetchParams.platform = "IOS"    
    } else{
        fetchParams.model = "Samsung A3";
        fetchParams.dtype = "CORP";
        fetchParams.platform = "ANDROID"
    }
    //
    const res = await fetch("http://localhost:5000/api/getwebclips?" + new URLSearchParams(fetchParams).toString(), {
        headers: {
            "Key": localStorage.getItem("Token") ?? ""
        },
        method: "GET"
    }).then((res : any) =>{
        return res.json();
    })    

    return res["data"] ?? [];
}

export async function fetchApps(sn : string) : Promise<string[]>{
    // temp testing data
    return new Promise( (res) =>{
        if (sn.charAt(0) == "a"){
            res(["app_Googling", "app_Chrome?", "app_Duckduckgo"] as string[]);
        } else {
            res(["app_Googling","app_Valorant", "app_Appstoreaaaaaaaaaaaaaaaaaaaaaaa"] as string[]);
        }
    })
}
