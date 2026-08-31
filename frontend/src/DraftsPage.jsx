import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function DraftsPage({
  onBack,
  onNewPost,
  onEditDraft,
  darkMode,
  onToggleTheme
}) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDrafts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/admin/posts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load drafts"
        );
      }

      setDrafts(
        data.filter((post) => !post.published)
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this draft?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(
        `/admin/posts/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete draft"
        );
      }

      setDrafts((currentDrafts) =>
        currentDrafts.filter(
          (draft) => draft.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div
      className={
        darkMode ? "site dark" : "site"
      }
    >
      <header className="topbar admin-topbar">
        <button
          className="wordmark admin-back"
          onClick={onBack}
          aria-label="Biniyam Abebe home"
        >
          <span>BA</span> Biniyam Abebe
        </button>

        <nav className="admin-nav">
          <button onClick={onBack}>
            Dashboard
          </button>

          <button className="admin-nav-active">
            Drafts
          </button>
        </nav>

        <div className="admin-label">
          <span className="status-dot" /> Draft library
        </div>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
        >
          <span>
            {darkMode ? "☼" : "◐"}
          </span>
        </button>
      </header>

      <main className="admin-main drafts-page">
        <button
          className="back-link"
          onClick={onBack}
        >
          ← Back to dashboard
        </button>

        <div className="admin-heading">
          <div>
            <p className="eyebrow">
              Your workspace
            </p>

            <h1>Saved drafts</h1>

            <p className="admin-subtitle">
              Return to an unfinished thought whenever
              you are ready.
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

        {loading ? (
          <div className="empty-admin">
            <span>✳</span>
            <strong>Loading drafts...</strong>
          </div>
        ) : drafts.length ? (
          <div className="draft-list">
            {drafts.map((draft) => (
              <article
                className="draft-row"
                key={draft.id}
              >
                <div>
                  <span className="draft-category">
                    {draft.category}
                  </span>

                  <h2>
                    {draft.title ||
                      "Untitled draft"}
                  </h2>

                  <p>
                    {draft.excerpt ||
                      "No description yet."}
                  </p>

                  <small>
                    Last saved{" "}
                    {new Date(
                      draft.updatedAt
                    ).toLocaleDateString()}
                  </small>
                </div>

                <div className="draft-row-actions">
                  <button
                    className="quiet-action"
                    onClick={() =>
                      onEditDraft(draft)
                    }
                  >
                    Open ↗
                  </button>

                  <button
                    className="quiet-action delete-action"
                    onClick={() =>
                      handleDelete(draft.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-admin drafts-empty">
            <span>✳</span>

            <strong>
              No saved drafts yet.
            </strong>

            <p>
              Your unfinished posts will appear here.
            </p>

            <button
              className="primary-action small-action"
              onClick={onNewPost}
            >
              ＋ Start writing
            </button>
          </div>
        )}
      </main>

      <footer className="admin-footer">
        <span>© 2024 Biniyam Abebe</span>

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

export default DraftsPage;

