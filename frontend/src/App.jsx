
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import ArticlePage from "./ArticlePage";
import Admin from "./Admin";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import DraftsPage from "./DraftsPage";
import PostPage from "./PostPage";
import {
  fetchPublishedPosts,
  logout,
  refreshAccessToken
} from "./services/api";

function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const navigate = useNavigate();

  /*
   * Load published posts for the public website.
   */
  useEffect(() => {
    const loadPublicPosts = async () => {
      try {
        setPostsLoading(true);

        setPosts(await fetchPublishedPosts());
      } catch (error) {
        console.error(
          "Failed to load posts:",
          error
        );
      } finally {
        setPostsLoading(false);
      }
    };

    loadPublicPosts();
  }, []);

  /*
   * Search public posts.
   */
  const visiblePosts = useMemo(() => {
    return posts.filter((post) =>
      `${post.title || ""} ${
        post.excerpt || ""
      } ${post.category || ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [posts, query]);

  /*
   * =====================================================
   * PUBLIC WEBSITE
   * =====================================================
   *
   * Visitors see ONLY this.
   *
   * There is intentionally no Admin link here.
   */
  return (
    <div
      className={
        darkMode
          ? "site dark"
          : "site"
      }
    >
      <button
        className="menu-toggle"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        aria-label={
          sidebarOpen
            ? "Close navigation"
            : "Open navigation"
        }
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? "×" : "☰"}
      </button>

      <header className="topbar">
        <Link
          className="wordmark"
          to="/"
          aria-label="Biniyam Abebe home"
        >
          <span>BA</span> Biniyam Abebe
        </Link>

        <nav
          className={
            sidebarOpen
              ? "is-open"
              : ""
          }
        >
          <Link
            to="/#writing"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            Writing
          </Link>

          <Link
            to="/#about"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            About
          </Link>

          <Link
            to="/#newsletter"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            Newsletter
          </Link>
        </nav>

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          aria-label="Toggle color theme"
        >
          <span>
            {darkMode
              ? "☼"
              : "◐"}
          </span>
        </button>
      </header>

      <main id="top">

        {/* ABOUT / HERO */}
        <section
          className="intro"
          id="about"
        >
          <p className="eyebrow">
            INDEPENDENT WRITER & MED-STUDENT
          </p>

          <h1>
            Heading
            <br />
            <em>Heading</em>
          </h1>

          <p className="intro-copy">
            I’m Biniyam,
          </p>

          <Link
            className="text-link"
            to="/#writing"
          >
            Explore the writing{" "}
            <span>↘</span>
          </Link>

          <div className="intro-mark">
            ✳
          </div>
        </section>

        {/* SELECTED WRITING */}
        <section
          className="writing-section"
          id="writing"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                The latest
              </p>

              <h2>
                Selected writing
              </h2>
            </div>

            <div className="search-wrap">
              <span>⌕</span>

              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search notes"
                aria-label="Search notes"
              />
            </div>
          </div>

          {postsLoading ? (
            <p className="empty-state">
              Loading writing...
            </p>
          ) : visiblePosts.length ? (
            <div className="posts-grid">
              {visiblePosts.map(
                (post) => (
                  <article
                    className="post"
                    key={post.id}
                  >
                    {post.coverImage && (
                      <img
                        src={
                          post.coverImage
                        }
                        alt=""
                      />
                    )}

                    <div className="post-info">

                      <div className="post-meta">
                        <span>
                          {
                            post.category
                          }
                        </span>

                        <span>
                          {new Date(
                            post.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <h3>
                        {post.title}
                      </h3>

                      <p>
                        {
                          post.excerpt ||
                          post.content
                        }
                      </p>

                      <div className="post-footer">

                        <span>
                          {Math.max(
                            1,
                            Math.ceil(
                              (
                                post.content
                                  ?.length ||
                                0
                              ) / 1200
                            )
                          )}{" "}
                          min read
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/post/${post.id}`)
                          }
                          aria-label={`Read ${post.title}`}
                        >
                          Read article{" "}
                          <b>↗</b>
                        </button>

                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <p className="empty-state">
              No notes found. Try another phrase.
            </p>
          )}
        </section>

        {/* NEWSLETTER */}
        <section
          className="newsletter"
          id="newsletter"
        >
          <div>
            <p className="eyebrow">
              A letter, occasionally
            </p>

            <h2>
              Good things,
              <br />
              <em>in your inbox.</em>
            </h2>
          </div>

          <div className="signup">

            <p>
              A short note when I have
              something worth sharing.
              No noise, just the good stuff.
            </p>

            {subscribed ? (
              <p className="success">
                You’re on the list.
                See you soon.
              </p>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  aria-label="Your email address"
                />

                <button type="submit">
                  Subscribe{" "}
                  <span>↗</span>
                </button>
              </form>
            )}

            <small>
              Unsubscribe anytime.
              I respect your inbox.
            </small>

          </div>
        </section>

        {/* SOCIAL */}
        <section
          className="social-section"
          id="social"
        >
          <div className="social-intro">

            <p className="eyebrow">
              Find me elsewhere
            </p>

            <h2>
              Come say
              <br />
              <em>hello.</em>
            </h2>

          </div>

          <div className="social-links">

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon">
                ◎
              </span>

              <span>
                <strong>
                  Instagram
                </strong>

                <small>
                  Photos & fragments
                </small>
              </span>

              <b>↗</b>
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon">
                in
              </span>

              <span>
                <strong>
                  LinkedIn
                </strong>

                <small>
                  Work & collaborations
                </small>
              </span>

              <b>↗</b>
            </a>

            <a
              href="https://medium.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon">
                M
              </span>

              <span>
                <strong>
                  Medium
                </strong>

                <small>
                  Essays & observations
                </small>
              </span>

              <b>↗</b>
            </a>

          </div>
        </section>

      </main>

      <footer>
        <span>
          © 2024 Biniyam Abebe
        </span>

        <div>
          <Link to="/">
            Instagram
          </Link>
        </div>
      </footer>

    </div>
  );
}

function ProtectedRoute({ isAdmin, authReady }) {
  if (!authReady) {
    return <div className="site"><main className="admin-main"><p>Restoring admin session...</p></main></div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
}

function AdminLoginRoute({ isAdmin, authReady, onLogin, darkMode, onToggleTheme }) {
  const navigate = useNavigate();

  if (!authReady) {
    return <div className="site"><main className="admin-main"><p>Restoring admin session...</p></main></div>;
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <AdminLogin
      onLogin={() => {
        onLogin();
        navigate("/admin/dashboard", { replace: true });
      }}
      onBack={() => navigate("/")}
      darkMode={darkMode}
      onToggleTheme={onToggleTheme}
    />
  );
}

function AdminContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = location.state?.draft || null;

  const openNewPost = () => navigate("/admin/new-post");

  return (
    <Routes>
      <Route
        index
        element={
          <Admin
            onNewPost={openNewPost}
            onEditPost={(post) => navigate("/admin/new-post", { state: { draft: post } })}
            onPostDeleted={() => {}}
            onDrafts={() => navigate("/admin/drafts")}
          />
        }
      />
      <Route path="dashboard" element={<Admin onNewPost={openNewPost} onEditPost={(post) => navigate("/admin/new-post", { state: { draft: post } })} onPostDeleted={() => {}} onDrafts={() => navigate("/admin/drafts")} />} />
      <Route path="posts" element={<Admin onNewPost={openNewPost} onEditPost={(post) => navigate("/admin/new-post", { state: { draft: post } })} onPostDeleted={() => {}} onDrafts={() => navigate("/admin/drafts")} />} />
      <Route path="drafts" element={<DraftsPage onBack={() => navigate("/admin")} onNewPost={openNewPost} onEditDraft={(post) => navigate("/admin/new-post", { state: { draft: post } })} />} />
      <Route path="new-post" element={<PostPage draft={draft} onPostSaved={() => {}} onBack={() => navigate("/admin")} />} />
      <Route path="profile" element={<Admin initialTab="profile" onNewPost={openNewPost} onEditPost={(post) => navigate("/admin/new-post", { state: { draft: post } })} onPostDeleted={() => {}} onDrafts={() => navigate("/admin/drafts")} />} />
      <Route path="settings" element={<Admin initialTab="settings" onNewPost={openNewPost} onEditPost={(post) => navigate("/admin/new-post", { state: { draft: post } })} onPostDeleted={() => {}} onDrafts={() => navigate("/admin/drafts")} />} />
    </Routes>
  );
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshAccessToken()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
      .finally(() => setAuthReady(true));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsAdmin(false);
      navigate("/");
    }
  };

  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/post/:id" element={<ArticlePage />} />
      <Route
        path="/admin"
        element={<AdminLoginRoute isAdmin={isAdmin} authReady={authReady} onLogin={() => setIsAdmin(true)} darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />}
      />
      <Route path="/about" element={<Home />} />
      <Route element={<ProtectedRoute isAdmin={isAdmin} authReady={authReady} />}>
        <Route element={<AdminLayout onLogout={handleLogout} darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />}>
          <Route path="/admin/*" element={<AdminContent />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
