import React from 'react'
import {useState, FormEvent, useRef} from 'react'
import './components.css'
export default function Adding({reqtype, close, tabledata, settabledata, count} : {reqtype : string, close : () => void, tabledata : {[index : string] : string[]}, settabledata : (data : {[index : string] : string[]}) => void, count : React.MutableRefObject<number>}){
    const [textArea, setText] = useState("");
    const importing = useRef(false);

    if (reqtype == "Look for last location"){
        return (<div><form onSubmit={
            (event : FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (importing.current){
                    // we do checks here
                    const curString = (localStorage.getItem("SN") ?? "").split("\n");
                    const arr = textArea.split("\n");
                    let discardedCount = 0;
                    for (let i =0; i<arr.length;i++){
                        arr[i] = arr[i].trim();
                        const temp = arr[i].split(",");
                        if (temp.length == 2){
                            if (temp[0].length > 0 && temp[1].length > 0 && !curString.includes(temp[0])){
                                curString.push(temp[0]);
                            } else {
                                discardedCount++;
                            }
                        } else {
                            discardedCount++;
                        }
                    }
                    
                    const newData = JSON.parse(JSON.stringify(tabledata))
                    for (let i =0; i<arr.length;i++){
                        const entry = arr[i].split(",");
                        if (entry.length != 2){
                            continue;
                        }
                        if (entry[0].length == 0 || entry[1].length == 0){
                            continue;
                        }

                        if (newData[entry[0]] != null && newData[entry[0]] != ([] as string[])){
                            continue;
                        }
                        newData[entry[0]] = [] as string[];
                        // pushing data (fetch here)
                        newData[entry[0]].push("CORP");
                        newData[entry[0]].push(entry[1]);
                        newData[entry[0]].push("uuid_testuuid" + entry[0]);

                        count.current++;
                    }
                    console.log(newData);
                    settabledata(newData);
                    localStorage.setItem("SN", curString.join("\n"));
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
                <div className="flex-1"><b style={{color: "black"}}>SN & MAC of device(s): </b><textarea readOnly={false} style={{resize: "none", color: "black"}} placeholder='Eg. 123,snxxx1111' value={textArea} onChange={(e)=>{setText(e.currentTarget.value)}} className="sntextarea2" name="snDevices"/></div>
    
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
        (event : FormEvent<HTMLFormElement>) => {
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
                for (let i =0; i<arr.length;i++){
                    arr[i] = arr[i].trim();
                    if (!curString.includes(arr[i]) && arr[i].length > 0){
                        curString.push(arr[i]);
                    }
                }
                const newData = JSON.parse(JSON.stringify(tabledata))
                for (let i =0; i<arr.length;i++){
                    if (arr[i] == ''){
                        continue;
                    }
                    if (newData[arr[i]] != null && newData[arr[i]] != ([] as string[])){
                        continue;
                    }
                    newData[arr[i]] = [] as string[];
                    // api calls here
                    // remember add new device record is different
                    if (reqtype.includes("4G VPN") || reqtype.includes("Trial Certificate")){
                        newData[arr[i]].push("CORP");
                        newData[arr[i]].push("Yes");
                    } else if (reqtype == "Retire device"){
                        newData[arr[i]].push("CORP");
                    } else if (reqtype == "Add new device record"){
                        newData[arr[i]].push("CORP");
                        newData[arr[i]].push("Yes");
                    } else if (reqtype == "Add Webclip"){
                        newData[arr[i]].push("CORP");
                        newData[arr[i]].push("wcp_Webclip"); // default value 
                    } else if (reqtype == "App Update"){
                        newData[arr[i]].push("CORP");
                        newData[arr[i]].push("app_App"); // default value
                    } else if (reqtype == "Change of Device Type"){
                        newData[arr[i]].push("CORP");
                        newData[arr[i]].push(event.currentTarget.changeType.value);
                    }
                    if (reqtype != "Add new device record"){
                        newData[arr[i]].push("uuid_testuuid" + arr[i]);
                    }
                    count.current++;
                }
                settabledata(newData);
                localStorage.setItem("SN", curString.join("\n"));
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