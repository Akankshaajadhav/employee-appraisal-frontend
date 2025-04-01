

import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import DataGridDemo from "./components/employee";
import AddAppraisalCycle from "./components/AddAppraisalCycle";
import Questionnaire from "./components/Questionnaire";

import Login from "./components/LoginCompo"; // Corrected import
import Home from "./components/Home"

import { Button } from "@mui/material"; 
import { Box } from "@mui/system"; 

const MainApp = () => {
  const [screen, setScreen] = useState(1);

  return (
    <div>
      {/* Conditionally render components */}
      {screen === 1 && <AddAppraisalCycle />}
      {screen === 2 && <DataGridDemo />}
      {screen === 3 && <Questionnaire />}

      {/* Navigation buttons */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {screen > 1 && (
          <button onClick={() => setScreen(screen - 1)}>Previous</button>
        )}
        {(screen < 2 || screen < 3) && (
          <button onClick={() => setScreen(screen + 1)}>Next</button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainApp />} />
      </Routes>
    </Router>
  );
}
