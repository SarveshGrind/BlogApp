import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth';
import {login, logout} from './store/authSlice'
import { Headers, Footers } from './components';
import { useSelector } from 'react-redux' 

function App() {
  const [loading, setLoading] = useState(true); 
  const dispatch  = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      }
    })
    .catch( (error) => {
      console.log("App.jsx :: useEffect :: error", error)}
      
    )
    .finally(() => setLoading(false))
  }
, [])

//  add catch as well

  return !loading ? (
    <>
    <div className='min-h-screen flex flex-wrap bg-gray-400'>
      <div className='w-full block'>
        <Headers/>
          <main>
            <Outlet/>
          </main>
        <Footers/>
      </div>
    </div>
    </>
   ) : null
   
}

export default App
