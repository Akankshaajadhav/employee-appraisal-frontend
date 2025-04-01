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

// Custom Toolbar Component
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Box>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarExport />
      </Box>
      <Box>
        <GridToolbarQuickFilter/>
      </Box>
    </GridToolbarContainer>
  );
}

export default function DataGridDemo() {
  const [rows, setRows] = React.useState([]);
  const [employeeMap, setEmployeeMap] = React.useState({}); // To map employee_id -> employee_name
  const [originalRows, setOriginalRows] = React.useState([]); // Store original order
  const [selectedIds, setSelectedIds] = React.useState([]); // Track selected rows

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/") // API call to FastAPI
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
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to reorder rows based on selection and restore deselected rows
  const handleRowSelection = (selectedRowIds) => {
    setSelectedIds(selectedRowIds);

    if (selectedRowIds.length === 0) {
      setRows(originalRows); // If nothing is selected, reset to original order
      return;
    }

    const selectedRows = originalRows.filter((row) => selectedRowIds.includes(row.id));
    const unselectedRows = originalRows.filter((row) => !selectedRowIds.includes(row.id));

    setRows([...selectedRows, ...unselectedRows]);
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
    <Box item sx={{ height: 600, width: '90%', overflow: 'auto', ml:5, mt:20}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]} 
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }} // Toolbar added here
        onRowSelectionModelChange={handleRowSelection} // Handle row selection change
        selectionModel={selectedIds} // Maintain selection state
        rowHeight={getRowHeight()}
      />
    </Box>
  );
}
