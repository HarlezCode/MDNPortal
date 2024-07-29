import { useNavigate } from "react-router-dom"

export function Navbar(){
    const nav = useNavigate();
    return (
         <div className="absolute top-0 left-[25%] grid grid-rows-1 grid-cols-2 w-[20%] h-[10%] mt-2">
            <div className="hover:bg-red-500 text-4xl pt-3" onClick={()=>nav("../dashboard")}>
                <h3>Home</h3>
            </div>
            <div className="hover:bg-red-500 text-4xl pt-3" onClick={()=>nav("../dashboard/browse")}>
                <h3>Browse</h3>
            </div>
         </div>
    )
}