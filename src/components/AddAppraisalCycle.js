
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import TextField from '@mui/material/TextField';
import {
  createAppraisalCycle,
  createStage,
  createParameter,
} from "../services/AddAppraisalCycle";


const AddAppraisalCycle = () => {
  // Appraisal Cycle State
  const [cycleName, setCycleName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");

  // Validation Errors
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [stageErrors, setStageErrors] = useState({});

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Stages State
  const [stages, setStages] = useState([
    { name: "Setup", startDate: "", endDate: "" },
    { name: "Self Assessment", startDate: "", endDate: "" },
    { name: "Lead Assessment", startDate: "", endDate: "" },
    { name: "HR/VL Validation", startDate: "", endDate: "" },
    { name: "Closure", startDate: "", endDate: "" },
  ]);

  // Parameters State
  const [parameters, setParameters] = useState([
    {
      name: "Overall Performance Rating",
      helptext: "",
      employee: true,
      teamLead: true,
      fixed: true,
    },
  ]);

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [cycleName, description, startDate, endDate, stages, parameters]);

  const validateForm = () => {
    
    let valid = true;
    if (!startDate) {
        setStartDateError("Start date is required");
        valid = false;
      } else {
        setStartDateError("");
      }
    
      if (!endDate) {
        setEndDateError("End date is required");
        valid = false;
      } else if (startDate > endDate) {
        setEndDateError("End date must be after start date");
        valid = false;
      } else {
        setEndDateError("");
      }

    if (startDate && endDate && startDate > endDate) {
      setEndDateError("End date must be after start date");
      valid = false;
    } else {
      setEndDateError("");
    }

    let newStageErrors = {};
    let previousEndDate = startDate; // Start with the cycle's start date

    stages.forEach((stage, index) => {
      let error = {};
      if (!stage.startDate || !stage.endDate) {
        // error.start = "Start date and is required";
        valid = false;
      }
      if (
        stage.startDate &&
        (stage.startDate < startDate || stage.startDate > endDate)
      ) {
        error.start = "Start date must be within cycle period";
        valid = false;
      }
      if(stage.endDate && (stage.endDate < stage.startDate)){
        error.end = "End date must be after start date";
        valid = false;
      }
      else if (
        stage.endDate &&
        (stage.endDate > endDate)
      ) {
        error.end = "End date must be within cycle period";
        valid = false;
      }
      // Ensure each stage starts after the previous stage ends
      if (
        index > 0 &&
        stage.startDate &&
        previousEndDate &&
        stage.startDate <= previousEndDate
      ) {
        error.start = "Start date must be after the previous stage's end date";
        valid = false;
      }

      previousEndDate = stage.endDate; // Update the previous end date for next iteration
      newStageErrors[index] = error;
    });

    setStageErrors(newStageErrors);
    setFormValid(valid);
  };

  const handleSave = async () => {
    
    try {
      console.log("Saving Appraisal Cycle...");

      // Step 1: Save Appraisal Cycle
      const cycleData = await createAppraisalCycle({
        cycle_name: cycleName,
        description,
        status,
        start_date_of_cycle: startDate,
        end_date_of_cycle: endDate,
      });

      const cycleId = cycleData.cycle_id;

      // Step 2: Save Stages
      for (const stage of stages) {
        await createStage({
          stage_name: stage.name,
          cycle_id: cycleId,
          start_date_of_stage: stage.startDate,
          end_date_of_stage: stage.endDate,
        });
      }

      // Step 3: Save Parameters
      for (const param of parameters) {
        await createParameter({
          parameter_title: param.name,
          helptext: param.helptext,
          cycle_id: cycleId,
          applicable_to_employee: param.employee,
          applicable_to_lead: param.teamLead,
          is_fixed_parameter: param.fixed,
        });
      }

      setSnackbar({
        open: true,
        message: "Cycle Created Successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  const addParameter = () => {
    setParameters([
      ...parameters,
      {
        name: "",
        helptext: "",
        employee: false,
        teamLead: false,
        fixed: false,
      },
    ]);
  };

  return (
    <Card sx={{ p: 3, width: "80%", margin: "auto", mt: 5, mb:3 }}>
        <Typography variant="h6" color="primary">
            Add Appraisal Cycle
          </Typography>
      <CardContent>
        <Card sx={{ p: 1, width: "100%" }}>
          <Typography  color="primary" fontWeight="bold">
            Appraisal Cycle Details
          </Typography>
          <CardContent>
            {/* Appraisal Cycle Inputs */}
            <Grid container spacing={2}>
              <Grid  size={12}>
                <TextField
                  fullWidth
                  label="Appraisal Cycle Name"
                  required
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                />
              </Grid>
              <Grid  size={12}>
                <TextField
                  fullWidth
                  label="Description"
                  required
                  multiline
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid  size={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid  size={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  error={!!endDateError}
                  helperText={endDateError}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* Stages Section */}
        <Card sx={{ p: 1, width: "100%", mt: 1 }}>
          <CardContent>
            {/* <Typography variant="h6" sx={{ mt: 3, color: "primary.main" }}>Stages</Typography> */}
            {/* <Typography variant="h6" sx={{ mt: 3, color: "primary.main" }}>Parameters</Typography> */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid  size={4}>
                <Typography fontWeight="bold" sx={{ color: "primary.main" }}>
                  Stages
                </Typography>
              </Grid>
              <Grid  size={4}>
                <Typography
                  fontWeight="bold"
                  sx={{ ml: 2, color: "primary.main" }}
                >
                  Start Date
                </Typography>
              </Grid>
              <Grid  size={4}>
                <Typography
                  fontWeight="bold"
                  sx={{ ml: 2, color: "primary.main" }}
                >
                  End Date
                </Typography>
              </Grid>
            </Grid>

            {stages.map((stage, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                sx={{ mt: 1, alignItems: "center" }}
              >
                <Grid  size={4}>
                  <Typography
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {stage.name}
                  </Typography>
                </Grid>
                <Grid  size={4}>
                  <TextField
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={stage.startDate}
                    onChange={(e) => {
                      const newStages = [...stages];
                      newStages[index].startDate = e.target.value;
                      setStages(newStages);
                    }}
                    error={!!stageErrors[index]?.start}
                    helperText={stageErrors[index]?.start}
                  />
                </Grid>
                <Grid  size={4}>
                  <TextField
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={stage.endDate}
                    onChange={(e) => {
                      const newStages = [...stages];
                      newStages[index].endDate = e.target.value;
                      setStages(newStages);
                    }}
                    error={!!stageErrors[index]?.end}
                    helperText={stageErrors[index]?.end}
                  />
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Card>
        {/* Parameters Section */}
        <Card sx={{ p: 1, width: "100%", mt: 1 }}>
          <CardContent>
            {/* <Typography variant="h6" sx={{ mt: 3, color: "primary.main" }}>Parameters</Typography> */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={4}>
                <Typography
                  fontWeight="bold"
                  sx={{ ml: 2, color: "primary.main" }}
                >
                  Parameters For Lead Assessment
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography
                  fontWeight="bold"
                  sx={{ ml: 2, color: "primary.main" }}
                >
                  Help Text
                </Typography>
              </Grid>
              <Grid size={2}>
                <Typography
                  fontWeight="bold"
                  sx={{ ml: 2, color: "primary.main" }}
                >
                  Employee
                </Typography>
              </Grid>
              <Grid size={2}>
                <Typography
                  fontWeight="bold"
                  sx={{ ml: 2, color: "primary.main" }}
                >
                  Team Lead
                </Typography>
              </Grid>
            </Grid>

            {parameters.map((param, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                <Grid size={4}>
                  <TextField
                    fullWidth
                    label="Parameter"
                    disabled={param.fixed}
                    value={param.name}
                    onChange={(e) => {
                      const newParams = [...parameters];
                      newParams[index].name = e.target.value;
                      setParameters(newParams);
                    }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    fullWidth
                    label="Helptext"
                    value={param.helptext}
                    onChange={(e) => {
                      const newParams = [...parameters];
                      newParams[index].helptext = e.target.value;
                      setParameters(newParams);
                    }}
                  />
                </Grid>
                <Grid size={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ ml: 3 }}
                        checked={param.employee}
                        disabled={param.fixed}
                        onChange={(e) => {
                          const newParams = [...parameters];
                          newParams[index].employee = e.target.checked;
                          setParameters(newParams);
                        }}
                      />
                    }
                  />
                </Grid>
                <Grid size={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ ml: 3 }}
                        checked={param.teamLead}
                        disabled={param.fixed}
                        onChange={(e) => {
                          const newParams = [...parameters];
                          newParams[index].teamLead = e.target.checked;
                          setParameters(newParams);
                        }}
                      />
                    }
                  />
                </Grid>
              </Grid>
            ))}

            <IconButton color="primary" onClick={addParameter} sx={{ mt: 2 }}>
              <AddIcon />
            </IconButton>
          </CardContent>
        </Card>
        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!formValid}
            sx={{ mt: 3 }}
          >Save
          </Button>
          <Button variant="contained" color="error" sx={{ mt: 3, ml:3 }}>
            Cancel
          </Button>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default AddAppraisalCycle;
