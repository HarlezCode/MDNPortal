import React, { useState, useRef } from "react";
import { Navbar, Toaster } from "./components";
import "./components.css"

export default function Tools(){
    const [mode, setMode] = useState('none');
    const [attributes, setAttributes] = useState([['','']] as string[][]);
    const [inputs, setInputs] = useState([] as any);
    const [isPreview, setPreview] = useState(true);
    const [toastMsg, setToast] = useState("");
    const [inputValue, setInputValue] = useState("");
    const value = useRef("");
    return (<div>
            <Toaster show={toastMsg != ""} msg={toastMsg}/>
            <Navbar/>
            <div className="flex" style={{position: "absolute", top: "10%", left: "20%"}}>
                <div style={{backgroundColor:"rgb(91, 91, 112)", boxShadow:"10px 5px 5px rgb(100, 80, 105)", borderRadius:"0.5rem",padding: 20, marginRight: "50px"}}>
                    {mode != "GUUID" && <div className="mbdiv" style={{marginBottom: "20px"}}><h3>Input</h3>{mode != "none" && <input className="inputfilebutton" type="file" accept=".txt" onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
                        const reader = new FileReader();
                        reader.onload = async (e : ProgressEvent<FileReader>) =>{
                            const text = (e.target?.result as string);
                            
                            const arr = text.split("\r\n");
                            for (let i =0; i < arr.length; i++){
                                arr[i] = arr[i].trim()
                            }
                            setInputs(arr);
                        }
                        const targets = e.target.files ?? null;
                        if (targets == null) return;
                        const target = targets[0];

                        if (target.name.endsWith(".txt")){
                            reader.readAsText(target);
                        } else {
                            alert("This is not a txt file.");
                        }
                    }}/>}</div>}
                    <div style={{marginBottom: "20px"}}>
                        <h3>Select request</h3>
                        <select className="mrdiv mbdiv" style={{backgroundColor: "white", color: "black", border: "none"}} onChange={(e : any)=>{
                            setInputs([]);
                            value.current = "";
                            setInputValue("");
                            setMode(e.currentTarget.value);
                            setPreview(true);
                        }}>
                        <option value="none">-- Select -- </option>
                        <option value="SCAttr">Set Custom Attributes</option>
                    </select></div>
                    <div className="mrdiv">
                        <hr/>
                        <h3 className="mbdiv">Configurations</h3>
                        <hr/>
                        {mode =="SCAttr" &&
                            <div>
                                <div> 
                                    <div style={{display:"flex", marginLeft: 20, marginBottom: 20}}><h3 style={{marginTop: 10}}>Attributes</h3>
                                        <button className="logoutbut" style={{
                                            marginLeft: 20,
                                            paddingLeft: 20,
                                            paddingRight: 20,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            marginTop: 5,
                                            marginBottom: 5,
                                            borderRadius: 4
                                        }} onClick={() =>{
                                            const temp = JSON.parse(JSON.stringify(attributes));
                                            temp.push(["",""]);
                                            setAttributes(temp);
                                        }}>Add row</button>
                                        <h3 style={{marginTop: 10, marginLeft: 20}}>Import </h3>
                                        <input type="file" style={{marginLeft: 20, marginTop: 10}} className="inputfilebutton"/>
                                    </div>
                                    <div style={{ maxHeight: "200px", overflowY: "auto"}}>
                                    <table style={{marginLeft: "auto", marginRight: "auto"}}>
                                        <thead>
                                            <tr>
                                                <th>Key</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            
                                            {
                                                attributes.map((value : string[], index : number) =>{
                                                    return(
                                                        <tr key={index}>
                                                            <td style={{paddingRight: 20, paddingBottom: "10px"}}>
                                                                <input name={"trattk"+index} style={{backgroundColor: "white", color: "black", border: "none"}} value={value[0] ?? ""} onChange={(e : any)=>{
                                                                    const temp = JSON.parse(JSON.stringify(attributes));
                                                                    temp[parseInt((e.currentTarget.name as string).slice(6))] = [e.currentTarget.value, temp[parseInt(e.currentTarget.name.slice(6))][1]];
                                                                    setAttributes(temp);
                                                                }}/>
                                                            </td>
                                                            <td style={{paddingBottom: "10px"}}>
                                                                <input name={"trattv"+index} style={{backgroundColor: "white", color: "black", border: "none"}} value={value[1] ?? ""} onChange={(e : any) =>{
                                                                    const temp = JSON.parse(JSON.stringify(attributes));
                                                                    temp[parseInt((e.currentTarget.name as string).slice(6))] = [temp[parseInt(e.currentTarget.name.slice(6))][0], e.currentTarget.value];
                                                                    setAttributes(temp);

                                                                }}/>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {isPreview &&
                <div style={{backgroundColor: "rgb(91, 91, 112)", padding: 20, minWidth: "400px", borderRadius: 7,marginRight:"50px", boxShadow: "10px 5px 5px rgb(90, 80, 105)"}}>
                    <h3>Preview</h3>
                    <hr/>
                    {
                        mode == "SCAttr" && 
                            <div>
                                <div>
                                    <h3>
                                        Attributes
                                    </h3>
                                    <ul style={{listStyleType: "none", overflowY: "auto", maxHeight: "150px"}}>
                                        {
                                            attributes.map((val : any) =>{
                                                if (val[0] == ""){
                                                    return;
                                                }
                                                return (<li>
                                                    {val[0]} : {val[1]}
                                                </li>)
                                            })
                                        }
                                    </ul>
                                </div>
                                <div>
                                        <h3>
                                            Applying to UUIDS
                                        </h3>
                                        <ul style={{listStyleType: "none", overflowY: "auto", maxHeight: "200px"}}>
                                            {
                                                inputs.map((val: any) =>{
                                                    return (
                                                        <li>
                                                            {val}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                </div>

                            </div>
                    }
                    <button className="logoutbut" style={{marginTop:"10px"}} onClick={()=>{
                        // api calls here for every req & check params here
                        if (mode == "none"){
                            setToast("Please Select a Request Type!");
                            setTimeout(()=>{setToast("")}, 3000);
                            return;
                        } else if (mode == "SCAttr"){

                        } else if (mode == "SLabels"){
                            
                        }
                        setPreview(false);
                    }}>Process</button>
                </div>}
                {!isPreview &&
                <div style={{backgroundColor: "rgb(91, 91, 112)", padding: 20, minWidth: "400px", borderRadius: 7, boxShadow: "10px 5px 5px rgb(90, 80, 105)"}}>
                    <div style={{display: 'flex'}}>
                        <button className="logoutbut" onClick={()=>{setPreview(true);}}>Back</button>
                        <h3 style={{margin: 'auto'}}>Response</h3>
                    </div>
                    <hr/>

                </div>}
            </div>
    </div>);
}