import React, { useState } from "react";
import { Button, Box, Card, Snackbar, Alert,Typography,Grid } from "@mui/material";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import DataGridDemo from "./SelectEmployee"; // Employee Selection Component
import CheckboxList from "./SelectQuestion"; // Question Selection Component

export default function Assignment({ cycleId, onClose,cycleName }) {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleEmployeeSelection = (employees) => {
    setSelectedEmployees(employees);
  };

  const handleQuestionSelection = (questions) => {
    setSelectedQuestions(questions);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAssign = () => {
    const assignmentData = {
      cycle_id: cycleId,
      employee_ids: selectedEmployees.map((emp) => emp.employee_id),
      question_ids: selectedQuestions.map((q) => q.question_id),
    };

    fetch("http://localhost:8000/assignments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignmentData),
    })
      .then((response) => response.json())
      .then(() => {
        showSnackbar("Assignment successful!", "success");
      })
      .catch((error) => {
        console.error("Error assigning:", error);
        showSnackbar("The question is already assigned to the selected employee", "error");
      });
  };

  const handleClose = () => {
    setSelectedEmployees([]);
    setSelectedQuestions([]);
    onClose();
  };

  return (
    <Box>
      <Card sx={{ mt: 2, width: "100%", height: 600}}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{mt:1,ml:1,mb:1}}>
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography variant="h6" color="primary" fontWeight={"bold"}>
                {cycleName}
              </Typography>

              <Typography variant="body1">Employees: {selectedEmployees.length}</Typography>
          </Grid>
        </Grid>

        <PanelGroup direction="horizontal">
          {/* Left Panel - Employee Selection */}
          <Panel defaultSize={50} minSize={30} maxSize={70} >
            <Box >
            {/* sx={{ padding: 2, height: "100%", display: "flex", flexDirection: "column" }} */}
              <DataGridDemo onSelect={handleEmployeeSelection} selectedEmployees={selectedEmployees} />
            </Box>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle style={{ width: "5px", background: "#ccc", cursor: "ew-resize" }} />

          {/* Right Panel - Question Selection */}
          <Panel defaultSize={50} minSize={30} maxSize={70}>
            <Box sx={{ padding: 2, height: "100%", display: "flex", flexDirection: "column" }}>
              <CheckboxList onSelect={handleQuestionSelection} selectedQuestions={selectedQuestions} />
            </Box>
          </Panel>
        </PanelGroup>
      </Card>

      {/* Bottom Buttons */}
      <Box sx={{ display: "flex", justifyContent: "right", gap: 3, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssign}
          disabled={selectedEmployees.length === 0 || selectedQuestions.length === 0}
        >
          Assign
        </Button>
        <Button variant="contained" color="error" onClick={handleClose} >
          Close
        </Button>
      </Box>

      {/* Snackbar Component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
