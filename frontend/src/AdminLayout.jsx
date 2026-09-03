import { Link, NavLink, Outlet } from "react-router-dom";

function AdminLayout({ onLogout, darkMode, onToggleTheme }) {
  const navClass = ({ isActive }) =>
    isActive ? "admin-nav-active" : "";

  return (
    <div className={darkMode ? "site dark" : "site"}>
      <header className="topbar admin-topbar">
        <Link
          className="wordmark admin-back"
          to="/"
          aria-label="Biniyam Abebe home"
        >
          <span>BA</span> Biniyam Abebe
        </Link>

        <nav className="admin-nav">
          <NavLink className={navClass} to="/admin/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={navClass} to="/admin/posts">
            Posts
          </NavLink>
          <NavLink className={navClass} to="/admin/drafts">
            Drafts
          </NavLink>
          <NavLink className={navClass} to="/admin/new-post">
            New post
          </NavLink>
          <NavLink className={navClass} to="/admin/profile">
            Profile
          </NavLink>
          <Link to="/">View site</Link>
          <button onClick={onLogout}>Log out</button>
        </nav>

        <div className="admin-label">
          <span className="status-dot" /> Admin workspace
        </div>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
        >
          <span>{darkMode ? "☼" : "◐"}</span>
        </button>
      </header>

      <Outlet />

      <footer className="admin-footer">
        <span>© 2024 Biniyam Abebe</span>
        <span>Admin workspace <i>✳</i></span>
      </footer>
    </div>
  );
}

export default AdminLayout;
