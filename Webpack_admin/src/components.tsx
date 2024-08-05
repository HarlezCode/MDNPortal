import React from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "./serverActions";

export function Navbar(){
    const nav = useNavigate();
    return (<div>
    
    <div className="bg-slate-500 navbardiv" >
        <div className='adminlabel mr'>
            <h1 className='adminlabeltext'>Admin Portal</h1>
        </div>
         <div className="adminbuttons">
            <div className="h3div" onClick={()=>nav("../dashboard")}>
                <h3 className='h3but'>Home</h3>
            </div>
            <div className="h3div" onClick={()=>nav("../dashboard/browse")}>
                <h3 className='h3but'>Browse</h3>
            </div>
            <div className="h3div" onClick={()=>nav("../dashboard/webclips")}>
                <h3 className='h3but'>Webclips</h3>
            </div>
            <div className='h3div' onClick={()=>nav("../dashboard/mitools")}>
                <h3 className='h3but'>MI tools</h3>
            </div>
         </div>
    </div>
    <div className='logoutdiv'>
        <button className='logoutbut' onClick={async ()=>{
            
            await logout().then((res : boolean)=>{
                if (res)
                    nav("../login");})
            }}>Logout</button>
    </div>
    </div>
    )
}