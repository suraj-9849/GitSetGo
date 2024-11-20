import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home/Home'
// import RoomPage from "./components/Room/Room";
import Login from '../components/Authpages/Login'
import Signup from '../components/Authpages/Signup'
import ImaggaImageAnalysis from '../components/Ai/ImaggaImageAnalysis'
import RoomPage from '../components/Room/RoomPage'
import VideoCam from '../components/VideoCam/VideoCam'
// import Profile from '../components/Profile/Profile'

function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path='/videoCam' element={<VideoCam />} />
        <Route path='/image' element={<ImaggaImageAnalysis />} />
        <Route path="/videocam/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  )
}

export default Routing
