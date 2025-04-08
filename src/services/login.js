import axios from "axios";

// const API_URL = "http://localhost:8000/auth"; // Corrected to match backend
const API_URL = process.env.REACT_APP_BASE_URL; // from .env file
console.log("API_URL from env: ", API_URL);  // Debug line

export const login_auth = async (employee_id, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { employee_id, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return response.data; // Expecting { message, employee_id, role }
  } catch (error) {
    throw error.response ? error.response.data.detail : "Login failed. Please try again.";
  }
};
