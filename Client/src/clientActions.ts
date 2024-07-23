export function resetLocalStorage(){
    localStorage.removeItem("SN");
    localStorage.removeItem("NumDevices");
    localStorage.removeItem("Type");
    localStorage.removeItem("Webclip");
    localStorage.removeItem("VPN");
    localStorage.removeItem("Change");
    localStorage.removeItem("App");
    localStorage.removeItem("RequestType");
    localStorage.removeItem("MAC");
}

export function formSubmitProtocol(){
    resetLocalStorage();
}