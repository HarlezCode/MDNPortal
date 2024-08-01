import React from 'react'
import { useNavigate } from "react-router-dom";
import { DefaultWrapper, DefaultTitle, BackButton, DefaultInput } from "./components";
import { FormEvent } from "react";
import { formSubmitProtocol } from "./clientActions";
export default function AppUpdate(){
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <DefaultTitle>App Update</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        formSubmitProtocol()
                        localStorage.setItem("RequestType", "App Update");
                        localStorage.setItem("SN", event.currentTarget.snDevices.value);
                        localStorage.setItem("NumDevices", event.currentTarget.numDevices.value);
                        localStorage.setItem("App", event.currentTarget.app.value);
                        nav("../edit")
                    }
                }>
                <div className="space-y-[5%] grid content-start justify-items-start place-content-start">
                <div><b className="text-slate-900">Number of device(s) affected: </b><DefaultInput id="numDevices"/></div>
                <div className="flex-1 col-1 row-1"><b className="text-slate-900">SN of device(s): </b><textarea className="text-slate-900 bg-slate-100 border-blue-800 border-2 rounded mt-3 align-middle" name="snDevices"/></div>
                <div >
                    <b className="text-slate-900 pr-5">App: </b>
                    <select name="app" className="bg-white text-slate-900">
                        <option value="">-- select --</option>
                        <option value="some apps">Some apps</option>
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