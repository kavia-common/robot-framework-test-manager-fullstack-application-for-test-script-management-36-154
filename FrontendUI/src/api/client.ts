import axios from "axios";
import { getAuthToken } from "@hooks/useAuth";

// Resolve API base URL from Vite env with sensible default for local dev
// Default: http://localhost:8000/api/v1
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
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
