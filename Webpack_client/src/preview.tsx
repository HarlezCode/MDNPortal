import React from 'react'
import { useNavigate } from "react-router-dom";
import { DefaultTitle } from "./components";
import "./components.css"


async function submitFunc(data : {[index : string]: string[]}, close : () => void, nav : (addr : string) => void){
    //need to do item checks here eg. webclip unselected and give error if some are not selected.
    //for adding removing vpn, need to check if vpn exists or not and warn the user correspondingly.
    //for add/remove trial cert, need to check for existence and warn the user correspondingly.
    // prepare api call here as well
    await fetch("http://localhost:5000/api/addrequests", {headers : {"key" : localStorage.getItem("Token") ?? "", "fromuser" : "user_" + localStorage.getItem("Token"), 'Accept' : 'application/json', 'Content-Type' : 'application/json'}, method : "POST", body : JSON.stringify(data)}).then((res) =>{
        res.json().then((res) =>{
            if (res["res"] == "error"){
                nav("../response?res=error&data="+res["error"])
            } else if (res["res"] == "ok"){
                if (res["data"].length > 0){
                    nav("../response?res=ok&data=" + JSON.stringify(res["data"]));
                    return;
                } 
                nav("../response?res=ok");
            } else if (res["res"] == "invalid"){
                // need to test this
                console.log("invalid data");
                console.log(res);
            }
        })
        close();
    }).catch(()=>{
        nav("../response?res=error&data="+"The+server+is+not+responsive.");
        close();        
    });
}

export default function Preview({previewFunc, data} : {previewFunc : (val : boolean) => void, data : {[index : string] : string[]}}){
    const nav = useNavigate();
    return(<>
        <div><div className='addingdiv'></div><div className="previewdiv3">
            <div className="flex-1 previewdiv">
                <div>
                    <DefaultTitle>Preview</DefaultTitle>
                </div>
                <div className="previewdiv2">
                <table className="flex-1 previewtable">
                    <thead>
                        <tr style={{color: "black"}}>
                            <th>SN</th>
                            {data["Headers"].map((v : string) => {
                                return (<th key={v+"_header"}>{v}</th>);
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {
                        Object.keys(data).map((k : string) =>{
                            if (k != "Headers" && k != "RequestType" && !k.startsWith("data_")){
                            return (<tr key={k+"preview"}>
                                <td style={{color: "black"}}>{k}</td>
                                {data[k].map((val : string)=>{
                                    if (val.startsWith("uuid_")){
                                        return;
                                    }
                                    if (val.startsWith("wcp_") || val.startsWith("app_")){
                                        return (<td style={{color: "black"}}>{val.substring(4)}</td>)
                                    }
                                    return (<td style={{color: "black"}}>{val}</td>)
                                })}
                                </tr>
                                )
                            } else {
                                return;
                            }
                        }
                        )

                    }
                    </tbody>
                </table>
                </div>
                <div className="previewbuttondiv">
                    <div><button onClick={()=>previewFunc(false)}>Close</button></div>
                    <div><button onClick={()=>submitFunc(data, ()=>{previewFunc(false)}, nav)}>Submit</button></div>
                </div>
            </div>
            </div>
        </div>
    
    </>)
}