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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "./CustomeToolbar";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import {fetchAppraisalCycles,deleteAppraisalCycle,} from "../services/AddAppraisalCycle";
import Assignment from "./Assignment";

const HRLandingPage = () => {
  const navigate = useNavigate();

  const [appraisalCycles, setAppraisalCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    if (cycle.start_date_of_cycle > today) {
      return "Setup";
    }
    return "Closure";
  };

  // Fetch appraisal cycle list
  const loadAppraisalCycles = async () => {
    try {
      const data = await fetchAppraisalCycles();
      setAppraisalCycles(data);
      console.log(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load appraisal cycles");
      console.log("Error while fetching cycles: " + err);
      setLoading(false);
    }
  };

  // Delete appraisal cycle
  const handleDelete = async (cycle_id) => {
    try {
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
  };

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState(null);
  const [selectedCycleName, setSelectedCycleName] = useState(null);

    const toggleDetailsView = (cycleId) => {
      const selectedCycle = appraisalCycles.find((cycle) => cycle.cycle_id === cycleId);
      
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

  const rowsWithStage = appraisalCycles.map((cycle) => ({
    ...cycle,
    currentStage: findCurrentStage(cycle),
  }));

  const columnsWithStage = [
    { field: "cycle_name", headerName: "Name", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "currentStage", headerName: "Current Stage", flex: 1 },
    { field: "start_date_of_cycle", headerName: "Start Date", flex: 1 },
    { field: "end_date_of_cycle", headerName: "End Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              toggleDetailsView(params.row.cycle_id);
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              alert("Clicked on edit icon");
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.cycle_id);
            }}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];
  const getRowHeight = () => 38;

  return (
    <>
    <Card>
      <CardContent>
        <Card sx={{ width: "100%" }}>
          <CardContent sx={{ height: 300, maxHeight: 300 }}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{mb:2}}>
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
                    <Link onClick={() => navigate("/reports")} color="primary">
                      Reports
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link onClick={() => navigate("/questionnaire")} color="primary">
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

            <Grid container spacing={2} style={{ height: "100%" }}>
              {loading ? (
                <Grid item xs={12}>
                  <p>Loading appraisal cycles...</p>
                </Grid>
              ) : error ? (
                <Grid item xs={12}>
                  <p>{error}</p>
                </Grid>
              ) : (
                <Grid item xs={12} style={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    rows={rowsWithStage}
                    columns={columnsWithStage}
                    getRowId={(row) => row.cycle_id}
                    slots={{ toolbar: CustomToolbar }}
                    pageSizeOptions={[5]}
                    sx={{
                      height:250,
                      overflow:"auto",
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold", // Make column headers bold
                    }
                    }}
                    rowHeight={getRowHeight()}
                    // hideFooterPagination
                    hideFooter
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {detailsVisible && selectedCycleId && (
            <Assignment cycleId={selectedCycleId} onClose={handleCloseAssignment} cycleName={selectedCycleName}  />
        )}


        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical, horizontal }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
    </>
  );
};

export default HRLandingPage;
