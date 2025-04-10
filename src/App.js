import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import AddAppraisalCycle from "./components/AddAppraisalCycle";
import EditAppraisalCycle from "./components/EditAppraisalCycle";
import Questionnaire from "./components/Questionnaire";
import HRLandingPage from "./components/HRLandingPage";
import Login from "./components/LoginCompo"; 
import DropdownPage from "./components/LeadLandingPage";                      //Change it as per your file
import SelfAssessmentRepo from "./components/SelfAssessmentRepo";

export default function App() {
  return (
    <Router>           
      <Routes>         
        <Route path="/" element={<Login />} />
        <Route path="/hr-home" element={<HRLandingPage />} />
        <Route path="/employee-home" element={<DropdownPage />} />
        <Route path="/add-appraisal" element={<AddAppraisalCycle />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/edit-appraisal/:cycle_id" element={<EditAppraisalCycle />} />
        <Route path="/historical-and-lead-report" element={<SelfAssessmentRepo />} />
      </Routes>
    </Router>
  );
}
