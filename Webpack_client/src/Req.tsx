import React from 'react'
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultWrapper } from "./components";
import "./components.css"
const requestTypes : string[] = [
    "Add 4G VPN Profile",
    "Add new device record",
    "Add Trial Certificate",
    "Add Webclip",
    "App Update",
    "Change of Device Type",
    "Look for last location",
    "Remove 4G VPN profile",
    "Remove Trial Certificate",
    "Retire device"
]


export default function Req(){
    const nav = useNavigate();
    return (<>
    <DefaultWrapper>
        <h3 ><b style={{fontSize: "1.5rem", lineHeight: "2rem"}} >Type of Request</b></h3>
        <form className='mt' onSubmit={
            (event : FormEvent<HTMLFormElement>) =>{
                event.preventDefault();
                const val = event.currentTarget.req.value
                switch (val){
                    case "Add 4G VPN Profile": localStorage.setItem("RequestType", "Add 4G VPN Profile"); nav("../edit"); break; 
                    case "Add new device record": localStorage.setItem("RequestType", "Add new device record"); nav("../edit"); break;
                    case "Add Trial Certificate": localStorage.setItem("RequestType", "Add Trial Certificate"); nav("../edit"); break; 
                    case "Add Webclip": localStorage.setItem("RequestType", "Add Webclip"); nav("../edit"); break;
                    case "App Update": localStorage.setItem("RequestType", "App Update"); nav("../edit"); break;
                    case "Change of Device Type": localStorage.setItem("RequestType", "Change of Device Type"); nav("../edit"); break; 
                    case "Look for last location": localStorage.setItem("RequestType", "Look for last location"); nav("../edit"); break;
                    case "Remove 4G VPN profile": localStorage.setItem("RequestType", "Remove 4G VPN profile"); nav("../edit"); break;
                    case "Remove Trial Certificate": localStorage.setItem("RequestType", "Remove Trial Certificate"); nav("../edit"); break; 
                    case "Retire device": localStorage.setItem("RequestType", "Retire device"); nav("../edit"); break;
                    default: alert("Please Select a Request Type"); break;
                }
            }
        }>
        <div>
            <b style={{fontSize: "1rem"}}>Type of Request: </b>
            <select name="req" className="selector">
                <option value="">-- Select -- </option>
                {requestTypes.map((v, i)=>{
                    return (<option key={i} value={v} id={v}>{v}</option>)
                })}
            </select>
        </div>
        <div>
        <button className="defaultbutton">Next</button>
        </div>
        </form>
    </DefaultWrapper>    
    </>)
}