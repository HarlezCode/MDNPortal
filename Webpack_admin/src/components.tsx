import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "./serverActions";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Toast} from 'bootstrap';

export function Confirmation({children, text} : {children : any, text : string}){
    const [isConfirm, setConfirm] = useState(false);
    const [isGuard, setGuard] = useState(true);
    console.log(isGuard, isConfirm);
    return (<>
        {
            !isGuard && <>{children}</>
        }
        { isGuard && <>
        <button className='ml mrs bg-rose-600 border-none trhovexl' style={{width: "100px"}} onClick={()=>{setConfirm(true)}}>{text} Confirm</button>
        {
            isConfirm && isGuard &&
        <div>
            <div className='coverdiv' style={{top: "0", left: "0", position: "fixed", zIndex: "2"}}></div>
            <div className='loadingcard bg-slate-400' style={{zIndex: "3", position: "absolute", left: "35vw", top: "40%"}}>
                <h1 style={{fontSize: "2.5rem"}}>Confirm?</h1>
                <button className='ml mrs bg-rose-600 border-none trhovexl'  onClick={()=>{
                    setConfirm(false);
                    setGuard(false);
                    }}>
                    Yes
                </button>
                <button className='ml mrs bg-rose-600 border-none trhovexl' onClick={()=>{setConfirm(false)}}>
                    No
                </button>
            </div>
            
        </div>
        } </>}
    </>)
}



export function Toaster({show, msg} : {show : boolean, msg : string}){
    const toastRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        var myToast = toastRef.current;
        var bsToast = Toast.getInstance(myToast as Element);
        if (!bsToast){
            bsToast = new Toast(myToast as Element);
        } 
        if (bsToast.isShown() && show){
            return;
        }
        console.log("updating");
        show ? bsToast.show() : bsToast.hide();
    })
    return (
        <div className="toast toastbodycolor" ref={toastRef} style={{position: "absolute", top: '80%', right: 10, zIndex: 1000}}>
            <div className="toast-header toastheadercolor" style={{height: "50%"}}>
                <button className="ml-2 mb-1 toastbutton" onClick={()=>{
                    var myToast = toastRef.current;
                    var bsToast = Toast.getInstance(myToast as Element);
                    if (bsToast){
                        bsToast.hide();
                    }
                }}>
                    X
                </button>
            </div>
            <div className="toast-body" style={{color: "white"}}>
                <h3 style={{fontSize: "1.2rem"}}>{msg}</h3>
            </div>
        </div>
    )
}



export function Navbar(){
    const nav = useNavigate();
    return (<div>
    
    <div className='navsidebar d-flex flex-column flex-shrink-0 py-3 text-white' style={{top:0, position: 'absolute', height: '100%', paddingRight: '40px', paddingLeft:'10px'}}>
        <div className='adminlabel mr'>
            <h1 className='adminlabeltext'>Admin Portal</h1>
        </div>
        <ul className='nav nav-pills flex-column mb-auto'>
            <li>
                <div className="h3div" onClick={()=>nav("../dashboard")}>
                    <h3 className='h3but'>Home</h3>
                </div>
            </li>
            <li>
                <div className="h3div" onClick={()=>nav("../dashboard/browse")}>
                    <h3 className='h3but'>Browse</h3>
                </div>
            </li>
            <li>
                <div className="h3div" onClick={()=>nav("../dashboard/webclips")}>
                    <h3 className='h3but'>Webclips</h3>
                </div>
            </li>
            <li>
                <div className='h3div' onClick={()=>nav("../dashboard/mitools")}>
                    <h3 className='h3but'>MI tools</h3>
                </div>
            </li>
        </ul>
        <hr/>
        <div>
            <div style={{marginTop: "20px", marginBottom: "20px"}}><h3 style={{fontSize: "1.2rem"}}>{localStorage.getItem("Token")}</h3></div>
        <button className='logoutbut' onClick={async ()=>{
            
            await logout().then((res : boolean)=>{
                if (res)
                    nav("../login");})
            }}>Logout</button>
        </div>
    </div>
    </div>
    )
}