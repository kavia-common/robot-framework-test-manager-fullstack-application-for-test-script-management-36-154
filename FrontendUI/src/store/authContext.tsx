import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, me as apiMe, User } from "../api/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /** Provides authentication state and actions to the app. */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function bootstrap() {
    const token = localStorage.getItem("rf_tm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const u = await apiMe();
      setUser(u);
    } catch {
      localStorage.removeItem("rf_tm_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doLogin(username: string, password: string) {
    setLoading(true);
    try {
      const res = await apiLogin(username, password);
      localStorage.setItem("rf_tm_token", res.access_token);
      const u = await apiMe();
      setUser(u);
    } finally {
      setLoading(false);
    }
  }

  function doLogout() {
    localStorage.removeItem("rf_tm_token");
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, loading, login: doLogin, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
