import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const isAuthenticated = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" component={Login} />
        {/*protected routes*/}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
