// services/dashboardService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Eroare la fetch dashboard:", error);
    throw error;
  }
};
