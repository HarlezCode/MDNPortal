import React, { useState } from "react";
import "./components.css"
import { Navbar } from "./components";

export default function Tools(){
    const [mode, setMode] = useState('none');
    return (<div>
            <Navbar/>
            <div className="flex">
                <div>
                    <div className="mbdiv"><h3>Input</h3><input type="file"/></div>
                    <select className="mrdiv mbdiv" onChange={(e : any)=>{
                            setMode(e.currentTarget.value);
                        }}>
                        <option value="" >-- Select -- </option>
                        <option value="SCAttr">Set Custom Attributes</option>
                        <option value="GCAttr">Get Custom Attributes</option>
                    </select>
                    <div className="mrdiv">
                        <h3 className="mbdiv">Config</h3>
                        {mode =="SCAttr" &&
                            <div>
                                Some stuff
                            </div>
                        }
                        {
                            mode == "GCAttr" &&
                            <div>
                                Some stuff 2
                            </div>
                        }
                    </div>
                </div>
                <div className="flex" style={{position:"absolute",left:1200, top:120}}>
                    <button style={{position: "relative",marginRight: 10, height: "3rem"}}>
                        Process
                    </button>
                    <button style={{height: "3rem"}}>
                        Export
                    </button>
                </div>
                <div style={{marginRight: 100}}>
                    <h3>Preview</h3>
                </div>
                <div style={{marginRight: 100}}>
                    <h3>Output</h3>
                </div>
                
            </div>
    </div>);
}