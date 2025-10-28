import axios from "axios";
import { getAuthToken, getRefreshToken, setAccessToken, clearAuthState } from "@hooks/useAuth";

/**
 * Resolve API base URL from Vite env with sensible default for local dev.
 * IMPORTANT: Do not hardcode URLs elsewhere; always use this axios instance.
 * Default: http://localhost:8000/api/v1
 */
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

/**
 * Attach Bearer JWT from AuthProvider memory store to each request.
 */
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

/**
 * Response interceptor:
 * - On 401, attempt one refresh using refresh token.
 * - If refresh succeeds, retry queued requests with the new token.
 * - If refresh fails or no refresh token, clear state and redirect to /login.
 */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      (originalRequest as any)._retry = true;
      const rt = getRefreshToken();

      if (!rt) {
        clearAuthState();
        if (typeof window !== "undefined") window.location.replace("/login");
        return Promise.reject(error);
      }

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
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: rt },
          { timeout: 15000 }
        );
        const newAccess: string | undefined = refreshResponse?.data?.access_token;
        if (newAccess) {
          setAccessToken(newAccess);
          queuedRequests.forEach((cb) => cb(newAccess));
          queuedRequests = [];
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } else {
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
