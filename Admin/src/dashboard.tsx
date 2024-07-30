import {fetchFromServerRaw, processRequests} from './serverActions'
import {useState, useRef, useEffect } from 'react';
import { Navbar } from './components';
import { exportExcel } from './clientActions';
type ResType = {[key : string] : string};

function ScrollableTD({children} : {children : any}){
    return (<td className='hover:overflow-auto max-w-14 h-14 overflow-hidden px-4'>{children}</td>)
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
    
    <Navbar />
    
    <div className='absolute left-0 top-[20%]'>
        <div>
            <div className='absolute space-x-2 flex' style={{left: 950, right: 0, top: -20}}>
                <select className='h-8 bg-rose-900 mt-5' onChange={
                    (e : any) =>{
                        exportOption.current = e.currentTarget.value;
                    }

                }>
                    <option value="current">All Pending</option>
                    <option value="daily">Daily report</option>
                    <option value="monthly">Monthly report</option>
                </select>
                <button className='bg-red-500 hover:bg-rose-500 border-none' onClick={() =>{
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
                <button className='bg-red-500 hover:bg-rose-500 border-none text-xs' onClick={()=>{
                    if (isProcess.current){
                        return;
                    }
                    const temp = [] as ResType[];
                    isProcess.current = true;
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
                        alert(res);
                    })
                }}>Process Selected</button>
            </div>
            
        </div>
        <div className='ml-[20%] w-[120%] mt-[5%] mb-[5%] overflow-y-auto' style={{height: '36rem'}}>
            <div className='bg-red-700 pb-[1%] rounded'>
                <h2 className='text-4xl'>Pending Requests</h2>
            </div>
            <div>
                <div className='flex'><h3 className='mr-2 mt-2'>Auto Refresh:</h3><input onChange={(e : any) =>{
                    autoRefresh.current = e.currentTarget.checked;
                    setRefresh(true);
                }}type="checkbox"/>
                
                </div>
            </div>
            <table className='bg-rose-700 mx-auto w-full border-separate border-spacing-x-0'>
                <thead style={{position: 'sticky', top: 0}} className='bg-rose-700'>
                    <tr>
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
                            return <tr key={i} id={item.id + "_row"} className={'hover:bg-rose-500' + ((cbState[item.id] ?? false) ? 'hover:bg-rose-500 ' + 'bg-rose-500' : '')} onClick={(e : any) =>{
                                const key = e.currentTarget.id.slice(0, e.currentTarget.id.length-4) ?? ""
                                const temp = JSON.parse(JSON.stringify(cbState));
                                console.log(cbState);
                                if (temp[key] != null){
                                    temp[key] = !temp[key];
                                }
                                setCb(temp);
                            }}>
                                <td><button className='bg-rose-600 border-none hover:bg-rose-400' name={item.id + "_but"} onClick={(e : any)=>{
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
                                                alert(res);
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
    </>);
}