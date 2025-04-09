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
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Chip from '@mui/material/Chip';
// import OutlinedInput from '@mui/material/OutlinedInput';

// const API_URL = process.env.REACT_APP_BASE_URL; 

// // Custom Toolbar Component with Better Alignment
// function CustomToolbar() {
//   return (
//     <GridToolbarContainer sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
//       {/* Left Side - Filters, Columns, Export */}
//       <Box sx={{ display: "flex", gap: 1 }}>
//         <GridToolbarColumnsButton />
//         <GridToolbarFilterButton />
//         <GridToolbarExport />
//       </Box>

//       {/* Right Side - Search Bar */}
//       <Box sx={{ width: "250px" }}>
//         <GridToolbarQuickFilter />
//       </Box>
//     </GridToolbarContainer>
//   );
// }

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// // lead_assessment/employees_ratings/2

// export default function HistoricalReportTable({ onSelect }) {
//   const [rows, setRows] = React.useState([]);
//   const [employeeMap, setEmployeeMap] = React.useState({});
//   const [originalRows, setOriginalRows] = React.useState([]);
//   const [selectedIds, setSelectedIds] = React.useState([]);
//   const [cycles, setCycles] = React.useState([]);
//   const [selectedCycles, setSelectedCycles] = React.useState([]);
//   const [baseColumns] = React.useState([
//     { field: "employee_id", headerName: "Employee ID", width: 120 },
//     { field: "employee_name", headerName: "Name", width: 150 },
//     { field: "role", headerName: "Role", width: 120 },
//     { field: "reporting_manager", headerName: "Reporting Manager", width: 200 },
//     { field: "previous_reporting_manager", headerName: "Previous Manager", width: 200 },
//   ]);
//   const [columns, setColumns] = React.useState(baseColumns);

//   // Fetch employee data
//   React.useEffect(() => {
//     fetch(`${API_URL}/employees`)
//       .then((response) => response.json())
//       .then((data) => {
//         // Create a mapping of employee_id to employee_name
//         const empMap = {};
//         data.forEach(emp => {
//           empMap[emp.employee_id] = emp.employee_name;
//         });

//         // Convert API data to DataGrid format
//         const formattedData = data.map((emp, index) => ({
//           id: index + 1,
//           employee_id: emp.employee_id,
//           employee_name: emp.employee_name,
//           role: emp.role,
//           reporting_manager: emp.reporting_manager_name || "-",
//           previous_reporting_manager: emp.previous_reporting_manager_name || "-",
//         }));

//         setEmployeeMap(empMap);
//         setRows(formattedData);
//         setOriginalRows(formattedData);
//       })
//       .catch((error) => console.error("Error fetching employee data:", error));
//   }, []);

//   // Fetch completed cycles data
//   React.useEffect(() => {
//     fetch(`${API_URL}/appraisal_cycle/appraisal-cycles/completed`) // Replace with your actual API endpoint
//       .then((response) => response.json())
//       .then((data) => {
//         setCycles(data);
//       })
//       .catch((error) => console.error("Error fetching cycle data:", error));
//   }, []);

//   // Handle cycle selection change
//   const handleCycleChange = (event) => {
//     const { value } = event.target;
//     setSelectedCycles(value);
    
//     // Update columns based on selected cycles
//     updateColumnsBasedOnCycles(value);
//   };

//   // Update columns based on selected cycles
//   const updateColumnsBasedOnCycles = async (selectedCycleIds) => {
//     // Create dynamic columns based on selected cycles
//     const cycleColumns = selectedCycleIds.map(cycleId => {
//       const cycleInfo = cycles.find(c => c.cycle_id === cycleId);
//       const cycleTitle = cycleInfo ? cycleInfo.cycle_name : `Cycle ${cycleId}`;
      
//       return {
//         field: `cycle_${cycleId}`,
//         headerName: cycleTitle,
//         width: 150,
//         valueGetter: (params) => {
//           return params.row[`cycle_${cycleId}`] !== undefined ? params.row[`cycle_${cycleId}`] : "-";
//         }
//       };
//     });

//     // Combine base columns with cycle columns
//     setColumns([...baseColumns, ...cycleColumns]);

//     // Fetch ratings data for all selected cycles
//     if (selectedCycleIds.length > 0) {
//       // Create a copy of the current rows to update with ratings
//       const updatedRows = [...rows];
      
//       // Fetch ratings for each cycle and update rows
//       for (const cycleId of selectedCycleIds) {
//         try {
//           const response = await fetch(`${API_URL}/lead_assessment/employees_ratings/${cycleId}`);
//           const ratingsData = await response.json();
          
//           // Update rows with ratings data
//           updatedRows.forEach(row => {
//             // Find the rating for this employee in this cycle
//             const employeeRating = ratingsData.find(r => r.employee_id === row.employee_id);
            
//             // Add the rating to the row under a cycle-specific field name
//             row[`cycle_${cycleId}`] = employeeRating ? employeeRating.parameter_rating : "-";
//           });
//         } catch (error) {
//           console.error(`Error fetching ratings for cycle ${cycleId}:`, error);
//         }
//       }
      
//       // Remove data for cycles that are no longer selected
//       updatedRows.forEach(row => {
//         Object.keys(row).forEach(key => {
//           if (key.startsWith('cycle_')) {
//             const cycleId = parseInt(key.replace('cycle_', ''));
//             if (!selectedCycleIds.includes(cycleId)) {
//               delete row[key];
//             }
//           }
//         });
//       });
      
//       setRows(updatedRows);
//     } else {
//       // If no cycles selected, remove all cycle data
//       const cleanedRows = rows.map(row => {
//         const newRow = { ...row };
//         Object.keys(newRow).forEach(key => {
//           if (key.startsWith('cycle_')) {
//             delete newRow[key];
//           }
//         });
//         return newRow;
//       });
      
//       setRows(cleanedRows);
//     }
//   };

//   // Handle row selection
//   const handleRowSelection = (selectedRowIds) => {
//     setSelectedIds(selectedRowIds);
    
//     // Get selected and unselected employees, preserving all data including cycle ratings
//     const selectedEmployees = rows.filter(row => selectedRowIds.includes(row.id));
//     const unselectedEmployees = rows.filter(row => !selectedRowIds.includes(row.id));
  
//     const newOrderedRows = [...selectedEmployees, ...unselectedEmployees];
//     setRows(newOrderedRows);
  
//     if (onSelect) {
//       onSelect(selectedEmployees);
//     }
//   };

//   const getRowHeight = () => 35;

//   return (
//     <Box sx={{ width: '100%' }}>
//       {/* Cycle Selection Dropdown */}
//       <FormControl sx={{ mb: 2, width: '100%' }}>
//         <InputLabel id="cycle-multiple-chip-label">Select App Cycles</InputLabel>
//         <Select
//           labelId="cycle-multiple-chip-label"
//           id="cycle-multiple-chip"
//           multiple
//           value={selectedCycles}
//           onChange={handleCycleChange}
//           input={<OutlinedInput id="select-multiple-chip" label="Select App Cycles" />}
//           renderValue={(selected) => (
//             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//               {selected.map((value) => {
//                 const cycleInfo = cycles.find(c => c.cycle_id === value);
//                 return (
//                   <Chip key={value} label={cycleInfo ? cycleInfo.cycle_name : `Cycle ${value}`} />
//                 );
//               })}
//             </Box>
//           )}
//           MenuProps={MenuProps}
//         >
//           {cycles.map((cycle) => (
//             <MenuItem
//               key={cycle.cycle_id}
//               value={cycle.cycle_id}
//             >
//               {cycle.cycle_name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* DataGrid Table */}
//       <DataGrid
//         sx={{ 
//           height: 500, 
//           overflow: "auto",
//           "& .MuiDataGrid-columnHeaderTitle": {
//             fontWeight: "bold",
//           }
//         }}
//         rows={rows}
//         columns={columns}
//         pageSizeOptions={[5]} 
//         checkboxSelection
//         disableRowSelectionOnClick
//         slots={{ toolbar: CustomToolbar }}
//         onRowSelectionModelChange={handleRowSelection}
//         selectionModel={selectedIds}
//         rowHeight={getRowHeight()}
//         hideFooter
//       />
//     </Box>
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
  const [baseColumns] = React.useState([
    { field: "employee_id", headerName: "Employee ID", width: 120 },
    { field: "employee_name", headerName: "Name", width: 150 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "reporting_manager", headerName: "Reporting Manager", width: 200 },
    { field: "previous_reporting_manager", headerName: "Previous Manager", width: 200 },
  ]);
  const [columns, setColumns] = React.useState(baseColumns);

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
  const updateColumnsBasedOnCycles = async (selectedCycleIds) => {
    // Create dynamic columns based on selected cycles
    const cycleColumns = selectedCycleIds.map(cycleId => {
      const cycleInfo = cycles.find(c => c.cycle_id === cycleId);
      const cycleTitle = cycleInfo ? cycleInfo.cycle_name : `Cycle ${cycleId}`;
      
      return {
        field: `cycle_${cycleId}`,
        headerName: cycleTitle,
        width: 150,
      };
    });

    // Combine base columns with cycle columns
    setColumns([...baseColumns, ...cycleColumns]);

    // Fetch ratings data for all selected cycles
    if (selectedCycleIds.length > 0) {
      // Create a copy of the current rows to update with ratings
      const updatedRows = [...rows];
      
      // Fetch ratings for each cycle and update rows
      for (const cycleId of selectedCycleIds) {
        try {
          const response = await fetch(`${API_URL}/lead_assessment/employees_ratings/${cycleId}`);
          const ratingsData = await response.json();
          
          // Update rows with ratings data
          updatedRows.forEach(row => {
            // Find the rating for this employee in this cycle
            const employeeRating = ratingsData.find(r => r.employee_id === row.employee_id);
            
            // Add the rating to the row under a cycle-specific field name
            row[`cycle_${cycleId}`] = employeeRating ? employeeRating.parameter_rating : "-";
          });
        } catch (error) {
          console.error(`Error fetching ratings for cycle ${cycleId}:`, error);
        }
      }
      
      // Remove data for cycles that are no longer selected
      updatedRows.forEach(row => {
        Object.keys(row).forEach(key => {
          if (key.startsWith('cycle_')) {
            const cycleId = parseInt(key.replace('cycle_', ''));
            if (!selectedCycleIds.includes(cycleId)) {
              delete row[key];
            }
          }
        });
      });
      
      setRows(updatedRows);
    } else {
      // If no cycles selected, remove all cycle data
      const cleanedRows = rows.map(row => {
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