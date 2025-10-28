import axios from "axios";
import { getAuthToken, getRefreshToken, setAccessToken, clearAuthState } from "@hooks/useAuth";

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

// A small guard to avoid infinite refresh loops
let isRefreshing = false;
let queuedRequests: Array<(token: string | null) => void> = [];

// Response interceptor: handle 401 -> attempt refresh once -> redirect to login on failure
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    // Only try refresh on 401 for requests that are not marked as _retry
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const rt = getRefreshToken();

      if (!rt) {
        // No refresh token available -> clear state and redirect
        clearAuthState();
        if (typeof window !== "undefined") window.location.replace("/login");
        return Promise.reject(error);
      }

      // If already refreshing, queue the request until refresh completes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queuedRequests.push((newToken) => {
            if (!newToken) {
              reject(error);
            } else {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            }
          });
        });
      }

      try {
        isRefreshing = true;
        // Refresh using a direct call to the refresh endpoint to avoid circular import
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: rt },
          { timeout: 15000 }
        );
        const newAccess: string | undefined = refreshResponse?.data?.access_token;
        if (newAccess) {
          setAccessToken(newAccess);
          // drain queue
          queuedRequests.forEach((cb) => cb(newAccess));
          queuedRequests = [];
          // retry original
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } else {
          // Failed to get token
          clearAuthState();
          queuedRequests.forEach((cb) => cb(null));
          queuedRequests = [];
          if (typeof window !== "undefined") window.location.replace("/login");
          return Promise.reject(error);
        }
      } catch (e) {
        clearAuthState();
        queuedRequests.forEach((cb) => cb(null));
        queuedRequests = [];
        if (typeof window !== "undefined") window.location.replace("/login");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
