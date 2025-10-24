import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./store/authContext";
import Dashboard from "./routes/Dashboard";
import Tests from "./routes/Tests";
import TestDetail from "./routes/TestDetail";
import CaseDetail from "./routes/CaseDetail";
import Queue from "./routes/Queue";
import History from "./routes/History";
import Login from "./routes/Login";

function ProtectedRoute({ children, roles }: { children: React.ReactElement; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div role="status" aria-busy="true" className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.some(r => user.roles.includes(r))) {
    return <div className="container" role="alert">You do not have permission to view this page.</div>;
  }
  return children;
}

function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="App">
      <nav className="navbar" aria-label="Main navigation">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link to="/" className="App-link" style={{ marginRight: 16 }}>Dashboard</Link>
            <Link to="/tests" className="App-link" style={{ marginRight: 16 }}>Tests</Link>
            <Link to="/queue" className="App-link" style={{ marginRight: 16 }}>Queue</Link>
            <Link to="/history" className="App-link">History</Link>
          </div>
          <div>
            <button className="theme-toggle" onClick={() => setTheme(t => t === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            {user ? (
              <button style={{ marginLeft: 12 }} className="theme-toggle" onClick={logout} aria-label="Logout">Logout</button>
            ) : (
              <Link to="/login" className="App-link" style={{ marginLeft: 12 }}>Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="container" style={{ paddingTop: 20 }}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/" element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/tests" element={
            <Layout>
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/tests/:id" element={
            <Layout>
              <ProtectedRoute>
                <TestDetail />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/cases/:id" element={
            <Layout>
              <ProtectedRoute>
                <CaseDetail />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/queue" element={
            <Layout>
              <ProtectedRoute>
                <Queue />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/history" element={
            <Layout>
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
