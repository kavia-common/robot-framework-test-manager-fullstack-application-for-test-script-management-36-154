import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Role = "admin" | "tester" | "viewer";

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

let memoryToken: string | null = null;

// PUBLIC_INTERFACE
export function getAuthToken(): string | null {
  /** Returns current auth token stored in memory (or could be injected via cookie by server). */
  return memoryToken;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /** Auth provider storing token in-memory with simple mock login for scaffolding purposes. */
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    // Attempt bootstrap from sessionStorage as fallback (not as secure as httpOnly cookie).
    const cached = sessionStorage.getItem("auth_user");
    const token = sessionStorage.getItem("auth_token");
    if (cached && token) {
      setUser(JSON.parse(cached));
      memoryToken = token;
    }
    setBootstrapped(true);
  }, []);

  const login = useCallback(
    async (username: string, _password: string) => {
      // Placeholder: integrate with backend auth later. Assume success and issue a fake token.
      memoryToken = "FAKE_JWT_TOKEN";
      const nextUser: User = {
        id: "u-" + username,
        name: username,
        role: username === "admin" ? "admin" : "tester"
      };
      setUser(nextUser);
      sessionStorage.setItem("auth_user", JSON.stringify(nextUser));
      sessionStorage.setItem("auth_token", memoryToken);
    },
    []
  );

  const logout = useCallback(() => {
    memoryToken = null;
    setUser(null);
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
  }, []);

  const hasRole = useCallback(
    (roles: Role | Role[]) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role);
    },
    [user]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    bootstrapped,
    login,
    logout,
    hasRole
  };

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
