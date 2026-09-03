function AdminLayout({
  section,
  onNavigate,
  onLogout,
  darkMode,
  onToggleTheme,
}) {
  return (
      <header className="topbar admin-topbar">
        <button
          className="wordmark admin-back"
          onClick={() => onNavigate("dashboard")}
          aria-label="Biniyam Abebe admin dashboard"
        >
          <span>BA</span> Biniyam Abebe
        </button>

        <nav className="admin-nav">
          <button
            className={section === "dashboard" ? "admin-nav-active" : ""}
            onClick={() => onNavigate("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={section === "posts" ? "admin-nav-active" : ""}
            onClick={() => onNavigate("posts")}
          >
            Posts
          </button>
          <button
            className={section === "drafts" ? "admin-nav-active" : ""}
            onClick={() => onNavigate("drafts")}
          >
            Drafts
          </button>
          <button
            className={section === "new-post" ? "admin-nav-active" : ""}
            onClick={() => onNavigate("new-post")}
          >
            New post
          </button>
          <button
            className={section === "profile" ? "admin-nav-active" : ""}
            onClick={() => onNavigate("profile")}
          >
            Profile
          </button>
          <button
            className={section === "settings" ? "admin-nav-active" : ""}
            onClick={() => onNavigate("settings")}
          >
            Settings
          </button>
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

  );
}

export default AdminLayout;
