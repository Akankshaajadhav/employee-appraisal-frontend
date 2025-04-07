import * as React from "react";
import { useState } from "react";
// MUI table
import { DataGrid } from "@mui/x-data-grid";
import "./Questionnaire.css";

// MUI toolbar
import CustomToolbar from "./CustomeToolbar";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { Snackbar, Alert, Card, CardContent } from "@mui/material";
//Import for search bar
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

//Import for dropdown
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// API function
import { fetchQuestions, addQuestion } from "../services/questionnaireService";

import { useNavigate } from "react-router-dom";

export default function Questionnaire({onClose}) {
  const navigate = useNavigate();
  // To display question list.
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add question hooks.
  const [question_text, setQuestionText] = useState("");
  const [question_type, setQuestionType] = useState("");
  const [mcqOptions, setMcqOptions] = useState([""]);
  const [yesNoLabels, setYesNoLabels] = useState(["Yes", "No"]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  let vertical = "bottom";
  let horizontal = "center";
  // Add MCQ option
  const handleAddMcqOption = () => {
    setMcqOptions([...mcqOptions, ""]);
  };

  // Update MCQ option
  const handleMcqOptionChange = (index, value) => {
    const updatedOptions = [...mcqOptions];
    updatedOptions[index] = value;
    setMcqOptions(updatedOptions);
  };

  // Remove MCQ option
  const handleRemoveMcqOption = (index) => {
    if (mcqOptions.length > 1) {
      setMcqOptions(mcqOptions.filter((_, i) => i !== index));
    }
  };

  // Update Yes/No labels
  const handleYesNoLabelChange = (index, value) => {
    setYesNoLabels((prevLabels) => {
      const updatedLabels = [...prevLabels];
      updatedLabels[index] = value;
      return updatedLabels;
    });
  };

  // Save question
  const handleSave = async () => {
    if (!question_text || !question_type) {
      setSnackbar({
        open: true,
        message: "Question text and type are required.",
        severity: "error",
      });
      return;
    }

    if (question_text.trim() === "") {
      setSnackbar({
        open: true,
        message: "Question text cannot be empty.",
        severity: "error",
      });
      return;
    }

    if (question_text.length > 250) {
      setSnackbar({
        open: true,
        message: "Question text should be less than 250 characters.",
        severity: "error",
      });
      return;
    }

    let options = null;

    if (question_type === "MCQ" || question_type === "Single_Choice") {
      options = mcqOptions
        .filter((opt) => opt.trim() !== "")
        .map((opt) => ({ option_text: opt }));
      if (options.length === 0) {
        setSnackbar({
          open: true,
          message:
            "At least one option is required for MCQ or Single Choice questions.",
          severity: "error",
        });
        return;
      }

      if (mcqOptions.some((opt) => opt.trim() === "")) {
        setSnackbar({
          open: true,
          message: "Options cannot be empty.",
          severity: "error",
        });
      }
    }

    if (question_type === "Yes/No") {
      options = yesNoLabels
        .filter((opt) => opt.trim() !== "")
        .map((opt) => ({ option_text: opt }));
      if (options.length === 0) {
        setSnackbar({
          open: true,
          message: "Yes/No options cannot be empty.",
          severity: "error",
        });
        return;
      }

      if (yesNoLabels.some((opt) => opt.trim() === "")) {
        setSnackbar({
          open: true,
          message: "Yes/No labels cannot be empty.",
          severity: "error",
        });
        return;
      }
    }

    const questionData = {
      question_type,
      question_text,
      options,
    };

    try {
      const response = await addQuestion(questionData);
      console.log("Saving question:", response);
      loadQuestions();
      handleCancel();
      setSnackbar({
        open: true,
        message: "Question added successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    setQuestionText("");
    setQuestionType("");
    setMcqOptions([""]);
    setYesNoLabels(["Yes", "No"]);
  };

  // Fetch question list.
  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (err) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadQuestions();
  }, []);

  // MUI column names and their size.
  const columns = [
    { field: "question_id", headerName: "Q. No.", width: 90 },
    { field: "question_text", headerName: "Questions", width: 500 },
  ];

  

  return (
    
      <Card sx={{ p: 3, width: "90%", mt: 5, mb: 3, ml: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent:"space-between",
            fontSize: "20px",
            color: "#3b7dda",
            ml: "20px",
            mt: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Questionnaire</h2>
          <IconButton onClick={() => {navigate("/hr-home")}} color="error">
            <CloseIcon />
          </IconButton>
        </Box>
        <CardContent>
          <Card sx={{ width: "100%", mb: 3, display: "flex", gap: 2 }}>
            {/* <CardContent> */}
            {/* Title Section */}
            <Card sx={{ p: 1, width: "50%", flex: 1 }}>
              {/* Split Screen Layout */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  height: "100vh",
                  gap: 2,
                }}
              >
                {/* Left Panel */}
                <Box sx={{ flex: 1, p: 2, minWidth: 600, maxHeight: "800px" }}>
                  {loading ? (
                    <p>Loading questions...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <DataGrid
                      rows={questions}
                      columns={columns}
                      getRowId={(row) => row.question_id}
                      slots={{ toolbar: CustomToolbar }}
                    />
                  )}
                </Box>
              </Box>
            </Card>
            {/* Right Panel */}
            <Card
              sx={{
                p: 1,
                width: "40%",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    minWidth: 300,
                    maxHeight: "500px",
                  }}
                >
                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        mb: 2,
                        color: "#3b7dda",
                      }}
                    >
                      <h3>Add A New Question</h3>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={question_text}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Type your question here"
                        variant="standard"
                      />

                      <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="question-type-label">
                          Question Type
                        </InputLabel>
                        <Select
                          labelId="question-type-label"
                          id="question-type-select"
                          value={question_type}
                          onChange={(e) => setQuestionType(e.target.value)}
                          autoWidth
                          label="Question_Type"
                          sx={{
                            height: 43,
                            "& .MuiMenuItem-root": {
                              fontSize: "10px",
                              padding: "12px 16px",
                              minHeight: "20px",
                            },
                          }}
                        >
                          <MenuItem value="MCQ">MCQ</MenuItem>
                          <MenuItem value="Yes/No">Yes/No</MenuItem>
                          <MenuItem value="Descriptive">Descriptive</MenuItem>
                          <MenuItem value="Single_Choice">
                            Single Choice
                          </MenuItem>
                          <MenuItem value="Rating_Scale">Rating Scale</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    {/* MCQ (Conditional Rendering) */}
                    {question_type === "MCQ" && (
                      <div className="mcq_setup">
                        <label htmlFor="option">Options</label>
                        {mcqOptions.map((option, index) => (
                          <div key={index} className="input_option">
                            <TextField
                              value={option}
                              onChange={(e) =>
                                handleMcqOptionChange(index, e.target.value)
                              }
                              placeholder={`Option ${index + 1}`}
                              variant="standard"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMcqOption(index)}
                              disabled={mcqOptions.length === 1}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={handleAddMcqOption}>
                          +
                        </button>
                      </div>
                    )}

                    {/* Single_Choice Options (Conditional Rendering) */}
                    {question_type === "Single_Choice" && (
                      <div className="mcq_setup">
                        <label htmlFor="option">Options</label>
                        {mcqOptions.map((option, index) => (
                          <div key={index} className="input_option">
                            <TextField
                              value={option}
                              onChange={(e) =>
                                handleMcqOptionChange(index, e.target.value)
                              }
                              placeholder={`Option ${index + 1}`}
                              variant="standard"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMcqOption(index)}
                              disabled={mcqOptions.length === 1}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={handleAddMcqOption}>
                          +
                        </button>
                      </div>
                    )}

                    {/* Customizable Yes/No options */}
                    {question_type === "Yes/No" && (
                      <div className="mcq_setup">
                        <label htmlFor="option">Labels</label>
                        <div className="input_option">
                          <TextField
                            value={yesNoLabels[0]}
                            onChange={(e) =>
                              handleYesNoLabelChange(0, e.target.value)
                            }
                            variant="standard"
                          />
                        </div>
                        <div className="input_option">
                          <TextField
                            value={yesNoLabels[1]}
                            onChange={(e) =>
                              handleYesNoLabelChange(1, e.target.value)
                            }
                            variant="standard"
                          />
                        </div>
                      </div>
                    )}
                  </Box>
                </Box>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  mt: "auto",
                  mb: 3,
                  ml: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSave}
                  color="primary"
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCancel}
                  color="error"
                >
                  Cancel
                </Button>
              </Box>
              <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                anchorOrigin={{ vertical, horizontal }}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
              >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
              </Snackbar>
            </Card>
          </Card>
        </CardContent>
      </Card>
    
  );
}