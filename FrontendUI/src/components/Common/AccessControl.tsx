import { PropsWithChildren } from "react";
import { useAuth } from "@hooks/useAuth";

type Role = "admin" | "tester" | "viewer";

interface Props {
  roles: Role[] | Role;
  fallback?: JSX.Element | null;
}

// PUBLIC_INTERFACE
export default function AccessControl({ roles, fallback = null, children }: PropsWithChildren<Props>) {
  /** Conditionally renders children based on RBAC roles. */
  const { hasRole } = useAuth();
  const ok = hasRole(roles);
  return ok ? <>{children}</> : fallback;
}
