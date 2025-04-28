import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login_auth } from "../services/login"; 
import CardMedia from '@mui/material/CardMedia';
import logo from "./logo.jpg";
const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login_auth(employeeId, password);
      console.log(response);

      if (response.message === "Login successful") {
        const userRole = response.role.toLowerCase(); // Ensure role is in lowercase
        localStorage.setItem("employee_id", response.employee_id); // Store ID
        localStorage.setItem("user_role", userRole); // Store role
  
        // Redirect based on role
        if (userRole === "hr") {
          navigate("/hr-home"); // HR landing page
        } else if (userRole === "admin") {
          navigate("/admin-home"); // admin landing page (Can see both appraisal cycle steup and assessment)
        }else{
          navigate("/employee-home"); // Employee landing page
        }
      } else {
        setError(response.detail || "Invalid credentials");
        setOpen(true);
      }
    } catch (err) {
      setError(err || "Login failed. Please try again.");
      setOpen(true);
    }
  };
  

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ width: 300, p: 2 }}>
      <CardMedia
        component="img"
        height="40"
        sx={{ objectFit: "contain" }}
        image={logo}
        alt="Paella dish"
      />
        <CardContent>
          
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{mt:2,p:1}}>
            Login
          </Button>
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 3 }}>
          <Typography>{error}</Typography>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Login;
