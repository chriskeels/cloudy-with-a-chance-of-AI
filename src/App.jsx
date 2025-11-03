import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
     <>
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/learnmore" element={<Learnmore />} />
        <Route path="/home" element={<Home />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        {/* <Route path="/settings" element={<Settings />} /> */}

      </Routes>
    </Router>
    
      
    </>
  )
}

export default App
