import {useState, FormEvent, useRef} from 'react'
export default function Adding({reqtype, close, tabledata, settabledata, count} : {reqtype : string, close : any, tabledata : any, settabledata : any, count : any}){
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
        }><div className='h-screen w-screen bg-gray-900 opacity-50 absolute top-0 bottom-0 left-0'></div><div className="bottom-[0%] left-[38%] top-[20%] w-[25%] mx-[0%] absolute">
            <div className="bg-slate-400 grid p-[10%] content-start justify-items-middle rounded space-y-4">
                
                <div className="bg-slate-700 p-2"><span className="text-3xl">Import</span></div>
                <input type="file" accept=".txt" onChange={(e : any)=>{
                    const reader = new FileReader();
                    reader.onload = async (e) =>{
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
                    reader.readAsText(e.target.files[0]);
    
                }} className="text-slate-800"/>
                <div className="flex-1"><b className="text-slate-900">SN & MAC of device(s): </b><textarea readOnly={false} style={{resize: "none"}} value={textArea} onChange={(e)=>{setText(e.currentTarget.value)}} className="overflow-y-scroll h-40 w-60 text-slate-900 bg-white border-blue-800 border-2 rounded mt-3 align-top" name="snDevices"/></div>
    
                <div className="space-x-4">
                    <button className="bg-slate-600" onClick={() =>{importing.current = false; close()}}>Close</button>
                    <button className="bg-slate-600" onClick={() =>{
                        importing.current = true;
                    }}>import</button>
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
                const arr = textArea.split("\n");
                for (let i =0; i<arr.length;i++){
                    arr[i] = arr[i].trim();
                    if (!curString.includes(arr[i])){
                        curString.push(arr[i]);
                    }
                }
                const newData = JSON.parse(JSON.stringify(tabledata))
                for (let i =0; i<arr.length;i++){
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
    }><div className='h-screen w-screen bg-gray-900 opacity-50 absolute top-0 bottom-0 left-0'></div><div className="bottom-[0%] left-[38%] top-[20%] w-[25%] mx-[0%] absolute">
        <div className="bg-slate-400 grid p-[10%] content-start justify-items-middle rounded space-y-4">
            
            <div className="bg-slate-700 p-2"><span className="text-3xl">Import</span></div>
            <input type="file" accept=".txt" onChange={(e : any)=>{
                const reader = new FileReader();
                reader.onload = async (e) =>{
                    const text = (e.target?.result as string);
                    
                    const arr = text.split("\r\n");
                    for (let i =0; i < arr.length; i++){
                        arr[i] = arr[i].trim()
                    }
                    setText(arr.join("\n"));

                }
                reader.readAsText(e.target.files[0]);

            }} className="text-slate-800"/>
            <div className="flex-1 col-1 row-1"><b className="text-slate-900">SN of device(s): </b><textarea readOnly={false} style={{resize: "none"}} value={textArea} onChange={(e)=>{setText(e.currentTarget.value)}} className="overflow-y-scroll h-40 text-slate-900 bg-white border-blue-800 border-2 rounded mt-3 align-top" name="snDevices"/></div>
            {reqtype == "Change of Device Type" && <div className='flex space-x-4'>
                <h3><b>Change To: </b></h3>
                <select name="changeType">
                    <option value="">--Select--</option>
                    <option value="CORP">CORP</option>
                    <option value="OUD">OUD</option>
                    <option value="COPE">COPE</option>
                </select>
            </div>}
            <div className="space-x-4">
                <button className="bg-slate-600" onClick={() =>{importing.current = false; close()}}>Close</button>
                <button className="bg-slate-600" onClick={() =>{
                    importing.current = true;
                }}>import</button>
            </div>
            
            </div>
        </div>
        </form>
    </div>);
}