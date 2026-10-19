import DraftsPage from "../pages/DraftsPage";
import PostPage from "../pages/PostPage";
import { Route, Routes } from "react-router-dom";

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
            onPostDeleted={() => {}}
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