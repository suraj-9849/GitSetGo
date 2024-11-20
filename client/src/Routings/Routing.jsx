import React from 'react'
import Profile from '../components/Profile/Profile'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home/Home'
import Login from '../components/Authpages/Login'
import Signup from '../components/Authpages/Signup'

import VideoRoom from '../components/VideoRoom/VideoRoom'

function Routing() {
  return (
    <div>
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/profile" element={<Profile />} />
       <Route path="/login" element={<Login />} />
       <Route path="/sign-up" element={<Signup />} />
        <Route path='/videoCam' element={<VideoRoom />} />
      </Routes>
    </div>
  )
}

export default Routing
