export default function Preview({previewFunc} : {previewFunc : any}){
    return(<>
        <div>
            <button onClick={()=>previewFunc(false)}>Off</button>
        </div>
    
    </>)
}