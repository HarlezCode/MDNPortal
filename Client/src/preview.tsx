export default function Preview({previewFunc} : {previewFunc : any}){
    return(<>
        <div><div className='h-screen w-screen bg-gray-900 opacity-50 absolute bottom-0 left-0'></div><div className="bottom-[0%] left-[38%] top-[20%] w-[25%] mx-[0%] absolute">
            <div className="bg-slate-400 grid p-[10%] content-start justify-items-middle rounded space-y-4">

                <button onClick={()=>previewFunc(false)}>Off</button>
            </div>
            
            </div>
        </div>
    
    </>)
}