import axios from "axios";
import cookieService from "../services/cookieService"; // Adjust the path as needed

const apiService = {
  async postRequest(url, data) {
    let requestData;
    let headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173",
    };

    // Retrieve token from the cookie if it exists
    const sessionData = cookieService.getComplexCookie("sessionData");
    const token = sessionData?.token;

    // Append the Authorization header if token is available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    requestData = `"${JSON.stringify(data).replace(/"/g, '\\"')}"`;

    try {
      const response = await axios({
        method: "post",
        url,
        data: requestData,
        headers,
      });

      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error.response?.data?.message || error.message;
    }
  },
};

export default apiService;
