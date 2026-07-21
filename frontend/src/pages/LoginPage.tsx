// LoginPage — the admin login form.
// Registered at /admin/login in App.tsx.
// On success, navigates to /admin.
 
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./LoginPage.css";
 
export default function LoginPage() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
 
  // If already logged in redirect away.
  if (isAdmin) {
    navigate("/admin", { replace: true });
    return null;
  }
 
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
 
    const success = await login({ username, password });
 
    if (success) {
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid username or password.");
      setPassword("");   // clear password on failure
    }
 
    setSubmitting(false);
  }
 
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Admin</h1>
 
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username" className="login-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              disabled={submitting}
            />
          </div>
 
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={submitting}
            />
          </div>
 
          {error && <p className="login-error" role="alert">{error}</p>}
 
          <button
            type="submit"
            className="login-button"
            disabled={submitting || !username || !password}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
 