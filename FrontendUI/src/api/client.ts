import axios from "axios";

export type LoginResponse = { access_token: string; token_type: string };
export type User = { user_id: string; username: string; roles: string[] };

const baseURL = process.env.REACT_APP_API_BASE || "/api/v1";

// Create axios instance
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

// Attach token to each request if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rf_tm_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler -> redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("rf_tm_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export async function login(username: string, password: string): Promise<LoginResponse> {
  /** Authenticate user and return access token. */
  const { data } = await api.post<LoginResponse>("/auth/login", { username, password });
  return data;
}

// PUBLIC_INTERFACE
export async function me(): Promise<User> {
  /** Retrieve current user info. */
  const { data } = await api.get<User>("/auth/me");
  return data;
}

// PUBLIC_INTERFACE
export async function listTests(): Promise<any[]> {
  /** List test scripts. */
  const { data } = await api.get<any[]>("/tests");
  return data;
}

// PUBLIC_INTERFACE
export async function getTest(id: string): Promise<any> {
  /** Get test details. */
  const { data } = await api.get<any>(`/tests/${id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function listCases(params?: Record<string, string>): Promise<any[]> {
  /** List test cases. */
  const { data } = await api.get<any[]>("/cases", { params });
  return data;
}

// PUBLIC_INTERFACE
export async function getCase(id: string): Promise<any> {
  /** Get case details. */
  const { data } = await api.get<any>(`/cases/${id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function addToQueue(case_ids: string[]): Promise<any> {
  /** Add test cases to queue. */
  const { data } = await api.post("/queue", { case_ids });
  return data;
}

// PUBLIC_INTERFACE
export async function listQueue(): Promise<any[]> {
  /** List queue items. */
  const { data } = await api.get<any[]>("/queue");
  return data;
}

// PUBLIC_INTERFACE
export async function removeFromQueue(case_id: string): Promise<void> {
  /** Remove a test case from queue. */
  await api.delete(`/queue/${case_id}`);
}

// PUBLIC_INTERFACE
export async function execute(case_ids: string[], run_type: "ad_hoc" | "queued" = "ad_hoc"): Promise<any> {
  /** Execute test cases. */
  const { data } = await api.post("/execute", { case_ids, run_type });
  return data;
}

// PUBLIC_INTERFACE
export async function listHistory(params?: Record<string, string | number>): Promise<any> {
  /** List run history. */
  const { data } = await api.get("/history", { params });
  return data;
}

// PUBLIC_INTERFACE
export async function getRun(run_id: string): Promise<any> {
  /** Get run details. */
  const { data } = await api.get(`/history/${run_id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function getLog(run_id: string): Promise<{ log_url: string } | any> {
  /** Get log link for a run. */
  const { data } = await api.get(`/logs/${run_id}`);
  return data;
}

export default api;
