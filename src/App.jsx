import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Authpages from './pages/Authpages'
import Dashboard from './pages/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isLoggedIn 
              ? <Navigate to="/dashboard" /> 
              : <Authpages onLogin={() => setIsLoggedIn(true)} />
          } 
        />
        <Route path="/dashboard/*" element={
  isLoggedIn ? <Dashboard onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/" />
} />
      </Routes>
    </Router>
  )
}

export default App