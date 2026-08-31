import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function AdminPage({
  onBack,
  onNewPost,
  onDrafts,
  darkMode,
  onToggleTheme
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
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const publishedPosts = posts.filter((post) => post.published);
  const drafts = posts.filter((post) => !post.published);

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

        <nav className="admin-nav">
          <button className="admin-nav-active">
            Dashboard
          </button>

          <button onClick={onDrafts}>
            Drafts
          </button>
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

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Good morning, Biniyam</p>

            <h1>Content overview</h1>

            <p className="admin-subtitle">
              Keep your corner of the internet thoughtful and up to date.
            </p>
          </div>

          <button
            className="primary-action"
            onClick={onNewPost}
          >
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

            <strong>
              {loading ? "..." : publishedPosts.length}
            </strong>

            <small className="neutral">
              {publishedPosts.length === 1
                ? "1 published post"
                : `${publishedPosts.length} published posts`}
            </small>
          </div>

          <div>
            <span>Newsletter readers</span>

            <strong>248</strong>

            <small className="positive">
              ↑ 12% this month
            </small>
          </div>

          <div>
            <span>Page views</span>

            <strong>1,842</strong>

            <small className="positive">
              ↑ 18% this month
            </small>
          </div>

          <button
            className="admin-stat-button"
            onClick={onDrafts}
          >
            <span>Drafts</span>

            <strong>
              {loading ? "..." : drafts.length}
            </strong>

            <small className="neutral">
              View saved drafts
            </small>
          </button>
        </div>

        <div className="admin-content-grid">
          <section className="admin-panel posts-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Your library</p>

                <h2>Recent writing</h2>
              </div>

              <button
                className="quiet-action"
                onClick={onDrafts}
              >
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
                  <article
                    className="admin-post-row"
                    key={post.id}
                  >
                    <div>
                      <span className="draft-category">
                        {post.category}
                      </span>

                      <h3>{post.title}</h3>

                      <p>
                        {post.excerpt ||
                          "No description yet."}
                      </p>
                    </div>

                    <span>
                      {post.published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-admin">
                <span>✳</span>

                <strong>
                  Your first story starts here.
                </strong>

                <p>
                  Write something worth coming back to.
                </p>

                <button
                  className="primary-action small-action"
                  onClick={onNewPost}
                >
                  ＋ Start a draft
                </button>
              </div>
            )}
          </section>

          <section className="admin-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Audience</p>

                <h2>Newsletter</h2>
              </div>

              <button className="quiet-action">
                Manage ↗
              </button>
            </div>

            <div className="audience-number">
              <strong>248</strong>
              <span>subscribers</span>
            </div>

            <div className="mini-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <p className="chart-note">
              Your list is growing steadily.
            </p>
          </section>
        </div>
      </main>

      <footer className="admin-footer">
        <span>© 2024 Biniyam Abebe</span>

        <span>
          Admin workspace <i>✳</i>
        </span>

        <button
          className="footer-back"
          onClick={onBack}
        >
          ← Back to site
        </button>
      </footer>
    </div>
  );
}

export default AdminPage;