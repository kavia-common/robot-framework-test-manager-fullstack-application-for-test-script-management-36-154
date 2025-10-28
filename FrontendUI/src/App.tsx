import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "@hooks/useAuth";
import { useNotifications } from "@hooks/useNotifications";
import QueueBar from "@components/Queue/QueueBar";
import HistoryLogsPanel from "@components/History/HistoryLogsPanel";

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
              <NavLink to="/tests" className={({ isActive }) => (isActive ? "active" : "")}>
                Tests
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
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
