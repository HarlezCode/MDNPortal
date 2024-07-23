import { useNavigate } from "react-router-dom";
import { DefaultWrapper, DefaultTitle, BackButton, DefaultInput } from "./components";
import { FormEvent } from "react";
import { formSubmitProtocol } from "./clientActions";
export function AddDeviceRecord(){
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <DefaultTitle>Add new device record</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        formSubmitProtocol()
                        // do assertion checks here

                        // set item and navigate
                        localStorage.setItem("RequestType", "Add new device record");
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
export function ChangeDeviceType(){
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <DefaultTitle>Change of Device Type</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        formSubmitProtocol()
                        // basic assertion here
                        localStorage.setItem("RequestType", "Change of Device Type");
                        localStorage.setItem("SN", event.currentTarget.snDevices.value);
                        localStorage.setItem("NumDevices", event.currentTarget.numDevices.value);
                        localStorage.setItem("Change", event.currentTarget.changing.value);
                        nav("../edit")
                    }
                }>
                <div className="space-y-[5%] grid content-start justify-items-start place-content-start">
                <div><b className="text-slate-900">Number of device(s) affected: </b><DefaultInput id="numDevices"/></div>
                <div className="flex-1 col-1 row-1"><b className="text-slate-900">SN of device(s): </b><textarea className="text-slate-900 bg-slate-100 border-blue-800 border-2 rounded mt-3 align-middle" name="snDevices"/></div>
                <div >
                    <b className="text-slate-900 pr-5">App: </b>
                    <select name="changing" className="bg-white text-slate-900">
                        <option value="">-- select --</option>
                        <option value="CRPTOCPE">CORP to COPE</option>
                        <option value="CRPTOOUD">CORP to OUD</option>
                        <option value="CPETOCRP">COPE to CORP</option>
                        <option value="CPETOOUD">COPE to OUD</option>
                        <option value="OUDTOCRP">OUD to CORP</option>
                        <option value="OUDTOCPE">OUD to COPE</option>
                    </select>
                </div>
                
                <h3 className="text-slate-900 text-sm">*One SN per line, no comma or semi-colon is needed. Number of SN input will be checked too.</h3>
                <h3 className="text-slate-900 text-sm"># Bulk SNs should be same App.</h3>
                <button className="ml-[49%] bg-slate-700">Next</button>
                </div>
            </form>
            <BackButton nav={nav} />
        </div>
    </DefaultWrapper>
    </>)
}

export function RetireDevice(){
    const nav = useNavigate();

    return (<>
    <DefaultWrapper>
        <DefaultTitle>Retire Device</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        formSubmitProtocol()
                        localStorage.setItem("RequestType", "Retire device");
                        localStorage.setItem("SN", event.currentTarget.snDevices.value);
                        localStorage.setItem("NumDevices", event.currentTarget.numDevices.value); 
                        nav("../edit")        
                    }
                }>
                <div className="space-y-[5%] grid content-start justify-items-start place-content-start">
                <div><b className="text-slate-900">Number of device(s) affected: </b><DefaultInput id="numDevices"/></div>
                <div className="flex-1 col-1 row-1"><b className="text-slate-900">SN of device(s): </b><textarea className="text-slate-900 bg-slate-100 border-blue-800 border-2 rounded mt-3 align-middle" name="snDevices"/></div>
                <h3 className="text-slate-900 text-sm">*One SN per line, no comma or semi-colon is needed. Number of SN input will be checked too.</h3>
                <button className="ml-[50%] bg-slate-700">Next</button>
                </div>
            </form>
            <BackButton nav={nav} />
        </div>
    </DefaultWrapper>
    </>)
}

export function LastLocation(){
    const nav = useNavigate()
    return (<><DefaultWrapper> 
        <DefaultTitle>Look for last location</DefaultTitle>
        <div><form onSubmit={
            (event : FormEvent<HTMLFormElement>) =>{
                event.preventDefault()
                formSubmitProtocol()
                localStorage.setItem("RequestType", "Look for last location")
                localStorage.setItem("SN", event.currentTarget.sn.value)
                localStorage.setItem("MAC", event.currentTarget.mac.value)
                nav("../edit")
            }
            
        }>
            <div className="flex-1 space-y-4">
                <div><b className="text-slate-900">SN of device: </b><DefaultInput id="sn"/></div>
                <div className="pb-[1%]"><b className="text-slate-900">MAC Address: </b><DefaultInput id="mac"/></div>
                <button className="bg-slate-700">Next</button>
            </div>
        </form>
        <BackButton nav={nav}/>
        </div>
        </DefaultWrapper></>)
}