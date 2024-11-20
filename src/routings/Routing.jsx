import React from 'react'
import Home from '../components/Home/Home'
import Profile from '../components/Profile/Profile'
import { Route, Routes } from 'react-router-dom'

function Routing() {
  return (
    <div>
         <Routes>

       <Route path="/" element={<Home />} />
       <Route path="/profile" element={<Profile />} />
         </Routes>
    </div>
  )
}

export default Routing
