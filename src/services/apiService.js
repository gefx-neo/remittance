import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // import authStore to handle logout
import cookieService from "../services/cookieService";

// Set the default base URL for all axios requests
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173",
  },
});

// Request interceptor to append the Authorization header
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

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("401 Unauthorized detected, logging out...");

      // Unauthorized access, log the user out
      const authStore = useAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

const apiService = {
  async postRequest(url, data, options = { format: "json" }) {
    let requestData;
    const headers = {};

    // Apply formatting based on the options.format value
    switch (options.format) {
      case "raw":
        // Use your specific raw format with escaped double quotes
        requestData = `"${JSON.stringify(data).replace(/"/g, '\\"')}"`;
        headers["Content-Type"] = "application/json"; // Still JSON, but formatted as raw
        break;

      // case "form-url-encoded":
      //   const formData = new URLSearchParams();
      //   for (const key in data) {
      //     formData.append(key, data[key]);
      //   }
      //   requestData = formData;
      //   headers["Content-Type"] = "application/x-www-form-urlencoded"; // Form-encoded
      //   break;

      case "multipart/form-data": // New case for file uploads
        requestData = data; // Directly use the FormData object
        headers["Content-Type"] = "multipart/form-data";

        break;

      default:
        requestData = JSON.stringify(data); // Default to JSON string
        headers["Content-Type"] = "application/json";
        break;
    }

    try {
      const response = await axiosInstance.post(url, requestData, {
        headers: { ...axiosInstance.defaults.headers, ...headers },
      });
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
