// Screen for the asignment -RHS (Questions)


import React, {useState, useEffect} from 'react'; 
import SearchIcon from "@mui/icons-material/Search";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {
    Card, 
    Box, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Checkbox, 
    FormControl,
    MenuItem, 
    Select, 
    TextField,
    InputAdornment,
    Collapse,
    Divider,
    Button,
    Grid,
    IconButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DeleteIcon from '@mui/icons-material/Delete';

export default function CheckboxList({ onSelect }) {
// export default function CheckboxList() {
    const [questions, setQuestions] = useState([]);
    const [checked, setChecked] = useState([]);
    const [type, setType] = React.useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false); 

    const fetchQuestions = () => {
        setQuestions([]); 
        setChecked([]);  
        setSearchTerm("");
        setType("");
        setIsPreviewMode(false);
        fetch("http://localhost:8000/question")
            .then((response) => response.json())
            .then((data) => setQuestions(data))
            .catch((error) => console.error("Error fetching questions:", error));
    };
    
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Handle checkbox toggle
    const handleToggle = (questionId) => () => {
        setChecked((prev) => {
            const updatedChecked = prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId];
    
            // Get selected questions
            const selectedQuestions = questions.filter((q) => updatedChecked.includes(q.question_id));
            
            // Ensure `onSelect` is called with selected questions
            if (onSelect) {
                console.log("Passing Selected Questions:", selectedQuestions);
                onSelect(selectedQuestions);
            }

            return updatedChecked;
        });
    };
    
    const handleQuestionClick = (questionId) => {
        setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
    };

    // Toggle between preview and selection mode
    const handlePreviewToggle = () => {
        setIsPreviewMode((prev) => !prev); 
    };

    // Remove questions in preview mode
    const handleRemoveQuestion = (questionId) => {
        setChecked((prev) => {
            const updatedChecked = prev.filter((id) => id !== questionId);
            const updatedSelected = questions.filter((q) => updatedChecked.includes(q.question_id));

            // Notify parent of updated selection
            if (onSelect) {
                onSelect(updatedSelected);
            }
    
            return updatedChecked;
        });
    };

     // Filter questions based on selected type & search key word
     const filteredQuestions = questions.filter((question) =>
        (type === "" || question.question_type === type) &&  // Filter by type
        question.question_text.toLowerCase().includes(searchTerm.toLowerCase())  // Filter by search term
    );

    const selectedQuestions = questions.filter((q) => checked.includes(q.question_id));

    return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "550px" }}> 
    {/* Top Section: Filters and Search */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <FormControl>
            <Select
                labelId="question-type-label"
                id="question-type-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                displayEmpty
                sx={{height:40}}
            >
                <MenuItem value="">Select Question Type</MenuItem>
                <MenuItem value="MCQ">MCQ</MenuItem>
                <MenuItem value="Yes/No">Yes/No</MenuItem>
                <MenuItem value="Descriptive">Descriptive</MenuItem>
                <MenuItem value="Single choice">Single choice</MenuItem>
                {/* <MenuItem value="Rating scale">Rating scale</MenuItem> */}
            </Select>
        </FormControl>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={fetchQuestions} disabled={isPreviewMode}>
                <RefreshOutlinedIcon color={isPreviewMode ? "disabled" : "primary"} />
            </IconButton>

            <TextField
                sx={{ width: "250px" }}
                placeholder="Search"
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "black", fontSize: "20px" }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    </Box>

    {/* Questions List - Fixed Height to Keep Button at Bottom */}
    <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "600px" }}>  
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {!isPreviewMode && (
                <ListItem disablePadding>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={filteredQuestions.length > 0 && checked.length === filteredQuestions.length}
                            indeterminate={checked.length > 0 && checked.length < filteredQuestions.length}
                            onChange={() => {
                                if (checked.length === filteredQuestions.length) {
                                    setChecked([]);
                                } else {
                                    setChecked(filteredQuestions.map((q) => q.question_id));
                                }
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText primary="Select All" sx={{ ml: 2 }} />
                </ListItem>
            )}

            {(isPreviewMode ? selectedQuestions : filteredQuestions).map((question) => {
                const isExpanded = expandedQuestion === question.question_id;
                const isExpandable = question.question_type !== "Descriptive";

                return (
                    <React.Fragment key={question.question_id}>
                        <ListItem disablePadding>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked.includes(question.question_id)}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={handleToggle(question.question_id)}
                                    inputProps={{ "aria-labelledby": `question-${question.question_id}` }}
                                />
                            </ListItemIcon>

                            <ListItemButton onClick={() => isExpandable && handleQuestionClick(question.question_id)} dense>
                                <ListItemText id={`question-${question.question_id}`} primary={question.question_text} />
                                {isExpandable && (
                                    <Box sx={{ ml: 2 }}>{isExpanded ? <ExpandLess /> : <ExpandMore />}</Box>
                                )}
                            </ListItemButton>
                            {/* 
                            {isPreviewMode && (
                                <IconButton onClick={() => handleRemoveQuestion(question.question_id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            )} */}
                        </ListItem>

                        {isExpandable && (
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={{ pl: 4 }}>
                                    {question.options.length > 0 ? (
                                        question.options.map((option, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={option.option_text} />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <ListItem>
                                            <ListItemText primary="No options available" />
                                        </ListItem>
                                    )}
                                </List>
                            </Collapse>
                        )}

                        <Divider sx={{ bgcolor: "lightgray", my: 0 }} />
                    </React.Fragment>
                );
            })}
        </List>
    </Box>

    <Box sx={{ mt: "auto", pt: 2, display: "flex", justifyContent: "flex-end" , mb:3,mr:1}}>
        <Button
            variant="contained"
            color="primary"
            onClick={handlePreviewToggle}
            disabled={checked.length === 0 && !isPreviewMode}
        >
            {isPreviewMode ? "Go Back to Selection" : "Preview Selection"}
        </Button>
    </Box>
</Box>

    );
}
