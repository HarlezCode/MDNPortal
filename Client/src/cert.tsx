import { useNavigate } from "react-router-dom";
import { BackButton, DefaultInput, DefaultTitle, DefaultWrapper } from "./components"
import { FormEvent } from "react";
import { formSubmitProtocol } from "./clientActions";
export function AddTrialCert(){
    const nav = useNavigate();

    return (<>
    <DefaultWrapper>
        <DefaultTitle>Add Trial Certificate</DefaultTitle>
        <div>
            <form onSubmit={
                    (event : FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        formSubmitProtocol()
                        // basic assertion here
                        localStorage.setItem("RequestType", "Add Trial Certificate");
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
export function RemoveTrialCert(){
    const nav = useNavigate();
    return (<>
        <DefaultWrapper>
            <DefaultTitle>Remove Trial Certificate</DefaultTitle>
            <div>
                <form onSubmit={
                        (event : FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            formSubmitProtocol()
                            // basic assertion here

                            localStorage.setItem("RequestType", "Remove Trial Certificate");
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