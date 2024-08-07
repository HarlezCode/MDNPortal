import React from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "./serverActions";
import 'bootstrap/dist/css/bootstrap.min.css';

export function Toaster({show} : {show : boolean}){
    return (
        <div className="toast" style={{position: "absolute", top: 0, right: 0, zIndex: 1000, width: "100%"}}>
            <div className="toast-header">
                <strong className="mr-auto">Error</strong>
                <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    X
                </button>
            </div>
            <div className="toast-body">
                {show ? "Error" : ""}
            </div>
        </div>
    )
}



export function Navbar(){
    const nav = useNavigate();
    return (<div>
    
    <div className='navsidebar d-flex flex-column flex-shrink-0 py-3 text-white bg-dark' style={{top:0, position: 'absolute', height: '100%', paddingRight: '40px', paddingLeft:'10px'}}>
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
            <div style={{marginTop: "20px", marginBottom: "20px"}}><h3 style={{fontSize: "1.2rem"}}>User: {localStorage.getItem("Token")}</h3></div>
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