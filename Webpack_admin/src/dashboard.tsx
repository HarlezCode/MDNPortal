import React, { BaseSyntheticEvent } from 'react';
import {fetchFromServerRaw, processRequests, rejectRequest} from './serverActions'
import {useState, useRef, useEffect } from 'react';
import { Confirmation, Navbar, Toaster } from './components';
import { exportExcel, exportCsvNewDevice } from './clientActions';
import Loading from './loading';
import './components.css';

/*
The main page where you see all pending requests
*/


type ResType = {[key : string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='scrolltd'>{children}</td>)
}


export default function Dashboard(){
    const [tableData, setData] = useState([] as ResType[]);
    const [cbState, setCb] = useState({} as {[index : string] : boolean}); 
    const [refresh, setRefresh] = useState(true);
    const [toastMsg, setToast] = useState("");
    const autoRefresh = useRef(false);
    const isProcess = useRef(false);
    const exportOption = useRef("current");
    const showOptions = useRef(false);
    const processConfirm = useRef(false);
    const forceProcess = useRef(false);

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
                console.log(res);
            });
            if (autoRefresh.current){
                setTimeout(()=>{setRefresh(true)}, 10000);
            }
        }
    }, [refresh]);


    return (<>
    
    <Toaster show={toastMsg != ""} msg={toastMsg}/>
    
    <div className='dashboarddiv'>
        <div>
            <div className='dashboarddiv2' style={{left: "90%", right: 0, top: -40}}>
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
                    }
                }}>
                    Export
                </button>
                <div>
                <button className="bg-red-500 processall options" style={{marginBottom: "5px"}}  onClick={
                    ()=>{
                        showOptions.current = !showOptions.current;
                        setRefresh(true);
                    }
                }>Options</button>
                {showOptions.current && <div style={{display: "grid", zIndex: "1"}}>
                    {
                        processConfirm.current == false && <button className='bg-red-500 dropdownitem'  style={{zIndex: "1"}} onClick={
                            () => { processConfirm.current = true;setRefresh(true);}
                        }>Process Selected</button>
                    }
                    {
                        processConfirm.current == true && <>
                            <div style={{display : "flex"}}>
                                <button className='bg-red-500 dropdownitem' onClick={()=>{processConfirm.current=false;setRefresh(true);}}>No</button>
                                <button className='bg-red-500 dropdownitem' onClick={()=>{
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
                                    
                                    processRequests(temp, forceProcess.current).then((res : any) =>{
                                        isProcess.current = false;
                                        setRefresh(true);
                                        if (res?.res == "error"){
                                            setToast(res.error);
                                        } else if (res?.res == "ok"){
                                            setToast("Requests were successfully processed.");
                                        }
                                        setTimeout(()=>{setToast("")}, 3000);
                                    })
                                    processConfirm.current = false;
                                    showOptions.current = false;
                }}>Yes</button>
                            </div>
                        </>
                    }
                <button className='bg-red-500 dropdownitem' onClick={
                    () => {
                        const validData = [] as {[index : string] : any}[];
                        Object.keys(cbState).forEach((val : string) => {
                            if (cbState[val]){
                                for (let i=0; i<tableData.length; i++){
                                    if (tableData[i].id == val){
                                        if (tableData[i].requestType == "Add new device record"){
                                            validData.push(tableData[i]);
                                        }
                                        break;
                                    }
                                }
                            }
                        })
                        if (validData.length == 0){
                            setToast("This only exports data for adding new devices. Please select at least one valid request.")
                            setTimeout(()=>{setToast("")}, 3000);
                        }
                        exportCsvNewDevice(validData);
                        showOptions.current = !showOptions.current;
                        setRefresh(true);
                        processConfirm.current = false;
                    }} 
                    style={{zIndex: 1}}>
                    Export Selected Devices
                </button>
                </div>}
                </div>
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
                }} type="checkbox" style={{marginRight:"20px"}}/>
                <h3 className='mr-2 mt-2'>Force Process:</h3><input onChange={(e : any) =>{
                    forceProcess.current = e.currentTarget.checked;
                }} type="checkbox"/></div>
                
                
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
                        tableData.map((item : ResType, i : number) => {
                            return <tr key={i} id={item.id + "_row"} className={'trhove ' + ((cbState[item.id] ?? false) ? 'trhover': '')} onClick={(e : any) =>{
                                console.log(tableData[i]);
                                const key = e.currentTarget.id.slice(0, e.currentTarget.id.length-4) ?? ""
                                const temp = JSON.parse(JSON.stringify(cbState));
                                console.log(cbState);
                                if (temp[key] != null){
                                    temp[key] = !temp[key];
                                }
                                setCb(temp);
                            }}>
                                <td><Confirmation key={item.id + "rej"} text="Reject"><button className='ml mrs bg-rose-600 border-none trhovexl' name={item.id + "_rejbut"} onClick={(e : any) =>{

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
                                                if (res.res == "error"){
                                                    setToast(res.error ?? "error");
                                                } else if (res.res == "ok"){
                                                    setToast("Request was successfully rejected.");
                                                }
                                                setTimeout(()=>{setToast("")}, 3000);
                                            });
                                            break;
                                        }
                                    }


                                }}>Reject</button></Confirmation></td>
                                <td><Confirmation key={item.id + "process"} text='Process'><button className='bg-rose-600 bg-rose-600 border-none trhovexl' name={item.id + "_but"} onClick={(e : React.MouseEvent<HTMLButtonElement>)=>{
                                    if (isProcess.current){
                                        return;
                                    }
                                    isProcess.current = true;
                                    const key = e.currentTarget.name.slice(0, e.currentTarget.name.length-4);
                                    for (let i =0; i < tableData.length; i++){
                                        if (tableData[i].id == key){
                                            const temp = [] as ResType[];
                                            temp.push(tableData[i]);
                                            processRequests(temp, forceProcess.current).then((res : any)=>{
                                                setRefresh(true);
                                                isProcess.current = false;
                                                console.log(res);
                                                if (res?.res == "error"){
                                                    setToast(res?.error);
                                                } else if (res?.res == "ok"){
                                                    setToast("Request was successfully processed.");
                                                }
                                                setTimeout(()=>{setToast("")}, 3000);
                                            });
                                            break;
                                        }
                                    }

                                }}>Process</button></Confirmation></td>
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