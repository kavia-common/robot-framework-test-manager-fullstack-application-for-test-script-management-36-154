import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "@api/auth";
import { loginWithPassword } from "@api/auth";

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
}

/** Storage keys */
const AK = "auth_access_token";
const RK = "auth_refresh_token";
const UK = "auth_user";

/** Internal module state cache for axios to read */
let accessTokenMem: string | null = null;
let refreshTokenMem: string | null = null;

/**
 * PUBLIC_INTERFACE
 */
export function getAuthToken(): string | null {
  /** Get current access token for attaching to API requests. */
  return accessTokenMem;
}

/**
 * PUBLIC_INTERFACE
 */
export function getRefreshToken(): string | null {
  /** Get current refresh token for token refresh flow. */
  return refreshTokenMem;
}

/**
 * PUBLIC_INTERFACE
 */
export function setAccessToken(token: string | null) {
  /** Update access token in memory and sessionStorage (if provided). */
  accessTokenMem = token;
  if (token) {
    sessionStorage.setItem(AK, token);
  } else {
    sessionStorage.removeItem(AK);
  }
}

/**
 * PUBLIC_INTERFACE
 */
export function clearAuthState() {
  /** Clear all auth-related state from memory and storage. */
  accessTokenMem = null;
  refreshTokenMem = null;
  sessionStorage.removeItem(AK);
  sessionStorage.removeItem(RK);
  sessionStorage.removeItem(UK);
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Decode minimal claims from a JWT safely (no validation) */
function decodeJwt<T = any>(token: string | null): T | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload as T;
  } catch {
    return null;
  }
}

/** Map claims to our User shape; backend should include sub, name, role or similar */
function claimsToUser(claims: any): User | null {
  if (!claims) return null;
  const id = claims.sub || claims.user_id || claims.id;
  const name = claims.name || claims.username || "User";
  const role: Role | undefined = claims.role || claims.roles?.[0];
  if (!id || !role) return null;
  return { id: String(id), name: String(name), role: role as Role };
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /** Auth provider integrated with backend tokens, using access/refresh tokens with axios interceptors. */
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    // Bootstrap from sessionStorage
    const at = sessionStorage.getItem(AK);
    const rt = sessionStorage.getItem(RK);
    const persistedUser = sessionStorage.getItem(UK);

    accessTokenMem = at;
    refreshTokenMem = rt;

    if (persistedUser) {
      try {
        setUser(JSON.parse(persistedUser));
      } catch {
        // fallback to decode from token if corrupted
        const claims = decodeJwt(at);
        const u = claimsToUser(claims);
        if (u) setUser(u);
      }
    } else if (at) {
      const claims = decodeJwt(at);
      const u = claimsToUser(claims);
      if (u) {
        setUser(u);
        sessionStorage.setItem(UK, JSON.stringify(u));
      }
    }

    setBootstrapped(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginWithPassword({ username, password });
    const at = res.access_token;
    const rt = res.refresh_token ?? null;

    setAccessToken(at);
    refreshTokenMem = rt;
    if (rt) sessionStorage.setItem(RK, rt);
    else sessionStorage.removeItem(RK);

    // prefer explicit user payload; fallback to jwt claims
    let u: User | null = res.user ?? claimsToUser(decodeJwt(at));
    // If backend does not supply role in token, we conservatively assign viewer to avoid over-privilege
    if (!u && at) {
      u = { id: "me", name: username, role: "viewer" };
    }
    setUser(u);
    if (u) sessionStorage.setItem(UK, JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    clearAuthState();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: Role | Role[]) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role);
    },
    [user]
  );

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      bootstrapped,
      login,
      logout,
      hasRole
    }),
    [user, bootstrapped, login, logout, hasRole]
  );

  // Avoid JSX parsing issues in some TS configs by using React.createElement
  // eslint-disable-next-line react/react-in-jsx-scope
  return (globalThis as any).React
    ? (globalThis as any).React.createElement(AuthContext.Provider, { value }, children)
    : (null as unknown as JSX.Element);
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextValue {
  /** Hook to access authentication state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
