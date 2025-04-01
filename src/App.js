import React, { useState } from "react";
import "./App.css";
import DataGridDemo from "./components/employee";
import AddAppraisalCycle from "./components/AddAppraisalCycle";
import Questionnaire from "./components/Questionnaire";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
const ParentComponent = ({ onNext }) => {
  const [showPage, setShowPage] = useState(false);
  const [questionnaire, setQuestionnaire] = useState(true);
  return (
    <div style={{ position: "relative" }}>
      {/* Top-right Add button */}
      {(!questionnaire && !showPage) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end", // Align button to right
            padding: "10px",
            gap:"10px"
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setQuestionnaire(true)}
          >
            Questionnaire
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowPage(true)}
          >
            Add
          </Button>
        </Box>
      )}

      {showPage && <AddAppraisalCycle onClose={() => setShowPage(false)} />}
      {questionnaire && <Questionnaire onClose={() => setQuestionnaire(false)} />}
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState(1);

  return (
    <div>
      {/* Conditionally render components */}
      {screen === 1 && <ParentComponent onNext={() => setScreen(2)} />}
      {screen === 2 && <DataGridDemo />}

      {/* Navigation buttons */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {screen > 1 && (
          <button onClick={() => setScreen(screen - 1)}>Previous</button>
        )}
        {screen < 2 && (
          <button onClick={() => setScreen(screen + 1)}>Next</button>
        )}
      </div>
    </div>
  );
}