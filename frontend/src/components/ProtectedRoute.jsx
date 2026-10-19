import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute({
  isAdmin,
  authReady
}) {
  if (!authReady) {
    return (
      <div className="site">
        <main className="admin-main">
          <p>Restoring admin session...</p>
        </main>
      </div>
    );
  }

  return isAdmin ? (
    <Outlet />
  ) : (
    <Navigate
      to="/admin"
      replace
    />
  );
}

export default ProtectedRoute