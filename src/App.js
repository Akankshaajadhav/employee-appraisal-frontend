import React,{ useState } from "react";
import './App.css';
import DataGridDemo from "./components/employee";
import AddAppraisalCycle from './components/AddAppraisalCycle'; 
import Questionnaire from "./components/Questionnaire";
// function App() {
//   return (
//     <div>
        
//       <AddAppraisalCycle />
//       <DataGridDemo />
//       <Questionnaire />
//     </div>
//   );
// }

// export default App;


// import React, { useState } from "react";
// import './App.css';
// import DataGridDemo from "./components/employee";
// import AddAppraisalCycle from './components/AddAppraisalCycle';

function App() {
  const [screen, setScreen] = useState(1);

  return (
    <div>
      {/* Conditionally render components based on state */}
      {screen === 1 && <AddAppraisalCycle />}
      {screen === 2 && <DataGridDemo />}  
      {screen === 3 && <Questionnaire />}


      {/* Navigation buttons */}
      <div style={{ marginTop: "20px" }}>
        {screen > 1 && <button onClick={() => setScreen(screen - 1)}>Previous</button>}
        {(screen < 2 ||screen <3) && <button onClick={() => setScreen(screen + 1)}>Next</button>}
      </div>
    </div>
  );
}

export default App;
