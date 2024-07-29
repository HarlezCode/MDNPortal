import { useNavigate } from 'react-router-dom';
import {logout, fetchFromServer} from './serverActions'
import { FormEvent, useState, useRef } from 'react';
import { Navbar } from './components';
type ResType = {[key :string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='hover:overflow-auto max-w-12 overflow-hidden'>{children}</td>)
}

export default function Browse(){
    const nav = useNavigate();
    const [tableData, setData] = useState([] as ResType[]);
    const buttonState = useRef("none");
    return (<>
    <div className='absolute top-0 left-3 mt-2 bg-gradient-to-r from-red-800 to-rose-900 rounded p-2'>
        <h1>Admin Portal</h1>
    </div>
    <Navbar />
    <div className='top-0 absolute right-0 m-2'>
        <button className='bg-red-500 hover:bg-rose-500 outline-none border-none' onClick={async ()=>{
            
            await logout().then((res : boolean)=>{
                if (res)
                    nav("../login");})
            }}>Logout</button>
        
        
    </div>
    <div className='absolute left-0 top-[20%]'>
        <div>
            <form className='absolute space-x-2 flex' style={{left: 1150, right: 0, top: 0}} onSubmit={(e : FormEvent<HTMLFormElement>) => { e.preventDefault()}}>
                <select className='h-8 bg-rose-900'>
                    <option value="current">Current</option>
                    <option value="daily">Daily report</option>
                    <option value="monthy">Monthy report</option>
                </select>
                <button className='bg-red-500 hover:bg-rose-500 border-none' onClick={() =>{
                    alert("exporting")
                }}>
                    Export
                </button>
            </form>
            
        </div>
    </div>
    </>);
}