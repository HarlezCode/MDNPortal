import React from 'react'
import { useNavigate } from "react-router-dom";
import {authAction} from "./serverActions"
import './components.css'

export default function Login(){

    const navigate = useNavigate();

     return (<div className="r1">
     <div className="r2">
     <form onSubmit={async (event) =>{
        event.preventDefault();
        await authAction(event.currentTarget.username.value, event.currentTarget.password.value)
        .then((res) =>{
            localStorage.setItem("Token", res);
        });
        navigate("../req");
     }}>
        <div>
            <div>
                <h3 className="r4">
                    Login
                </h3>
            </div>
            <div className='r3'>
            <input placeholder="CORP ID" name="username" className="r5"/>
            </div>
            <div className='r3 mb3'>
            <input placeholder="Password" type="password" name="password" className="r5"/>
            </div>
            <div className='r3'>
            <button type="submit" className="r7">Login</button>
            </div>
        </div>
     </form>
     </div>
     </div>)
}