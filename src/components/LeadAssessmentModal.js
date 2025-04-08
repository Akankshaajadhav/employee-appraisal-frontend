
import React, { useState, useEffect } from "react";
import {
  Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Button, Tooltip, Snackbar, Alert, IconButton, Radio,
  colors
} from "@mui/material";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs"; // Import dayjs
// import VisibilityIcon from '@mui/icons-material/Visibility';  // Eye icon
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
const API_URL = process.env.REACT_APP_BASE_URL; // from .env file



const LeadAssessmentModal = ({ open, onClose, selectedCycle, employees, selectedEmployee, setSelectedEmployee, employeeId }) => {
  const [parameters, setParameters] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [cycleStatus, setCycleStatus] = useState("active"); // Assume active by default
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const [readOnly, setReadOnly] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!selectedCycle || !selectedEmployee) return;

    // Fetch cycle status
    axios.get(`${API_URL}/appraisal_cycle/status/${selectedCycle}`)
      .then(response => { 
        console.log("Cycle Status from API:", response.data.status);
        setCycleStatus(response.data.status);
        setReadOnly(response.data.status !== "active"); // Set readOnly for non-active cycles
        console.log("ReadOnly set to:", response.data.status !== "active");
      })
      .catch(error => {
        console.error("Error fetching cycle status:", error);
        setCycleStatus("inactive"); // Default to inactive if API fails
        setReadOnly(true);
      });

    // Fetch parameters & previous ratings if cycle is completed
    axios.get(`${API_URL}/parameters/${selectedCycle}/${selectedEmployee}`)
      .then(response => setParameters(Array.isArray(response.data) ? response.data : []))
      .catch(error => {
        console.error("Error fetching parameters:", error);
        setParameters([]);
      });

    axios.get(`${API_URL}/lead_assessment/lead_assessment/previous_data/${selectedCycle}/${selectedEmployee}`)
      .then(response => {
        if (response.data && response.data.ratings) {
          // Remove duplicate parameter entries based on parameter_id
          const uniqueRatings = Array.from(
            new Map(response.data.ratings.map(item => [item.parameter_id, item])).values()
          );

          setEmployeeData(prevData => ({
            ...prevData,
            [selectedEmployee]: {
              ratings: uniqueRatings.reduce((acc, item) => {
                acc[item.parameter_id] = item.parameter_rating;
                return acc;
              }, {}),
              discussionDate: response.data.discussion_date ? dayjs(response.data.discussion_date) : null, // Convert here
              comments: uniqueRatings.length > 0 ? uniqueRatings[0].specific_input : "", // Use first unique input
            }
          }));

         
        }
        console.log("ReadOnly State Current:", readOnly);
      })
      .catch(error => console.error("Error fetching previous ratings:", error));

  }, [selectedCycle, selectedEmployee]);

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const currentRatings = employeeData[selectedEmployee]?.ratings || {};
  const currentDiscussionDate = employeeData[selectedEmployee]?.discussionDate || null;
  const currentComments = employeeData[selectedEmployee]?.comments || "";

  const handleRatingChange = (parameterId, value) => {
    if (readOnly) return; // Prevent changes in read-only mode

    setEmployeeData(prevData => ({
      ...prevData,
      [selectedEmployee]: {
        ...prevData[selectedEmployee],
        ratings: { ...prevData[selectedEmployee]?.ratings, [parameterId]: value }
      }
    }));
  };

  const handleDiscussionDateChange = (newDate) => {
    if (readOnly) return; // Prevent changes in read-only mode

    setEmployeeData(prevData => ({
      ...prevData,
      [selectedEmployee]: { ...prevData[selectedEmployee], discussionDate: newDate }
    }));
  };

  const handleCommentsChange = (e) => {
    if (readOnly) return; // Prevent changes in read-only mode

    setEmployeeData(prevData => ({
      ...prevData,
      [selectedEmployee]: { ...prevData[selectedEmployee], comments: e.target.value }
    }));
  };

  const handleSubmit = () => {
    if (readOnly) {
      setSnackbar({ open: true, message: "Cannot submit ratings for a non-active cycle.", severity: "error" });
      return;
    }

    if (!selectedEmployee) {
      setSnackbar({ open: true, message: "Please select an employee.", severity: "error" });
      return;
    }

    if (!currentDiscussionDate) {
      setSnackbar({ open: true, message: "Discussion date is required.", severity: "error" });
      return;
    }

    const missingRatings = parameters.some(param => !currentRatings[param.parameter_id]);
    if (missingRatings) {
      setSnackbar({ open: true, message: "All parameters must have a rating.", severity: "error" });
      return;
    }

    const formattedRatings = Object.entries(currentRatings).map(([paramId, value]) => ({
      parameter_id: parseInt(paramId),
      parameter_rating: value,
      specific_input: currentComments || ""
    }));

    const formattedDate = currentDiscussionDate ? currentDiscussionDate.format("YYYY-MM-DD") : null;

    const payload = {
      employee_id: selectedEmployee,
      cycle_id: selectedCycle,
      ratings: formattedRatings,
      discussion_date: formattedDate,
    };

    axios.post(`${API_URL}/lead_assessment/save_rating`, payload)
      .then(() => {
        setSnackbar({ open: true, message: "Assessment submitted successfully!", severity: "success" });
      })
      .catch(error => {
        console.error("Error submitting assessment:", error);
        setSnackbar({ open: true, message: "Failed to submit assessment. Try again.", severity: "error" });
      });
  };

  const resetFields = () => {
    setEmployeeData({});
    setParameters([]);
    setSelectedEmployee("");
  };
  const filteredEmployees = employees.filter(emp => emp.employee_id != employeeId);

  return (
    <Modal open={open}  onClose={(event, reason) => reason !== "backdropClick" && onClose()} disableEscapeKeyDown>
      <Box sx={{ width: "60%", height: "85vh", p: 4, mx: "auto", mt: 2, bgcolor: "white", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom align="center" color="primary">
          Lead Assessment {readOnly}
        </Typography>

        <IconButton color="error" onClick={() => { resetFields(); onClose(); }} sx={{ position: "absolute", left: "78%", top: "4%" }}>
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <FormControl sx={{ width: "30%" }}>
            <InputLabel sx={{ backgroundColor: "white", px: 1, top: "-4px" }}>Employee</InputLabel>
            <Select value={selectedEmployee} onChange={handleEmployeeChange} disabled={readOnly} 
            sx={{
              height: 40, 
              display: "flex",
              width:"180px",
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
            }}>
              {filteredEmployees.map(emp => (
                <MenuItem key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
 

{/* date picker with tooltip, on hover shows the one-one discussion with emp completed on */}
          
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
  <Box
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    onClick={() => setShowTooltip(false)} // Hide on click
  >
    <Tooltip
      title="One-on-one discussion with employee completed on"
      placement="top"
      open={showTooltip}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: '#1976d2',
            color: 'white',
            fontSize: '14px',
            padding: '8px',
            borderRadius: '4px',
            width:'60%',
            boxShadow: '0px 0px 3px rgba(0,0,0,0.2)', // optional for nice shadow
          },
        },
        arrow: {
          sx: {
            color: '#1976d2',  // Arrow color should match tooltip background
          },
        },
      }}
    >
      <div>
        <DatePicker
          label="One-on-one discussion with employee completed on"
          value={currentDiscussionDate}
          onChange={(newDate) => handleDiscussionDateChange(newDate)}
          disabled={readOnly}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </div>
    </Tooltip>
  </Box>
</LocalizationProvider> */}


{/* as per requirement */}

<LocalizationProvider dateAdapter={AdapterDayjs} >
  <Box sx={{ display: 'flex', alignItems: 'center'}}>
    <Typography  sx={{ color: 'primary.main', fontWeight: 'bold', mr:1 }}>
      One-on-one discussion with employee completed on
    </Typography>
    <DatePicker
      
      value={currentDiscussionDate}
      onChange={(newDate) => handleDiscussionDateChange(newDate)}
      format="DD/MM/YYYY"
      disabled={readOnly}
      slotProps={{ textField: { size: 'small',sx: { width: '160px' }  },
     
    }}
      
    />
  </Box>
</LocalizationProvider>

        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: "50vh", mb: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Evaluation Parameter</TableCell>
                {[1, 2, 3, 4].map(value => (
                  <TableCell key={value} align="center" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{["Needs Improvement", "Satisfactory", "Good", "Excellent"][value - 1]}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {parameters.map(param => (
                <TableRow key={param.parameter_id} sx={{ height: "1" ,padding: "0px"}}>
                  <TableCell>{param.parameter_title}</TableCell>
                  {[1, 2, 3, 4].map(value => (
                    <TableCell align="center" key={value}>
                      <Radio
                        name={`rating-${param.parameter_id}`}
                        value={value}
                        checked={currentRatings[param.parameter_id] === value}
                        onChange={() => handleRatingChange(param.parameter_id, value)}
                        disabled={readOnly}
                        sx={{ padding: "0px" }} 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody> */}


{/* <TableBody>
  {parameters.map(param => (
    <TableRow key={param.parameter_id} sx={{ height: "1", padding: "0px" }}>
      
      <TableCell>
        <Tooltip
          title={param.helptext || "No help text available"}
          placement="top"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: '#1976d2',
                color: 'white',
                fontSize: '13px',
                padding: '8px 12px',
                borderRadius: '4px',
                boxShadow: '0px 0px 8px rgba(0,0,0,0.2)',
              },
            },
            arrow: {
              sx: {
                color: '#1976d2',
              },
            },
          }}
        >
          <span style={{ cursor: 'pointer' }}>{param.parameter_title}</span>
        </Tooltip>
      </TableCell>

      {[1, 2, 3, 4].map(value => (
        <TableCell align="center" key={value}>
          <Radio
            name={`rating-${param.parameter_id}`}
            value={value}
            checked={currentRatings[param.parameter_id] === value}
            onChange={() => handleRatingChange(param.parameter_id, value)}
            disabled={readOnly}
            sx={{ padding: "0px" }}
          />
        </TableCell>
      ))}

    </TableRow>
  ))}
</TableBody> */}


<TableBody>
  {parameters.map(param => (
    <TableRow key={param.parameter_id} sx={{ height: "1", padding: "0px" }}>
      
      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {param.parameter_title}

        <Tooltip
          title={param.helptext || "No help text available"}
          placement="top"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: '#1976d2',
                color: 'white',
                fontSize: '13px',
                padding: '6px',
                borderRadius: '4px',
                boxShadow: '0px 0px 8px rgba(0,0,0,0.2)',
                maxWidth: '200px', 
              },
            },
            arrow: {
              sx: {
                color: '#1976d2',
              },
            },
          }}
        >
          <IconButton size="small" sx={{ p: 0.5 }}>
            <InfoOutlineIcon sx={{ color: '#1976d2', fontSize: '18px' }} />
          </IconButton>
        </Tooltip>
      </TableCell>

      {[1, 2, 3, 4].map(value => (
        <TableCell align="center" key={value}>
          <Radio
            name={`rating-${param.parameter_id}`}
            value={value}
            checked={currentRatings[param.parameter_id] === value}
            onChange={() => handleRatingChange(param.parameter_id, value)}
            disabled={readOnly}
            sx={{ padding: "0px" }}
          />
        </TableCell>
      ))}

    </TableRow>
  ))}
</TableBody>



          </Table>
        </TableContainer>
        <TextField
          label="Any specific inputs"
          multiline
          rows={2}
          fullWidth
          sx={{ mb: 2 }}
          value={currentComments}
          disabled={readOnly}
          InputProps={{ readOnly: readOnly }}
          onChange={handleCommentsChange}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", position: "sticky", bottom: 0, p: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={readOnly} align="right">Submit</Button>

        </Box>
               <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                          {snackbar.message}
                        </Alert>
                </Snackbar>
      </Box>
    </Modal>
  );
};

export default LeadAssessmentModal;


