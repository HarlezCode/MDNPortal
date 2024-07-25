export async function authAction(username : string, password : string) : Promise<string>{
    return new Promise( (res) => {
        res(username+password)});
}

export async function fetchWebClips(sn : string) : Promise<string[]>{
    // fetch from mobile iron api
    return new Promise( (res) =>{
        if (sn.charAt(0) == "a"){
            res(["wcp_AClip1aaaaaaaaaaaaaaaaaaaaaa", "wcp_AClip2"] as string[]);
        } else {
            res(["wcp_Other1", "wcp_Other2"] as string[]);
        } 
    })
}

export async function fetchApps(sn : string) : Promise<string[]>{
    return new Promise( (res) =>{
        if (sn.charAt(0) == "a"){
            res(["app_Googling", "app_Chrome?", "app_Duckduckgo"] as string[]);
        } else {
            res(["app_Googling","app_Valorant", "app_Appstoreaaaaaaaaaaaaaaaaaaaaaaa"] as string[]);
        }
    })
}
