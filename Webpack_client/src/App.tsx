import React from 'react'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import ProtectedRoute from './protected';
import Login from "./login";
import Req from "./Req"
import Edit from './edit';
import Responses from './Responses';

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
  },
  {
    path : 'response',
    element: <ProtectedRoute><Responses/></ProtectedRoute>
  }
]
);

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
