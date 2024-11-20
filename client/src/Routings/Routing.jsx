import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home/Home'
import Login from '../components/Authpages/Login'
import Signup from '../components/Authpages/Signup'
import VideoRoom from '../components/VideoRoom/VideoRoom'
import ImaggaImageAnalysis from '../components/Ai/ImaggaImageAnalysis'
import Ask from '../components/Home/ask';
// import Profile from '../components/Profile/Profile'

function Routing() {
  return (
    <div>
      <Routes>
       <Route path="/" element={<Home />} />
       {/* <Route path="/profile" element={<Profile />} /> */}
       <Route path="/login" element={<Login />} />
       <Route path="/sign-up" element={<Signup />} />
        <Route path='/videoCam' element={<VideoRoom />} />
        <Route path='/image' element={<ImaggaImageAnalysis />} />
        <Route path='/symptoms' element={<Ask/>} />
      </Routes>
    </div>
  )
}

export default Routing
