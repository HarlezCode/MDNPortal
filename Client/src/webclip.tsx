import { useNavigate } from "react-router-dom";
import { DefaultWrapper, DefaultTitle, BackButton, DefaultInput } from "./components";
import { FormEvent } from "react";


export default function WebClip() {
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <DefaultTitle>Add Webclip</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        //assertions here


                        localStorage.setItem("RequestType", "Add Webclip");
                        localStorage.setItem("SN", event.currentTarget.snDevices.value);
                        localStorage.setItem("NumDevices", event.currentTarget.numDevices.value);
                        localStorage.setItem("Webclip", event.currentTarget.webclips.value);
                        nav("../edit")
                    }
                }>
                <div className="space-y-[5%] grid content-start justify-items-start place-content-start">
                <div><b className="text-slate-900">Number of device(s) affected: </b><DefaultInput id="numDevices"/></div>
                <div className="flex-1 col-1 row-1"><b className="text-slate-900">SN of device(s): </b><textarea className="text-slate-900 bg-slate-100 border-blue-800 border-2 rounded mt-3 align-middle" name="snDevices"/></div>
                <div >
                    <b className="text-slate-900 pr-5">Webclip: </b>
                    <select name="webclips" className="bg-white text-slate-900">
                        <option value="">-- select --</option>
                        <option value="SomeWeb clips">Webclipping</option>
                    </select>
                </div>
                
                <h3 className="text-slate-900 text-sm">*One SN per line, no comma or semi-colon is needed. Number of SN input will be checked too.</h3>
                <h3 className="text-slate-900 text-sm"># Bulk SNs should be same Webclip.</h3>
                <button className="ml-[49%] bg-slate-700">Next</button>
                </div>
            </form>
            <BackButton nav={nav} />
        </div>
    </DefaultWrapper>
    </>)
}