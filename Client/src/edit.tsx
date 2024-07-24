import { useEffect, useState, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Preview from "./preview";
import {DefaultTitle, DefaultWrapper } from "./components";
import Adding from "./Adding";
import { resetLocalStorage } from "./clientActions";

export default function Edit(){
    const [tableData, setData] = useState({} as {[index : string]: string[]});
    const [update, setUpdate] = useState(true);
    const nav = useNavigate();
    const buttonClick = useRef("none");
    const [isPreview, setPreview] = useState(false);
    const [isAdding, setAdding] = useState(false);
    const reqType = useRef(localStorage.getItem("RequestType"));
    const numberOfDevices = useRef(0);
    useEffect(()=>{
        if (update == false){
            return;
        }
        resetLocalStorage();
        const req = localStorage.getItem("RequestType");
        if (req == ""){
            alert("Request Failed!");
            nav("../req");
            return;
        }

        const temp : {[index : string]: string[]} = {};
        temp["RequestType"] = [req ?? ""];
        temp["Headers"] = [];
        switch (req){
            case "Add 4G VPN Profile": 
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
                setData(temp);
                break;
            case "Add new device record":
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
                setData(temp);
                break;
            case "Add Trial Certificate":
                temp["Headers"].push("Type");
                setData(temp);
                break;
            case "Add Webclip":
                temp["Headers"].push("Type");
                setData(temp);
                break;
            case "App Update":
                temp["Headers"].push("Type");
                setData(temp);
                break;
            case "Change of Device Type":
                temp["Headers"].push("Type");
                setData(temp);
                break;
            case "Look for last location":
                break;
            case "Remove 4G VPN profile":
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
                setData(temp);
                break;
            case "Remove Trial Certificate":
                temp["Headers"].push("Type");
                setData(temp);
                break;
        }
        setUpdate(false);
    }, [update, nav]);
    
    
    if (update == true){
        return(<></>)
    }

    return(<>
        
        <DefaultWrapper>
        <DefaultTitle>{reqType.current}</DefaultTitle>
                
        <form onSubmit={
            (event : FormEvent<HTMLFormElement>) =>{
                event.preventDefault();
                let boxes : HTMLCollection;
                let temp;
                let localStorageString : string[];
                let tempElement : HTMLInputElement;
                switch(buttonClick.current){
                    case "Add": 
                        setAdding(true);
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
                                    numberOfDevices.current = numberOfDevices.current - 1;
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
                    nav("../req");
                }
            } className="bg-slate-600 hover:bg-slate-700">Back</button>
            <button onClick={
                () =>{
                    if (!isPreview)
                        buttonClick.current = "Add"
                }
            } className="bg-slate-600 hover:bg-slate-700">Add</button>
            
            <button onClick={
                () =>{
                    if (!isAdding && !isPreview)
                        buttonClick.current = "Delete"
                }
            }className="bg-slate-600 hover:bg-slate-700">Delete</button>

            <button onClick={
                () =>{
                    console.log(isAdding, isPreview);
                    if (!isAdding)
                        buttonClick.current = "Preview"
                }
            } className="bg-slate-600 hover:bg-slate-700">Preview</button>
            <h3 className="text-slate-800 text-left"># Entries: {numberOfDevices.current}</h3>
        </div>
        <div className="grid max-h-96 overflow-y-scroll">
        <table className="w-[90%] table-auto mx-auto border-separate border-spacing-2 border-spacing-x-0 p-2 bg-slate-600 hover:bg-slate-700 overflow-y-scroll rounded mt-5">
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
                    if (key == "RequestType" || key == "Headers"){
                        return;
                    }
                    return (
                        <tr key={key + "_r"} className="hover:bg-slate-500">
                            <td key={key+"_check"}>
                                <input className="w-[100%] h-[100%]" name={key + "_check"} type="checkbox"/>
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
    {
        (isPreview && !isAdding) && <Preview previewFunc={setPreview}/>
    }
    {
        (!isPreview && isAdding) && <Adding reqtype={reqType.current ?? ""} close={setAdding} tabledata={tableData}
        settabledata={setData} count={numberOfDevices}/>
    }
    </>)
}