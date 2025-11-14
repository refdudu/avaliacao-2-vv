import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);
