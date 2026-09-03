import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPublishedPost } from "./services/api";

function ArticlePage({ darkMode, onToggleTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetchPublishedPost(id)
      .then((data) => {
        if (mounted) {
          setPost(data);
        }
      })
      .catch((requestError) => {
        if (mounted) {
          setError(requestError.message);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div
      className={`article-overlay ${darkMode ? "dark" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-title"
      onClick={() => navigate(-1)}
    >
      <article
        className="article-reader"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="article-close"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close article"
        >
          ×
        </button>
        <button
          className="theme-toggle article-theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
        >
          <span>{darkMode ? "☼" : "◐"}</span>
        </button>

        <main className="post-page article-reader-content">
        {error ? (
          <p className="empty-state">{error}</p>
        ) : !post ? (
          <p className="empty-state">Loading article...</p>
        ) : (
          <article>
            <div className="article-heading">
              <div className="post-meta">
                <span>{post.category}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 id="article-title">{post.title}</h1>
              <p className="article-lede">{post.excerpt || ""}</p>
              <span className="article-read">
                {Math.max(1, Math.ceil((post.content?.length || 0) / 1200))} min read
              </span>
            </div>

            {post.coverImage && (
              <img className="article-image" src={post.coverImage} alt="" />
            )}

            <div className="article-body">
              {(post.content || "")
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={`${post.id}-${index}`}>{paragraph}</p>
                ))}
            </div>
          </article>
        )}
        </main>
      </article>
    </div>
  );
}

export default ArticlePage;