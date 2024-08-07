import React from "react";
import { Navbar, Toaster} from "./components";
import {useRef, useState, useEffect} from 'react';
import {fetchWebclips, updateWebclip} from "./serverActions"
import Loading from "./loading";
import AddWebclips from "./addWebclips";
type ResType = {[key : string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='scrolltd'>{children}</td>)
}


export default function Webclips(){
    const [activeWc, setActive] = useState([] as ResType[]);
    const [inactiveWc, setInactive] = useState([] as ResType[]);
    const [cbState, setCb] = useState({} as {[index : string] : boolean}); 
    const [cbInactiveState, setInactiveCb] = useState({} as {[index : string] : boolean}); 
    const [refresh, setRefresh] = useState(true);
    const [pageOn, setPage] = useState("active");
    const [isAdding, setAdding] = useState(false);
    const isProcess = useRef(false);
    const [toastMsg, setToast] = useState("");

    useEffect(() =>{
        const temp = {} as {[index :string] : boolean};
        activeWc.forEach((val : ResType) =>{
            if (!Object.keys(cbState).includes(val.id.toString())){
                temp[val.id.toString()] = false;
            } else {
                temp[val.id.toString()] = cbState[val.id.toString()];
                
            }

        });
        setCb(temp);
    }, [activeWc]);
    useEffect(() =>{
        const temp = {} as {[index :string] : boolean};
        inactiveWc.forEach((val : ResType) =>{
            if (!Object.keys(cbInactiveState).includes(val.id.toString())){
                temp[val.id.toString()] = false;
            } else {
                temp[val.id.toString()] = cbInactiveState[val.id.toString()];
                
            }

        });
        setInactiveCb(temp);
    }, [inactiveWc]);
    useEffect(()=>{
        // fetch from db
        if (refresh){
            setRefresh(false);
            fetchWebclips("active").then((res: any)=>{
                if (res["res"] == "ok"){
                    setActive(res["data"]);
                }
            });
            fetchWebclips("inactive").then((res: any)=>{
                if (res["res"] == "ok"){
                    setInactive(res["data"]);
                }
            })
        }
    }, [refresh]);


    return (<>
    
    <Toaster show={toastMsg != ""} msg={toastMsg}/>
    <div className="webclipdiv">
        <div className="webclipdiv2">
            <button className="bg-rose-600 selectbutton mrdiv" onClick={() =>{
                if (isProcess.current){
                    return;
                }
                isProcess.current = true;
                if (pageOn=="active"){
                    
                    (async () =>{
                    for (let v=0; v< Object.keys(cbState).length; v++){
                        const val = Object.keys(cbState)[v]
                        if (cbState[val]){
                            let index = -1;
                            for (let i=0; i < activeWc.length; i++){
                                if (activeWc[i].id == val){
                                    index = i;
                                    break
                                }
                            }
                            if (index != -1){
                                await updateWebclip(activeWc[index], "inactive").then((res : any)=>{
                                    if ((res.res ?? "error") == "error"){
                                        setToast("An error has occured.");
                                    } else {
                                        setToast("Webclips deactivated.");
                                    }
                                    setTimeout(()=>{setToast("")}, 3000);
                                });
                            }
                        }
                    }}
                    )().then(()=>{
                        isProcess.current = false;
                        setRefresh(true);
                    })
                } else {
                    (async () =>{
                        for (let v=0; v< Object.keys(cbInactiveState).length; v++){
                            const val = Object.keys(cbInactiveState)[v]
                            if (cbInactiveState[val]){
                                let index = -1;
                                for (let i=0; i < inactiveWc.length; i++){
                                    if (inactiveWc[i].id == val){
                                        index = i;
                                        break
                                    }
                                }
                                if (index != -1){
                                    await updateWebclip(inactiveWc[index], "active").then((res : any) =>{
                                        if ((res.res ?? "error") == "error"){
                                            setToast("An error has occured.");
                                        } else {
                                            setToast("Webclips activated.");
                                        }
                                        setTimeout(()=>{setToast("")}, 3000);
                                    });
                                }
                            }
                        }}
                        )().then(()=>{
                            isProcess.current = false;
                            setRefresh(true);
                        })
                }
                setRefresh(true);
                
            }}>
                {(pageOn=="inactive" ? 'Act' : 'Deact')}ivate Selected
            </button>
            <button className="bg-rose-600 selectbutton mrdiv" onClick={() =>{
                if (isProcess.current){
                    return;
                }
                isProcess.current = true;
                if (pageOn=="active"){
                    
                    (async () =>{
                    for (let v=0; v< Object.keys(cbState).length; v++){
                        const val = Object.keys(cbState)[v]
                        if (cbState[val]){
                            let index = -1;
                            for (let i=0; i < activeWc.length; i++){
                                if (activeWc[i].id == val){
                                    index = i;
                                    break
                                }
                            }
                            if (index != -1){
                                await updateWebclip(activeWc[index], "delete").then((res : any)=>{
                                    if ((res.res ?? "error") == "error"){
                                        setToast("An error has occured.");
                                    } else {
                                        setToast("Webclips deleted.");
                                    }
                                    setTimeout(()=>{setToast("")}, 3000);
                                });
                            }
                        }
                    }}
                    )().then(()=>{
                        isProcess.current = false;
                        setRefresh(true);
                    })
                } else {
                    (async () =>{
                        for (let v=0; v< Object.keys(cbInactiveState).length; v++){
                            const val = Object.keys(cbInactiveState)[v]
                            if (cbInactiveState[val]){
                                let index = -1;
                                for (let i=0; i < inactiveWc.length; i++){
                                    if (inactiveWc[i].id == val){
                                        index = i;
                                        break
                                    }
                                }
                                if (index != -1){
                                    await updateWebclip(inactiveWc[index], "delete").then((res : any) =>{
                                        if ((res.res ?? "error") == "error"){
                                            setToast("An error has occured.");
                                        } else {
                                            setToast("Webclips deleted.");
                                        }
                                        setTimeout(()=>{setToast("")}, 3000);  
                                    });
                                }
                            }
                        }}
                        )().then(()=>{
                            isProcess.current = false;
                            setRefresh(true);
                        })
                }
                setRefresh(true);
                
            }}>
                Delete Selected
            </button>
            <button className="bg-rose-600 selectbutton" onClick={()=>{
                if (!isProcess.current)
                    setAdding(true);
            }}>
                Add Webclips
            </button>
        </div>
    <div className="activetabdiv">
        <div onClick={()=>{setPage("active");setRefresh(true);}} className={(pageOn=="active" ? " bg-rose-700" : " bg-rose-600 activetab")}><h3 className="my1 defaulttext">Active webclips</h3></div>
        <div onClick={()=>{setPage("inactive");setRefresh(true);}} className={(pageOn=="inactive" ? " bg-rose-700" : " bg-rose-600 activetab")}><h3 className="my1 defaulttext">Inactive webclips</h3></div>
    </div>
    <div className="webclipdiv3" >
    <table className='webcliptable bg-rose-700'>
                <thead style={{position: 'sticky', top: 0}} className='bg-rose-700'>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Model</th>
                        <th>Device Type</th>
                        <th>Platform</th>
                        <th>Cluster</th>
                        <th>OS</th>
                        <th>Webclip</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {   (pageOn=="active") &&
                        (activeWc.map((item, i) => {
                            return <tr key={i} id={item.id + "_row"} className={'webcliprow' + ((cbState[item.id] ?? false) ? ' webcliprowstatic' : '')} onClick={(e : any) =>{
                                const key = e.currentTarget.id.slice(0, e.currentTarget.id.length-4) ?? ""
                                const temp = JSON.parse(JSON.stringify(cbState));
                                if (temp[key] != null){
                                    temp[key] = !temp[key];
                                }
                                setCb(temp);
                            }}>
                                <td><input type='checkbox' name={item.id + "_check"} checked={cbState[item.id] ?? false} onChange={(e : any) =>{
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                    const temp = JSON.parse(JSON.stringify(cbState));
                                    if (temp[key] != null){
                                        temp[key] = e.currentTarget.checked;
                                    }
                                    setCb(temp);
                                }}/></td>
                                <td style={{padding:"0.5rem",width:"2.5rem"}}><button className='bg-rose-600 defaultbutton' name={item.id + "_delbut"} onClick={(e : any)=>{
                                    if (isProcess.current){
                                        return;
                                    }
                                    isProcess.current = true;
                                    let found = false;
                                    const key = e.currentTarget.name.slice(0,e.currentTarget.name.length-7);
                                    for (let i=0;i<activeWc.length;i++){
                                        if (activeWc[i].id == key){
                                            found = true;
                                            updateWebclip(activeWc[i], "delete").then((res : any)=>{
                                                isProcess.current = false;
                                                setRefresh(true);
                                                if ((res.res ?? "error") == "error"){
                                                    setToast("An error has occured.");
                                                } else {
                                                    setToast("Webclip deleted.");
                                                }
                                                setTimeout(()=>{setToast("")}, 3000);
                                            });
                                            break;
                                        }
                                    }
                                    if (!found){
                                        isProcess.current = false;
                                    }
                                }}>Delete</button></td>
                                 <td style={{padding:"0.5rem",width:"2.5rem"}}><button className='bg-rose-600 defaultbutton' name={item.id + "_deabut"} onClick={(e : any)=>{
                                    if (isProcess.current){
                                        return;
                                    }
                                    isProcess.current = true;
                                    let found = false;
                                    const key = e.currentTarget.name.slice(0,e.currentTarget.name.length-7);
                                    for (let i=0;i<activeWc.length;i++){
                                        if (activeWc[i].id == key){
                                            updateWebclip(activeWc[i], "inactive").then((res : any)=>{
                                                isProcess.current=false;
                                                setRefresh(true);
                                                if ((res.res ?? "error") == "error"){
                                                    setToast("An error has occured.");
                                                } else {
                                                    setToast("Webclip deactivated.");
                                                }
                                                setTimeout(()=>{setToast("")}, 3000);
                                            });
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found){
                                        isProcess.current = false;
                                    }


                                }}>Deactivate</button></td>
                                
                                <ScrollableTD>{item.model}</ScrollableTD>
                                <ScrollableTD>{item.dtype}</ScrollableTD>
                                <ScrollableTD>{item.platform}</ScrollableTD>
                                <ScrollableTD>{item.clstr}</ScrollableTD>
                                <ScrollableTD>{item.os}</ScrollableTD>
                                <ScrollableTD>{item.webclip}</ScrollableTD>
                            </tr>
                        }))
                    }
                    {
                        (pageOn=="inactive") &&(
                            inactiveWc.map((item, i) => {
                                return <tr key={i} id={item.id + "_row"} className={'webcliprow ' + ((cbInactiveState[item.id] ?? false) ? 'webcliprowstatic' : '')} onClick={(e : any) =>{
                                    const key = e.currentTarget.id.slice(0, e.currentTarget.id.length-4) ?? ""
                                    const temp = JSON.parse(JSON.stringify(cbInactiveState));
                                    if (temp[key] != null){
                                        temp[key] = !temp[key];
                                    }
                                    setInactiveCb(temp);
                                }}>
                                    <td><input type='checkbox' name={item.id + "_check"} checked={cbInactiveState[item.id] ?? false} onChange={(e : any) =>{
                                        const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                        const temp = JSON.parse(JSON.stringify(cbInactiveState));
                                        if (temp[key] != null){
                                            temp[key] = e.currentTarget.checked;
                                        }
                                        setInactiveCb(temp);
                                    }}/></td>
                                    <td style={{padding:"0.5rem",width:"2.5rem"}}><button className='bg-rose-600 defaultbutton' name={item.id + "_delbut"} onClick={(e : any)=>{
                                        if (isProcess.current){
                                            return;
                                        }
                                        isProcess.current = true;
                                        const key = e.currentTarget.name.slice(0,e.currentTarget.name.length-7);
                                        let found = false;
                                        for (let i=0;i<inactiveWc.length;i++){
                                            if (inactiveWc[i].id == key){
                                                updateWebclip(inactiveWc[i], "delete").then((res : any)=>{
                                                    isProcess.current=false; 
                                                    setRefresh(true);
                                                    if ((res.res ?? "error") == "error"){
                                                        setToast("An error has occured.");
                                                    } else {
                                                        setToast("Webclip deleted.");
                                                    }
                                                    setTimeout(()=>{setToast("")}, 3000);
                                                })
                                                found = true;
                                                break;
                                            }
                                        }  
                                        if (!found){
                                            isProcess.current = false;
                                        }
                                    }}>Delete</button></td>
                                     <td style={{padding:"0.5rem",width:"2.5rem"}}><button className='bg-rose-600 defaultbutton' name={item.id + "_actbut"} onClick={(e : any)=>{
                                    if (isProcess.current){
                                        return;
                                    }
                                    isProcess.current = true;
                                    const key = e.currentTarget.name.slice(0,e.currentTarget.name.length-7);
                                    let found = false;
                                    for (let i=0;i<inactiveWc.length;i++){
                                        if (inactiveWc[i].id == key){
                                            found = true;
                                            updateWebclip(inactiveWc[i], "active").then((res : any)=>{
                                                isProcess.current = false;
                                                setRefresh(true);
                                                if ((res.res ?? "error") == "error"){
                                                    setToast("An error has occured.");
                                                } else {
                                                    setToast("Webclip activated.");
                                                }
                                                setTimeout(()=>{setToast("")}, 3000);
                                            })
                                            break;
                                        }
                            
                                    } 
                                    if (!found){
                                        isProcess.current = false;
                                    }
                                    }}>Activate</button></td>
                                    
                                    <ScrollableTD>{item.model}</ScrollableTD>
                                    <ScrollableTD>{item.dtype}</ScrollableTD>
                                    <ScrollableTD>{item.platform}</ScrollableTD>
                                    <ScrollableTD>{item.clstr}</ScrollableTD>
                                    <ScrollableTD>{item.os}</ScrollableTD>
                                    <ScrollableTD>{item.webclip}</ScrollableTD>
                                </tr>
                            })


                        )
                    }

                </tbody>
                
            </table>
            </div>
            
    </div>
    {isProcess.current && <Loading/>
    }
    {
        isAdding  && !isProcess.current && <AddWebclips close={setAdding} setRefresh={setRefresh}/>
    }
    <Navbar/>
    </>);
}