import React from 'react';
import { FormEvent, useState } from "react";
import { addWebclips } from "./serverActions";
import Loading from "./loading";
/*
The component for adding webclips
*/
export default function AddWebclips({close, setRefresh} : {close : (val : boolean)=>void, setRefresh : (val : boolean)=>void}){
    const [loading, setLoading] = useState(false);
    return(
        <div>
            
            <div className='coverscreen' style={{top:0, left:0}}></div>
            <form onSubmit={(e : FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                addWebclips(e).then((res : boolean)=>{
                    setLoading(false); 
                    if (res){
                        close(false);
                        setRefresh(true);
                    }
                });
                setLoading(true);
            }}>
            <div className='relative bg-rose-600' style={{width: 1000, height: 700}}>
                <div className="addwebclipdiv">
                    <button className="bg-rose-500 defaultbutton" style={{paddingLeft:"2.5rem",paddingRight:"2.5rem"}} onClick={()=>{close(false);setRefresh(true);}}>Close</button>
                </div>
                <div className="bg-rose-700 addwebclipdiv2">
                    <div className="addwebclipdiv3 mbdiv"><h3 className="h3default">Models: </h3><input className="defaultinputs2" name="model" placeholder="Eg. Ipad, ipod"/></div>
                    <div className="flex justify-center mbdiv">
                        <h3 className="h3default"style={{marginTop: "53px"}}>Device Types: </h3>
                        <div className='mrdiv'><h3 className="h3default">Corp </h3><input className="bg-white" name="CORP" type="checkbox"/></div>
                        <div className='mrdiv'><h3 className="h3default">Oud </h3><input className="bg-white" name="OUD" type="checkbox"/></div>
                        <div className=''><h3 className="h3default">Cope </h3><input className="bg-white" name="COPE" type="checkbox"/></div>
                    </div>
                    <div className="flex justify-center mbdiv"><h3 className="h3default">Platform: </h3><input className="defaultinputs2" name="platform" placeholder="Eg. IOS, ANDROID"/></div>
                    <div className="flex justify-center mbdiv"><h3 className="h3default">Os versions: </h3><input className="defaultinputs2" name="os" placeholder="Only use for one platform"/></div>
                    <div className="flex justify-center mbdiv"><h3 className="h3default">Webclip: </h3><input required={true} className="defaultinputs2" name="webclip" placeholder="Eg. Clip1"/></div>
                    <div className="flex justify-center mbdiv"><h3 className="h3default">Labels: </h3><input required={true} className="defaultinputs2" name="labels" placeholder="Eg. label 1, label 2"/></div>
                    <div className="flex justify-center mbdiv"><h3 className="h3default">Labelids: </h3><input required={true} className="defaultinputs2" name="labelids" placeholder="Eg. 32,53"/></div>
                    <div className='flex justify-center mbdiv'>
                        <h3 className='h3default' style={{marginRight: "1rem"}}>Server: </h3>
                        <select name="server" className='mbdiv' style={{paddingRight: "2rem", color: "black"}}>
                            <option value='1' style={{color: "black"}}>MDM-1</option>
                            <option value='0' style={{color: "black"}}>MDM</option>
                        </select>
                    </div>
                    <button className="bg-rose-500 defaultbutton">Submit</button>
                </div>
                <h3 className="relative">* If a field is left empty it will not use that field as requirement.</h3>
                <h3 className="relative">* Please ensure you have selected at least 1 device type.</h3>
            </div>
            </form>
            {   loading && <Loading/>}
        </div>
    )
}