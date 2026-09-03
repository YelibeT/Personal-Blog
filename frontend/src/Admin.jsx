import { useEffect, useState } from "react";
import { apiFetch } from "./services/api";

function AdminPage({
  onNewPost,
  onEditPost,
  onPostDeleted,
  onDrafts
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await apiFetch("/admin/posts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load posts");
        }

        setPosts(data);
      } catch (requestError) {
        console.error(requestError);
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDeletePost = async (post) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title || "Untitled post"}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(`/admin/posts/${post.id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts((currentPosts) =>
        currentPosts.filter((currentPost) => currentPost.id !== post.id)
      );
      onPostDeleted(post.id);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message);
    }
  };

  const publishedPosts = posts.filter((post) => post.published);
  const drafts = posts.filter((post) => !post.published);

  return (
    <div className="admin-page-content">
      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Your workspace</p>
            <h1>Content overview</h1>
            <p className="admin-subtitle">
              Keep your corner of the internet thoughtful and up to date.
            </p>
          </div>

          <button className="primary-action" onClick={onNewPost}>
            ＋ New post
          </button>
        </div>

        {error && (
          <div className="empty-admin">
            <strong>{error}</strong>
          </div>
        )}

        <div className="admin-stats">
          <div>
            <span>Published posts</span>
            <strong>{loading ? "..." : publishedPosts.length}</strong>
            <small className="neutral">
              {publishedPosts.length === 1
                ? "1 published post"
                : `${publishedPosts.length} published posts`}
            </small>
          </div>

          <button className="admin-stat-button" onClick={onDrafts}>
            <span>Drafts</span>
            <strong>{loading ? "..." : drafts.length}</strong>
            <small className="neutral">View saved drafts</small>
          </button>
        </div>

        <section className="admin-panel posts-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Your library</p>
              <h2>Recent writing</h2>
            </div>

            <button className="quiet-action" onClick={onDrafts}>
              View drafts ↗
            </button>
          </div>

          {loading ? (
            <div className="empty-admin">
              <span>✳</span>
              <strong>Loading your writing...</strong>
            </div>
          ) : posts.length > 0 ? (
            <div className="admin-post-list">
              {posts.slice(0, 5).map((post) => (
                <article className="admin-post-row" key={post.id}>
                  <div>
                    <span className="draft-category">
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <h3>{post.title || "Untitled post"}</h3>
                    <p>{post.excerpt || "No description yet."}</p>
                  </div>

                  <div className="admin-post-row-actions">
                    <span>{post.published ? "Published" : "Draft"}</span>
                    <button className="quiet-action" onClick={() => onEditPost(post)}>
                      Edit
                    </button>
                    <button className="quiet-action delete-action" onClick={() => handleDeletePost(post)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-admin">
              <span>✳</span>
              <strong>Your first story starts here.</strong>
              <p>Write something worth coming back to.</p>
              <button className="primary-action small-action" onClick={onNewPost}>
                ＋ Start a draft
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
