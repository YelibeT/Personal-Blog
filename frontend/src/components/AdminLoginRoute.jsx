import AdminLogin from "../pages/AdminLogin";
import { useNavigate } from "react-router-dom";

function AdminLoginRoute({
  isAdmin,
  authReady,
  onLogin,
  darkMode,
  onToggleTheme
}) {
  const navigate = useNavigate();

  if (!authReady) {
    return (
      <div className="site">
        <main className="admin-main">
          <p>Restoring admin session...</p>
        </main>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <Navigate to="/admin/dashboard" replace/>
    );
  }

  return (
    <AdminLogin onLogin={() => {onLogin();
      navigate("/admin/dashboard",
          {
            replace: true
          }
        );
      }}
      onBack={() =>navigate("/")}
      darkMode={darkMode}
      onToggleTheme={onToggleTheme}
    />
  );
}

export default AdminLoginRoute