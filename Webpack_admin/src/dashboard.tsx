import React from 'react';
import {fetchFromServerRaw, processRequests, rejectRequest} from './serverActions'
import {useState, useRef, useEffect } from 'react';
import { Navbar } from './components';
import { exportExcel } from './clientActions';
import Loading from './loading';
import './components.css'
type ResType = {[key : string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='scrolltd'>{children}</td>)
}


export default function Dashboard(){
    const [tableData, setData] = useState([] as ResType[]);
    const [cbState, setCb] = useState({} as {[index : string] : boolean}); 
    const [refresh, setRefresh] = useState(true);
    const autoRefresh = useRef(false);
    const isProcess = useRef(false);
    const exportOption = useRef("current");

    useEffect(() =>{
        const temp = {} as {[index :string] : boolean};
        tableData.forEach((val : ResType) =>{
            if (!Object.keys(cbState).includes(val.id.toString())){
                temp[val.id.toString()] = false;
            } else {
                temp[val.id.toString()] = cbState[val.id.toString()];
                
            }

        });
        setCb(temp);
    }, [tableData]);
    useEffect(()=>{
        // fetch from db
        if (refresh){
            setRefresh(false);
            fetchFromServerRaw({}).then((res)=>{
                setData(res);
            });
            if (autoRefresh.current){
                setTimeout(()=>{setRefresh(true)}, 10000);
            }
        }
    }, [refresh]);


    return (<>
    
    
    
    <div className='dashboarddiv'>
        <div>
            <div className='dashboarddiv2' style={{left: "95%", right: 0, top: -20}}>
                <select style={{height: "2rem", fontSize:"1rem", marginTop:"25px"}} className='bg-rose-900 mrdiv' onChange={
                    (e : any) =>{
                        exportOption.current = e.currentTarget.value;
                    }

                }>
                    <option value="current">All Pending</option>
                    <option value="daily">Daily report</option>
                    <option value="monthly">Monthly report</option>
                </select>
                <button className='bg-red-500 exportbutton mrdiv' onClick={() =>{
                    const params = {
                        stat : '',
                        date : ''
                    }
                    if (!isProcess.current){
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
                    }
                }}>
                    Export
                </button>
                <button className='bg-red-500 processall' onClick={()=>{
                    if (isProcess.current){
                        return;
                    }
                    const temp = [] as ResType[];
                    isProcess.current = true;
                    setRefresh(true);
                    Object.keys(cbState).forEach((val : string) =>{
                        if (cbState[val]){
                            for (let i =0; i<tableData.length;i++){
                                if (tableData[i].id == val){
                                    temp.push(JSON.parse(JSON.stringify(tableData[i])));
                                }
                            }
                        }   
                    });
                    
                    processRequests(temp).then((res : any) =>{
                        isProcess.current = false;
                        setRefresh(true);
                    })
                }}>Process Selected</button>
            </div>
            
        </div>
        <div className='pendingdiv' style={{height: '36rem'}}>
            <div className='pendinglabel'>
                <h2 className='pendingh2'>Pending Requests</h2>
            </div>
            <div>
                <div className='flex'><h3 className='mr-2 mt-2'>Auto Refresh:</h3><input onChange={(e : any) =>{
                    autoRefresh.current = e.currentTarget.checked;
                    setRefresh(true);
                }} type="checkbox"/>
                
                </div>
            </div>
            <table className='bg-rose-700 mx-auto pendingtable'>
                <thead style={{position: 'sticky', top: 0}} className='bg-rose-700'>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
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
                    {
                        tableData.map((item, i) => {
                            return <tr key={i} id={item.id + "_row"} className={'trhove ' + ((cbState[item.id] ?? false) ? 'trhover': '')} onClick={(e : any) =>{
                                const key = e.currentTarget.id.slice(0, e.currentTarget.id.length-4) ?? ""
                                const temp = JSON.parse(JSON.stringify(cbState));
                                console.log(cbState);
                                if (temp[key] != null){
                                    temp[key] = !temp[key];
                                }
                                setCb(temp);
                            }}>
                                <td><button className='ml mrs bg-rose-600 border-none trhovexl' name={item.id + "_rejbut"} onClick={(e : any) =>{

                                    if (isProcess.current){
                                        return;
                                    }
                                    isProcess.current = true;
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-7);
                                    for (let i =0; i < tableData.length; i++){
                                        if (tableData[i].id == key){
                                            const temp = [] as ResType[];
                                            temp.push(tableData[i]);
                                            rejectRequest(temp).then((res : ResType)=>{
                                                setRefresh(true);
                                                isProcess.current = false;
                                                console.log(res);
                                            });
                                            break;
                                        }
                                    }


                                }}>Reject</button></td>
                                <td><button className='bg-rose-600 bg-rose-600 border-none trhovexl' name={item.id + "_but"} onClick={(e : any)=>{
                                    if (isProcess.current){
                                        return;
                                    }
                                    isProcess.current = true;
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-4);
                                    for (let i =0; i < tableData.length; i++){
                                        if (tableData[i].id == key){
                                            const temp = [] as ResType[];
                                            temp.push(tableData[i]);
                                            processRequests(temp).then((res : any)=>{
                                                setRefresh(true);
                                                isProcess.current = false;
                                            });
                                            break;
                                        }
                                    }

                                }}>Process</button></td>
                                <td><input type='checkbox' name={item.id + "_check"} checked={cbState[item.id] ?? false} onChange={(e : any) =>{
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-6) ?? "";
                                    const temp = JSON.parse(JSON.stringify(cbState));
                                    if (temp[key] != null){
                                        temp[key] = e.currentTarget.checked;
                                    }
                                    setCb(temp);
                                }}/></td>
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
                            </tr>
                        })
                    }

                </tbody>
            </table>
            </div>
    </div>
    {isProcess.current && <Loading/>}
    <Navbar />
    </>);
}