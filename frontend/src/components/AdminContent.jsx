import DraftsPage from "../pages/DraftsPage";
import PostPage from "../pages/PostPage";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Admin from "../pages/Admin";
import ProfilePage from "../pages/ProfilePage";


function AdminContent({onLogout,onPostSaved,onPostDeleted}) {

  const navigate = useNavigate();
  const location = useLocation();
  const draft = location.state?.draft || null;

  const openNewPost =() =>
      navigate("/admin/new-post");

  return (
    <Routes>
      <Route 
        path="drafts" element={
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

export default AdminContent