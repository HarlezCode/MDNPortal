import React from 'react';
import { Navigate } from "react-router-dom";

/*
Middleware component to redirect not logged in users
Note: this doesn't serve any actual protection
*/

export default function ProtectedRoute({children} : any){
    const token = localStorage.getItem("Token");
    
    if (!token) return <Navigate to="../login"></Navigate>
 
    return children;
}