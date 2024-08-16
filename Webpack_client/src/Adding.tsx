import React from 'react'
import {useState, FormEvent, useRef} from 'react'
import './components.css'
import { getDeviceInfo, getDeviceType } from './serverActions';
const clusters = [
    'HKEC',
    'HKWC',
    'KEC',
    'KWC',
    'KCC',
    'NTEC',
    'NTWC',
    'HAHO'
];

async function llfetch(reqType : string, count : number[], entries : string, errors : string[], newData : {[index : string]: string[]}, newMetaData : {[index : string] : {[index : string] : string}}){
    const entry = entries.split(",");
    if (entry[0].length == 0 || entry[1].length == 0){
        return;
    }

    if (newData[entry[0]] != null && newData[entry[0]] != ([] as string[])){
        return;
    }

    console.log(newData);
    console.log(entries);
    if (reqType == "Look for last location"){
        if (entry.length != 2){
            return;
        }
        const res = await getDeviceInfo(entry[0]);
        if (res["error"] != ""){
            errors.push(res["error"]);
            return;
        }

        const devicetype = await getDeviceType(res["data"][0]["common.uuid"]);
        if (devicetype == "error"){
            errors.push("Could not get identify device type for " + entry[0]);
            return;
        }
        newData[entry[0]] = [] as string[];
        newData[entry[0]].push(devicetype);
        // validate mac address here
        newData[entry[0]].push(entry[1]);
        newData[entry[0]].push("uuid_" + res["data"][0]["common.uuid"]);
        newMetaData[entries] = res["data"][0];
    } else {
        if (entry.length != 3){
            return;
        }
        // validate dtype & cluster
        if (!clusters.includes(entry[1].toUpperCase())){
            errors.push("Invalid Cluster For SN: " + entry[0]);
            return;
        } else if (!["CORP", "COPE", "OUD"].includes(entry[2].toUpperCase())){
            errors.push("Invalid Device Type For SN: " + entry[0]);
            return;
        }

        // enroll device
        newData[entry[0]] = [] as string[];
        newData[entry[0]].push(entry[2].toUpperCase()); // dtype
        newData[entry[0]].push(entry[1].toUpperCase()); // cluster
    }
    
    count[0]++;
}

async function nmfetch(reqtype : string, count : number[],entry : string, errors : string[], newData : {[index : string]: string[]}, newMetaData : {[index : string] : {[index : string] : string}}, changeType : string = ''){
    if (entry == ''){
        return;
    }
    if (newData[entry] != null && newData[entry] != ([] as string[])){
        return;
    }
   
    // api calls here                    
    const res = await getDeviceInfo(entry);
    if (res["error"] != ""){
        errors.push(res["error"]);
        return;
    }

    const devicetype = await getDeviceType(res["data"][0]["common.uuid"]);
    if (devicetype == "error"){
        errors.push("Could not get identify device type for " + entry);
        return;
    }

    newData[entry] = [] as string[];
    newData[entry].push(devicetype);
    newMetaData[entry] = res["data"][0];

    if (reqtype == "Add Webclip"){
        newData[entry].push("wcp_Webclip"); // default value 
    } else if (reqtype == "App Update"){
        newData[entry].push("app_App"); // default value
    } else if (reqtype == "Change of Device Type"){
        newData[entry].push(changeType);
    }
    if (reqtype != "Add new device record"){
        newData[entry].push("uuid_" + res["data"][0]["common.uuid"]);
    }

    count[0]++;
}



export default function Adding({reqtype, close, tabledata, settabledata, count, metadata, setmetadata} : {reqtype : string, close : () => void, tabledata : {[index : string] : string[]}, settabledata : (data : {[index : string] : string[]}) => void, count : React.MutableRefObject<number>, metadata : {[index : string] : {[index : string] : string}}, setmetadata : (data : {[index : string] : {[index : string] : string}})=>void}){
    const [textArea, setText] = useState("");
    const importing = useRef(false);

    if (reqtype == "Look for last location" || reqtype=="Add new device record"){
        return (<div><form onSubmit={
            async (event : FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (importing.current){
                    // we do checks here
                    const curString = (localStorage.getItem("SN") ?? "").split("\n");
                    const arr = textArea.split("\n");
                    let discardedCount = 0;
                    for (let i =0; i<arr.length;i++){
                        arr[i] = arr[i].trim();
                        const temp = arr[i].split(",");
                        if (reqtype == "Look for last location"){
                            if (temp.length == 2){
                                if (temp[0].length > 0 && temp[1].length > 0 && !curString.includes(temp[0])){
                                    curString.push(temp[0]);
                                } else {
                                    discardedCount++;
                                }
                            } else {
                                if (temp.length == 1){
                                    if (temp[0] == ''){
                                        continue;
                                    }
                                }
                                discardedCount++;
                            }
                        } else {
                            if (temp.length == 3){
                                if (temp[0].length > 0 && temp[1].length > 0 && !curString.includes(temp[0])){
                                    curString.push(temp[0]);
                                } else {
                                    discardedCount++;
                                }
                            } else {
                                if (temp.length == 1){
                                    if (temp[0] == ''){
                                        continue;
                                    }
                                }
                                discardedCount++;
                            }
                        }
                    }
                    const errors = [] as string[];
                    const newMetaData = JSON.parse(JSON.stringify(metadata));
                    const newData = JSON.parse(JSON.stringify(tabledata))
                    const newCounts = [0];
                    const promises = arr.map( async (val : string) =>
                        llfetch(reqtype,newCounts,val,errors,newData,newMetaData)
                    );

                    await Promise.all(promises);

                    setmetadata(newMetaData);
                    settabledata(newData);
                    count.current += newCounts[0];
                    localStorage.setItem("SN", curString.join("\n"));
                    if (errors.length > 0){
                        alert(errors.join("\n"));
                    }
                    close();
                    if (discardedCount > 0){
                        alert("Some entries were discarded due to input format error or already in the table.");
                    }
                }
            }
        }><div className='addingdiv'></div><div className="addingdiv2">
            <div className="addingdiv3">
                
                <div className="importheader"><span>Import</span></div>
                <input type="file" accept=".txt" className="mt" style={{marginBottom: '20px'}} onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
                    const reader = new FileReader();
                    reader.onload = async (e : ProgressEvent<FileReader>) =>{
                        const text = (e.target?.result as string);
                        const arr = text.split("\r\n");
                        const finalArr = [] as string[];
                        for (let i =0; i < arr.length; i++){
                            arr[i] = arr[i].trim();
                            const l = arr[i].split(",");
                            if (l.length == 2){
                                finalArr.push(l.join(","));
                            }
                        }
                        
                        setText(finalArr.join("\n"));
    
                    }
                    const targets = e.target.files ?? null;
                    if (targets == null) return;
                    const target = targets[0];

                    if (target.name.endsWith(".txt")){
                        reader.readAsText(target);
                    } else {
                        alert("This is not a txt file.");
                    }
    
                }}/>
                <div className="flex-1"><b style={{color: "black"}}>{reqtype=="Look for last location" ? <>SN & MAC of device(s):</> : <>SN & Cluster of device(s) & Type:</> }</b><textarea readOnly={false} style={{resize: "none", color: "black"}} placeholder={'Eg. 123,' + (reqtype == "Look for last location" ? "mcl1112" : "HAHO,CORP")} value={textArea} onChange={(e)=>{setText(e.currentTarget.value)}} className="sntextarea2" name="snDevices"/></div>
    
                <div>
                    <button className="mr2" onClick={() =>{importing.current = false; close()}}>Close</button>
                    <button className="mr2" onClick={() =>{
                        importing.current = true;
                    }}>Import</button>
                </div>
                
                </div>
            </div>
            </form>
        </div>);
    }


    return (<div><form onSubmit={  
        async (event : FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // err check here
            if (reqtype == "Change of Device Type" && importing.current){
                if (event.currentTarget.changeType.value == ""){
                    alert("Please select a type to change to!")
                    return;
                }
            }

             
            if (importing.current){
                // we do checks here
                const curString = (localStorage.getItem("SN") ?? "").split("\n");
                let arr = textArea.split("\n");
                const errors = [] as string [];
                for (let i =0; i<arr.length;i++){
                    arr[i] = arr[i].trim();
                    if (!curString.includes(arr[i]) && arr[i].length > 0){
                        curString.push(arr[i]);
                    }
                }
                const newData = JSON.parse(JSON.stringify(tabledata))
                const newMetaData = JSON.parse(JSON.stringify(metadata));
                const newCounts = [0];
                const st = performance.now();
                const promises = arr.map(async (val : string) =>{
                    if (reqtype == "Change of Device Type"){
                        await nmfetch(reqtype, newCounts,val,errors,newData,newMetaData,event.currentTarget.changeType.value);
                    } else {
                        await nmfetch(reqtype, newCounts,val,errors,newData,newMetaData);
                    }
                });
                await Promise.all(promises).then(()=>console.log("complete"));

                console.log(performance.now()-st);
                count.current += newCounts[0];

                setmetadata(newMetaData);
                settabledata(newData);
                

                localStorage.setItem("SN", curString.join("\n"));
                if (errors.length  > 0){
                    alert(errors.join("\n"));
                }
                close();
            }
        }
    }><div className='addingdiv'></div><div className="addingdiv2">
        <div className="addingdiv3">
            
            <div className="importheader"><span>Import</span></div>
            <input type="file" accept=".txt" onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
                const reader = new FileReader();
                reader.onload = async (e : ProgressEvent<FileReader>) =>{
                    const text = (e.target?.result as string);
                    
                    const arr = text.split("\r\n");
                    for (let i =0; i < arr.length; i++){
                        arr[i] = arr[i].trim()
                    }
                    setText(arr.join("\n"));

                }

                const targets = e.target.files ?? null;
                if (targets == null) return;
                const target = targets[0];

                if (target.name.endsWith(".txt")){
                    reader.readAsText(target);
                } else {
                    alert("This is not a txt file.");
                }

            }} className="mt"/>
            <div className="griddy mt" style={{color: "black"}}><b>SN of device(s)</b><textarea readOnly={false} style={{resize: "none", color: "black"}} value={textArea} onChange={(e)=>{setText(e.currentTarget.value)}} className="sntextarea" name="snDevices"/></div>
            {reqtype == "Change of Device Type" && <div className='flex mb3'>
                <h3><b style={{color: 'black'}}>Change To </b></h3>
                <select name="changeType" className='typeselect'>
                    <option value="">--  Select  --</option>
                    <option value="CORP">CORP</option>
                    <option value="OUD">OUD</option>
                    <option value="COPE">COPE</option>
                </select>
            </div>}
            <div className="mt">
                <button className="mr2" onClick={() =>{importing.current = false; close()}}>Close</button>
                <button className="mr2" onClick={() =>{
                    importing.current = true;
                }}>Import</button>
            </div>
            
            </div>
        </div>
        </form>
    </div>);
}