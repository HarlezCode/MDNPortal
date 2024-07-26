import { useNavigate } from "react-router-dom";
import {authAction} from "./serverActions.ts"


export default function Login(){

    const navigate = useNavigate();

     return (<div className="bg-gradient-to-r from-rose-600 to-blue-600 p-2">
     <div className="bg-rose-800 p-20">
     <form onSubmit={async (event) =>{
        event.preventDefault();
        await authAction(event.currentTarget.username.value, event.currentTarget.password.value)
        .then((res) =>{
            localStorage.setItem("Token", res);
        });
        navigate("../dashboard");
     }}>
        <div className="space-y-2">
            <div>
                <h3 className="text-3xl font-serif bg-rose-800 rounded py-2">
                    Admin Portal
                </h3>
            </div>
            <div>
            <input placeholder="CORP ID" name="username" className="p-2 font-serif bg-rose-100 rounded text-rose-900"/>
            </div>
            <div>
            <input placeholder="Password" type="password" name="password" className="text-rose-900 p-2 font-serif bg-rose-100 rounded"/>
            </div>
            <div>
            <button type="submit" className="font-serif bg-rose-500 px-10">Login</button>
            </div>
        </div>
     </form>
     </div>
     </div>)
}