import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'
import Frontpage from './components/Frontpage'
import './style/Frontpage.css'
import Homepage from './components/Homepage'
import './style/Homepage.css'



function App() {

  return (
     <>
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/Homepage" element={<Homepage />} />

      </Routes>
    </Router>
    
      
    </>
  )
}

export default App
