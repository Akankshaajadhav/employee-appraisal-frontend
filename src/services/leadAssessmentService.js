import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust based on your backend URL

export const fetchParameters = async (cycleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/parameters/${cycleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parameters:", error);
    return [];
  }
};

export const submitAssessment = async (data) => {
  try {
    await axios.post(`${API_BASE_URL}/lead-assessment`, data);
    alert("Assessment saved successfully!");
  } catch (error) {
    console.error("Error submitting assessment:", error);
  }
};
