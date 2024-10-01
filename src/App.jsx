// src/App.js
import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ConnectionDashboard from './pages/ConnectionDashboard';
import Dashboard from './pages/Dashboard'; // Correct path to Dashboard

function App() {
  // State to hold connection data
  const [connectionData, setConnectionData] = useState([]);

  // Function to update connection data
  const updateCharts = (data) => {
    setConnectionData(data);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route 
            path="/dashboard" 
            element={<Dashboard data={connectionData} />} // Pass data to Dashboard
          />
          <Route 
            path="/" 
            element={<ConnectionDashboard updateCharts={updateCharts} />} // Pass update function
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
