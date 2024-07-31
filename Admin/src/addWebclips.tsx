import { FormEvent, useState } from "react";
import { addWebclips } from "./serverActions";
import Loading from "./loading";

export default function AddWebclips({close, setRefresh} : {close : any, setRefresh : any}){
    const [loading, setLoading] = useState(false);
    return(
        <div>
            
            <div className='absolute h-screen w-screen bg-gray-900 opacity-50' style={{top:0, left:0}}></div>
            <form onSubmit={(e : FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                addWebclips(e).then((res : boolean)=>{
                    setLoading(false); 
                    if (res){
                        close(false);
                        setRefresh(true);
                    }
                });
                setLoading(true);
            }}>
            <div className='relative bg-rose-600' style={{width: 1000, height: 700}}>
                <div className="justify-start grid pl-2 pt-2">
                    <button className="bg-rose-500 px-10" onClick={()=>{close(false);setRefresh(true);}}>Close</button>
                </div>
                <div className="bg-rose-700 space-y-5 w-[80%] mx-auto mt-10 py-5">
                    <div className="flex justify-center space-x-4 ml-4"><h3>Models: </h3><input className="bg-white text-slate-900" name="model" placeholder="Eg. Ipad, ipod"/></div>
                    <div className="flex justify-center space-x-4">
                        <h3 className="mt-5">Device Types: </h3>
                        <div><h3>Corp </h3><input className="bg-white" name="CORP" type="checkbox"/></div>
                        <div><h3>Oud </h3><input className="bg-white" name="OUD" type="checkbox"/></div>
                        <div><h3>Cope </h3><input className="bg-white" name="COPE" type="checkbox"/></div>
                    </div>
                    <div className="flex justify-center space-x-4 ml-4"><h3>Platform: </h3><input className="bg-white text-slate-900" name="platform" placeholder="Eg. IOS, ANDROID"/></div>
                    <div className="flex justify-center space-x-4 ml-4"><h3>Cluster: </h3><input className="bg-white text-slate-900" name="cluster" placeholder="Eg. 1, 2"/></div>
                    <div className="flex justify-center space-x-4 ml-4"><h3>Os versions: </h3><input className="bg-white text-slate-900" name="os" placeholder="Only use for one platform"/></div>
                    <div className="flex justify-center space-x-4 ml-4"><h3>Webclip: </h3><input required={true} className="bg-white text-slate-900" name="webclip" placeholder="Eg. Clip1"/></div>
                    <button className="bg-rose-500 px-10">Submit</button>
                </div>
                <h3 className="relative text-white">* If a field is left empty it will not use that field as requirement.</h3>
                <h3 className="relative text-white">* Please ensure you have selected atleast 1 device type.</h3>
            </div>
            </form>
            {   loading &&<Loading/>}
        </div>
    )
}