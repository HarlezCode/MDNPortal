import { Navbar } from "./components";
import {useRef, useState, useEffect} from 'react';
import {fetchWebclips} from "./serverActions"
type ResType = {[key : string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='hover:overflow-auto max-w-14 h-14 overflow-hidden px-4'>{children}</td>)
}


export default function Webclips(){
    const [activeWc, setActive] = useState([] as ResType[]);
    const [inactiveWc, setInactive] = useState([] as ResType[]);
    const [cbState, setCb] = useState({} as {[index : string] : boolean}); 
    const [refresh, setRefresh] = useState(true);
    const [pageOn, setPage] = useState("active");

    useEffect(() =>{
        const temp = {} as {[index :string] : boolean};
        activeWc.forEach((val : ResType) =>{
            if (!Object.keys(cbState).includes(val.id.toString())){
                temp[val.id.toString()] = false;
            } else {
                temp[val.id.toString()] = cbState[val.id.toString()];
                
            }

        });
        setCb(temp);
    }, [activeWc]);
    useEffect(()=>{
        // fetch from db
        if (refresh){
            setRefresh(false);
            fetchWebclips("active").then((res: any)=>{
                if (res["res"] == "ok"){
                    setActive(res["data"]);
                }
            });
            fetchWebclips("inactive").then((res: any)=>{
                if (res["res"] == "ok"){
                    setInactive(res["data"]);
                }
            })
            setTimeout(()=>{setRefresh(true)}, 30000);
        }
    }, [refresh]);


    return (<>
    <Navbar/>
    
    <div className="w-[80%] absolute left-[10%] h-[80%] top-[20%]">
    <div className="w-[25%] relative left-[0%] grid grid-rows-1 grid-cols-2">
        <div onClick={()=>{setPage("active")}} className={(pageOn=="active" ? " bg-rose-700" : " bg-rose-600 hover:cursor-pointer hover:bg-rose-500")}><h3 className="text-xl">Active webclips</h3></div>
        <div onClick={()=>{setPage("inactive")}} className={(pageOn=="inactive" ? " bg-rose-700" : " bg-rose-600 hover:cursor-pointer hover:bg-rose-500")}><h3 className="text-xl">Inactive webclips</h3></div>
    </div>
    <table className='flex-1 bg-rose-700 w-full border-separate border-spacing-x-0 overflow-y-auto'>
                <thead style={{position: 'sticky', top: 0}} className='bg-rose-700'>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Model</th>
                        <th>Device Type</th>
                        <th>Platform</th>
                        <th>Cluster</th>
                        <th>OS</th>
                        <th>Webclip</th>
                    </tr>
                </thead>
                <tbody>
                    {   (pageOn=="active") &&
                        (activeWc.map((item, i) => {
                            return <tr key={i} id={item.id + "_row"} className={'hover:bg-rose-500' + ((cbState[item.id] ?? false) ? 'hover:bg-rose-500 ' + 'bg-rose-500' : '')} onClick={(e : any) =>{
                                const key = e.currentTarget.id.slice(0, e.currentTarget.id.length-4) ?? ""
                                const temp = JSON.parse(JSON.stringify(cbState));
                                console.log(cbState);
                                if (temp[key] != null){
                                    temp[key] = !temp[key];
                                }
                                setCb(temp);
                            }}>
                                <td className="w-10 p-2"><button className='bg-rose-600 border-none hover:bg-rose-400' name={item.id + "_but"} onClick={(e : any)=>{
                                    

                                }}>Delete</button></td>
                                 <td className="w-10 p-2"><button className='bg-rose-600 border-none hover:bg-rose-400' name={item.id + "_but"} onClick={(e : any)=>{
                                    

                                }}>Deactivate</button></td>
                                <td><input type='checkbox' name={item.id + "_check"} checked={cbState[item.id] ?? false} onChange={(e : any) =>{
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                    const temp = JSON.parse(JSON.stringify(cbState));
                                    if (temp[key] != null){
                                        temp[key] = e.currentTarget.checked;
                                    }
                                    setCb(temp);
                                }}/></td>
                                <ScrollableTD>{item.model}</ScrollableTD>
                                <ScrollableTD>{item.dtype}</ScrollableTD>
                                <ScrollableTD>{item.platform}</ScrollableTD>
                                <ScrollableTD>{item.clstr}</ScrollableTD>
                                <ScrollableTD>{item.os}</ScrollableTD>
                                <ScrollableTD>{item.webclip}</ScrollableTD>
                            </tr>
                        }))
                    }
                    {
                        (pageOn=="inactive") &&(
                            inactiveWc.map((item, i) => {
                                return <tr key={i} id={item.id + "_row"} className={'hover:bg-rose-500' + ((cbState[item.id] ?? false) ? 'hover:bg-rose-500 ' + 'bg-rose-500' : '')} onClick={(e : any) =>{
                                    const key = e.currentTarget.id.slice(0, e.currentTarget.id.length-4) ?? ""
                                    const temp = JSON.parse(JSON.stringify(cbState));
                                    console.log(cbState);
                                    if (temp[key] != null){
                                        temp[key] = !temp[key];
                                    }
                                    setCb(temp);
                                }}>
                                    <td className="w-10 p-2"><button className='bg-rose-600 border-none hover:bg-rose-400' name={item.id + "_but"} onClick={(e : any)=>{
                                        
    
                                    }}>Delete</button></td>
                                     <td className="w-10 p-2"><button className='bg-rose-600 border-none hover:bg-rose-400' name={item.id + "_but"} onClick={(e : any)=>{
                                        
    
                                    }}>Activate</button></td>
                                    <td><input type='checkbox' name={item.id + "_check"} checked={cbState[item.id] ?? false} onChange={(e : any) =>{
                                        const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                        const temp = JSON.parse(JSON.stringify(cbState));
                                        if (temp[key] != null){
                                            temp[key] = e.currentTarget.checked;
                                        }
                                        setCb(temp);
                                    }}/></td>
                                    <ScrollableTD>{item.model}</ScrollableTD>
                                    <ScrollableTD>{item.dtype}</ScrollableTD>
                                    <ScrollableTD>{item.platform}</ScrollableTD>
                                    <ScrollableTD>{item.clstr}</ScrollableTD>
                                    <ScrollableTD>{item.os}</ScrollableTD>
                                    <ScrollableTD>{item.webclip}</ScrollableTD>
                                </tr>
                            })


                        )
                    }

                </tbody>
            </table>
    </div>
    </>);
}