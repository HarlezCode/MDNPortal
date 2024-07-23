export function DefaultWrapper({children} : any){
    return(<div className="absolute left-[25%] w-[50%] top-[10%] border-solid border-4 mt-[1%] pt-[2%] border-blue-800 flex-1 col-1 bg-slate-300 pb-10 px-10 space-y-[10%] shadow-xl rounded place-item-center">
            {children}
        </div>)
}
export function DefaultInput({id} : {id : string}){
    return(<input className="bg-slate-100 text-slate-900 border-blue-800 border-2 rounded"name={id}/>)
}

export function BackButton({nav} : {nav : any}){
    return(<button className="mt-[4%] bg-slate-700" onClick={
        () =>{
            nav("../req");
        }
    }>Back</button>)
}

export function DefaultTitle({children} : any){
    return(<b><h3 className="text-2xl text-slate-900">{children}</h3></b>)
}