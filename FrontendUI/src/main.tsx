/**
 * Application single entry point (mounted by index.html).
 * Vite dev server runs at port 3000 (see vite.config.ts).
 */
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./styles/global.css";
import { AuthProvider } from "@hooks/useAuth";
import { NotificationsProvider } from "@hooks/useNotifications";

/**
 * Root component only used to add app-level side effects.
 * Adds a simple healthcheck log on mount so preview systems can detect readiness.
 */
function AppRoot() {
  useEffect(() => {
    // Healthcheck log to indicate the app mounted successfully
    // This can be used by preview environments to detect readiness.
    // Includes the configured API base env if present.
    const apiBase = (import.meta as any)?.env?.VITE_API_BASE_URL;
    // eslint-disable-next-line no-console
    console.log("[healthcheck] FrontendUI mounted", {
      env: import.meta.env.MODE,
      apiBase: apiBase || "unset"
    });
  }, []);
  return (
    <AuthProvider>
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
