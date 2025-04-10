import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  TextField,
  Tooltip,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Button,
} from "@mui/material";
import axios from "axios";
import LeadAssessmentModal from "./LeadAssessmentModal";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const API_URL = process.env.REACT_APP_BASE_URL;

const DropdownPage = () => {
  const [appraisalCycles, setAppraisalCycles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [teamLeadName, setTeamLeadName] = useState("");
  const [userRole, setUserRole] = useState("");
  const employeeId = localStorage.getItem("employee_id");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCycleActive, setIsCycleActive] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  const [responses, setResponses] = useState({});
  const [cachedEmployee, setCachedEmployee] = useState("");
  const [cachedManager, setCachedManager] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 


  useEffect(() => {
    if (!employeeId) return;
    const fetchUserRoleAndCycles = async () => {
      try {
        const userResponse = await axios.get(`${API_URL}/employee_details/${employeeId}`);
        const role = userResponse.data.role.toLowerCase();
        setUserRole(role);
    
        if (role === "hr") {
          const cyclesResponse = await axios.get(`${API_URL}/appraisal_cycle/`);
          const filteredCycles = cyclesResponse.data.filter(
            (cycle) => cycle.status === "active" || cycle.status === "completed"
          );
          setAppraisalCycles(filteredCycles);
    
          const activeCycle = filteredCycles.find((cycle) => cycle.status === "active");
          if (activeCycle) {
            setSelectedCycle(activeCycle.cycle_id);
            setIsCycleActive(true);
    
            const empRes = await axios.get(`${API_URL}/employees/${activeCycle.cycle_id}/${employeeId}`);
            setEmployees(empRes.data);
    
            const defaultEmployeeId = empRes.data.some((emp) => emp.employee_id === employeeId)
              ? employeeId
              : empRes.data[0]?.employee_id || "";
    
            setSelectedEmployee(defaultEmployeeId);
    
            if (defaultEmployeeId) {
              const managerResponse = await axios.get(`${API_URL}/reporting_manager/${defaultEmployeeId}`);
              setTeamLeadName(managerResponse.data.reporting_manager_name);
            }
          }
        }
    
        else if (role === "team lead") {
          const allCyclesRes = await axios.get(`${API_URL}/appraisal_cycle/`);
          const cycles = allCyclesRes.data;
    
          const tlAssignedCycles = [];
    
          for (const cycle of cycles) {
            const empRes = await axios.get(`${API_URL}/employees/${cycle.cycle_id}/${employeeId}`);
            if (empRes.data && empRes.data.length > 0) {
              tlAssignedCycles.push({ ...cycle, employees: empRes.data });
            }
          }
    
          const filteredCycles = tlAssignedCycles.filter(
            (cycle) => cycle.status === "active" || cycle.status === "completed"
          );
    
          setAppraisalCycles(filteredCycles);
    
          const activeCycle = filteredCycles.find((cycle) => cycle.status === "active");
          if (activeCycle) {
            setSelectedCycle(activeCycle.cycle_id);
            setIsCycleActive(true);
    
            // Set default employee to team lead themselves
            setEmployees(activeCycle.employees);
            setSelectedEmployee(employeeId);
    
            const managerResponse = await axios.get(`${API_URL}/reporting_manager/${employeeId}`);
            setTeamLeadName(managerResponse.data.reporting_manager_name);
          }
        }

        else {
          // Regular employee
          const cyclesResponse = await axios.get(`${API_URL}/assessment/cycles/${employeeId}`);
          const filteredCycles = cyclesResponse.data.filter(
            (cycle) => cycle.status === "active" || cycle.status === "completed"
          );
          setAppraisalCycles(filteredCycles);
        
          const activeCycle = filteredCycles.find((cycle) => cycle.status === "active");
          if (activeCycle) {
            setSelectedCycle(activeCycle.cycle_id);
            setIsCycleActive(true);
        
            setSelectedEmployee(employeeId);
        
            //  Add this line to make sure the dropdown gets the employee list
            const employeesResponse = await axios.get(`${API_URL}/employees/${activeCycle.cycle_id}/${employeeId}`);
            setEmployees(employeesResponse.data);
        
            const managerResponse = await axios.get(`${API_URL}/reporting_manager/${employeeId}`);
            setTeamLeadName(managerResponse.data.reporting_manager_name);
          }
        }
        
      } catch (error) {
        console.error("Error fetching user role or cycles:", error);
      }
    };

    
    fetchUserRoleAndCycles();
  }, [employeeId]);

  useEffect(() => {
    const fetchAssessmentDataAndResponses = async () => {
      if (!selectedCycle || !selectedEmployee) return;
  
      const questionOwnerId = userRole === "team lead" ? employeeId : selectedEmployee; // Who owns the questions
      // const questionOwnerId = selectedEmployee; // Always the target of the assessment


      // const responseOwnerId = selectedEmployee; // Who's being assessed
      const responseOwnerId = userRole === "team lead" ? employeeId : selectedEmployee;

      try {
        const questionsRes = await axios.get(`${API_URL}/assessment/questions/${questionOwnerId}/${selectedCycle}`);
        const questions = questionsRes.data || [];
        console.log("Fetched Questions:", questions);
        setAssessmentData(questions);
      
        try {
          const responseRes = await axios.get(`${API_URL}/assessment/responses/${responseOwnerId}/${selectedCycle}`);
          const previous = {};
      
          responseRes.data?.forEach((res) => {
            previous[res.question_id] = res.option_ids?.length > 0
              ? res.option_ids
              : res.response_text?.[0] || "";
          });
      
          setResponses(previous);
        } catch (err) {
          // Allow 404s for no responses yet
          if (err.response?.status === 404) {
            setResponses({});
          } else {
            console.error("Error fetching responses:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching assessment questions:", error);
        setAssessmentData([]);
        setResponses({});
      }
      
    };
  
    fetchAssessmentDataAndResponses();
  }, [selectedCycle, selectedEmployee, userRole]);
  
  const openModal = () => {
    setCachedEmployee(selectedEmployee);
    setCachedManager(teamLeadName);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedEmployee(cachedEmployee);
    setTeamLeadName(cachedManager);
    setModalOpen(false);
  };

  const handleEmployeeChange = async (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    setTeamLeadName("");
  
    if (userRole !== "team lead") {
      setAssessmentData([]);
      setResponses({});
    }
  
    try {
      const managerResponse = await axios.get(`${API_URL}/reporting_manager/${empId}`);
      setTeamLeadName(managerResponse.data.reporting_manager_name);
    } catch (error) {
      console.error("Error fetching reporting manager:", error);
    }
  };
  
  const handleCycleChange = async (e) => {
    const cycleId = e.target.value;
    setSelectedCycle(cycleId);
  
    try {
      const cycleResponse = await axios.get(`${API_URL}/appraisal_cycle/${cycleId}`);
      setIsCycleActive(cycleResponse.data.status === "active");
  
      const employeesResponse = await axios.get(`${API_URL}/employees/${cycleId}/${employeeId}`);
      setEmployees(employeesResponse.data);
  
      if (userRole === "team lead") {
        // For Team Leads, always default to themselves
        setSelectedEmployee(employeeId);
  
        const managerRes = await axios.get(`${API_URL}/reporting_manager/${employeeId}`);
        setTeamLeadName(managerRes.data.reporting_manager_name);
      } else {
        // HR or employee flow
        const userExists = employeesResponse.data.some((emp) => emp.employee_id === employeeId);
        const defaultEmpId = userExists
          ? employeeId
          : employeesResponse.data[0]?.employee_id || "";
  
        setSelectedEmployee(defaultEmpId);
  
        if (defaultEmpId) {
          const managerRes = await axios.get(`${API_URL}/reporting_manager/${defaultEmpId}`);
          setTeamLeadName(managerRes.data.reporting_manager_name);
        }
      }
    } catch (error) {
      console.error("Error handling cycle change:", error);
    }
  };
  
  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const renderInputField = (question) => {
    const { question_id, question_type, options = [] } = question;
  
    switch (question_type.toLowerCase()) {
      case "mcq":
        return (
          <Box sx={{ pl: 5 }}>
            {options.map((option) => (
              <FormControlLabel
                key={option.option_id}
                control={
                  <Checkbox
                    checked={responses[question_id]?.includes(option.option_id) || false}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(responses[question_id] || []), option.option_id]
                        : responses[question_id].filter((id) => id !== option.option_id);
                      handleResponseChange(question_id, newValue);
                    }}
                    disabled={!isCycleActive}
                  />
                }
                label={option.option_text}
              />
            ))}
          </Box>
        );
  
      case "single choice":
      case "yes/no":
        return (
          <Box sx={{ pl: 5 }}>
            <RadioGroup
              value={responses[question_id] || ""}
              onChange={(e) => handleResponseChange(question_id, e.target.value)}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.option_id}
                  value={option.option_id}
                  control={<Radio disabled={!isCycleActive} />}
                  label={option.option_text}
                />
              ))}
            </RadioGroup>
          </Box>
        );
  
      case "descriptive":
        return (
          <Box sx={{ pl: 5 }}>
            <TextareaAutosize
              minRows={2}
              value={responses[question_id] || ""}
              onChange={(e) => handleResponseChange(question_id, e.target.value)}
              disabled={!isCycleActive}
              style={{ 
                width: "30%",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </Box>
        );
  
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = assessmentData.map((question) => {
        const response = responses[question.question_id];
        const question_type = question.question_type.toLowerCase();
  
        if (question_type === "mcq") {
          return {
            question_id: question.question_id,
            allocation_id: question.allocation_id,
            cycle_id: selectedCycle,
            employee_id: selectedEmployee,
            option_ids: response || [],
            response_text: null,
          };
        } else if (["single choice", "yes/no"].includes(question_type)) {
          return {
            question_id: question.question_id,
            allocation_id: question.allocation_id,
            cycle_id: selectedCycle,
            employee_id: selectedEmployee,
            option_ids: [parseInt(response)],
            response_text: null,
          };
        } else if (question_type === "descriptive") {
          return {
            question_id: question.question_id,
            allocation_id: question.allocation_id,
            cycle_id: selectedCycle,
            employee_id: selectedEmployee,
            option_ids: [],
            response_text: [response],
          };
        } else {
          return null;
        }
      }).filter(Boolean);
  
      await axios.post(`${API_URL}/assessment/submit`, payload);
  
      setSnackbarMessage("Responses submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error submitting responses:", error);
      setSnackbarMessage("Failed to submit responses.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

  const refreshAssessmentData = async () => {
    if (!selectedCycle || !selectedEmployee) return;
  
    const questionOwnerId = userRole === "team lead" ? employeeId : selectedEmployee;
    const responseOwnerId = userRole === "team lead" ? employeeId : selectedEmployee;
  
    try {
      const questionsRes = await axios.get(`${API_URL}/assessment/questions/${questionOwnerId}/${selectedCycle}`);
      const questions = questionsRes.data || [];
      setAssessmentData(questions);
  
      try {
        const responseRes = await axios.get(`${API_URL}/assessment/responses/${responseOwnerId}/${selectedCycle}`);
        const previous = {};
        responseRes.data?.forEach((res) => {
          previous[res.question_id] = res.option_ids?.length > 0
            ? res.option_ids
            : res.response_text?.[0] || "";
        });
        setResponses(previous);
      } catch (err) {
        if (err.response?.status === 404) {
          setResponses({});
        } else {
          console.error("Error fetching responses:", err);
        }
      }
    } catch (error) {
      console.error("Error refreshing assessment data:", error);
      setAssessmentData([]);
      setResponses({});
    }
  };
  

  return (
    <Card sx={{m:2,  justifyContent: "center" }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", mt:2 }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel sx={{background:"white", pl:1,pr:1}}>Appraisal Cycle</InputLabel>
              <Select value={selectedCycle} onChange={handleCycleChange}>
                {appraisalCycles.map((cycle) => (
                  <MenuItem key={cycle.cycle_id} value={cycle.cycle_id}>
                    {cycle.cycle_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel sx={{background:"white", pl:1,pr:1}}>Employee</InputLabel>
              <Select value={selectedEmployee} onChange={handleEmployeeChange}>
                {employees.map((emp) => (
                  <MenuItem key={emp.employee_id} value={emp.employee_id}>
                    <Tooltip title={`${emp.employee_id} - ${emp.employee_name}`} placement="top" arrow>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block", maxWidth: "200px" }}>
                        {emp.employee_id} - {emp.employee_name}
                      </span>
                    </Tooltip>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedEmployee && (
              <TextField
                label="Reporting Manager"
                value={teamLeadName || "N/A"}
                InputProps={{ readOnly: true }}
                variant="standard"
              />
            )}

            {(userRole === "team lead" || userRole === "Team Lead") && (
              <Box sx={{ position: "absolute", left: "85%", top: "10%" }}>
                <a
                  onClick={openModal}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline", fontSize: "20px" }}
                >
                  Lead Assessment
                </a>
              </Box>
            )}
          </Box>
        </CardContent>

      <Card sx={{ width: "100%",mt:2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }} color="primary" fontWeight={"bold"}>
            <span>
              Self Assessment {selectedCycle && `: ${appraisalCycles.find(cycle => cycle.cycle_id === selectedCycle)?.cycle_name || ''}`}
            </span>
            <Tooltip title="Refresh responses" arrow>
              <IconButton onClick={refreshAssessmentData} size="small" color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Typography>


          {assessmentData.length > 0 ? (
            <Box mt={4}>
              {assessmentData.map((question, index) => (
                <Box key={question.question_id} mb={3}>
                  <Typography variant="subtitle1" fontWeight={"bold"}>
                    {index + 1}. {question.question_text}
                  </Typography>
                  {renderInputField(question)}
                </Box>
              ))}
              

            {isCycleActive && (
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            )}

            </Box>
          ) : (
            <Box mt={4}>
              <Typography variant="body1" color="text.secondary">
                No questions allocated for you.
              </Typography>
            </Box>
          )}

          <LeadAssessmentModal
            open={isModalOpen}
            onClose={closeModal}
            selectedCycle={selectedCycle}
            employees={employees}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            employeeId={employeeId}
            isCycleActive={isCycleActive}
            prefilledData={null}
          />
        </CardContent>
      </Card>

      <Snackbar
  open={snackbarOpen}
  autoHideDuration={4000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>

    </Card>
  );
};

export default DropdownPage;


