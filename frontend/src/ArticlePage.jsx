import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPublishedPost } from "./services/api";

function ArticlePage() {
  const { id } = useParams();
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
    <div className="site">
      <header className="topbar">
        <Link className="wordmark" to="/" aria-label="Biniyam Abebe home">
          <span>BA</span> Biniyam Abebe
        </Link>
        <Link className="text-link" to="/">Back to writing</Link>
      </header>

      <main className="post-page">
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
              <h1>{post.title}</h1>
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
    </div>
  );
}

export default ArticlePage;