import { useNavigate } from "react-router-dom";
import {authAction} from "./serverActions.ts"


export default function Login(){

    const navigate = useNavigate();

     return (<div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2">
     <div className="bg-gray-800 p-20">
     <form onSubmit={async (event) =>{
        event.preventDefault();
        await authAction(event.currentTarget.username.value, event.currentTarget.password.value)
        .then((res) =>{
            localStorage.setItem("Token", res);
        });
        navigate("../req");
     }}>
        <div className="space-y-2">
            <div>
                <h3 className="text-3xl font-serif bg-slate-700 rounded py-2">
                    User Portal
                </h3>
            </div>
            <div>
            <input placeholder="CORP ID" name="username" className="p-2 font-serif bg-slate-100 rounded text-slate-900"/>
            </div>
            <div>
            <input placeholder="Password" type="password" name="password" className="text-slate-900 p-2 font-serif bg-slate-100 rounded"/>
            </div>
            <div>
            <button type="submit" className="font-serif bg-blue-500 px-10">Login</button>
            </div>
        </div>
     </form>
     </div>
     </div>)
}