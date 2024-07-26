import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import ProtectedRoute from './protected';
import Login from "./login";
import Req from "./Req"
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
