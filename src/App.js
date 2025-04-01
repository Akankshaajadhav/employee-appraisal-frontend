
// import React, { useState } from "react";
// import "./App.css";
// import DataGridDemo from "./components/employee";
// import AddAppraisalCycle from "./components/AddAppraisalCycle";
// import Questionnaire from "./components/Questionnaire";
// import { Button } from "@mui/material"; 
// import { Box } from "@mui/system"; 
// const ParentComponent = ({ onNext }) => {
//   const [showPage, setShowPage] = useState(true);

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Top-right Add button */}
//       {!showPage && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end", // Align button to right
//             padding: "10px",
//           }}
//         >
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setShowPage(true)}
//           >
//             Add 
//           </Button>
//         </Box>
//       )}

//       {showPage && <AddAppraisalCycle onClose={() => setShowPage(false)} />}
//     </div>
//   );
// };

// export default function App() {
//   const [screen, setScreen] = useState(1);

//   return (
//     <div>
//       {/* Conditionally render components */}
//       {screen === 1 && <ParentComponent onNext={() => setScreen(2)} />}
//       {screen === 2 && <DataGridDemo />}
//       {screen === 3 && <Questionnaire />}

//       {/* Navigation buttons */}
//       <div style={{ marginTop: "20px", textAlign: "center" }}>
//         {screen > 1 && <button onClick={() => setScreen(screen - 1)}>Previous</button>}
//         {screen < 3 && <button onClick={() => setScreen(screen + 1)}>Next</button>}
//       </div>
//     </div>
//   );
// }




// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
// import "./App.css";
// import DataGridDemo from "./components/employee";
// import AddAppraisalCycle from "./components/AddAppraisalCycle";
// import Questionnaire from "./components/Questionnaire";
// // import Login from "./components/Login";
// import {login_auth} from "./components/Login_auth";
// import { Button, Box } from "@mui/material"; 

// const ParentComponent = ({ onNext }) => {
//   const [showPage, setShowPage] = useState(true);

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Top-right Add button */}
//       {!showPage && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             padding: "10px",
//           }}
//         >
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setShowPage(true)}
//           >
//             Add 
//           </Button>
//         </Box>
//       )}
//       {showPage && <AddAppraisalCycle onClose={() => setShowPage(false)} />}
//     </div>
//   );
// };

// const MainApp = () => {
//   const [screen, setScreen] = useState(1);

//   return (
//     <div>
//       {/* Conditionally render components */}
//       {screen === 1 && <ParentComponent onNext={() => setScreen(2)} />}
//       {screen === 2 && <DataGridDemo />}
//       {screen === 3 && <Questionnaire />}

//       {/* Navigation buttons */}
//       <div style={{ marginTop: "20px", textAlign: "center" }}>
//         {screen > 1 && <button onClick={() => setScreen(screen - 1)}>Previous</button>}
//         {screen < 3 && <button onClick={() => setScreen(screen + 1)}>Next</button>}
//       </div>
//     </div>
//   );
// };

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<login_auth />} />
//         <Route path="/home" element={<MainApp />} />
//       </Routes>
//     </Router>
//   );
// }



// working for the login branch
// import React, {useState} from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";

// import DataGridDemo from "./components/employee";
// import AddAppraisalCycle from './components/AddAppraisalCycle'; 
// import Questionnaire from "./components/Questionnaire";


// import Login from "./components/LoginCompo"; // Corrected import
// import Home from "./components/Home"

// import { Button } from "@mui/material"; 
// import { Box } from "@mui/system"; 



// const MainApp = () => {
//   const [screen, setScreen] = useState(1);

//   return (
//     <div>
//       {/* Conditionally render components based on state */}
//       {screen === 1 && <AddAppraisalCycle />}
//       {screen === 2 && <DataGridDemo />}  
//       {screen === 3 && <Questionnaire />}


//       {/* Navigation buttons */}
//       <div style={{ marginTop: "20px" }}>
//         {screen > 1 && <button onClick={() => setScreen(screen - 1)}>Previous</button>}
//         {(screen < 2 ||screen <3) && <button onClick={() => setScreen(screen + 1)}>Next</button>}
//       </div>
//     </div>
//   );
// }


// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/home" element={<MainApp />} />
//       </Routes>
//     </Router>
//   );
// }




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/LoginCompo";
import DropdownPage from "./components/DropdownPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<DropdownPage employeeId={1} />} />
      </Routes>
    </Router>
  );
}

export default App;
