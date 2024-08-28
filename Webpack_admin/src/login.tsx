import React from 'react';
import { useNavigate } from "react-router-dom";
import {authAction} from "./serverActions"

/*
Login page
*/


export default function Login(){

    const navigate = useNavigate();

     return (<div className="logindiv" style={{padding: 6}}>
     <div className="bg-rose-900" style={{padding: 60}}>
     <form onSubmit={async (event : React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        await authAction(event.currentTarget.username.value, event.currentTarget.password.value)
        .then((res) =>{
            localStorage.setItem("Token", res);
            navigate("../dashboard");
        }).catch(()=>{
            alert("An error has occurred. Server not Responding.")
        });
     }}>
        <div>
            <div className='mbdiv'>
                <h3 className="adminportaltext bg-rose-900">
                    Admin Portal
                </h3>
            </div>
            <div>
            <input placeholder="CORP ID" name="username" className="logininput"/>
            </div>
            <div>
            <input placeholder="Password" type="password" name="password" className="logininput"/>
            </div>
            <div>
            <button type="submit" className='loginbut'>Login</button>
            </div>
        </div>
     </form>
     </div>
     </div>)
}