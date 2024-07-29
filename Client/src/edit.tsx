import { useEffect, useState, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Preview from "./preview";
import {AppSelector, DefaultTitle, DefaultWrapper, WebClipSelector } from "./components";
import Adding from "./Adding";
import { resetLocalStorage } from "./clientActions";

export default function Edit(){
    const [tableData, setData] = useState({"Headers" : [] as string[]} as {[index : string]: string[]});
    const [update, setUpdate] = useState(true);
    const [isPreview, setPreview] = useState(false);
    const [isAdding, setAdding] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState({} as {[index : string] : boolean});
    const nav = useNavigate();
    const buttonClick = useRef("none");
    const reqType = useRef(localStorage.getItem("RequestType"));
    const numberOfDevices = useRef(0);
    const prevTarget = useRef("");
    const shiftKeyDown = useRef(false);
    const possibleWC = useRef({} as {[index : string] : string[]});
    const possibleApps = useRef({} as {[index : string] : string[]});

    useEffect(() => {
        const tempCheckboxes = JSON.parse(JSON.stringify(checkboxStates));
        let updated = false;
        for (let i =0; i< Object.keys(tableData).length; i++){
            if (Object.keys(tableData)[i] != "Headers" && Object.keys(tableData)[i] != "RequestType" ){
                if (checkboxStates[Object.keys(tableData)[i]] == null){
                    tempCheckboxes[Object.keys(tableData)[i]] = false;
                    updated = true;
                }
            }
        }
        if (updated)
            setCheckboxStates(tempCheckboxes);
    }, [tableData]);
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
            case "Retire device":
                temp["Headers"].push("Type");
                setData(temp);
                break;
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
                temp["Headers"].push("VPN");
                setData(temp);
                break;
            case "Add Webclip":
                temp["Headers"].push("Type");
                temp["Headers"].push("Webclip");
                setData(temp);
                break;
            case "App Update":
                temp["Headers"].push("Type");
                temp["Headers"].push("App");
                setData(temp);
                break;
            case "Change of Device Type":
                temp["Headers"].push("Type");
                temp["Headers"].push("Changing To");
                setData(temp);
                break;
            case "Look for last location":
                temp["Headers"].push("Type");
                temp["Headers"].push("MAC");
                setData(temp);
                break;
            case "Remove 4G VPN profile":
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
                setData(temp);
                break;
            case "Remove Trial Certificate":
                temp["Headers"].push("Type");
                temp["Headers"].push("VPN");
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

                let selected : string = "";
                if (buttonClick.current == "bulkwebclip"){
                    selected = event.currentTarget.wcSelector.value;
                } else if (buttonClick.current == "bulkapps"){
                    selected = event.currentTarget.appSelector.value;
                }

                let boxes : HTMLCollection;
                let temp : {[index : string] : string[]};
                let localStorageString : string[];
                let tempElement : HTMLInputElement;
                let tempCheckboxes;
                switch(buttonClick.current){
                    case "Add": 
                        setAdding(true);
                        break;
                    case "Preview": setPreview(true); break;
                    case "Delete": 
                        boxes = event.currentTarget.getElementsByTagName("input");
                        temp = JSON.parse(JSON.stringify(tableData));
                        tempCheckboxes = JSON.parse(JSON.stringify(checkboxStates));
                        localStorageString = (localStorage.getItem("SN") ?? "").split("\n");

                        for (let i = 0; i < boxes.length; i++){
                            tempElement = boxes[i] as HTMLInputElement;
                            
                            if (tempElement.type == "checkbox"){
                                if (tempElement.checked){
                                    numberOfDevices.current = numberOfDevices.current - 1;
                                    delete tempCheckboxes[tempElement.name.slice(0,tempElement.name.length-6)];
                                    delete temp[tempElement.name.slice(0,tempElement.name.length-6)];
                                    localStorageString = localStorageString.filter(function(item) { return item !== (tempElement.name.slice(0, tempElement.name.length-6) as string)})
                                }
                            }
                        }
                        localStorage.removeItem("SN");
                        localStorage.setItem("SN", localStorageString.join("\n"));
                        setData(temp);
                        setCheckboxStates(tempCheckboxes);
                        
                        break;
                    case "bulkwebclip":
                        if (selected != ""){
                            const temp = JSON.parse(JSON.stringify(tableData));
                            for (let i=0; i < Object.keys(checkboxStates).length;i++){
                                const key = Object.keys(checkboxStates)[i];
                                if (checkboxStates[key]){
                                    for (let v=0; v < temp[key].length; v++){
                                        if (temp[key][v].startsWith("wcp_")){
                                            temp[key][v] = selected;
                                            break;
                                        }
                                    }
                                }
                            }
                            setData(temp);
                        }
                        break;
                    case "bulkapps":
                        if (selected != ""){
                            const temp = JSON.parse(JSON.stringify(tableData));
                            for (let i=0; i < Object.keys(checkboxStates).length;i++){
                                const key = Object.keys(checkboxStates)[i];
                                if (checkboxStates[key]){
                                    for (let v=0; v < temp[key].length; v++){
                                        if (temp[key][v].startsWith("app_")){
                                            temp[key][v] = selected;
                                            break;
                                        }
                                    }
                                }
                            }
                            setData(temp);
                        }
                        break;
                        
                    default:
                        return;
                }
            }
        }>
        <div className="mb-[2%] flex-1 space-x-2">
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
            } className="bg-slate-600 hover:bg-slate-700">Import</button>
            
            <button onClick={
                () =>{
                    if (!isAdding && !isPreview)
                        buttonClick.current = "Delete"
                }
            }className="bg-slate-600 hover:bg-slate-700">Delete</button>

            <button onClick={
                () =>{
                    if (!isAdding)
                        buttonClick.current = "Preview"
                }
            } className="bg-slate-600 hover:bg-slate-700">Preview</button>
            <h3 className="text-slate-800 text-left mt-[1%]"># Entries: {numberOfDevices.current}</h3>
            {reqType.current =="Add Webclip" && <div>
                <b className="text-slate-900">Bulk update: </b>
                <select name="wcSelector" className="w-[25%]"><option value="">
                Select WebClips
                </option>
                {
                    function () {
                        const vals = new Set([] as string[]);
                        const keys = [] as string[];
                        const options = [] as string[];
                        for (let i=0; i < Object.keys(checkboxStates).length;i++){
                            const key = Object.keys(checkboxStates)[i];
                            if (checkboxStates[key]){
                                if (possibleWC.current[key] != null){
                                    if (!keys.includes(key)){
                                        keys.push(key);
                                    }
                                    possibleWC.current[key].forEach((val : string) =>{
                                        vals.add(val);
                                    });
                                }
                            }
                        }
                        
                        vals.forEach((val : string) =>{
                            let add = true;
                            for (let i=0; i < keys.length; i++){
                                if (!possibleWC.current[keys[i]].includes(val)){
                                    add = false;
                                    break;
                                }
                            }
                            if (add)
                                options.push(val);
                        });
                        return (<>{
                            options.map((val : string) =>{
                                return (
                                    <option className="select-none" value={val}>
                                        {val.slice(4)}
                                    </option>
                                )
                            })
                        }</>)
                    }()
                }

                
            </select>
            <button onClick={() =>{
                if (!isAdding && !isPreview){
                    buttonClick.current = "bulkwebclip";
                }
            }}className="bg-slate-600 ml-[2%] hover:bg-slate-700 py-[0.5%] px-[1%] text-sm">
                Confirm
            </button>
            </div>}


            {reqType.current =="App Update" && <div>
                <b className="text-slate-900">Bulk update: </b>
                <select name="appSelector" className="w-[25%]"><option value="">
                Select Apps
                </option>
                {
                    function () {
                        const vals = new Set([] as string[]);
                        const keys = [] as string[];
                        const options = [] as string[];
                        for (let i=0; i < Object.keys(checkboxStates).length;i++){
                            const key = Object.keys(checkboxStates)[i];
                            if (checkboxStates[key]){
                                if (possibleApps.current[key] != null){
                                    if (!keys.includes(key)){
                                        keys.push(key);
                                    }
                                    possibleApps.current[key].forEach((val : string) =>{
                                        vals.add(val);
                                    });
                                }
                            }
                        }
                        
                        vals.forEach((val : string) =>{
                            let add = true;
                            for (let i=0; i < keys.length; i++){
                                if (!possibleApps.current[keys[i]].includes(val)){
                                    add = false;
                                    break;
                                }
                            }
                            if (add)
                                options.push(val);
                        });
                        return (<>{
                            options.map((val : string) =>{
                                return (
                                    <option value={val}>
                                        {val.slice(4)}
                                    </option>
                                )
                            })
                        }</>)
                    }()
                }

                
            </select>
            <button onClick={() =>{
                if (!isAdding && !isPreview){
                    buttonClick.current = "bulkapps";
                }
            }}className="bg-slate-600 ml-[2%] hover:bg-slate-700 py-[0.5%] px-[1%] text-sm">
                Confirm
            </button>
            </div>}
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
            <tbody tabIndex={-1} style={{outline: "none"}} onKeyDown={(e : any) =>{
                    if (e.key == "Shift"){
                        shiftKeyDown.current = true;
                    }
                }} onKeyUp={(e : any) =>{
                    if (e.key == "Shift"){
                        shiftKeyDown.current = false;
                    }
                }} onBlur={
                    (e : any) =>{
                        shiftKeyDown.current = false;
                        prevTarget.current = "";
                    }
                } 
                className="overflow-y-scroll max-h-96 h-96">
                 {Object.keys(tableData).map((key) => {
                    if (key == "RequestType" || key == "Headers" || key.startsWith("data_")){
                        return;
                    }
                    return (
                        <tr id={key + "_r"} key={key + "_r"} className="hover:bg-slate-500"onClick={(e : any)=>{
                            
                            
                            const key = (e.currentTarget.id ?? "").slice(0,e.currentTarget.id.length-2);
                            const temp = JSON.parse(JSON.stringify(checkboxStates));

                            if (temp[key] == null && key != ""){
                                temp[key] = true;
                            } else {
                                temp[key] = !temp[key];
                            }
                            
                            if (shiftKeyDown.current){
                                if (prevTarget.current != ""){
                                    const curIndex = Object.keys(checkboxStates).indexOf(key);
                                    const lastIndex = Object.keys(checkboxStates).indexOf(prevTarget.current);
                                    if (curIndex != null && lastIndex != null && curIndex != lastIndex){
                                        if (curIndex > lastIndex){
                                            for (let i = lastIndex; i < curIndex; i++){
                                                temp[Object.keys(checkboxStates)[i]] = true;
                                            }
                                        } else {
                                            for (let i = curIndex; i < lastIndex + 1; i++){
                                                temp[Object.keys(checkboxStates)[i]] = true;
                                            }
                                        }
                                    }

                                }
                            }
                            setCheckboxStates(temp);
                            prevTarget.current = key;
                        }} 
                    >
                            <td key={key+"_check"}>
                                <input onLoad={(e : any)=>{
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                    const temp = JSON.parse(JSON.stringify(checkboxStates));
                                    if (temp[key] == null && key != ""){
                                        temp[key] = false;
                                    }
                                    
                                }}checked={checkboxStates[key] ?? ""} onChange={(e : any)=>{
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                    const temp = JSON.parse(JSON.stringify(checkboxStates));
                                    if (temp[key] == null && key != ""){
                                        temp[key] = true;
                                    } else {
                                        temp[key]= !temp[key];
                                    }
                                    setCheckboxStates(temp);
                                }} className="w-[100%] h-[100%]" name={key + "_check"} type="checkbox"/>
                            </td>
                            <td key="-1">
                                <h3 className="select-none">{key}</h3>
                            </td>
                            {tableData[key].map((item, i) => {
                                if (item.startsWith("wcp_")){
                                    return(
                                        <td className="px-10 py-2" key={String(i)}>
                                            <WebClipSelector tabledata={tableData} sn={key} possibleWC={possibleWC}/>
                                        </td>
                                    )
                                } else if (item.startsWith("app_")){
                                    return(
                                        <td className="px-10 py-2" key={String(i)}>
                                            <AppSelector tabledata={tableData} sn={key} possibleApps={possibleApps} />
                                        </td>
                                    )
                                } else if (item.startsWith("uuid_")){
                                    return;
                                } else if (item.startsWith("fromuser_")){
                                    return;
                                }

                                return(
                                    <td className="px-10 py-2" key={String(i)}>
                                        <h3 className="select-none">{item}</h3>
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
        (isPreview && !isAdding) && <Preview previewFunc={setPreview} data={tableData}/>
    }
    {
        (!isPreview && isAdding) && <Adding reqtype={reqType.current ?? ""} close={setAdding} tabledata={tableData}
        settabledata={setData} count={numberOfDevices}/>
    }
    </>)
}