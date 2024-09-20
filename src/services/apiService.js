import axios from "axios";
import cookieService from "../services/cookieService";

// Set the default base URL for all axios requests
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from the cookie if it exists
    // const sessionData = cookieService.getComplexCookie("sessionData");
    // const token = sessionData?.token;
    const token = localStorage.getItem("token");

    // Append the Authorization header if token is available
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiService = {
  async postRequest(url, data, useRawFormat = false) {
    let requestData;

    // Apply JSON.stringify or the escaped format based on the flag
    if (useRawFormat) {
      requestData = `"${JSON.stringify(data).replace(/"/g, '\\"')}"`;
    } else {
      requestData = JSON.stringify(data);
    }

    try {
      const response = await axiosInstance.post(url, requestData);
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error.response?.data?.message || error.message;
    }
  },

  async getRequest(url, params = {}) {
    try {
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error.response?.data?.message || error.message;
    }
  },
};

export default apiService;
