import React from "react";
import  Box  from "@mui/material/Box";
import {
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarFilterButton, 
  GridToolbarExport,
  GridToolbarQuickFilter
} from "@mui/x-data-grid";

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Box>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />  
        <GridToolbarExport />
      </Box>
      
      <Box>
        <GridToolbarQuickFilter /> 
      </Box>
             
    </GridToolbarContainer>
  );
}

export default CustomToolbar;