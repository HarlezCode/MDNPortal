import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultWrapper } from "./components";

const requestTypes : string[] = [
    "Add 4G VPN Profile",
    "Add new device record",
    "Add Trial Certificate",
    "Add Webclip",
    "App Update",
    "Change of Device Type",
    "Look for last location",
    "Remove 4G VPN profile",
    "Remove Trial Certificate",
    "Retire device"
]


export default function Req(){
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <h3><b className="text-slate-900 text-2xl">Type of Request</b></h3>
        <form onSubmit={
            (event : FormEvent<HTMLFormElement>) =>{
                event.preventDefault();
                const val = event.currentTarget.req.value
                switch (val){
                    case "Add 4G VPN Profile": nav("add4gvpn"); break;
                    case "Add new device record": nav("addnewdevice"); break;
                    case "Add Trial Certificate": nav("addtrialcert"); break;
                    case "Add Webclip": nav("addwebclip"); break;
                    case "App Update": nav("appupdate"); break;
                    case "Change of Device Type": nav("changedevicetype"); break;
                    case "Look for last location": nav("lookforlastlocation"); break;
                    case "Remove 4G VPN profile": nav("remove4gvpn"); break;
                    case "Remove Trial Certificate": nav("removetrialcert"); break;
                    case "Retire device": nav("retiredevice"); break;
                    default: alert("Please Select a Request Type"); break;
                }
            }
        }>
        <div>
            <b className="text-slate-900">Type of Request: </b>
            <select  name="req" className="p-1 rounded bg-white text-slate-900">
                <option value="">-- Select -- </option>
                {requestTypes.map((v, i)=>{
                    return (<option key={i} value={v} id={v}>{v}</option>)
                })}
            </select>
        </div>
        <div className="py-2">
        <button className="bg-slate-700 px-10 mt-10">Next</button>
        </div>
        </form>
    </DefaultWrapper>    
    </>)
}