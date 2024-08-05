import React from 'react';
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import ProtectedRoute from './protected';
import Login from "./login"
import Dashboard from "./dashboard"
import Browse from "./browse"
import Webclips from './webclips';
import "./components.css"
import Tools from './tools';

const router = createBrowserRouter([
  {
    path : '/',
    element : <Navigate to="./login" />

  },
  {
    path : '/login',
    element : <Login />
  },
  {
    path : '/dashboard',
    element : <ProtectedRoute><Dashboard/></ProtectedRoute>
  },
  {
    path: '/dashboard/browse',
    element : <ProtectedRoute><Browse/></ProtectedRoute>
  },
  {
    path: '/dashboard/webclips',
    element: <ProtectedRoute><Webclips/></ProtectedRoute>

  },
  {
    path: '/dashboard/mitools',
    element: <ProtectedRoute><Tools/></ProtectedRoute>
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
