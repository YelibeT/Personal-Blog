import { useState } from "react";
import { login } from "./services/api";

function AdminLogin({ onLogin, onBack, darkMode, onToggleTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);

      // Backend confirmed that this is an ADMIN
      onLogin();
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "site dark" : "site"}>
      <header className="topbar admin-topbar">
        <button
          className="wordmark admin-back"
          onClick={onBack}
          aria-label="Biniyam Abebe home"
        >
          <span>BA</span> Biniyam Abebe
        </button>

        <div className="admin-label">
          <span className="status-dot" />
          Admin access
        </div>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
        >
          <span>{darkMode ? "☼" : "◐"}</span>
        </button>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Private workspace</p>
            <h1>Admin login</h1>
            <p className="admin-subtitle">
              Sign in to manage your writing.
            </p>
          </div>
        </div>

        <form
          className="post-editor"
          onSubmit={handleSubmit}
          style={{ maxWidth: "520px" }}
        >
          <section className="editor-main">
            <label className="editor-field">
              <span>Email</span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Admin email"
                required
                autoComplete="email"
              />
            </label>

            <label className="editor-field">
              <span>Password</span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Password"
                required
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div className="empty-admin">
                <strong>{error}</strong>
              </div>
            )}

            <div className="editor-actions">
              <button
                type="button"
                className="secondary-action"
                onClick={onBack}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-action editor-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </section>
        </form>
      </main>

      <footer className="admin-footer">
        <span>© 2024 Biniyam Abebe</span>
      </footer>
    </div>
  );
}

export default AdminLogin;

