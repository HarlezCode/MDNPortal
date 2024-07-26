export async function authAction(username : string, password : string) : Promise<string>{
    return new Promise( (res) => {
        res(username+password)});
}

export async function logout() : Promise<boolean>{
    localStorage.removeItem("Token");
    return new Promise( (res) => {
        res(true)});
}
