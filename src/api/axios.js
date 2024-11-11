import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5200/api", // Default API base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Add an interceptor for requests if needed
apiClient.interceptors.request.use((config) => {
    // You can add authorization tokens or other common headers here
    return config;
});

// Add an interceptor for responses to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error globally or handle specific error codes
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;