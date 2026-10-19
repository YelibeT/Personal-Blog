import { Link, NavLink, Outlet } from "react-router-dom";

function AdminContent({onLogout,onPostSaved,onPostDeleted}) {

  const navigate = useNavigate();
  const location = useLocation();
  const draft = location.state?.draft || null;

  const openNewPost =() =>
      navigate("/admin/new-post");

  return (
    <Routes>
      <Route index element={
          <Admin 
            onNewPost={openNewPost} 
            onEditPost={(post) => navigate("/admin/new-post", {state: {draft: post}})}
            onPostDeleted={onPostDeleted}
            onDrafts={() =>navigate("/admin/drafts")}
          />
        }
      />

      <Route
        path="dashboard"
        element={
          <Admin 
            onNewPost={openNewPost} 
            onEditPost={(post) => navigate("/admin/new-post", {state: {draft: post}})}
            onPostDeleted={onPostDeleted}
            onDrafts={() => navigate("/admin/drafts")}
          />
        }
      />

      
      <Route
        path="posts"
        element={
          <Admin 
            onNewPost={openNewPost} 
            onEditPost={(post) => navigate("/admin/new-post", {state: {draft: post}})}
            onPostDeleted={onPostDeleted}
            onDrafts={() => navigate("/admin/drafts")}
          />
        }
      />


      <Route
        path="drafts"
        element={
          <DraftsPage
            onBack={() => navigate("/admin")}
            onNewPost={openNewPost}
            onEditDraft={(post) => navigate("/admin/new-post", {state: {draft: post}})}
          />
        }
      />

      <Route
        path="new-post"
        element={
          <PostPage
            draft={draft}
            onPostSaved={onPostSaved}
            onBack={() => navigate("/admin")}
          />
        }
      />

      <Route
        path="settings"
        element={
          <Admin
            initialTab="settings"
            onNewPost={openNewPost}
            onEditPost={(post) => navigate("/admin/new-post", {state: {draft: post}})}
            onPostDeleted={onPostDeleted}
            onDrafts={() => navigate("/admin/drafts")}
          />
        }
      />

      <Route
        path="profile"
        element={
          <ProfilePage
            onLogout={onLogout}
          />
        }
      />
    </Routes>
  );
}

function AdminLayout({ darkMode, onToggleTheme }) {
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
