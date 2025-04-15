import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  FormControl,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import CustomToolbar from "./CustomeToolbar";
import CloseIcon from "@mui/icons-material/Close";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { getCylceResponses, activeCycles, getEmpList } from "../services/SelfAssessReport";

const pivotData = (data, rows) => {
  if (!rows) return [];

  const employeeMap = {};
  const answeredEmployees = new Set();
  const allQuestions = new Set();

  // Step 1: Track all question texts and responses
  if (data) {
    data.forEach((item) => {
      answeredEmployees.add(item.employee_id);
      allQuestions.add(item.question_text);
    });
  }

  // Step 2: Initialize all employees with base data
  rows.forEach((emp) => {
    employeeMap[emp.employee_id] = {
      id: emp.employee_id,
      employee_id: emp.employee_id,
      employee_name: emp.employee_name,
      role: emp.role,
      reporting_manager: emp.reporting_manager,
      previous_reporting_manager: emp.previous_reporting_manager,
    };

    // Step 3: If employee hasn't answered, add "-" for each question
    if (!answeredEmployees.has(emp.employee_id)) {
      allQuestions.forEach((question) => {
        employeeMap[emp.employee_id][question] = "-";
      });
    }
  });

  // Step 4: Add responses for employees who answered
  if (data) {
    data.forEach((item) => {
      const emp = employeeMap[item.employee_id];
      if (emp) {
        if (emp[item.question_text]) {
          emp[item.question_text] += `, ${item.response_text}`;
        } else {
          emp[item.question_text] = item.response_text;
        }
      }
    });
  }

  return Object.values(employeeMap);
};


const generateColumns = (data,columns) => {
  if (!data) return [];

  // Collect unique question_texts
  const questionSet = new Set();
  data.forEach((item) => {
    questionSet.add(item.question_text);
  });

  const questionColumns = Array.from(questionSet).map((q) => ({
    field: q,
    headerName: q,
    width: 300,
  }));

  return [...columns, ...questionColumns];
};

const SelfAssessmentRepo = () => {
  const navigate = useNavigate();

  const [rows, setRows] = React.useState([]);
  const [employeeMap, setEmployeeMap] = React.useState({});
  const [originalRows, setOriginalRows] = React.useState([]);

  const [activeCycle, setActiveCycles] = useState([]);
  const [cycle_id, setCycleId] = useState(null);
  const [response, setResponseData] = useState(null);
  const [employees, setEmployee] = useState(null);
  const [baseColumns] = useState([
    { field: "employee_id", headerName: "Employee ID", width: 200 },
    { field: "employee_name", headerName: "Name", width: 200 },
    { field: "role", headerName: "Role", width: 200 },
    { field: "reporting_manager", headerName: "Reporting Manager", width: 200 },
    { field: "previous_reporting_manager", headerName: "Previous Manager", width: 200 },
  ]);


  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await getEmpList();
        const empMap = {};
        response.forEach(emp => {
          empMap[emp.employee_id] = emp.employee_name;
        });

        const formattedData = response.map((emp, index) => ({
          id: index + 1,
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          role: emp.role,
          reporting_manager: emp.reporting_manager_name || "-",
          previous_reporting_manager: emp.previous_reporting_manager_name || "-",
        }));

        setEmployeeMap(empMap);
        setRows(formattedData);
        setOriginalRows(formattedData);
        
      } catch (error) {
        console.log("Error while fetching employees: " + error);
      }
    };
    getEmployees();
  }, []);


  useEffect(() => {
    const getResponses = async (cycle_id) => {
      try {
        const data = await getCylceResponses(cycle_id);
        setResponseData(data);
      } catch (error) {
        console.log("Error while fetching cycle: " + error);
      }
    };

    if (cycle_id) {
      getResponses(cycle_id);
    }
  }, [cycle_id]);


  useEffect(() => {
    const getActiveCycles = async () => {
      try {
        const response = await activeCycles();
        const filteredCycles = response.filter(
          (cycle) => cycle.status === "completed" || cycle.status === "active"
        );
        setActiveCycles(filteredCycles);
      } catch (error) {
        console.log("Error while fetching cycle: " + error);
      }
    };
    getActiveCycles();
  }, []);

  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Grid container alignItems="center" sx={{ m: 2, mb:0}}>
          <Grid size={11}>
            <Typography variant="h6" color="primary">
              Self Assessment Report
            </Typography>
          </Grid>
          <Grid size={1} sx={{ textAlign: "right" }}>
            <IconButton onClick={() => navigate("/hr-home")} color="error">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Card sx={{ m: 2,mt:0 }}>
          <CardContent>
            <FormControl sx={{ mt:2,mb:1,width: 'auto' , minWidth:'20%'}}>
              <InputLabel
                sx={{ backgroundColor: "white", px: 1, top: "-4px", pr: "2px" }}
              >
                Select Appraisal Cycles
              </InputLabel>
              <Select
                onChange={(e) => setCycleId(e.target.value)}
               
                MenuProps={MenuProps}
                sx={{
                  minHeight: '50px',
                  // Allow the select to grow in height based on content
                  // height: 'auto',
                  width:"300px",
                  // Add some padding for better appearance with multiple wrapped lines
                  '& .MuiSelect-select': {
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  }
                }}
              >
                {activeCycle.map((cycle) => (
                  <MenuItem key={cycle.cycle_id} value={cycle.cycle_id} >
                    {cycle.cycle_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

              <DataGrid
              rows={cycle_id ? pivotData(response, rows) : rows}
              columns={cycle_id ? generateColumns(response, baseColumns) : baseColumns}
              autoHeight
              sx={{
                maxWidth: "100%",
                maxHeight: "50%",
                height: "200px",
                overflow: "auto",
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
              }}
              slots={{ toolbar: CustomToolbar }}
              rowHeight={38}
              hideFooter
            />

          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default SelfAssessmentRepo;
