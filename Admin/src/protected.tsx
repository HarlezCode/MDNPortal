import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children} : any){
    const token = localStorage.getItem("Token");
    
    if (!token) return <Navigate to="../login"></Navigate>
 
    return children;
}