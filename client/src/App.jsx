import React from 'react'
import "./index.css"
import Routing from './routings/Routing'
import Navbar from './components/navbar/navbar'


function App() {
  return (
    <div className='overflow-hidden montserrat '>
      <Navbar/> 
      <Routing/>
    </div>
  )
}

export default App