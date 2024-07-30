import { useNavigate } from "react-router-dom";
import { DefaultTitle } from "./components";

async function submitFunc(data : any, close : any, nav : any){
    //need to do item checks here eg. webclip unselected and give error if some are not selected.
    //for adding removing vpn, need to check if vpn exists or not and warn the user correspondingly.
    //for add/remove trial cert, need to check for existence and warn the user correspondingly.
    // prepare api call here as well
    await fetch("http://localhost:5000/api/addrequests", {headers : {"key" : localStorage.getItem("Token") ?? "", "fromuser" : "user_" + localStorage.getItem("Token"), 'Accept' : 'application/json', 'Content-Type' : 'application/json'}, method : "POST", body : JSON.stringify(data)}).then((res) =>{
        res.json().then((res) =>{
            if (res == "error"){
                alert("An error has occured");
            } else if (res == "skipped entries"){
                alert("some entries were skipped");
            } else{
                nav("../req");
            }
        })
        close();
    });
}

export default function Preview({previewFunc, data} : {previewFunc : any, data : any}){
    const nav = useNavigate();
    return(<>
        <div><div className='h-[110%] w-screen bg-gray-900 opacity-50 absolute bottom-0 left-0 top-0'></div><div className="bottom-[0%] left-[30%] top-[20%] w-[40%] mx-[0%] absolute">
            <div className="bg-slate-400 flex-1 p-[10%] grid-rows-3 rounded space-y-8 h-[100%]">
                <div>
                    <DefaultTitle>Preview</DefaultTitle>
                </div>
                <div className="grid overflow-y-auto h-[70%]">
                <table className="flex-1 top-0 relative bg-white text-slate-800">
                    <thead>
                        <tr>
                            <th>SN</th>
                            {data["Headers"].map((v : string) => {
                                console.log(v);
                                return (<th>{v}</th>);
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {
                        Object.keys(data).map((k) =>{
                            if (k != "Headers" && k != "RequestType" && !k.startsWith("data_")){
                            return (<tr key={k+"preview"}>
                                <td>{k}</td>
                                {data[k].map((val : string)=>{
                                    if (val.startsWith("uuid_")){
                                        return;
                                    }
                                    return (<td>{val}</td>)
                                })}
                                </tr>
                                )
                            } else {
                                return;
                            }
                        }
                        )

                    }
                    </tbody>
                </table>
                </div>
                <div className="grid content-start grid-cols-5 space-x-[30%] grid-rows-1">
                    <div><button className="bg-slate-700" onClick={()=>previewFunc(false)}>Close</button></div>
                    <div><button className="bg-slate-700" onClick={()=>submitFunc(data, previewFunc, nav)}>Submit</button></div>
                </div>
            </div>
            </div>
        </div>
    
    </>)
}