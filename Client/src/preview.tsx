
function submitFunc(){
    alert("submitted");
}

export default function Preview({previewFunc, data} : {previewFunc : any, data : any}){
    return(<>
        <div><div className='h-screen w-screen bg-gray-900 opacity-50 absolute bottom-0 left-0 top-0'></div><div className="bottom-[0%] left-[38%] top-[20%] w-[25%] mx-[0%] absolute">
            <div className="bg-slate-400 grid p-[10%] content-start justify-items-middle rounded space-y-4">
                <div className="grid content-start grid-cols-5 space-x-[50%] grid-rows-1">
                <div><button className="bg-slate-700" onClick={()=>previewFunc(false)}>Close</button></div>
                <div><button className="bg-slate-700" onClick={()=>submitFunc()}>Submit</button></div>
                </div>
                <div className="grid content-center overflow-y-scroll max-h-96">
                <table className="flex-1 bg-white text-slate-800 align-middle">
                    <thead>
                        <tr>
                            <th>SN</th>
                            {data["Headers"].map((v : string) => {
                                return (<th>{v}</th>);

                            })}
                        </tr>
                    </thead>
                    <tbody>
                    {
                        Object.keys(data).map((k) =>{
                            if (k != "Headers" && k != "RequestType"){
                            return (<tr>
                                <td>{k}</td>
                                {data[k].map((val : string)=>{
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
            </div>
            
            </div>
        </div>
    
    </>)
}