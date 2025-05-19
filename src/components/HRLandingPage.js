
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Link,
  IconButton,
  Snackbar,
  Alert,
 Menu, 
 MenuItem,
 Skeleton,
 Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "./CustomeToolbar";
import Backdrop from '@mui/material/Backdrop';    
import CircularProgress from '@mui/material/CircularProgress';    
import { Edit, Delete, Visibility } from "@mui/icons-material";
import {
  fetchAppraisalCycles,
  deleteAppraisalCycle,
} from "../services/AddAppraisalCycle";
import Assignment from "./Assignment";
import {
  getGridNumericOperators,
  GridFilterInputValue,
} from '@mui/x-data-grid';

const HRLandingPage = ({ onNavigateToMain }) => {
  const navigate = useNavigate();
  // const [anchorEl, setAnchorEl] = React.captureOwnerStackuseState(null);

  const [appraisalCycles, setAppraisalCycles] = useState([]);
  const [error, setError] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState(null);
  const [selectedCycleName, setSelectedCycleName] = useState(null);
  const [loadingAppraisalCycles, setLoadingAppraisalCycles] = React.useState(true); 
  const [deleting, setDeleting] = useState(false); 
  // State for menu anchor element

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  let vertical = "bottom";
  let horizontal = "center";

  const findCurrentStage = (cycle) => {
    const today = new Date().toISOString().split("T")[0];

    if (!cycle || !cycle.stages) {
      return "Unknown";
    }

    for (const stage of cycle.stages) {
      if (
        today >= stage.start_date_of_stage &&
        today <= stage.end_date_of_stage
      ) {
        return stage.stage_name;
      }
    }

    if (cycle.start_date_of_cycle >= today) {
      return "Setup";
    }
    return "Closure";
  };

  const findYear = (cycle) => {
    let date = cycle.end_date_of_cycle;
    let year = parseInt(date.slice(0,4));
    return year;
  }

    const labeledNumericOperators = getGridNumericOperators().map((op) => {
    const labelMap = {
      '>': 'Greater than',
      '<': 'Less than',
      '=': 'Equals',
       '!=': 'Not Equals',
      '>=': 'Greater or Equals',
      '<=': 'Less or Equals'
    };

    return {
      ...op,
      label: labelMap[op.value] || op.label, 
      InputComponent: op.InputComponent || GridFilterInputValue,
    };
  });

  // Fetch appraisal cycle list
  const loadAppraisalCycles = async () => {
    try {
      setLoadingAppraisalCycles(true)
      const data = await fetchAppraisalCycles();
      setAppraisalCycles(data);
      console.log(data);
    } catch (err) {
      setError("Failed to load appraisal cycles");
      console.log("Error while fetching cycles: " + err);
    }
    finally{
      setLoadingAppraisalCycles(false);
    }

  };

  // Delete appraisal cycle
  const handleDelete = async (cycle_id) => {
    try {
      setDeleting(true); // Show loading backdrop 
      let cycle = appraisalCycles.filter(
        (cycle) => cycle.cycle_id === cycle_id
      );
      if (cycle.status === "active") {
        setSnackbar({
          open: true,
          message: "Active cycle can't be deleted..",
          severity: "error",
        });
        return;
      }
      const data = await deleteAppraisalCycle(cycle_id);
      loadAppraisalCycles();
      console.log("Cycle is deleted :" + data);
      setSnackbar({
        open: true,
        message: "Cycle is deleted successfully.",
        severity: "success",
      });
    } catch (err) {
      console.log("Error while deleting the cycle: " + err);
    }
    finally {
      setDeleting(false); // Hide loading backdrop             
    }
  };

  const toggleDetailsView = (cycleId) => {
    const selectedCycle = appraisalCycles.find(
      (cycle) => cycle.cycle_id === cycleId
    );

    if (selectedCycleId === cycleId && detailsVisible) {
      setDetailsVisible(false);
      setSelectedCycleId(null);
      setSelectedCycleName(null);
    } else {
      setDetailsVisible(true);
      setSelectedCycleId(cycleId);
      setSelectedCycleName(selectedCycle?.cycle_name || "Unknown Cycle");
    }
  };

  // Close handler for hiding Assignment component
  const handleCloseAssignment = () => {
    setDetailsVisible(false);
    setSelectedCycleId(null);
  };

  React.useEffect(() => {
    loadAppraisalCycles();
  }, []);

  const rowsWithStage = Array.isArray(appraisalCycles)
  ? appraisalCycles.map((cycle) => ({
      ...cycle,
      currentStage: findCurrentStage(cycle),
      years: findYear(cycle),
    }))
  : [];

  const columnsWithStage = [
    {
      field: "cycle_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        const cycleStr = params.value;
        return cycleStr.charAt(0).toUpperCase() + cycleStr.slice(1);
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const statusStr = params.value;
        return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
      },
    },
    {
      field: "years",
      headerName: "Year",
      flex: 1,
      filterOperators: labeledNumericOperators,
    },
    { field: "currentStage", headerName: "Current Stage", flex: 1 },
    {
      field: "start_date_of_cycle",
      headerName: "Start Date",
      flex: 1,
      renderCell: (params) => {
        const dateStr = params.value;
        if (!dateStr) return "";

        // const [year, month, day] = dateStr.split("T")[0].split("-");
        // return `${day}-${month}-${year}`;
        const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, " "); // Format the date as "dd-MMM-yyyy"
       
      },
    },
    {
      field: "end_date_of_cycle",
      headerName: "End Date",
      flex: 1,
      renderCell: (params) => {
        const dateStr = params.value;
        if (!dateStr) return "";

        // const [year, month, day] = dateStr.split("T")[0].split("-");
        // return `${day}-${month}-${year}`;

        const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, " "); // Format the date as "dd-MMM-yyyy"
       
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const isDeletable =
          params.row.status !== "active" && params.row.status !== "completed";
        const isVisible = params.row.status !== "completed";
        const isEditable = params.row.status !== "completed";
        
        return (
          <>
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                if (isVisible) {
                  toggleDetailsView(params.row.cycle_id);
                }
              }}
              disabled={
                !isVisible || (detailsVisible && selectedCycleId !== params.row.cycle_id)
              }
            >
              <Visibility />
            </IconButton>


            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                if(isEditable){
                  const cycle_id = params.row.cycle_id;
                  navigate(`/edit-appraisal/${cycle_id}`);
                }
              }}
              disabled={!isEditable}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                if(isDeletable){
                  handleDelete(params.row.cycle_id);
                }
              }}
              disabled={!isDeletable}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];
  const getRowHeight = () => 38;

  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // open menu
  };

  const handleClose = () => {
    setAnchorEl(null); // close menu
  };

  return (
    <>
          <Card sx={{ width: "100%" }}>
            <CardContent
              sx={{ height: detailsVisible ? 300 : "100vh"}}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                {/* Left Side: Appraisal Cycle */}
                <Grid item>
                  <Typography variant="h6" color="primary" fontWeight={"bold"}>
                    Appraisal Cycle
                  </Typography>
                </Grid>

                {/* Right Side: Links & Button */}
                <Grid item>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Link
                        onClick={handleClick}                     
                        color="primary"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        Reports
                      </Link>

                        <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                              >
                                <MenuItem
                                  onClick={() => {
                                    navigate("/historical-report");
                                    handleClose();
                                  }}
                                >
                                  Historical Report
                                </MenuItem>
                        
                                <MenuItem
                                  onClick={() => {
                                    navigate("/self-assessment-report"); 
                                    handleClose();
                                  }}
                                >
                                  Self Assessment Report
                                </MenuItem>
                              </Menu>

                    </Grid>
                    <Grid item>
                      <Link
                        onClick={() => navigate("/questionnaire")}
                        color="primary"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        Questionnaire
                      </Link>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/add-appraisal")}
                        color="primary"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>



              {(loadingAppraisalCycles) ?  (
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
                  <Grid item xs={12} style={{ height: "100%", width: "100%", }}>
                    <DataGrid
                      rows={rowsWithStage}
                      columns={columnsWithStage}
                      getRowId={(row) => row.cycle_id}
                      slots={{ toolbar: CustomToolbar }}
                      pageSizeOptions={[5]}
                      sx={{
                        height: detailsVisible ? 250 : "93vh",
                        padding:"2px",
                        minHeight:"auto",
                        overflow: "auto",
                        "& .MuiDataGrid-columnHeaderTitle": {
                          fontWeight: "bold", 
                        }
                      }}
                      rowHeight={getRowHeight()}
                      // hideFooterPagination
                      hideFooter
                    />
                  </Grid>
                )
              }
             
            </CardContent>
          </Card>

          <Box sx={{mb:2}}>
          {detailsVisible && selectedCycleId && (
            <Assignment
              cycleId={selectedCycleId}
              onClose={handleCloseAssignment}
              cycleName={selectedCycleName}
            />
          )}
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            anchorOrigin={{ vertical, horizontal }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>
        
      <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={deleting}     
  >
    <CircularProgress color="inherit" />
  </Backdrop>
    </>
  );
};

export default HRLandingPage;