import {useEffect, useState, useRef} from 'react';
import { fetchWebClips, fetchApps } from './serverActions';

export function DefaultWrapper({children} : any){
    return(<div className="absolute left-[25%] w-[50%] top-[10%] border-solid border-4 mt-[1%] pt-[2%] border-blue-900 flex-1 col-1 bg-slate-300 pb-10 px-10 space-y-[10%] shadow-xl rounded place-item-center">
            {children}
        </div>)
}
export function DefaultInput({id} : {id : string}){
    return(<input className="bg-slate-100 text-slate-900 border-blue-800 border-2 rounded"name={id}/>)
}

export function BackButton({nav} : {nav : any}){
    return(<button className="mt-[4%] bg-slate-700" onClick={
        () =>{
            nav("../req");
        }
    }>Back</button>)
}

export function DefaultTitle({children} : any){
    return(<b><h3 className="text-2xl text-slate-900">{children}</h3></b>)
}

export function WebClipSelector({sn, tabledata, possibleWC} : {sn : string, tabledata : {[index : string] : string[]}, possibleWC : any}){
    //fetch from mobileiron here for each sn using a server action

    const [webClips, setWebClips] = useState([] as string[]);
    const snNumber = useRef(sn);
    const allowFetch = useRef(true);
    useEffect(() =>{
        if (sn != "" && allowFetch.current){
            snNumber.current  = sn;
            const fetchData = async () =>{
                await fetchWebClips(sn).then((res)=>{
                    setWebClips(res);
                    possibleWC.current[snNumber.current] = res; 
                });
            }
            fetchData();
            allowFetch.current = false;
        }
    });

    return(<>
        <select className="bg-slate-700 rounded pl-[4%] w-[60%] overflow-x-hidden select-none" value={function(){
            for (let i =0; i < tabledata[snNumber.current].length; i++){
                if (tabledata[snNumber.current][i].startsWith("wcp_")){
                    return tabledata[snNumber.current][i];
                }
            }
        }()} onChange={(e : any) =>{
            if (e.currentTarget.value != "" && tabledata[snNumber.current] != null){
                for (let i =0; i < tabledata[snNumber.current].length; i++){
                    if (tabledata[snNumber.current][i].startsWith("wcp_")){
                        tabledata[snNumber.current][i] = e.currentTarget.value;
                    }
                }

            }
        }}>
            <option value="" >select</option>
            {webClips.map((item) =>{
                if (item.length >= 4){
                    return(
                        <option className="bg-slate-700 select-none" value={item} key={sn +" "+item}>
                            {item.slice(4)}
                        </option>
                    )
                }   
                return;
            })}
        </select>
    </>);


}


export function AppSelector({sn, tabledata, possibleApps} : {sn : string, tabledata : {[index : string] : string[]}, possibleApps : any}){
    //fetch from mobileiron here for each sn using a server action

    const [apps, setApps] = useState([] as string[]);
    const snNumber = useRef(sn);
    useEffect(() =>{
        if (sn != "" && apps.length == 0){
            snNumber.current  = sn;
            const fetchData = async () =>{
                await fetchApps(sn).then((res)=>{
                    setApps(res);
                    possibleApps.current[snNumber.current] = res; 
                });
            }
            fetchData();
        }
    });

    return(<>
        <select className="bg-slate-700 rounded pl-[4%] w-[60%] overflow-x-hidden select-none" value={function(){
            for (let i =0; i < tabledata[snNumber.current].length; i++){
                if (tabledata[snNumber.current][i].startsWith("app_")){
                    return tabledata[snNumber.current][i];
                }
            }
        }()} onChange={(e : any) =>{
            if (e.currentTarget.value != "" && tabledata[snNumber.current] != null){
                for (let i =0; i < tabledata[snNumber.current].length; i++){
                    if (tabledata[snNumber.current][i].startsWith("app_")){
                        tabledata[snNumber.current][i] = e.currentTarget.value;
                    }
                }

            }
        }}>
            <option value="" >select</option>
            {apps.map((item) =>{
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