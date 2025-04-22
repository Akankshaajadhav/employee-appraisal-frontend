// Screen for the asignment -HS (Employees)

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
import { Skeleton } from '@mui/material';
import { useNavigate } from "react-router-dom";

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
  
export default function DataGridDemo({ onSelect }) {
// export default function DataGridDemo() {
  const [rows, setRows] = React.useState([]);
  const [employeeMap, setEmployeeMap] = React.useState({}); // To map employee_id -> employee_name
  const [originalRows, setOriginalRows] = React.useState([]); // Store original order
  const [selectedIds, setSelectedIds] = React.useState([]); // Track selected rows
  const navigate = useNavigate();     
  const [loadingEmployees, setLoadingEmployees] = React.useState(true);  

  React.useEffect(() => {
    setLoadingEmployees(true)
    fetch(`${API_URL}/`) // API call to FastAPI
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
          reporting_manager: empMap[emp.reporting_manager] || "", // Convert ID to Name
          previous_reporting_manager: empMap[emp.previous_reporting_manager] || "", // Convert ID to Name
        }));

        setEmployeeMap(empMap); // Store mapping for future use
        setRows(formattedData);
        setOriginalRows(formattedData); // Store original order
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoadingEmployees(false));
  }, []);
  
  const handleRowSelection = (selectedRowIds) => {
    setSelectedIds(selectedRowIds);
    // Get selected rows
    const selectedEmployees = originalRows.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    // Get unselected rows
    const unselectedEmployees = originalRows.filter(
      (row) => !selectedRowIds.includes(row.id)
    );
  
    // Merge with selected rows on top
    const newOrderedRows = [...selectedEmployees, ...unselectedEmployees];
    
    setRows(newOrderedRows); // Update DataGrid rows
  
    if (onSelect) {
      onSelect(selectedEmployees); // Send selected employee objects
    }
  };
  
  // Define Columns
  const columns = [
    { field: "employee_id", headerName: "Employee ID", width: 120 },
    { field: "employee_name", headerName: "Name", width: 150 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "reporting_manager", headerName: "Reporting Manager", width: 200 },
    { field: "previous_reporting_manager", headerName: "Previous Manager", width: 200 },
  ];


  const getRowHeight = () => 35;

  return (
    <>
    {(loadingEmployees) ?  (
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
        sx = {{height: 500, overflow: "auto",
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Make column headers bold
        }
        }}
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]} 
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }} // Toolbar added here
        onRowSelectionModelChange={handleRowSelection} // Handle row selection change
        selectionModel={selectedIds} // Maintain selection state
        rowHeight={getRowHeight()}
        hideFooter
      />)}
  </>
  );
}