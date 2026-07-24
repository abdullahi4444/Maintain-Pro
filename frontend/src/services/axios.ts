import axios from "axios";
import { useAuthStore } from "@/app/store";

const fallbackApiUrl = "http://localhost:5264";
export const API_URL = (import.meta.env.VITE_API_URL || fallbackApiUrl).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
