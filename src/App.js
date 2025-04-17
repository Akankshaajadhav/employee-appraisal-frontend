import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import AddAppraisalCycle from "./components/AddAppraisalCycle";
import EditAppraisalCycle from "./components/EditAppraisalCycle";
import Questionnaire from "./components/Questionnaire";
import HRLandingPage from "./components/HRLandingPage";
import Login from "./components/LoginCompo";                    
import HistoricalReportTable from "./components/HistoricalReport";                 
import SelfAssessmentRepo from "./components/SelfAssessmentRepo";
import DropdownPage from "./components/employee_assessment"; 
import MainPage from "./components/MainPage";
export default function App() {
  return (
    <Router>           
      <Routes>         
        <Route path="/" element={<Login />} />
        <Route path="/hr-home" element={<HRLandingPage />} />
        <Route path="/employee-home" element={<DropdownPage />} />
        <Route path="/admin-home" element={<MainPage />} /> {/* Updated to use MainPage */}
        <Route path="/add-appraisal" element={<AddAppraisalCycle />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/historical-report" element={<HistoricalReportTable />} />        
        <Route path="/edit-appraisal/:cycle_id" element={<EditAppraisalCycle />} />
        <Route path="/self-assessment-report" element={<SelfAssessmentRepo />} />

      </Routes>
    </Router>
  );
}

// import React, { useState } from 'react';
// import SideNavigation from './components/AppLayout';
// import DropdownPage from './components/DropdownPage';
// import HRLandingPage from './components/HRLandingPage'; // Your existing HR landing page

// function App() {
//   const [currentPage, setCurrentPage] = useState('hr-dashboard');

//   const handleNavigation = (pageId) => {
//     setCurrentPage(pageId);
//   };

//   // Render the appropriate component based on currentPage
//   const renderPage = () => {
//     switch(currentPage) {
//       case 'hr-dashboard':
//         return <HRLandingPage />;
//       case 'assessment':
//         return <DropdownPage />;
//       default:
//         return <HRLandingPage />;
//     }
//   };

//   return (
//     <SideNavigation 
//       currentPage={currentPage} 
//       onNavigate={handleNavigation}
//     >
//       {renderPage()}
//     </SideNavigation>
//   );
// }

// export default App;
