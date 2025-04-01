import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { fetchParameters, submitAssessment } from "../services/leadAssessmentService";

const LeadAssessmentModal = ({ open, onClose, selectedCycle, employees, selectedEmployee, setSelectedEmployee }) => {
  const [parameters, setParameters] = useState([]);
  const [ratings, setRatings] = useState({});
  const [discussionDate, setDiscussionDate] = useState("");
  const [specificInput, setSpecificInput] = useState("");

  useEffect(() => {
    if (selectedCycle) {
      fetchParameters(selectedCycle).then((data) => setParameters(data));
    }
  }, [selectedCycle]);

  const handleRatingChange = (parameterId, value) => {
    setRatings({ ...ratings, [parameterId]: value });
  };

  const handleSubmit = async () => {
    if (!discussionDate) {
      alert("Please specify a date when you have completed the discussion with the employee");
      return;
    }
    await submitAssessment({
      cycle_id: selectedCycle,
      employee_id: selectedEmployee,
      ratings,
      discussion_date: discussionDate,
      specific_input: specificInput,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Lead Assessment
        <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Employee Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Employee</InputLabel>
          <Select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            {employees.map((emp) => (
              <MenuItem key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Discussion Date Picker */}
        <TextField
          type="date"
          fullWidth
          label="One-on-one Discussion with employee completed on"
          value={discussionDate}
          onChange={(e) => setDiscussionDate(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <CalendarTodayIcon />
              </IconButton>
            ),
          }}
        />

        {/* Evaluation Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameters</TableCell>
              {["Improvement Required", "Satisfactory", "Good", "Excellent"].map((label) => (
                <TableCell key={label}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((param) => (
              <TableRow key={param.parameter_ID}>
                <TableCell>
                  <Tooltip title={param.helptext || "No help text available"}>
                    <span>{param.parameter_title}</span>
                  </Tooltip>
                </TableCell>
                {[1, 2, 3, 4].map((value) => (
                  <TableCell key={value}>
                    <RadioGroup row>
                      <FormControlLabel
                        control={<Radio checked={ratings[param.parameter_ID] === value} onChange={() => handleRatingChange(param.parameter_ID, value)} />}
                        value={value}
                      />
                    </RadioGroup>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Specific Input Text Box */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Any specific inputs"
          value={specificInput}
          onChange={(e) => setSpecificInput(e.target.value)}
        />

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
          <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button>
          <Button variant="contained" color="error" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadAssessmentModal;
