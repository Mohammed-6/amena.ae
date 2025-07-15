import axios from "axios";
import { APP_SERVER_URL } from "./common";

const API_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL; // Replace with your API URL

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies are sent if needed
});

// Flag to prevent multiple token refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to get the token from headers (if stored in memory or localStorage)
const getToken = (): string | null => {
  return localStorage.getItem("token"); // Or fetch from memory store
};

// Function to refresh the token
export const refreshToken = async () => {
  try {
    const response = await axiosInstance.get("/api/impression", {
      headers: {
        "Content-Type": "application/json",
        sessionId: localStorage.getItem("sessionId"),
      }, // Pass headers if needed
    });

    const newToken = response.data.token;
    console.log("New token received:", newToken);

    // Store new token in localStorage
    localStorage.setItem("sessionId", newToken);
    // window.location.reload();

    // Notify all pending requests
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];

    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};

// **1️⃣ Request Interceptor (Attach Token)**
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **2️⃣ Response Interceptor (Handle Expired Token - 401)**
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshToken();
        isRefreshing = false;

        if (newToken) {
          refreshSubscribers.forEach((callback) => callback(newToken));
          refreshSubscribers = [];
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
