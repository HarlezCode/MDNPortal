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
  },
  {
    path : '/req/add4gvpn',
    element : <ProtectedRoute><AddVpn/></ProtectedRoute>
  },
  {
    path : '/req/remove4gvpn',
    element : <ProtectedRoute><RemoveVpn/></ProtectedRoute>
  },
  {
    path : '/req/addnewdevice',
    element : <ProtectedRoute><AddDeviceRecord/></ProtectedRoute>
  },{
    path : '/req/addtrialcert',
    element : <ProtectedRoute><AddTrialCert/></ProtectedRoute>
  },{
    path : '/req/addwebclip',
    element : <ProtectedRoute><WebClip/></ProtectedRoute>
  },{
    path : '/req/appupdate',
    element : <ProtectedRoute><AppUpdate/></ProtectedRoute>
  },{
    path : '/req/changedevicetype',
    element : <ProtectedRoute><ChangeDeviceType/></ProtectedRoute>
  },{
    path : '/req/lookforlastlocation',
    element : <ProtectedRoute><LastLocation/></ProtectedRoute>
  },{
    path : '/req/retiredevice',
    element : <ProtectedRoute><RetireDevice/></ProtectedRoute>
  },
  {
    path : '/req/removetrialcert',
    element : <ProtectedRoute><RemoveTrialCert/></ProtectedRoute>
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
