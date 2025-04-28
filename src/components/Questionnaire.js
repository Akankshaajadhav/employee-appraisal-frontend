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
  Skeleton,
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
  const [loadingQuestions, setLoadingquestions] = React.useState(true); 

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

    if (question_type === "MCQ" || question_type === "Single Choice") {
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
      setLoadingquestions(true)
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (err) {
      setError("Failed to load questions");
    } finally {
      // setLoading(false);
      setLoadingquestions(false)
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
    <Card sx={{  width: "100%", margin: "auto", mb: 3 }}>
      <Grid container alignItems="center">
        <Grid size={11}>
          <Typography variant="h6" color="primary" fontWeight={"bold"} pl="14px" pt="10px">
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
                {(loadingQuestions) ?  (
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
                    rows={questions}
                    columns={columns}
                    getRowId={(row) => row.question_id}
                    slots={{ toolbar: CustomToolbar }}
                    sx={{
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                      },
                    }}
                    hideFooter
                  />
                        )}
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
                      sx={{ flex: 1, mr: 20,  }} // Takes remaining space
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
                        <MenuItem value="Single Choice">Single Choice</MenuItem>
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
                      width: "50%",
                      minWidth: "250px",
                      padding: "7px",
                      marginTop: "15px",
                      borderRadius: "8px",
                      bgcolor: "background.paper",
                      maxHeight: "600px",
                    }}
                  >
                    {/* Options Title */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#202124",
                        alignSelf: "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      Options
                    </Typography>
                  
                    {/* Scrollable Options */}
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        maxHeight:"300px",
                        gap: "10px",
                        paddingRight: "4px", // optional: for better scroll space
                      }}
                    >
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
                    </Box>
                  
                    {/* Add Icon at Bottom */}
                    <IconButton
                      onClick={handleAddMcqOption}
                      sx={{
                        alignSelf: "flex-start",
                        fontSize: "25px",
                        color: "#5f6368",
                        textTransform: "none",
                        marginTop: "10px",
                        "&:hover": {
                          color: "#1a73e8",
                        },
                      }}
                    >
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                  )}

                  {/* Single_Choice Options (Conditional Rendering) */}
                  {question_type === "Single Choice" && (
                    <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      minWidth: "250px",
                      padding: "7px",
                      marginTop: "15px",
                      borderRadius: "8px",
                      bgcolor: "background.paper",
                      maxHeight: "600px",
                    }}
                  >
                    {/* Options Title */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#202124",
                        alignSelf: "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      Options
                    </Typography>
                  
                    {/* Scrollable Options */}
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        maxHeight:"300px",
                        gap: "10px",
                        paddingRight: "4px", // optional: for better scroll space
                      }}
                    >
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
                    </Box>
                  
                    {/* Add Icon at Bottom */}
                    <IconButton
                      onClick={handleAddMcqOption}
                      sx={{
                        alignSelf: "flex-start",
                        fontSize: "25px",
                        color: "#5f6368",
                        textTransform: "none",
                        marginTop: "10px",
                        "&:hover": {
                          color: "#1a73e8",
                        },
                      }}
                    >
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                  )}

                  {/* Customizable Yes/No options */}
                  {question_type === "Yes/No" && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "50%",     //changed width
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
