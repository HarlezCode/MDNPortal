import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import ProtectedRoute from './protected';
import Login from "./login"
import Dashboard from "./dashboard"
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
    path : 'dashboard',
    element : <ProtectedRoute><Dashboard/></ProtectedRoute>
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
