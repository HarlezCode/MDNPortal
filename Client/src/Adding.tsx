import {useState, FormEvent, useRef} from 'react'
export default function Adding({reqtype, close, tabledata, settabledata, count} : {reqtype : string, close : any, tabledata : any, settabledata : any, count : any}){
    const [textArea, setText] = useState("");
    const importing = useRef(false);

    if (reqtype == "Add 4G VPN Profile" ||
        reqtype == "Add Trial Certificate" ||
        reqtype == "Remove 4G VPN profile" ||
        reqtype == "Add new device record" ||
        reqtype == "Remove Trial Certificate"){

        return (<div><form onSubmit={
            (event : FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (importing.current){
                    // we do checks here
                    const curString = (localStorage.getItem("SN") ?? "").split("\n");
                    const arr = textArea.split("\n");
                    for (let i =0; i<arr.length;i++){
                        arr[i] = arr[i].trim();
                        curString.push(arr[i]);
                    }
                    const newData = JSON.parse(JSON.stringify(tabledata))
                    for (let i =0; i<arr.length;i++){
                        if (newData[arr[i]] != null && newData[arr[i]] != ([] as string[])){
                            continue;
                        }
                        newData[arr[i]] = [] as string[];
                        // api calls here
                        newData[arr[i]].push("CORP");
                        newData[arr[i]].push("Yes");
                        count.current++;
                    }
                    console.log(newData);
                    settabledata(newData);
                    localStorage.setItem("SN", curString.join("\n"));
                    
                    
                }
            }
        }><div className='h-screen w-screen bg-gray-900 opacity-50 absolute bottom-0 left-0'></div><div className="bottom-[0%] left-[38%] top-[20%] w-[25%] mx-[0%] absolute">
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
    return (<></>);
}