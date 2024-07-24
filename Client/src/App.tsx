import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import ProtectedRoute from './protected';
import Login from "./login";
import Req from "./Req"
import { AddVpn, RemoveVpn } from './vpn';
import { AddDeviceRecord, ChangeDeviceType, LastLocation, RetireDevice } from './device';
import { RemoveTrialCert, AddTrialCert } from './cert';
import WebClip from './webclip';
import AppUpdate from './update';
import Edit from './edit';

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
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
