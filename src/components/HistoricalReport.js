
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid';
// import {
//   GridToolbarContainer,
//   GridToolbarFilterButton,
//   GridToolbarColumnsButton,
//   GridToolbarExport,
//   GridToolbarQuickFilter,
// } from "@mui/x-data-grid";
// const API_URL = process.env.REACT_APP_BASE_URL; 
// // Custom Toolbar Component with Better Alignment
// function CustomToolbar() {
//     return (
//       <GridToolbarContainer sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
//         {/* Left Side - Filters, Columns, Export */}
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <GridToolbarColumnsButton />
//           <GridToolbarFilterButton />
//           <GridToolbarExport />
//         </Box>
  
//         {/* Right Side - Search Bar */}
//         <Box sx={{ width: "250px" }}>
//           <GridToolbarQuickFilter />
//         </Box>
//       </GridToolbarContainer>
//     );
//   }
  
// export default function HistoricalReportTable({ onSelect }) {
// // export default function DataGridDemo() {
//   const [rows, setRows] = React.useState([]);
//   const [employeeMap, setEmployeeMap] = React.useState({}); // To map employee_id -> employee_name
//   const [originalRows, setOriginalRows] = React.useState([]); // Store original order
//   const [selectedIds, setSelectedIds] = React.useState([]); // Track selected rows

//   React.useEffect(() => {
//     fetch(`${API_URL}/employees`) // API call to FastAPI
//       .then((response) => response.json())
//       .then((data) => {

//          // Create a mapping of employee_id to employee_name
//          const empMap = {};
//          data.forEach(emp => {
//            empMap[emp.employee_id] = emp.employee_name;
//          });

//         // Convert API data to DataGrid format
//         const formattedData = data.map((emp, index) => ({
//           id: index + 1,
//           employee_id: emp.employee_id,
//           employee_name: emp.employee_name,
//           role: emp.role,
//           reporting_manager: emp.reporting_manager_name || "-", // Convert ID to Name
//           previous_reporting_manager: emp.previous_reporting_manager_name || "-", // Convert ID to Name
//         }));

//         setEmployeeMap(empMap); // Store mapping for future use
//         setRows(formattedData);
//         setOriginalRows(formattedData); // Store original order
//       })
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);
  
//   const handleRowSelection = (selectedRowIds) => {
//     setSelectedIds(selectedRowIds);
//     // Get selected rows
//     const selectedEmployees = originalRows.filter((row) =>
//       selectedRowIds.includes(row.id)
//     );
//     // Get unselected rows
//     const unselectedEmployees = originalRows.filter(
//       (row) => !selectedRowIds.includes(row.id)
//     );
  
//     // Merge with selected rows on top
//     const newOrderedRows = [...selectedEmployees, ...unselectedEmployees];
    
//     setRows(newOrderedRows); // Update DataGrid rows
  
//     if (onSelect) {
//       onSelect(selectedEmployees); // Send selected employee objects
//     }
//   };
  
//   // Define Columns
//   const columns = [
//     { field: "employee_id", headerName: "Employee ID", width: 120 },
//     { field: "employee_name", headerName: "Name", width: 150 },
//     { field: "role", headerName: "Role", width: 120 },
//     { field: "reporting_manager", headerName: "Reporting Manager", width: 200 },
//     { field: "previous_reporting_manager", headerName: "Previous Manager", width: 200 },
//   ];


//   const getRowHeight = () => 35;

//   return (
//     // <Box item sx={{ height: 600, width: '100%', overflow: 'auto'}}>
//       <DataGrid
//         sx = {{height: 500, overflow: "auto",
//           "& .MuiDataGrid-columnHeaderTitle": {
//             fontWeight: "bold", // Make column headers bold
//         }
//         }}
//         rows={rows}
//         columns={columns}
//         pageSizeOptions={[5]} 
//         checkboxSelection
//         disableRowSelectionOnClick
//         slots={{ toolbar: CustomToolbar }} // Toolbar added here
//         onRowSelectionModelChange={handleRowSelection} // Handle row selection change
//         selectionModel={selectedIds} // Maintain selection state
//         rowHeight={getRowHeight()}
//         hideFooter
//       />
//     // </Box>
//   );
// }


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
  const [columns, setColumns] = React.useState([
    { field: "employee_id", headerName: "Employee ID", width: 120 },
    { field: "employee_name", headerName: "Name", width: 150 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "reporting_manager", headerName: "Reporting Manager", width: 200 },
    { field: "previous_reporting_manager", headerName: "Previous Manager", width: 200 },
  ]);

  // Fetch employee data
  React.useEffect(() => {
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
      .catch((error) => console.error("Error fetching employee data:", error));
  }, []);

  // Fetch completed cycles data
  React.useEffect(() => {
    fetch(`${API_URL}/appraisal_cycle/appraisal-cycles/completed`) // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setCycles(data);
      })
      .catch((error) => console.error("Error fetching cycle data:", error));
  }, []);

  // Handle cycle selection change
  const handleCycleChange = (event) => {
    const { value } = event.target;
    setSelectedCycles(value);
    
    // Update columns based on selected cycles
    updateColumnsBasedOnCycles(value);
  };

  // Update columns based on selected cycles
  const updateColumnsBasedOnCycles = (selectedCycleIds) => {
    // Start with base columns
    const baseColumns = [
      { field: "employee_id", headerName: "Employee ID", width: 120 },
      { field: "employee_name", headerName: "Name", width: 150 },
      { field: "role", headerName: "Role", width: 120 },
      { field: "reporting_manager", headerName: "Reporting Manager", width: 200 },
      { field: "previous_reporting_manager", headerName: "Previous Manager", width: 200 },
    ];

    // Add column for each selected cycle
    const cycleColumns = selectedCycleIds.map(cycle_id => {
      const cycleInfo = cycles.find(c => c.cycle_id === cycle_id);
      const cycleTitle = cycleInfo ? cycleInfo.cycle_name : `Cycle ${cycle_id}`;
      
      return {
        field: `cycle_${cycle_id}`,
        headerName: cycleTitle,
        width: 150,
        // If you need to fetch cycle data for each employee:
        valueGetter: (params) => {
          // This is a placeholder - you would need to implement logic to get the actual data
          // Could be fetched separately or included in the employee data
          return params.row[`cycle_${cycle_id}`] || "-";
        }
      };
    });

    // Combine base columns with cycle columns
    setColumns([...baseColumns, ...cycleColumns]);

    // If you need to fetch cycle data for selected cycles:
    if (selectedCycleIds.length > 0) {
      fetchCycleData(selectedCycleIds);
    }
  };

  // Fetch cycle-specific data for employees
  const fetchCycleData = (cycleIds) => {
    // This would be implemented based on your API design
    // Example implementation:
    Promise.all(cycleIds.map(cycleId => 
      fetch(`${API_URL}/lead_assessment/employees_ratings/${cycleId}`)
        .then(res => res.json())
    ))
    .then(cycleDataArray => {
      // Process cycle data and update rows
      const updatedRows = [...rows];
      
      cycleDataArray.forEach((cycleData, index) => {
        const cycleId = cycleIds[index];
        
        // Add cycle data to each employee row
        updatedRows.forEach(row => {
          const employeeData = cycleData.find(cd => cd.employee_id === row.employee_id);
          if (employeeData) {
            row[`cycle_${cycleId}`] = employeeData.parameter_rating || employeeData.status || "-";
          } else {
            row[`cycle_${cycleId}`] = "-";
          }
        });
      });
      
      setRows(updatedRows);
    })
    .catch(error => console.error("Error fetching cycle data:", error));
  };

  // Handle row selection
  const handleRowSelection = (selectedRowIds) => {
    setSelectedIds(selectedRowIds);
    
    const selectedEmployees = originalRows.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    
    const unselectedEmployees = originalRows.filter(
      (row) => !selectedRowIds.includes(row.id)
    );
  
    const newOrderedRows = [...selectedEmployees, ...unselectedEmployees];
    
    setRows(newOrderedRows);
  
    if (onSelect) {
      onSelect(selectedEmployees);
    }
  };

  const getRowHeight = () => 35;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Cycle Selection Dropdown */}
      <FormControl sx={{ mb: 2, width: '100%' }}>
        <InputLabel id="cycle-multiple-chip-label">Select App Cycles</InputLabel>
        <Select
          labelId="cycle-multiple-chip-label"
          id="cycle-multiple-chip"
          multiple
          value={selectedCycles}
          onChange={handleCycleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Select App Cycles" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const cycleInfo = cycles.find(c => c.cycle_id === value);
                return (
                  <Chip key={value} label={cycleInfo ? cycleInfo.cycle_name : `Cycle ${value}`} />
                );
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {cycles.map((cycle) => (
            <MenuItem
              key={cycle.cycle_id}
              value={cycle.cycle_id}
            >
              {cycle.cycle_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* DataGrid Table */}
      <DataGrid
        sx={{ 
          height: 500, 
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
      />
    </Box>
  );
}