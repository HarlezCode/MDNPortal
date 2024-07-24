import { useEffect, useState, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Preview from "./preview";
import {DefaultTitle, DefaultWrapper } from "./components";

export default function Edit(){
    const [tableData, setData] = useState({} as {[index : string]: string[]});
    const [update, setUpdate] = useState(true);
    const nav = useNavigate();
    const buttonClick = useRef("none");
    const [isPreview, setPreview] = useState(false);
    useEffect(()=>{
        if (update == false){
            return;
        }
        const req = localStorage.getItem("RequestType");
        if (req == ""){
            alert("Request Failed!");
            nav("../req");
            return;
        }

        const temp : {[index : string]: string[]} = {};
        temp["RequestType"] = [req ?? ""];
        temp["Headers"] = [];
        temp["HasDevices"] = ["false"];
        let devices = [] as string[];
        console.log("updating...")
        if (req == "Add 4G VPN Profile" || req == "Remove 4G VPN profile" || req == "Add new device record"){
            devices = (localStorage.getItem("SN") ?? "").split("\n");
            if (devices.length > 0){
                temp["HasDevices"] = ["true"];
            }
        }
        switch (req){
            case "Add 4G VPN Profile": 
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
                for (let i = 0; i < devices.length; i++){
                    temp[devices[i]] = [];
                    temp[devices[i]].push(localStorage.getItem("Type") ?? "");
                    temp[devices[i]].push(localStorage.getItem("VPN") ?? "");
                }
                setData(temp);
                break;
            case "Add new device record":
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
                for (let i = 0; i < devices.length; i++){
                    temp[devices[i]].push(localStorage.getItem("Type") ?? "");
                    temp[devices[i]].push(localStorage.getItem("VPN") ?? "");
                }
                setData(temp);
                break;
            case "Add Trial Certificate":
                break;
            case "Add Webclip":
                break;
            case "App Update":
                break;
            case "Change of Device Type":
                break;
            case "Look for last location":
                break;
            case "Remove 4G VPN profile":
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
                for (let i = 0; i < devices.length; i++){
                    temp[devices[i]].push(localStorage.getItem("Type") ?? "");
                    temp[devices[i]].push(localStorage.getItem("VPN") ?? "");
                }
                setData(temp);
                break;
            case "Remove Trial Certificate":
                break;
        }
        setUpdate(false);
    }, [update, nav])
    
    
    if (update == true){
        return(<></>)
    }

    if (tableData["HasDevices"].length != 0) {
        if (tableData["HasDevices"][0] == "false"){
            alert("No devices")
            nav("../req");
            return (<></>)
        }
    } else {
        alert("No devices")
        nav("../req");
        return (<></>)
    }

    return(<>
        <DefaultWrapper>
        <DefaultTitle>Edit Table</DefaultTitle>
        {
            isPreview && <Preview previewFunc={setPreview}/>
        }


        <form onSubmit={
            (event : FormEvent<HTMLFormElement>) =>{
                event.preventDefault();
                let boxes : HTMLCollection;
                let temp;
                let localStorageString : string[];
                let tempElement : HTMLInputElement;
                switch(buttonClick.current){
                    case "Add": 
                        break;
                    case "Preview": setPreview(true); break;
                    case "Delete": 
                        boxes = event.currentTarget.getElementsByTagName("input");
                        temp = JSON.parse(JSON.stringify(tableData));
                        localStorageString = (localStorage.getItem("SN") ?? "").split("\n");

                        for (let i = 0; i < boxes.length; i++){
                            tempElement = boxes[i] as HTMLInputElement;
                            if (tempElement.type == "checkbox"){
                                if (tempElement.checked){
                                    delete temp[tempElement.name.slice(0,tempElement.name.length-6)];
                                    localStorageString = localStorageString.filter(function(item) { return item !== (tempElement.name.slice(0, tempElement.name.length-6) as string)})
                                }
                            }
                        }
                        localStorage.removeItem("SN");
                        localStorage.setItem("SN", localStorageString.join("\n"));
                        setData(temp);
                        
                        break;
                    default:
                        return;
                }
            }
        }>
        <div className="mb-2 flex-1 space-x-2">
            <button onClick={
                () =>{
                    buttonClick.current = "Add"
                }
            } className="bg-slate-600 hover:bg-slate-700">Add</button>
            
            <button onClick={
                () =>{
                    buttonClick.current = "Delete"
                }
            }className="bg-slate-600 hover:bg-slate-700">Delete</button>

            <button onClick={
                () =>{
                    buttonClick.current = "Preview"
                }
            } className="bg-slate-600 hover:bg-slate-700">Preview</button>
        </div>
        <div className="grid max-h-96 overflow-y-scroll">
        <table className="table-auto  mx-auto border-separate border-spacing-2 border-spacing-x-0 p-2 bg-slate-600 hover:bg-slate-700 overflow-y-scroll rounded mt-5">
            <thead className="top-0">
                <tr className="bg-slate-500 text-xl">
                    <th className="py-6 px-6 border-b-4"></th>
                    <th className="border-b-4">SN</th>
                    { 
                        tableData["Headers"].map((item,i) => {
                            return (<th className="border-b-4" key={i}>{item}</th>)
                        })
                    }
                </tr>
            </thead>
            <tbody className="overflow-y-scroll max-h-96 h-96">
                 {Object.keys(tableData).map((key) => {
                    if (key == "RequestType" || key == "Headers" || key == "HasDevices"){
                        return;
                    }
                    return (
                        <tr key={key + "_r"} className="hover:bg-slate-500">
                            <td key={key+"_check"}>
                                <input name={key + "_check"} type="checkbox"/>
                            </td>
                            <td key="-1">
                                <h3>{key}</h3>
                            </td>
                            {tableData[key].map((item, i) => {
                                return(
                                    <td className="px-10 py-2" key={String(i)}>
                                        <h3>{item}</h3>
                                    </td>
                                )
                            })}
                        </tr>
                    )
                 })}
            </tbody>
        </table>
    </div>    
    </form>
    </DefaultWrapper>
    </>)
}