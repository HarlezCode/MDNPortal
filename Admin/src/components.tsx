import { useNavigate } from "react-router-dom";
import { logout } from "./serverActions";

export function Navbar(){
    const nav = useNavigate();
    return (<div>
    
    <div className="bg-slate-500 absolute top-0 left-0 w-full flex space-x-10 pb-3" >
        <div className='relative top-0 left-3 mt-2 bg-gradient-to-r from-red-800 to-rose-900 rounded p-2 text-l'>
        <h1>Admin Portal</h1>
        </div>
         <div className="relative top-0 left-0 grid grid-rows-1 grid-cols-3 w-[30%] h-[100%] mt-2 ">
            <div className="hover:bg-slate-400 hover:cursor-pointer text-4xl py-4 rounded" onClick={()=>nav("../dashboard")}>
                <h3>Home</h3>
            </div>
            <div className="hover:bg-slate-400 hover:cursor-pointer text-4xl py-4 rounded" onClick={()=>nav("../dashboard/browse")}>
                <h3>Browse</h3>
            </div>
            <div className="hover:bg-slate-400 hover:cursor-pointer text-4xl py-4 rounded" onClick={()=>nav("../dashboard/webclips")}>
                <h3>Webclips</h3>
            </div>
         </div>
    </div>
    <div className='top-3 absolute right-0 m-2'>
        <button className='bg-slate-400 hover:bg-rose-600 outline-none border-none' onClick={async ()=>{
            
            await logout().then((res : boolean)=>{
                if (res)
                    nav("../login");})
            }}>Logout</button>
        
        
    </div>
    </div>
    )
}