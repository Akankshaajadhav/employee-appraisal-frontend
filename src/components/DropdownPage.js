import { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, InputLabel, Box, Typography } from "@mui/material";
import axios from "axios";
import LeadAssessmentModal from "../components/LeadAssessment";
const DropdownPage = () => {
  const [appraisalCycles, setAppraisalCycles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const employeeId = localStorage.getItem("employee_id"); // Get logged-in employee ID
  const [isModalOpen, setModalOpen] = useState(false); // State for modal


  useEffect(() => {
    if (!employeeId) return; // Ensure employee ID is available
    axios.get("http://127.0.0.1:8000/appraisal_cycle/")
      .then((response) => setAppraisalCycles(response.data))
      .catch((error) => console.error("Error fetching appraisal cycles:", error));

    axios.get(`http://127.0.0.1:8000/reporting/${employeeId}`)
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, [employeeId]);

//   return (
//     <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mt: 5 }}>
//       <Typography variant="h5">Select Appraisal Cycle & Employee</Typography>
//       <Box>
//       <FormControl sx={{ mt: 2, minWidth: 200 }}>
//         <InputLabel>Appraisal Cycle</InputLabel>
//         <Select value={selectedCycle} onChange={(e) => setSelectedCycle(e.target.value)}>
//           {appraisalCycles.map((cycle) => (
//             <MenuItem key={cycle.cycle_id} value={cycle.cycle_id}>
//               {cycle.cycle_name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <FormControl sx={{ mt: 2, minWidth: 200 }}>
//         <InputLabel>Employee</InputLabel>
//         <Select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
//           {employees.map((emp) => (
//             <MenuItem key={emp.employee_id} value={emp.employee_id}>
//               {emp.employee_name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       </Box>
//     </Box>
//   );


return (
    <Box sx={{ display: "flex", flexDirection: "column", mt: 5 ,ml:10}}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Select Appraisal Cycle & Employee
      </Typography>
  
      <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
        {/* Appraisal Cycle Dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ backgroundColor: "white", px: 1, top: "-4px" }}>
            Appraisal Cycle
          </InputLabel>
          <Select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            sx={{
              height: 48, // Ensure consistent height
              display: "flex",
              alignItems: "center",
              "& .MuiSelect-icon": {
                backgroundColor: "primary.main",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
                height: "32px", // Ensures it does not go outside
                width: "32px",
                right: "2px",
                top: "50%",
                transform: "translateY(-50%)",
                position: "absolute",
              },
            }}
          >
            {appraisalCycles.map((cycle) => (
              <MenuItem key={cycle.cycle_id} value={cycle.cycle_id}>
                {cycle.cycle_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* Employee Dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ backgroundColor: "white", px: 1, top: "-4px" }}>
            Employee
          </InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            sx={{
              height: 48, // Ensure consistent height
              display: "flex",
              alignItems: "center",
              "& .MuiSelect-icon": {
                backgroundColor: "primary.main",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
                height: "32px", // Ensures it does not go outside
                width: "32px",
                right: "2px",
                top: "50%",
                transform: "translateY(-50%)",
                position: "absolute",
              },
            }}
          >
            {employees.map((emp) => (
              <MenuItem key={emp.employee_id} value={emp.employee_id}>
                {emp.employee_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Open Modal Link */}
       <Box sx={{ mt: 3 }}>
        <a onClick={() => setModalOpen(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
          Open Assessment
        </a>
      </Box>

      {/* Lead Assessment Modal */}
      <LeadAssessmentModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedCycle={selectedCycle}
        employees={employees}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        />
      </Box>

       
    </Box>
  );
  

};

export default DropdownPage;
