import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import {Grid,Typography, Card, IconButton,Skeleton} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
// import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
const API_URL = process.env.REACT_APP_BASE_URL; 

// Custom Toolbar Component with Better Alignment
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
      {/* Left Side - Filters, Columns, Export */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </Box>

      {/* Right Side - Search Bar */}
      <Box sx={{ width: "250px" }}>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

// Helper function to format ratings
const formatRating = (ratingValue) => {
  if (ratingValue === undefined || ratingValue === null || ratingValue === "-") {
    return "-";
  }
  
  const numericRating = Number(ratingValue);
  
  switch (numericRating) {
    case 1:
      return "1 - Improvements Required";
    case 2:
      return "2 - Satisfactory";
    case 3:
      return "3 - Good";
    case 4:
      return "4 - Excellent";
    default:
      return ratingValue; // Return original value if it doesn't match any case
  }
};

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

export default function HistoricalReportTable({ onSelect }) {
  const [rows, setRows] = React.useState([]);
  const [employeeMap, setEmployeeMap] = React.useState({});
  const [originalRows, setOriginalRows] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [cycles, setCycles] = React.useState([]);
  const [selectedCycles, setSelectedCycles] = React.useState([]);
  const [baseColumns] = React.useState([
    { field: "employee_id", headerName: "Employee ID",width:105},
    { field: "employee_name", headerName: "Name", flex:1,minWidth:130 },
    { field: "role", headerName: "Role", flex:1,minWidth:100 },
    { field: "reporting_manager", headerName: "Reporting Manager", flex:1,minWidth:130 },
    { field: "previous_reporting_manager", headerName: "Previous Manager", flex:1,minWidth:130 },
  ]);
  const [columns, setColumns] = React.useState(baseColumns);
  const navigate = useNavigate();         // 1
  const [loadingEmployees, setLoadingEmployees] = React.useState(true);  //2
const [loadingCycles, setLoadingCycles] = React.useState(true);  //3

  // Fetch employee data
  React.useEffect(() => {
    setLoadingEmployees(true);   //4
    fetch(`${API_URL}/employees`)
      .then((response) => response.json())
      .then((data) => {
        // Create a mapping of employee_id to employee_name
        const empMap = {};
        data.forEach(emp => {
          empMap[emp.employee_id] = emp.employee_name;
        });

        // Convert API data to DataGrid format
        const formattedData = data.map((emp, index) => ({
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
      })
      .catch((error) => console.error("Error fetching employee data:", error))
      .finally(() => setLoadingEmployees(false));
  }, []);

  // Fetch completed cycles data
  React.useEffect(() => {
    setLoadingCycles(true);    //5
    fetch(`${API_URL}/appraisal_cycle/appraisal-cycles/completed`) // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setCycles(data);
      })
      .catch((error) => console.error("Error fetching cycle data:", error))
      .finally(() => setLoadingCycles(false));
  }, []);

  // Handle cycle selection change
  const handleCycleChange = (event) => {
    const { value } = event.target;
    setSelectedCycles(value);
    
    // Update columns based on selected cycles
    updateColumnsBasedOnCycles(value);
  };

  // Update columns based on selected cycles
  const updateColumnsBasedOnCycles = async (selectedCycleIds) => {
    console.log("Selected Cycle IDs:", selectedCycleIds);
    
    // Create dynamic columns based on selected cycles
    const cycleColumns = selectedCycleIds.map(cycleId => {
      const cycleInfo = cycles.find(c => c.cycle_id === cycleId);
      const cycleTitle = cycleInfo ? cycleInfo.cycle_name : `Cycle ${cycleId}`;
      
      return {
        field: `cycle_${cycleId}`,
        headerName: cycleTitle,
        width: 200, // Increased width to accommodate longer rating text
        renderCell: (params) => {
          return formatRating(params.value);
        }
      };
    });

    // Combine base columns with cycle columns
    const newColumns = [...baseColumns, ...cycleColumns];
    setColumns(newColumns);
    console.log("Updated Columns:", newColumns);

    // Start with a fresh copy of rows to update
    const rowsCopy = [...originalRows].map(row => ({...row}));

    // Fetch ratings data for all selected cycles
    if (selectedCycleIds.length > 0) {
      // Fetch ratings for each cycle and update rows
      for (const cycleId of selectedCycleIds) {
        try {
          const response = await fetch(`${API_URL}/lead_assessment/employees_ratings/${cycleId}`);
          const ratingsData = await response.json();
          console.log(`Ratings data for cycle ${cycleId}:`, ratingsData);
          
          // Update rows with ratings data
          rowsCopy.forEach(row => {
            // Convert employee_id to the same type as in ratingsData for comparison
            const empId = Number(row.employee_id);
            
            // Find the rating for this employee in this cycle
            const employeeRating = ratingsData.find(r => Number(r.employee_id) === empId);
            
            if (employeeRating) {
              // Store the raw numeric value - formatting happens in renderCell
              row[`cycle_${cycleId}`] = employeeRating.parameter_rating;
              console.log(`Set rating for employee ${empId} in cycle ${cycleId}:`, employeeRating.parameter_rating);
            } else {
              row[`cycle_${cycleId}`] = "-";
            }
          });
        } catch (error) {
          console.error(`Error fetching ratings for cycle ${cycleId}:`, error);
        }
      }
      
      // Remove data for cycles that are no longer selected
      rowsCopy.forEach(row => {
        Object.keys(row).forEach(key => {
          if (key.startsWith('cycle_')) {
            const cycleId = parseInt(key.replace('cycle_', ''));
            if (!selectedCycleIds.includes(cycleId)) {
              delete row[key];
            }
          }
        });
      });
      
      // Update state with the new rows
      setRows(rowsCopy);
      console.log("Final updated rows:", rowsCopy);
    } else {
      // If no cycles selected, remove all cycle data
      const cleanedRows = rowsCopy.map(row => {
        const newRow = { ...row };
        Object.keys(newRow).forEach(key => {
          if (key.startsWith('cycle_')) {
            delete newRow[key];
          }
        });
        return newRow;
      });
      
      setRows(cleanedRows);
    }
  };

  // Handle row selection
  const handleRowSelection = (selectedRowIds) => {
    setSelectedIds(selectedRowIds);
    
    // Get selected and unselected employees, preserving all data including cycle ratings
    const selectedEmployees = rows.filter(row => selectedRowIds.includes(row.id));
    const unselectedEmployees = rows.filter(row => !selectedRowIds.includes(row.id));
  
    const newOrderedRows = [...selectedEmployees, ...unselectedEmployees];
    setRows(newOrderedRows);
  
    if (onSelect) {
      onSelect(selectedEmployees);
    }
  };

  const getRowHeight = () => 35;

  return (
    <Card sx={{ width: '100%', m:1 }}>
    <Box sx={{ width: '98%' ,ml:1}}>
      <Grid container alignItems="center" >
         <Grid item size={11}>
            <Typography variant="h6" color="primary" fontWeight={"bold"} pl="10px">
              Historical Report
            </Typography>
        </Grid>
        <Grid size={1} sx={{ textAlign: "right" }}>
            <IconButton onClick={() => navigate("/hr-home")} color="error">
              <CloseIcon />
            </IconButton>
          </Grid>
          </Grid>
     
       {/* Cycle Selection Dropdown with Checkboxes */}
       <FormControl sx={{ mb:1,width: 'auto' , minWidth:'20%'}}>
        <InputLabel id="checkbox-cycles-label" sx={{background:"white"}}>Select Appraisal Cycles</InputLabel>
        <Select
          labelId="checkbox-cycles-label"
          id="checkbox-cycles"
        //   sx={{height:'50px'}}
          multiple
          value={selectedCycles}
          onChange={handleCycleChange}
          input={<OutlinedInput label="Select App Cycles" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', gap: 0.5 ,flexWrap: 'wrap', py: 0.5 }}>
               
                
              {selected.map((value) => {
                const cycleInfo = cycles.find(c => c.cycle_id === value);
                return (
                  <Chip key={value} label={cycleInfo ? cycleInfo.cycle_name : `Cycle ${value}`}   size="small" />
                );
              })}
            </Box>
          )}
          MenuProps={MenuProps}
          sx={{
            minHeight: '50px',
            // Allow the select to grow in height based on content
            // height: 'auto',
            width:'auto',
            // Add some padding for better appearance with multiple wrapped lines
            '& .MuiSelect-select': {
              paddingTop: '8px',
              paddingBottom: '8px',
            }
          }}

        >
          {cycles.map((cycle) => (
            <MenuItem key={cycle.cycle_id} value={cycle.cycle_id}>
              <Checkbox checked={selectedCycles.indexOf(cycle.cycle_id) > -1} />
              <ListItemText primary={cycle.cycle_name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* DataGrid Table */}
      {(loadingEmployees || loadingCycles) ?  (
        <Box sx={{ width: '100%', mt: 2 }}>
          {[...Array(20)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={30} sx={{
              mb: 1,
              bgcolor: '#e6e9ed',
              opacity: 0.3
            }}/>
          ))}
        </Box> 

        ) : (
          <DataGrid
            sx={{ 
              overflow: "auto",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",

                
              }
            }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5]} 
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: CustomToolbar }}
            onRowSelectionModelChange={handleRowSelection}
            selectionModel={selectedIds}
            rowHeight={getRowHeight()}
            hideFooter
          />)
      }
    </Box>
    </Card>
  );
}

