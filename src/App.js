import React from "react";
import Dashboard from "./components/Dashboard";
import cdac_logo from "./components/assets/cdac_logo.png";
import "./App.css"
function App() {
  return (
    <div className="app">

      {/* Main Content */}
      <div className="main-content">
        {/* Title Container */}
        <div className="title-container">
          <img src={cdac_logo} alt="CDAC Logo" className="logo" />
          <h1 className="dashboard-title">CDAC ACTS Management Dashboard</h1>
        </div>
        
        {/* Dashboard Component */}
        <Dashboard />
      </div>
    </div>
  );
}

export default App;


//---------- code with login page, which is not as expected because it changes the dashboard layout
// import React, { useState } from 'react';
// import Dashboard from './components/Dashboard';
// import cdac_logo from './components/assets/cdac_logo.png';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';  // Assuming Login is in the components folder
// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const login = () => {
//     setIsAuthenticated(true); // Set authentication status to true
//   };

//   return (
//     <div className="app">
//       <Router>
//         <Routes>
//           {/* Routes for login and dashboard */}
//           <Route path="/" element={!isAuthenticated ? <Login onLogin={login} /> : <Dashboard />} />
//           <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login onLogin={login} />} />
//         </Routes>
//       </Router>

//       {/* Dashboard layout */}
//       {isAuthenticated && (
//         <div className="main-content">
//           <div className="title-container">
//             <img src={cdac_logo} alt="CDAC Logo" className="logo" />
//             <h1 className="dashboard-title">CDAC ACTS Management Dashboard</h1>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
