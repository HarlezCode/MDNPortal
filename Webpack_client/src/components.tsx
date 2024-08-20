import React from 'react'
import {useEffect, useState, useRef} from 'react';
import { fetchWebClips, fetchApps } from './serverActions';
import "./components.css"

export function DefaultWrapper({children} : any){
    return(<div className="wrapper">
            {children}
        </div>)
}
export function Wrapper({children} : any){
    return(<div className="wrapper2">
            {children}
        </div>)
}
export function DefaultInput({id} : {id : string}){
    return(<input className="dinput" name={id}/>)
}

export function BackButton({nav} : {nav : (addr : string) => void }){
    return(<button className="backbutton" onClick={
        () =>{
            nav("../req");
        }
    }>Back</button>)
}

export function DefaultTitle({children} : any){
    return(<b><h3 style={{fontSize: "2.5rem", fontWeight: 400, lineHeight: "2rem", color:"black"}}>{children}</h3></b>)
}

export function WebClipSelector({sn, tabledata, possibleWC, metadata} : {sn : string, tabledata : {[index : string] : string[]}, possibleWC : React.MutableRefObject<{[index : string] : string[]}>, metadata : {[index : string] : string}}){
    const [webClips, setWebClips] = useState([] as string[]);
    const snNumber = useRef(sn);
    const allowFetch = useRef(true);
    useEffect(() =>{
        if (sn != "" && allowFetch.current){
            snNumber.current = sn;
            const fetchData = async () =>{
                await fetchWebClips(metadata, tabledata[sn]).then((res)=>{
                    console.log(res);
                    if (res["error"] == ""){
                        if (res["data"].length == 0){
                            setWebClips(["error","No webclips"]);
                        } else {
                            setWebClips(res["data"]);
                        }
                        possibleWC.current[snNumber.current] = res["data"]; 
                    } else {
                        setWebClips(["error", res["error"]]);
                        possibleWC.current[snNumber.current] = [];
                    }
                });
            }
            fetchData();
            allowFetch.current = false;
        }
    });

    return(<>
        <select className="webclipselector" value={function(){
            for (let i = 0; i < tabledata[snNumber.current].length; i++){
                if (tabledata[snNumber.current][i].startsWith("wcp_")){
                    return tabledata[snNumber.current][i];
                }
            }
        }()} onChange={(e : React.ChangeEvent<HTMLSelectElement>) =>{
            if (e.currentTarget.value != "" && tabledata[snNumber.current] != null){
                for (let i = 0; i < tabledata[snNumber.current].length; i++){
                    if (tabledata[snNumber.current][i].startsWith("wcp_")){
                        tabledata[snNumber.current][i] = e.currentTarget.value;
                    }
                }

            }
        }}>
            {
                (webClips[0] == "error" && webClips.length == 2) && <><option value="">Error CLICK ME</option>

                <option value="">
                    {webClips[1]}
                </option>   
                </>
            }


            {(webClips[0] != "error") && <><option value="" >select</option>
            {webClips.map((item : string) =>{
                if (item.length >= 4){
                    return(
                        <option className="bg-slate-700 select-none" value={item} key={sn +" "+item}>
                            {item.slice(4)}
                        </option>
                    )
                }   
                return;
            })}</>}
        </select>
    </>);


}


export function AppSelector({sn, tabledata, possibleApps, uuid} : {sn : string, tabledata : {[index : string] : string[]}, possibleApps : React.MutableRefObject<{[index : string] : string[]}>, uuid : string}){
    const [apps, setApps] = useState([] as string[]);
    const snNumber = useRef(sn);
    useEffect(() =>{
        if (sn != "" && apps.length == 0){
            snNumber.current  = sn;
            const fetchData = async () =>{
                await fetchApps(uuid, tabledata[sn][3]).then((res : string[])=>{
                    possibleApps.current[snNumber.current] = [];
                    if (res.length == 0){
                        setApps(["No Apps!"]);
                        return;
                    } else if (res[0] == "error"){
                        setApps(["Error"]);
                        return;
                    }

                    setApps(res);
                    possibleApps.current[snNumber.current] = res; 
                });
            }
            fetchData();
        }
    });

    return(<>
        <select className="appselector" value={function(){
            for (let i =0; i < tabledata[snNumber.current].length; i++){
                if (tabledata[snNumber.current][i].startsWith("app_")){
                    return tabledata[snNumber.current][i];
                }
            }
        }()} onChange={(e : React.ChangeEvent<HTMLSelectElement>) =>{
            if (e.currentTarget.value != "" && tabledata[snNumber.current] != null){
                for (let i =0; i < tabledata[snNumber.current].length; i++){
                    if (tabledata[snNumber.current][i].startsWith("app_")){
                        tabledata[snNumber.current][i] = e.currentTarget.value;
                    }
                }

            }
        }}>
            {!(apps[0] ?? "").startsWith("app_") &&
            <option value="" >{apps[0]}</option>}


            {(apps[0] ?? "").startsWith("app_") &&
            <option value = "" >select</option>}
            {(apps[0] ?? "").startsWith("app_") && apps.map((item : string) =>{
                if (item.length >= 4){
                    return(
                        <option className="bg-slate-700" value={item} key={sn +" "+item}>
                            {item.slice(4)}
                        </option>
                    )
                }   
                return;
            })}
        </select>
    </>);


}