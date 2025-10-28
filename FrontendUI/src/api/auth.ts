import api from "./client";

/** Types for backend auth responses */
export type Role = "admin" | "tester" | "viewer";

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: "bearer" | string;
  /** Optional user info/claims payload; if not provided we’ll decode minimal info client-side or fetch /me */
  user?: {
    id: string;
    name: string;
    role: Role;
  };
}

export interface AuthRefreshResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: "bearer" | string;
}

/**
 * PUBLIC_INTERFACE
 */
export async function loginWithPassword(payload: AuthLoginRequest): Promise<AuthLoginResponse> {
  /** Perform username/password login against backend auth endpoint. */
  const res = await api.post<AuthLoginResponse>("/auth/login", payload);
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 */
export async function refreshAccessToken(rt: string): Promise<AuthRefreshResponse> {
  /** Refresh access token using refresh token against backend endpoint. */
  const res = await api.post<AuthRefreshResponse>("/auth/refresh", { refresh_token: rt });
  return res.data;
}
