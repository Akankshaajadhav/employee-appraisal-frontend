import React from "react";
import './App.css';
import DataGridDemo from "./components/employee";
import AddAppraisalCycle from './components/AddAppraisalCycle'; 

function App() {
  return (
    <div>
      <DataGridDemo />  
      <AddAppraisalCycle />
    </div>
  );
}

export default App;
