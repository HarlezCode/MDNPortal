import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultTitle, DefaultWrapper } from "./components";


export default function Edit(){
    const [tableData, setData] = useState({} as {[index : string]: string[]});
    const [update, setUpdate] = useState(true);
    const nav = useNavigate();
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
        <div>
        <table className="table-fixed mx-auto border-separate border-spacing-2 border-spacing-x-0 p-2 bg-slate-600 hover:bg-slate-700 overflow-y rounded mt-5">
            <thead>
                <tr>
                    <th></th>
                    <th>SN</th>
                    { 
                        tableData["Headers"].map((item,i) => {
                            return (<th key={i}>{item}</th>)
                        })
                    }
                </tr>
            </thead>
            <tbody>
                 {Object.keys(tableData).map((key) => {
                    if (key == "RequestType" || key == "Headers" || key == "HasDevices"){
                        return;
                    }
                    return (
                        <tr key={key + "_r"} className="hover:bg-slate-500">
                            <td key={key+"_check"}>
                                <input type="checkbox"/>
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
    </DefaultWrapper>
    </>)
}