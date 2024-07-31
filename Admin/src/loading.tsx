import { useEffect, useState } from "react"


export default function Loading(){
    const [counter, increment] = useState(0);
    const [refr, setRef] = useState(true);
    useEffect(()=>{
        if (!refr){
            return;
        }
        setTimeout(()=>{
            setRef(true);
            increment((counter+1)%4)
        }, 100);
        setRef(false);
    }, [refr])

    return(<div>
        <div className='absolute h-screen w-screen bg-gray-900 opacity-50' style={{top:0, left:0}}></div>
            <div className="absolute bg-slate-400 p-10 rounded" style={{top:300, left:650}}><div className="flex">
                <h3 className="text-4xl">Processing</h3><h3 className={"relative text-4xl " +"bottom-" + (counter == 0 ? "3" : "0")}>.</h3><h3 className={"relative text-4xl "+"bottom-" + (counter == 1 ? "3" : "0")}>.</h3><h3 className={"relative text-4xl "+"bottom-" + (counter == 2 ? "3" : "0")}>.</h3>
                <h3 className={"relative text-4xl "+"bottom-" + (counter == 3 ? "3" : "0")}>.</h3>
            </div>
        </div>
    </div>)
}