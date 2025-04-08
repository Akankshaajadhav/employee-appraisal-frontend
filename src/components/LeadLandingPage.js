// import { useState, useEffect } from "react";
// import { MenuItem, Select, FormControl, InputLabel, Box, Typography, TextField } from "@mui/material";
// import axios from "axios";
// import LeadAssessmentModal from "./LeadAssessmentModal";

// const DropdownPage = () => {
//   const [appraisalCycles, setAppraisalCycles] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedCycle, setSelectedCycle] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [reportingManager, setReportingManager] = useState("");
//   const [userRole, setUserRole] = useState(""); // Store logged-in user's role
//   const employeeId = localStorage.getItem("employee_id"); // Get logged-in employee ID
//   const [isModalOpen, setModalOpen] = useState(false); // State for modal
//   const [teamLeadName, setTeamLeadName] = useState(""); // Store Team Lead name
//   const [isCycleActive, setIsCycleActive] = useState(true); // Track cycle status
//   const [cycleStatus, setCycleStatus] = useState(""); // Store cycle status
//   const [prefilledData, setPrefilledData] = useState(null); // Store previous ratings

//   useEffect(() => {
//     // / Get logged-in employee ID
//   const employeeId = localStorage.getItem("employee_id");
//     if (!employeeId) return; // Ensure employee ID is available
    
//     // Set it as the selected employee if it exists and no employee is currently selected
//   if (employeeId && !selectedEmployee && employees.length > 0) {
//     setSelectedEmployee(employeeId);
//   }

//     axios.get("http://127.0.0.1:8000/appraisal_cycle/")
//       // .then((response) => setAppraisalCycles(response.data))
//       .then((response) => {
//         // Filter only "Completed" and "Active" cycles
//         const filteredCycles = response.data.filter(
//           (cycle) => cycle.status === "completed" || cycle.status === "active"
//         );
//         setAppraisalCycles(filteredCycles);
//       })
//       .catch((error) => console.error("Error fetching appraisal cycles:", error));

//     axios.get(`http://127.0.0.1:8000/reporting/${employeeId}`)
//       .then((response) => setEmployees(response.data))
//       .catch((error) => console.error("Error fetching employees:", error));

//       //fetch user role
//     axios.get(`http://127.0.0.1:8000/employee_details/${employeeId}`) // Fetch user role
//       .then((response) => {setUserRole(response.data.role);
//       // If HR, fetch all employees; otherwise, fetch only their reporting employees
//       if (response.data.role.toLowerCase() === "hr") {
//         axios.get("http://127.0.0.1:8000/")
//           .then((empResponse) => setEmployees(empResponse.data))
//           .catch((error) => console.error("Error fetching all employees:", error));
//       } else {
//         axios.get(`http://127.0.0.1:8000/reporting/${employeeId}`)
//           .then((empResponse) => setEmployees(empResponse.data))
//           .catch((error) => console.error("Error fetching employees:", error));
//       }
//       console.log("Updated Employees:", employees);
//       console.log("priifilled data : ", prefilledData);
//     })
//       .catch((error) => console.error("Error fetching employee role:", error));
//   }, [employeeId]);

//   // Handle employee selection
//   const handleEmployeeChange = (e) => {
//     const empId = e.target.value;
//     setSelectedEmployee(empId);
//     setTeamLeadName(""); // Reset team lead name
//     setPrefilledData(null); // Reset previously filled data when employee changes

//     // Find selected employee's reporting manager
//     const selectedEmp = employees.find(emp => emp.employee_id === empId);
//     if (selectedEmp && selectedEmp.reporting_manager_name) {
//       setTeamLeadName(selectedEmp.reporting_manager_name);
//     }

//     // Fetch reporting manager from backend
//     axios.get(`http://127.0.0.1:8000/reporting_manager/${empId}`)
//       .then((response) => setTeamLeadName(response.data.reporting_manager_name))
//       .catch((error) => console.error("Error fetching reporting manager:", error));

//     // Fetch previously filled data if cycle is inactive
//     if (!isCycleActive && selectedCycle) {
      
//       axios.get(`http://127.0.0.1:8000/lead_assessment/previous_data/${selectedCycle}/${empId}`)
//   .then((response) => {
//     // Remove duplicates based on `parameter_id`
//     const uniqueRatings = response.data.ratings.reduce((acc, curr) => {
//       if (!acc.some(item => item.parameter_id === curr.parameter_id)) {
//         acc.push(curr);
//       }
//       return acc;
//     }, []);

//     setPrefilledData({ 
//       // ...response.data, 
//       // ratings: uniqueRatings 
//       response
//     });
//   })
//   .catch((error) => console.error("Error fetching previous assessment data:", error));


//     }
//   };

//   const handleCycleChange = async (e) => {
//     const cycleId = e.target.value;
//     setSelectedCycle(cycleId);
//     setPrefilledData(null); // Reset previous data when changing cycles

//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/appraisal_cycle/${cycleId}`);
//       const isActive = response.data.status === "active";
//       setIsCycleActive(isActive);
//       setCycleStatus(response.data.status);
     
//       // Fetch employees under the logged-in team lead for the selected cycle 
//     const employeesResponse = await axios.get(`http://127.0.0.1:8000/employees/${cycleId}/${employeeId}`);
//     console.log(employeesResponse.data);
//     console.log("cycle status ", isActive);
//     // setEmployees([]);
//     setEmployees(employeesResponse.data);

//       // Fetch previous ratings if the selected cycle is inactive
//       if (!isActive && selectedEmployee) {
//         const ratingsResponse = await axios.get(`http://127.0.0.1:8000/lead_assessment/lead_assessment/previous_data/${cycleId}/${selectedEmployee}`);
//         setPrefilledData(ratingsResponse.data);
//         console.log(ratingsResponse);
//       }
//     } catch (error) {
//       console.error("Error fetching cycle status or previous data:", error);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", mt: 5, ml: 10 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Select Appraisal Cycle & Employee
//       </Typography>

//       <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>

//         {/* Appraisal Cycle Dropdown */}
//         <FormControl sx={{ minWidth: 200 }} size="small">
//           <InputLabel sx={{ backgroundColor: "white", px: 1, top: "-4px" }}>
//             Appraisal Cycle
//           </InputLabel>
//           <Select
//             value={selectedCycle}
//             onChange={handleCycleChange} r
//             sx={{
//               height: 40, 
//               display: "flex",
//               alignItems: "center",
//               "& .MuiSelect-icon": {
//                 backgroundColor: "primary.main",
//                 color: "white",
//                 padding: "3px",
//                 borderRadius: "4px",
//                 height: "32px", 
//                 width: "32px",
//                 right: "2px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 position: "absolute",
//               },
//             }}
//           >
//             {appraisalCycles.map((cycle) => (
//               <MenuItem key={cycle.cycle_id} value={cycle.cycle_id}>
//                 {cycle.cycle_name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

       
//           {/* Employee Dropdown */}

// <FormControl sx={{ minWidth: 150 }} size="small">
//   <InputLabel sx={{ backgroundColor: "white", px: 1, top: "-4px" }}>
//     Employee
//   </InputLabel>
//   <Select
//     value={selectedEmployee}
//     onChange={handleEmployeeChange}
//     sx={{
//       height: 40, 
//       display: "flex",
//       alignItems: "center",
//       "& .MuiSelect-icon": {
//         backgroundColor: "primary.main",
//         color: "white",
//         padding: "3px",
//         borderRadius: "4px",
//         height: "32px", 
//         width: "32px",
//         right: "2px",
//         top: "50%",
//         transform: "translateY(-50%)",
//         position: "absolute",
//       },
//     }}
//   >
//     {employees.map((emp) => (
//       <MenuItem key={emp.employee_id} value={emp.employee_id}>
//         {emp.employee_id} - {emp.employee_name}
//       </MenuItem>
//     ))}
//   </Select>
// </FormControl>


//        {/* Reporting Manager Name - Only visible after employee selection */}
// {selectedEmployee && (
//   <TextField 
//     // label="Reporting Manager"
//     value={teamLeadName || "N/A"}
//     InputProps={{
//       readOnly: true,
//     }}
//     variant="standard"
    
//   />
// )}

//         {/* Open Modal Link - Only Visible for Team Leads */}
//         {(userRole === "Team Lead" || userRole === "team lead") && (
//           <Box sx={{ position: "absolute", left: "80%", top: "4%" }}>
//             <a
//               onClick={() => setModalOpen(true)}
//               style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
//             >
//               Lead Assessment
//             </a>
//           </Box>
//         )}
//       </Box>

//       {/* Lead Assessment Modal */}
//       <LeadAssessmentModal
//         open={isModalOpen}
//         onClose={() => setModalOpen(false)}
//         selectedCycle={selectedCycle}
//         employees={employees}
//         selectedEmployee={selectedEmployee}
//         setSelectedEmployee={setSelectedEmployee}
//         employeeId={employeeId}
//         isCycleActive={isCycleActive} // Pass cycle status to modal
//         prefilledData={prefilledData} // Pass previous ratings
//       />
//     </Box>
//   );
// };

// export default DropdownPage;

import { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, InputLabel, Box, Typography, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import LeadAssessmentModal from "./LeadAssessmentModal";
const API_URL = process.env.REACT_APP_BASE_URL; // from .env file

const DropdownPage = () => {
  const [appraisalCycles, setAppraisalCycles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [reportingManager, setReportingManager] = useState("");
  const [userRole, setUserRole] = useState(""); // Store logged-in user's role
  const employeeId = localStorage.getItem("employee_id"); // Get logged-in employee ID
  const [isModalOpen, setModalOpen] = useState(false); // State for modal
  const [teamLeadName, setTeamLeadName] = useState(""); // Store Team Lead name
  const [isCycleActive, setIsCycleActive] = useState(true); // Track cycle status
  const [cycleStatus, setCycleStatus] = useState(""); // Store cycle status
  const [prefilledData, setPrefilledData] = useState(null); // Store previous ratings

  // Fetch appraisal cycles
  useEffect(() => {
    axios.get(`${API_URL}/appraisal_cycle/`)
      .then((response) => {
        // Filter only "Completed" and "Active" cycles
        const filteredCycles = response.data.filter(
          (cycle) => cycle.status === "completed" || cycle.status === "active"
        );
        setAppraisalCycles(filteredCycles);
        // Find the active cycle and set it as selected
        const activeCycle = response.data.find(cycle => cycle.status === "active");
        if (activeCycle) {
            setSelectedCycle(activeCycle.cycle_id);
        }

      })
      .catch((error) => console.error("Error fetching appraisal cycles:", error));
  }, []);

  // Fetch user role and employees
  useEffect(() => {
    if (!employeeId) return; // Ensure employee ID is available

    // Fetch user role first
    axios.get(`${API_URL}/employee_details/${employeeId}`)
      .then((response) => {
        setUserRole(response.data.role);
        
        // Based on role, fetch appropriate employees
        if (response.data.role.toLowerCase() === "hr") {
          return axios.get(`${API_URL}/`);
        } else {
          return axios.get(`${API_URL}/reporting/${employeeId}`);
        }
      })
      .then((empResponse) => {
        setEmployees(empResponse.data);
        // Now that we have the employees list, set the current user as selected
        setSelectedEmployee(employeeId);
        
        // Find and set reporting manager for the logged-in user
        const currentUser = empResponse.data.find(emp => emp.employee_id === employeeId);
        if (currentUser && currentUser.reporting_manager_name) {
          setTeamLeadName(currentUser.reporting_manager_name);
        } else {
          // If not found in the initial response, fetch specifically
          axios.get(`${API_URL}/reporting_manager/${employeeId}`)
            .then((managerResponse) => setTeamLeadName(managerResponse.data.reporting_manager_name))
            .catch((error) => console.error("Error fetching reporting manager:", error));
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [employeeId]);

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    setTeamLeadName(""); // Reset team lead name
    setPrefilledData(null); // Reset previously filled data when employee changes

    // Fetch reporting manager from backend
    axios.get(`${API_URL}/reporting_manager/${empId}`)
      .then((response) => setTeamLeadName(response.data.reporting_manager_name))
      .catch((error) => console.error("Error fetching reporting manager:", error));

    // Fetch previously filled data if cycle is inactive
    if (!isCycleActive && selectedCycle) {
      axios.get(`${API_URL}/lead_assessment/previous_data/${selectedCycle}/${empId}`)
        .then((response) => {
          // Remove duplicates based on `parameter_id`
          const uniqueRatings = response.data.ratings.reduce((acc, curr) => {
            if (!acc.some(item => item.parameter_id === curr.parameter_id)) {
              acc.push(curr);
            }
            return acc;
          }, []);

          setPrefilledData({ 
            response
          });
        })
        .catch((error) => console.error("Error fetching previous assessment data:", error));
    }
  };

  const handleCycleChange = async (e) => {
    const cycleId = e.target.value;
    setSelectedCycle(cycleId);
    setPrefilledData(null); // Reset previous data when changing cycles

    try {
      const response = await axios.get(`${API_URL}/appraisal_cycle/${cycleId}`);
      const isActive = response.data.status === "active";
      setIsCycleActive(isActive);
      setCycleStatus(response.data.status);
     
      // Fetch employees under the logged-in team lead for the selected cycle 
      const employeesResponse = await axios.get(`${API_URL}/employees/${cycleId}/${employeeId}`);
      setEmployees(employeesResponse.data);
      
      // Maintain the current user selection if they exist in the new employee list
      const userExists = employeesResponse.data.some(emp => emp.employee_id === employeeId);
      if (userExists) {
        setSelectedEmployee(employeeId);
      } else if (employeesResponse.data.length > 0) {
        // Otherwise select the first employee in the list
        setSelectedEmployee(employeesResponse.data[0].employee_id);
      } else {
        setSelectedEmployee("");
      }

      // Fetch previous ratings if the selected cycle is inactive
      if (!isActive && selectedEmployee) {
        const ratingsResponse = await axios.get(`${API_URL}/lead_assessment/lead_assessment/previous_data/${cycleId}/${selectedEmployee}`);
        setPrefilledData(ratingsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching cycle status or previous data:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mt: 5, ml: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Select Appraisal Cycle & Employee
      </Typography>

      <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>

        {/* Appraisal Cycle Dropdown */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel sx={{ backgroundColor: "white", px: 1, top: "-4px" }}>
            Appraisal Cycle
          </InputLabel>
          <Select
            value={selectedCycle}
            onChange={handleCycleChange}
            sx={{
              height: 40, 
              display: "flex",
              alignItems: "center",
              "& .MuiSelect-icon": {
                backgroundColor: "primary.main",
                color: "white",
                padding: "3px",
                borderRadius: "4px",
                height: "32px", 
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
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel sx={{ backgroundColor: "white", px: 1, top: "-4px" }}>
            Employee
          </InputLabel>
          <Select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            sx={{
              height: 40, 
              display: "flex",
              alignItems: "center",
              "& .MuiSelect-icon": {
                backgroundColor: "primary.main",
                color: "white",
                padding: "3px",
                borderRadius: "4px",
                height: "32px", 
                width: "32px",
                right: "2px",
                top: "50%",
                transform: "translateY(-50%)",
                position: "absolute",
              },
            }}
          >
            {/* {employees.map((emp) => (
              <MenuItem key={emp.employee_id} value={emp.employee_id}>
                
                {emp.employee_id} - {emp.employee_name}
              </MenuItem>
            ))} */}

      {employees.map((emp) => (
      <MenuItem key={emp.employee_id} value={emp.employee_id}>
        <Tooltip
          title={`${emp.employee_id} - ${emp.employee_name}`}
          placement="top"
          arrow
          
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '200px' }}>
            {emp.employee_id} - {emp.employee_name}
          </span>
        </Tooltip>
      </MenuItem>
    ))}
          </Select>
        </FormControl>

        {/* Reporting Manager Name - Only visible after employee selection */}
        {selectedEmployee && (
          <TextField 
            value={teamLeadName || "N/A"}
            InputProps={{
              readOnly: true,
            }}
            variant="standard"
          />
        )}

        {/* Open Modal Link - Only Visible for Team Leads */}
        {(userRole === "Team Lead" || userRole === "team lead") && (
          <Box sx={{ position: "absolute", left: "80%", top: "4%" }}>
            <a
              onClick={() => setModalOpen(true)}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              Lead Assessment
            </a>
          </Box>
        )}
      </Box>

      {/* Lead Assessment Modal */}
      <LeadAssessmentModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedCycle={selectedCycle}
        employees={employees}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        employeeId={employeeId}
        isCycleActive={isCycleActive} // Pass cycle status to modal
        prefilledData={prefilledData} // Pass previous ratings
      />
    </Box>
  );
};

export default DropdownPage;