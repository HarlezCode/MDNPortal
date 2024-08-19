import React from 'react';
import {fetchFromServer, fetchFromServerRaw} from './serverActions'
import { FormEvent, useState, useRef } from 'react';
import { Navbar, Toaster } from './components';
import { exportExcel } from './clientActions';
type ResType = {[key :string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='scrolltd'>{children}</td>)
}

export default function Browse(){
    const exportOption = useRef("current");
    const [tableData, setData] = useState([] as ResType[]);
    const buttonState = useRef("none");
    const [toastMsg, setToast] = useState("");
    return (<>
    <Toaster show={toastMsg != ""} msg={toastMsg}/>
    <div className='browsediv'>
        <div>
            <div className='browsediv2'>
            <select style={{height: "2rem", marginRight: "15px"}}className='bg-rose-900' onChange={(e : React.ChangeEvent<HTMLSelectElement>) =>{
                exportOption.current = e.currentTarget.value;
            }}>
                <option value="current">Fetched Result</option>
                <option value="daily">Daily report</option>
                <option value="monthly">Monthly report</option>
            </select>
            <button className='exportbutton2 bg-red-500' onClick={() =>{
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
                    fetchFromServerRaw(params).then((res : ResType[]) =>{
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
                    fetchFromServerRaw(params).then((res : ResType[]) =>{
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
                    await fetchFromServer(e).then((res : ResType[]) => {
                        setData(res);
                        if (res.length == 0){
                            setToast("No data found. Please check if the server is online.");
                        } else {
                            setToast("Successfully fetched data.")
                        }
                        setTimeout(()=>{setToast("")}, 3000);
                    });
                }
            }}>
                <div className='browsetablediv'>
            <button className='mrdiv bg-red-500 exportbutton2' onClick={()=>{buttonState.current="fetch"}}>Fetch</button></div>
                <table className='browsetable'>
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
                    <select name='requestfilter' style={{width: "100%"}}className='bg-rose-800'>
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
                    <td><input name='snfilter' className='w-16 bg-rose-800 defaultinputs' placeholder='Match'/></td>
                    <td><input name='clusterfilter' className='w-16 bg-rose-800 defaultinputs' placeholder='Match'/></td>
                    <td><select name='statusfilter' className='w-16 bg-rose-800 defaultinputs'>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Onhold">On hold</option>
                    </select></td>
                    <td><input name='uuidfilter' className='w-16 bg-rose-800 defaultinputs' placeholder='uuid'/></td>
                    <td><input name='datefilter' className="bg-rose-800 defaultinputs" style={{width: '90%'}} placeholder='dd/mm/yyyy'/></td>
                    <td><select name='devicefilter' style={{width: "100%"}} className='bg-rose-800'>
                        <option value="">All</option>
                        <option value="CORP">CORP</option>
                        <option value="OUD">OUD</option>
                        <option value="COPE">COPE</option>
                    </select></td>
                    
                    <td><select name='changefilter' style={{width: "100%"}} className='bg-rose-800'>
                        <option value="">None</option>
                        <option value="CORP">To CORP</option>
                        <option value="OUD">To OUD</option>
                        <option value="COPE">To COPE</option>
                    </select></td>
                    <td><input name='fromfilter' className='w-16 bg-rose-800 defaultinputs' placeholder='from'/></td>
                    <td><input name='macfilter' className='bg-rose-800 defaultinputs' placeholder='Match mac address'/></td>
                    <td><input name='appfilter' className='bg-rose-800 defaultinputs' placeholder='Match app update'/></td>
                    <td><input name='webclipfilter' className='bg-rose-800 defaultinputs' placeholder='Match webclip'/></td>
                    <td><input name='timefilter' className='bg-rose-800 defaultinputs' style={{width: "95%"}} placeholder='hh:mm:ss'/></td>
                    <td><input name='processfilter' className='bg-rose-800 defaultinputs' placeholder='Match processed'/></td>
                    </tr>
                    </tbody>
                </table>
                
            </form>
            <div className='browsediv3' style={{height: '24rem'}}>
            <table className='bg-rose-700 browsetable2'>
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
                        tableData.map((item : ResType, i : number) => {
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
    <Navbar />
    </>);
}