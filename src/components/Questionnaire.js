import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// External libraries (MUI)
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

//MUI Icons
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

//Custom components
import CustomToolbar from "./CustomeToolbar";

//API services
import { fetchQuestions, addQuestion } from "../services/questionnaireService";

export default function Questionnaire({ onClose }) {
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
      console.log(questionData);
      console.log(response);
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
    <Card sx={{ p: 3, width: "90%", margin: "auto", mt: 5, mb: 3 }}>
      <Grid container alignItems="center">
        <Grid size={11}>
          <Typography variant="h6" color="primary">
            Questionnaire
          </Typography>
        </Grid>
        <Grid size={1} sx={{ textAlign: "right" }}>
          <IconButton onClick={() => navigate("/hr-home")} color="error">
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <CardContent>
        <Card sx={{ width: "100%", mb: 3, display: "flex", gap: 2 }}>
          {/* <CardContent> */}
          <Card sx={{ width: "50%", flex: 1 }}>
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
              <Box sx={{ flex: 1, p: 1, minWidth: 600, maxHeight: "100vh" }}>
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
                    sx={{
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Card>
          {/* Right Panel */}
          <Card
            sx={{
              width: "50%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              maxHeight: "100vh",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 300,
                  maxHeight: 500,
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
                    <Typography variant="h6" color="primary">
                      Add a new question
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2, // adds spacing between elements
                      width: "100%",
                      mt: 2,
                    }}
                  >
                    <TextField
                      value={question_text}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Type your question here"
                      variant="standard"
                      sx={{ flex: 1, mr: 2 }} // Takes remaining space
                    />

                    <FormControl sx={{ minWidth: 160 }}>
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
                        <MenuItem value="Single_Choice">Single Choice</MenuItem>
                        {/* <MenuItem value="Rating_Scale">Rating_Scale</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Box>
                  {/* MCQ (Conditional Rendering) */}
                  {question_type === "MCQ" && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "100%",
                        minWidth: "500px",
                        padding: "7px",
                        marginTop: "15px",
                        borderRadius: "8px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        bgcolor: "background.paper", // optional
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#202124",
                          alignSelf: "flex-start",
                        }}
                      >
                        Options
                      </Typography>

                      {mcqOptions.map((option, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            borderRadius: "4px",
                            padding: "2px 6px",
                          }}
                        >
                          <TextField
                            fullWidth
                            variant="standard"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleMcqOptionChange(index, e.target.value)
                            }
                            InputProps={{
                              disableUnderline: false,
                              sx: {
                                fontSize: "14px",
                                padding: "8px 0",
                                background: "transparent",
                              },
                            }}
                          />
                          <IconButton
                            onClick={() => handleRemoveMcqOption(index)}
                            disabled={mcqOptions.length === 1}
                            sx={{
                              fontSize: "18px",
                              color: "#5f6368",
                              transition: "color 0.2s",
                              "&:hover": {
                                color: "#d93025",
                              },
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        </Box>
                      ))}
                      <AddIcon
                        sx={{
                          fontSize: "25px",
                          color: "#5f6368",
                          textTransform: "none",
                          "&:hover": {
                            color: "#1a73e8",
                          },
                        }}
                        onClick={handleAddMcqOption}
                      />
                    </Box>
                  )}

                  {/* Single_Choice Options (Conditional Rendering) */}
                  {question_type === "Single_Choice" && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "100%",
                        minWidth: "500px",
                        padding: "7px",
                        marginTop: "15px",
                        borderRadius: "8px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        bgcolor: "background.paper", // optional
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#202124",
                          alignSelf: "flex-start",
                        }}
                      >
                        Options
                      </Typography>

                      {mcqOptions.map((option, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            borderRadius: "4px",
                            padding: "2px 6px",
                          }}
                        >
                          <TextField
                            fullWidth
                            variant="standard"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleMcqOptionChange(index, e.target.value)
                            }
                            InputProps={{
                              disableUnderline: false,
                              sx: {
                                fontSize: "14px",
                                padding: "8px 0",
                                background: "transparent",
                              },
                            }}
                          />
                          <IconButton
                            onClick={() => handleRemoveMcqOption(index)}
                            disabled={mcqOptions.length === 1}
                            sx={{
                              fontSize: "18px",
                              color: "#5f6368",
                              transition: "color 0.2s",
                              "&:hover": {
                                color: "#d93025",
                              },
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        </Box>
                      ))}

                      <AddIcon
                        sx={{
                          fontSize: "25px",
                          color: "#5f6368",
                          textTransform: "none",
                          "&:hover": {
                            color: "#1a73e8",
                          },
                        }}
                        onClick={handleAddMcqOption}
                      />
                    </Box>
                  )}

                  {/* Customizable Yes/No options */}
                  {question_type === "Yes/No" && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                        minWidth: "300px",
                        padding: 2,
                        mt: 2,
                        borderRadius: "8px",
                        bgcolor: "background.paper",
                        maxHeight: 200,
                        overflowY: "auto",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "#202124",
                        }}
                      >
                        Labels
                      </Typography>

                      {[0, 1].map((index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            borderRadius: "4px",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            variant="standard"
                            value={yesNoLabels[index]}
                            onChange={(e) =>
                              handleYesNoLabelChange(index, e.target.value)
                            }
                            placeholder={index === 0 ? "Yes" : "No"}
                          />
                        </Box>
                      ))}
                    </Box>
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
                mr: 2,
              }}
            >
              <Button variant="contained" onClick={handleSave} color="primary">
                Save
              </Button>
              <Button variant="contained" onClick={handleCancel} color="error">
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
