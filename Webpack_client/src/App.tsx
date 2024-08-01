import React from 'react'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import ProtectedRoute from './protected';
import Login from "./login";
import Req from "./Req"
import Edit from './edit';
import "./index.css";

const router = createBrowserRouter([
  {
    path : '/',
    element : <Navigate to="./login" />

  },
  {
    path : 'login',
    element : <Login />
  },
  {
    path : 'req',
    element : <ProtectedRoute><Req/></ProtectedRoute>
  },
  {
    path : 'edit',
    element : <ProtectedRoute><Edit/></ProtectedRoute>
  }
]
);

function App() {
  return (
    <div id='root'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
