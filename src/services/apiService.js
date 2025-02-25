import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // import authStore to handle logout
import cookieService from "../services/cookieService";
import { useEnvironment } from "@/composables/useEnvironment";

export const DEFAULT_ERROR_MESSAGE =
  "Please try again or contact our support team.";

const { apiBaseUrl, corsOrigin } = useEnvironment(); // Get environment variables

// Set the default base URL for all axios requests
const axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Use the dynamically selected API URL
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": corsOrigin, // Use the correct CORS origin
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

// Response interceptor to handle  errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Ensure the response includes a default error message if none is provided
      error.response.data = {
        ...error.response.data,
        message: error.response.data?.message || DEFAULT_ERROR_MESSAGE,
      };

      if (error.response.status === 401) {
        console.log("401 Unauthorized detected, logging out...");
        const authStore = useAuthStore();
        authStore.logout();
      }
    } else {
      // Handle network errors or unreachable server
      error.message = DEFAULT_ERROR_MESSAGE;
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
      throw (
        error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
      );
    }
  },

  async getRequest(url, params = {}) {
    try {
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw (
        error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
      );
    }
  },

  async putRequest(url, data, options = { format: "json" }) {
    let requestData;
    const headers = {};

    switch (options.format) {
      case "raw":
        requestData = `"${JSON.stringify(data).replace(/"/g, '\\"')}"`;
        headers["Content-Type"] = "application/json";
        break;
      case "multipart/form-data":
        requestData = data;
        headers["Content-Type"] = "multipart/form-data";
        break;
      default:
        requestData = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
        break;
    }

    try {
      const response = await axiosInstance.put(url, requestData, {
        headers: { ...axiosInstance.defaults.headers, ...headers },
      });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw (
        error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
      );
    }
  },

  async deleteRequest(url, params = {}) {
    try {
      const response = await axiosInstance.delete(url, { params });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw (
        error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
      );
    }
  },
};

export default apiService;
