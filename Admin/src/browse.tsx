import {fetchFromServer, fetchFromServerRaw} from './serverActions'
import { FormEvent, useState, useRef } from 'react';
import { Navbar } from './components';
import { exportExcel } from './clientActions';
type ResType = {[key :string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='hover:overflow-auto max-w-14 overflow-hidden'>{children}</td>)
}

export default function Browse(){
    const exportOption = useRef("current");
    const [tableData, setData] = useState([] as ResType[]);
    const buttonState = useRef("none");
    return (<>
    <Navbar />
    <div className='absolute left-0 top-[20%]'>
        <div>
            <div className='left-[80%] absolute space-x-2'>
            <select className='h-8 bg-rose-900' onChange={(e : any) =>{
                exportOption.current = e.currentTarget.value;
            }}>
                <option value="current">Fetched Result</option>
                <option value="daily">Daily report</option>
                <option value="monthly">Monthly report</option>
            </select>
            <button className='bg-red-500 hover:bg-rose-500 border-none' onClick={() =>{
                const params = {
                    stat : '',
                    date : ''
                }
                if (exportOption.current == "current"){
                    exportExcel(tableData);
                } else if (exportOption.current == "monthly"){
                    const date = new Date();
                    const concatDate = date.getFullYear().toString() +"-" + (date.getMonth()+1).toString();
                    params.date= concatDate;
                    fetchFromServerRaw(params).then((res : any) =>{
                        exportExcel(res);
                    });
                } else if (exportOption.current == "daily"){
                    const date = new Date();
                    let month = (date.getMonth()+1).toString();
                    if (month.length ==1){
                        month = '0' + month;
                    }

                    const concatDate = date.getFullYear().toString() +"-" + month + "-" + date.getDate().toString();
                    params.date = concatDate;
                    fetchFromServerRaw(params).then((res : any) =>{
                        exportExcel(res);
                    })
                }
            }}>
                Export
            </button>
            </div>
            
            <form onSubmit={async (e : FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                // set filters params and make request
                if (buttonState.current == "fetch"){
                    await fetchFromServer(e).then((res) => setData(res));
                }
            }}>
                <div className='grid grid-rows-1 grid-cols-1 space-x-2 w-[30%] mx-auto mb-2'>
            <button className='bg-red-500 hover:bg-rose-500 border-none m-2' onClick={()=>{buttonState.current="fetch"}}>Fetch</button></div>
                <table className='table table-auto gap-0 space-x-0 border-spacing-0 border-collapse p-0 mt-8 mb-5 '>
                    <thead>
                        <tr>
                            <th>Request Type</th>
                            <th>Serial #</th>
                            <th>Cluster id</th>
                            <th>Status</th>
                            <th>UUID</th>
                            <th>Date Created</th>
                            <th>Device Type</th> 
                            <th>Change Type</th>
                            <th>From</th> 
                            <th>MAC</th>   
                            <th>App</th>    
                            <th>Webclip</th>   
                            <th>Time Created</th>      
                            <th>Processed By</th>
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
                        <option value="Retire device">
                            Retire device
                        </option>
                    </select></td>
                    <td><input name='snfilter' className='w-16 bg-rose-800 placeholder-white' placeholder='Match'/></td>
                    <td><input name='clusterfilter' className='w-16 bg-rose-800 placeholder-white' placeholder='Match'/></td>
                    <td><select name='statusfilter' className='w-16 bg-rose-800 placeholder-white'>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Onhold">On hold</option>
                    </select></td>
                    <td><input name='uuidfilter' className='w-16 bg-rose-800 placeholder-white' placeholder='uuid'/></td>
                    <td><input name='datefilter' className="bg-rose-800" type='date'/></td>
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
                    <td><input name='timefilter' className='max-w-26 bg-rose-800 placeholder-white' placeholder='hh:mm:ss'/></td>
                    <td><input name='processfilter' className='max-w-26 bg-rose-800 placeholder-white' placeholder='Match processed'/></td>
                    </tr>
                    </tbody>
                </table>
                
            </form>
            <div className='overflow-y-auto mb-10' style={{height: '24rem'}}>
            <table className='bg-rose-700 mx-auto w-full overflow-y-auto border-separate border-spacing-x-2'>
                <thead style={{position: 'sticky', top: 0}} className='bg-rose-700'>
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
                        <th>Processed By</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((item, i) => {
                            return <tr key={i}>
                                <ScrollableTD>{item.requestType}</ScrollableTD>
                                <ScrollableTD>{item.serial}</ScrollableTD>
                                <ScrollableTD>{item.cluster}</ScrollableTD>
                                <ScrollableTD>{item.status}</ScrollableTD>
                                <ScrollableTD>{item.uuid}</ScrollableTD>
                                <ScrollableTD>{item.date}</ScrollableTD>
                                <ScrollableTD>{item.device}</ScrollableTD>
                                <ScrollableTD>{item.change}</ScrollableTD>
                                <ScrollableTD>{item.from}</ScrollableTD>
                                <ScrollableTD>{item.mac}</ScrollableTD>
                                <ScrollableTD>{item.webclip}</ScrollableTD>
                                <ScrollableTD>{item.app}</ScrollableTD>
                                <ScrollableTD>{item.time}</ScrollableTD>
                                <ScrollableTD>{item.processed}</ScrollableTD>
                            </tr>
                        })
                    }

                </tbody>
            </table>
            </div>
        </div>
    </div>
    </>);
}