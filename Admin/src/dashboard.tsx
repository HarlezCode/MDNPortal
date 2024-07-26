import { useNavigate } from 'react-router-dom';
import {logout} from './serverActions'
import { FormEvent } from 'react';

export default function Dashboard(){
    const nav = useNavigate();
    return (<>
    <div className='absolute top-0 left-3 mt-2 bg-gradient-to-r from-red-800 to-rose-900 rounded p-2'>
        <h1>Admin Portal</h1>
    </div>
    <div className='top-0 absolute right-0 m-2'>
        <button className='bg-red-500 hover:bg-rose-500 outline-none border-none' onClick={async ()=>{
            
            await logout().then((res : boolean)=>{
                if (res)
                    nav("../login");})
            }}>Logout</button>
        
        
    </div>
    <div className='absolute left-0 top-[20%]'>
        <div>
            <form className='absolute space-x-2 ml-[80%] ' onSubmit={(e : FormEvent<HTMLFormElement>) => { e.preventDefault()}}>
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
            <h2 className='text-4xl mb-4'>Filters</h2>
            <form>
                
                <table className='table table-auto gap-0 space-x-0 border-spacing-0 border-collapse p-0 '>
                    <thead>
                        <tr>
                            <th>Request Type</th>
                            <th>Serial #</th>
                            <th>Cluster id</th>
                            <th>Status</th>
                            <th>UUID</th>
                            <th>Date</th>
                            <th>Device Type</th> 
                            <th>Change Type</th>
                            <th>From</th> 
                            <th>MAC</th>   
                            <th>Webclip</th>   
                            <th>App</th>    
                            <th>Time Created</th>      

                        </tr>                        
                    </thead>
                    
                    <tbody>
                        <tr>
                            <td>
                    <select name='requestfilter' className='w-[100%] bg-rose-800'>
                        <option value="">
                            All
                        </option>
                        <option value="Add new device record">
                            Add new device record
                        </option>
                        <option value="Add 4G VPN Profile">
                            Add 4G VPN Profile
                        </option>
                        <option value="Add Trial Certificate">
                            Add Trial Certificate
                        </option>
                        <option value="Add Webclip">
                            Add Webclip
                        </option>
                        <option value="App Update">
                            App Update
                        </option>
                        <option value="Change of Device Type">
                            Change of Device Type
                        </option>
                        <option value="Look for last location">
                            Look for last location
                        </option>
                        <option value="Remove 4G VPN profile">
                            Remove 4G VPN profile
                        </option>
                        <option value="Remove Trial Certificate">
                            Remove Trial Certificate
                        </option>
                    </select></td>
                    <td><input name='snfilter' className='w-16 bg-rose-800 placeholder-white' placeholder='Match'/></td>
                    <td><input name='clusterfilter' className='w-16 bg-rose-800 placeholder-white' placeholder='Match'/></td>
                    <td><select name='statusfilter' className='w-16 bg-rose-800 placeholder-white'>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                        <option value="onhold">On hold</option>
                    </select></td>
                    <td><input name='uuidfilter' className='w-16 bg-rose-800 placeholder-white' placeholder='uuid'/></td>
                    <td><input name='date' className="bg-rose-800" type='date'/></td>
                    <td><select name='devicefilter' className='w-[100%] bg-rose-800'>
                        <option value="">All</option>
                        <option value="CORP">CORP</option>
                        <option value="OUD">OUD</option>
                        <option value="COPE">COPE</option>
                    </select></td>
                    
                    <td><select name='changefilter' className='w-[100%] bg-rose-800'>
                        <option value="">None</option>
                        <option value="CORP">To CORP</option>
                        <option value="OUD">To OUD</option>
                        <option value="COPE">To COPE</option>
                    </select></td>
                    <td><input name='fromfilter' className='w-16 bg-rose-800 placeholder-white' placeholder='from'/></td>
                    <td><input name='macfilter' className='bg-rose-800 placeholder-white' placeholder='Match mac address'/></td>
                    <td><input name='appfilter' className='max-w-26 bg-rose-800 placeholder-white' placeholder='Match app update'/></td>
                    <td><input name='webclipfilter' className='max-w-26 bg-rose-800 placeholder-white' placeholder='Match webclip'/></td>
                    <td><input name='timefilter' className='max-w-26 bg-rose-800 placeholder-white' placeholder='hh:mm'/></td>
                    </tr>
                    </tbody>


                </table>



            </form>
        </div>
    </div>
    </>);
}