import { useNavigate } from "react-router-dom";
import { DefaultWrapper, DefaultTitle, BackButton, DefaultInput } from "./components";
import { FormEvent } from "react";
import { formSubmitProtocol } from "./clientActions";

export function AddVpn(){
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <DefaultTitle>Add 4G VPN Profile</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        formSubmitProtocol()
                        // set local storage
                        localStorage.setItem("RequestType", "Add 4G VPN Profile");
                        localStorage.setItem("SN", event.currentTarget.snDevices.value);
                        localStorage.setItem("NumDevices", event.currentTarget.numDevices.value);
                        localStorage.setItem("Type", event.currentTarget.devices.value);
                        localStorage.setItem("VPN", event.currentTarget.vpn.value);
                        nav("../edit")
                    }
                }>
                <div className="space-y-[5%] grid content-start justify-items-start place-content-start">
                <div><b className="text-slate-900">Number of device(s) affected: </b><DefaultInput id="numDevices"/></div>
                <div className="flex-1 col-1 row-1"><b className="text-slate-900">SN of device(s): </b><textarea className="text-slate-900 bg-slate-100 border-blue-800 border-2 rounded mt-3 align-middle" name="snDevices"/></div>
                <div >
                    <b className="text-slate-900 pr-5">Type of Device(s): </b>
                    <select name="devices" className="bg-white text-slate-900">
                        <option value="">-- select --</option>
                        <option value="CORP">CORP</option>
                        <option value="COPE">COPE</option>
                        <option value="OUD">OUD</option>
                    </select>
                </div>
                <div >
                    <b className="text-slate-900 pr-5">VPN: </b>
                    <select name="vpn" className="bg-white text-slate-900">
                        <option value="">-- select --</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                
                <h3 className="text-slate-900 text-sm">*One SN per line, no comma or semi-colon is needed. Number of SN input will be checked too.</h3>
                <h3 className="text-slate-900 text-sm"># Bulk SNs should be same type of devices and VPN setting.</h3>
                <button className="ml-[49%] bg-slate-700">Next</button>
                </div>
            </form>
            <BackButton nav={nav} />
        </div>
    </DefaultWrapper>
    </>)
}

export function RemoveVpn(){
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <DefaultTitle>Remove 4G VPN Profile</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        formSubmitProtocol()
                        // basic assertion here
                        
                        //set local storage
                        localStorage.setItem("RequestType", "Remove 4G VPN profile");
                        localStorage.setItem("SN", event.currentTarget.snDevices.value);
                        localStorage.setItem("NumDevices", event.currentTarget.numDevices.value);
                        localStorage.setItem("Type", event.currentTarget.devices.value);
                        localStorage.setItem("VPN", event.currentTarget.vpn.value);
                        nav("../edit")
                    }
                }>
                <div className="space-y-[5%] grid content-start justify-items-start place-content-start">
                <div><b className="text-slate-900">Number of device(s) affected: </b><DefaultInput id="numDevices"/></div>
                <div className="flex-1 col-1 row-1"><b className="text-slate-900">SN of device(s): </b><textarea className="text-slate-900 bg-slate-100 border-blue-800 border-2 rounded mt-3 align-middle" name="snDevices"/></div>
                <div >
                    <b className="text-slate-900 pr-5">Type of Device(s): </b>
                    <select name="devices" className="bg-white text-slate-900">
                        <option value="">-- select --</option>
                        <option value="CORP">CORP</option>
                        <option value="COPE">COPE</option>
                        <option value="OUD">OUD</option>
                    </select>
                </div>
                <div >
                    <b className="text-slate-900 pr-5">VPN: </b>
                    <select name="vpn" className="bg-white text-slate-900">
                        <option value="">-- select --</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                
                <h3 className="text-slate-900 text-sm">*One SN per line, no comma or semi-colon is needed. Number of SN input will be checked too.</h3>
                <h3 className="text-slate-900 text-sm"># Bulk SNs should be same type of devices and VPN setting.</h3>
                <button className="ml-[49%] bg-slate-700">Next</button>
                </div>
            </form>
            <BackButton nav={nav} />
        </div>
    </DefaultWrapper>
    </>)
}