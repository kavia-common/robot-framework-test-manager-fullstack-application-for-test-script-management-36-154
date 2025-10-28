import { Outlet, NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useAuth } from "@hooks/useAuth";
import { useNotifications } from "@hooks/useNotifications";
import QueueBar from "@components/Queue/QueueBar";
import HistoryLogsPanel from "@components/History/HistoryLogsPanel";
import { API_BASE_URL } from "@api/client";

export default function App() {
  const { user, logout } = useAuth();
  const { toasts, removeToast } = useNotifications();
  const mainRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Move focus to main on route changes for accessibility
    mainRef.current?.focus();
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main" aria-label="Skip to main content">
        Skip to content
      </a>
      <header className="topbar" role="banner">
        <h1 className="brand">Test Management</h1>
        <nav aria-label="Primary">
          <ul className="nav">
            <li>
              <NavLink to="/tests" className={({ isActive }: { isActive: boolean }) => (isActive ? "active" : "")}>
                Tests
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" className={({ isActive }: { isActive: boolean }) => (isActive ? "active" : "")}>
                History
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="userbox" role="group" aria-label="User actions">
          {user ? (
            <>
              <span className="username" aria-live="polite">
                {user.name}
              </span>
              <button
                className="btn"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink className="btn" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </header>

      {import.meta.env.DEV ? (
        <div
          role="note"
          aria-label="API base"
          style={{
            background: "#1e2430",
            borderBottom: "1px solid var(--border)",
            color: "var(--muted)",
            padding: "4px 12px",
            fontSize: 12
          }}
        >
          API: {API_BASE_URL}
        </div>
      ) : null}

      <main id="main" ref={mainRef} tabIndex={-1} className="content" role="main">
        <Outlet />
      </main>

      <aside className="side-panel" aria-label="Run history and logs">
        <HistoryLogsPanel />
      </aside>

      <footer className="bottombar" role="contentinfo">
        <QueueBar />
      </footer>

      <div aria-live="assertive" aria-atomic="true" className="toast-region">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.variant ?? "info"}`} role="status">
            <span>{t.message}</span>
            <button
              type="button"
              className="icon-btn"
              aria-label="Dismiss notification"
              onClick={() => removeToast(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
