import React from 'react'
import { useEffect, useState, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Preview from "./preview";
import {AppSelector, DefaultTitle, DefaultWrapper, WebClipSelector } from "./components";
import Adding from "./Adding";
import { resetLocalStorage } from "./clientActions";

/*
This is the edit table to add/delete device entries
*/


export default function Edit(){
    // data states
    const [tableData, setData] = useState({"Headers" : [] as string[]} as {[index : string]: string[]});
    const [metaData, setMetaData] = useState({} as {[index : string] : {[index : string] : string}});
    const [update, setUpdate] = useState(true);
    const possibleWC = useRef({} as {[index : string] : string[]});
    const possibleApps = useRef({} as {[index : string] : string[]});
    // ui states
    const [isPreview, setPreview] = useState(false);
    const [isAdding, setAdding] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState({} as {[index : string] : boolean});
    const nav = useNavigate();
    const buttonClick = useRef("none");
    const reqType = useRef(localStorage.getItem("RequestType"));
    const numberOfDevices = useRef(0);
    const prevTarget = useRef("");
    const shiftKeyDown = useRef(false);
    
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
        // Setting up headers for each type of request
        switch (req){
            case "Retire device":
                temp["Headers"].push("Type");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "Add 4G VPN Profile": 
                temp["Headers"].push("Type");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "Add new device record":
                temp["Headers"].push("Type");
                temp["Headers"].push("Cluster");
                setData(temp);
                break;
            case "Add Trial Certificate":
                temp["Headers"].push("Type");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "Add Webclip":
                temp["Headers"].push("Type");
                temp["Headers"].push("Webclip");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "App Update":
                temp["Headers"].push("Type");
                temp["Headers"].push("App");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "Change of Device Type":
                temp["Headers"].push("Type");
                temp["Headers"].push("Changing To");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "Look for last location":
                temp["Headers"].push("Type");
                temp["Headers"].push("MAC");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "Remove 4G VPN profile":
                temp["Headers"].push("Type");
                temp["Headers"].push("Server");
                setData(temp);
                break;
            case "Remove Trial Certificate":
                temp["Headers"].push("Type");
                temp["Headers"].push("Server");
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
        <div style={{borderTopRightRadius: "0.3rem", borderTopLeftRadius: "0.3rem",marginBottom: "20px", paddingTop: 10, paddingBottom: 10, backgroundColor: "#f5eaff"}}>
            <DefaultTitle>{reqType.current}</DefaultTitle>
        </div>    
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
                            const temp2 = JSON.parse(JSON.stringify(checkboxStates));
                            Object.keys(checkboxStates).forEach((val : string) =>{
                                temp2[val] = false;
                            })
                            setCheckboxStates(temp2);
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
                            const temp2 = JSON.parse(JSON.stringify(checkboxStates));
                            Object.keys(checkboxStates).forEach((val : string) =>{
                                temp2[val] = false;
                            })
                            setCheckboxStates(temp2);
                        }
                        break;
                        
                    default:
                        return;
                }
            }
        }>
        <div>
            <button onClick={
                () =>{
                    nav("../req");
                }
            } className="mr">Back</button>

            <button onClick={
                () =>{
                    if (!isPreview)
                        buttonClick.current = "Add"
                }
            } className="mr">Import</button>
            
            <button onClick={
                () =>{
                    if (!isAdding && !isPreview)
                        buttonClick.current = "Delete"
                }
            } className="mr">Delete</button>

            <button onClick={
                () =>{
                    if (!isAdding)
                        buttonClick.current = "Preview"
                }
            } >Preview</button>
            <h3 style={{marginBottom: '5px',textAlign: "left",  marginLeft: '10px', marginTop: "1%", fontWeight: "400", fontSize:"1rem"}}># Entries: {numberOfDevices.current}</h3>
            {reqType.current =="Add Webclip" && <div style={{marginBottom:'20px'}}>
                <b >Bulk update: </b>
                <select name="wcSelector" style={{width: "17%",paddingTop:"4px", paddingBottom: "4px", backgroundColor: "white", color: "black"}} className='mr'><option value="">
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
                            options.map((val : string, id : number) =>{
                                return (
                                    <option key={id} style={{userSelect: "none"}} value={val}>
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
            }} style={{fontSize:"0.875rem",lineHeight:"1.25rem", padding: ".5% 2.1%"}}>
                Confirm
            </button>
            </div>}


            {reqType.current =="App Update" && <div style={{marginBottom:'20px'}}>
                <b className="text-slate-900">Bulk update: </b>
                <select name="appSelector" style={{width: "17%",paddingTop:"4px", paddingBottom: "4px", backgroundColor: "white", color: "black"}} className='mr'><option value="">
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
                            options.map((val : string, id : number) =>{
                                return (
                                    <option key={id} style={{userSelect: "none"}} value={val}>
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
                
            }} style={{padding: ".5% 2.1%", fontSize:"0.875rem",lineHeight:"1.25rem"}}>
                Confirm
            </button>
            </div>}
        </div>

        <div className="div1">
        <table className="table1">
            <thead style={{top: 0, height: '3rem'}}>
                <tr style={{fontSize: "1.5rem"}} className='trheader'>
                    <th className='fweight600'></th>
                    <th className='fweight600'>Serial #</th>
                    { 
                        tableData["Headers"].map((item : string, i : number) => {
                            return (<th className="fweight600" key={i}>{item}</th>)
                        })
                    }
                </tr>
            </thead>
            <tbody tabIndex={-1} style={{outline: "none", height: "24rem", maxHeight: "24rem"}} onKeyDown={(e : React.KeyboardEvent) =>{
                    if (e.key == "Shift"){
                        shiftKeyDown.current = true;
                    }
                }} onKeyUp={(e : React.KeyboardEvent) =>{
                    if (e.key == "Shift"){
                        shiftKeyDown.current = false;
                    }
                }} onBlur={
                    () =>{
                        shiftKeyDown.current = false;
                        prevTarget.current = "";
                    }
                }> 
                 {Object.keys(tableData).map((key : string) => {
                    if (key == "RequestType" || key == "Headers" || key.startsWith("data_")){
                        return;
                    }
                    return (
                        <tr id={key + "_r"} key={key + "_r"} className="hoverrow" onClick={(e : React.MouseEvent<HTMLTableRowElement>)=>{
                            
                            
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
                                <input onLoad={(e : React.SyntheticEvent<HTMLInputElement>)=>{
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                    const temp = JSON.parse(JSON.stringify(checkboxStates));
                                    if (temp[key] == null && key != ""){
                                        temp[key] = false;
                                    }
                                    
                                }} checked={checkboxStates[key] ?? ""} onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                    const temp = JSON.parse(JSON.stringify(checkboxStates));
                                    if (temp[key] == null && key != ""){
                                        temp[key] = true;
                                    } else {
                                        temp[key]= !temp[key];
                                    }
                                    setCheckboxStates(temp);
                                }} style={{width: "120%", height: "120%"}} name={key + "_check"} type="checkbox"/>
                            </td>
                            <td key="-1" className='tdmax'>
                                <h3 style={{fontWeight: 400, paddingLeft:10, paddingRight: 10, paddingTop:2, paddingBottom:2, userSelect: 'none'}}>{key}</h3>
                            </td>
                            {tableData[key].map((item, i) => {
                                if (item.startsWith("wcp_")){
                                    return(
                                        <td style={{fontWeight: 400, paddingLeft:10, paddingRight: 10, paddingTop:2, paddingBottom:2, userSelect: 'none'}} key={String(i)}>
                                            <WebClipSelector metadata={metaData[key]} tabledata={tableData} sn={key} possibleWC={possibleWC}/>
                                        </td>
                                    )
                                } else if (item.startsWith("app_")){
                                    return(
                                        <td style={{fontWeight: 400, paddingLeft:10, paddingRight: 10, paddingTop:2, paddingBottom:2, userSelect: 'none'}} key={String(i)}>
                                            <AppSelector uuid={metaData[key]["common.uuid"] ?? ""} tabledata={tableData} sn={key} possibleApps={possibleApps}/>
                                        </td>
                                    )
                                } else if (item.startsWith("uuid_")){
                                    return;
                                } else if (item.startsWith("fromuser_")){
                                    return;
                                }

                                return(
                                    <td key={String(i)} className='tdmax'>
                                        <h3 style={{fontWeight: 400, paddingLeft:10, paddingRight: 10, paddingTop:2, paddingBottom:2, userSelect: "none"}}>{item}</h3>
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
        (!isPreview && isAdding) && <Adding metadata={metaData} setmetadata={setMetaData} reqtype={reqType.current ?? ""} close={()=>{setAdding(false)}} tabledata={tableData}
        settabledata={setData} count={numberOfDevices}/>
    }
    </>)
}