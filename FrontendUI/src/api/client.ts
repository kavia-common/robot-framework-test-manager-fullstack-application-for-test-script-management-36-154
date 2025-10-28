import axios from "axios";
import { getAuthToken } from "@hooks/useAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 20000
});

// Request interceptor to add bearer token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Normalize error shape
    const status = error?.response?.status;
    if (status === 401) {
      // token invalid/expired; let calling code react
    }
    return Promise.reject(error);
  }
);

export default api;
