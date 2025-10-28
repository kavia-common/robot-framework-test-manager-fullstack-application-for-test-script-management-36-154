import { useAuth } from "@hooks/useAuth";
import { useNotifications } from "@hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

 // PUBLIC_INTERFACE
export default function Login() {
  /** Login page allowing users to authenticate; integrates with backend via AuthProvider. */
  const { login } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(username, password);
      notify("Logged in", "success");
      navigate("/");
    } catch (e: any) {
      notify(e?.message ?? "Login failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="centered">
      <form className="card form" onSubmit={submit} noValidate aria-label="Login form">
        <h2>Login</h2>
        <label htmlFor="lg-username">Username</label>
        <input id="lg-username" autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="lg-password">Password</label>
        <input id="lg-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
