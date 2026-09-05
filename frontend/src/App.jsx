import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import ArticlePage from "./ArticlePage";
import Admin from "./Admin";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import DraftsPage from "./DraftsPage";
import PostPage from "./PostPage";
import ProfilePage from "./ProfilePage";
import {
  fetchPublishedPosts,
  logout,
  refreshAccessToken,
} from "./services/api";

const stripPostFormatting = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(^|\s)#{1,6}\s*/g, "$1")
    .replace(/[*_`>~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getPostPreview = (post) => {
  const source = post.excerpt?.trim() || post.content || "";
  const preview = stripPostFormatting(source);

  return preview.length > 120
    ? `${preview.slice(0, 117).trimEnd()}...`
    : preview;
};

function SocialIcon({ name }) {
  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15.4 3.2c.3 1.8 1.3 3 3.1 3.2v2.8c-1.2 0-2.3-.3-3.2-.9v6.1c0 3.4-2.2 5.6-5.3 5.6-2.9 0-5-2-5-4.8 0-3.1 2.5-5.2 5.7-5.2.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.2-.9-.2-1.3 0-2.4.9-2.4 2.3 0 1.2.8 2.1 2 2.1 1.3 0 2.1-.9 2.1-2.5V3.2h3z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <circle cx="12" cy="12" r="4" />
        <circle className="social-icon-dot" cx="17.5" cy="6.5" r="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H8v3.1h2.6v8h3.1z" />
    </svg>
  );
}

function Home({ darkMode, onToggleTheme, posts, postsLoading }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  
  const visiblePosts = useMemo(() => {
    return posts.filter((post) =>
      `${post.title || ""} ${post.excerpt || ""} ${post.category || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [posts, query]);

  return (
    <div className={darkMode ? "site dark" : "site"}>
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? "×" : "☰"}
      </button>

      <header className="topbar">
        <Link className="wordmark" to="/" aria-label="Biniyam Abebe home">
          <span>BA</span> Biniyam Abebe
        </Link>

        <nav className={sidebarOpen ? "is-open" : ""}>

          <Link to="/" onClick={() => setSidebarOpen(false)}>
            Home
          </Link>

          <Link to="/#about" onClick={() => setSidebarOpen(false)}>
            About
          </Link>

          <Link to="/#writing" onClick={() => setSidebarOpen(false)}>
            Writing
          </Link>

        </nav>

        <button
          className="theme-toggle"
          onClick={() => onToggleTheme()}
          aria-label="Toggle color theme"
        >
          <span>{darkMode ? "☼" : "◐"}</span>
        </button>
      </header>

      <main id="top">
        {/* ABOUT / HERO */}
        <section className="intro" id="about">
          <p className="eyebrow">WRITER & MED-STUDENT</p>

          <h1>
            Biniyam
            <br />
            <em>Abebe</em>
          </h1>

          <p className="intro-copy">I am a medical student and writer with a passion for sharing knowledge and creating meaningful content. As a Christian young person, I write about my personal experiences, spiritual struggles, lessons, and discoveries, using the Bible to understand and clarify what I have experienced. I believe that when biblical truth is shared in a simple, honest, and meaningful way, it can make a lasting impact on the spiritual lives of Christians. Through my writing and teaching, my desire is to share what I learn, encourage others in their faith, and help young Christians grow closer to God and His Word.</p>

          <Link className="text-link" to="/#writing">
            Explore the writing <span>↘</span>
          </Link>

          <div className="intro-mark">✳</div>
        </section>

        {/* SELECTED WRITING */}
        <section className="writing-section" id="writing">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The latest</p>

              <h2>Selected writing</h2>
            </div>

            <div className="search-wrap">
              <span>⌕</span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notes"
                aria-label="Search notes"
              />
            </div>
          </div>

          {postsLoading ? (
            <p className="empty-state">Loading writing...</p>
          ) : visiblePosts.length ? (
            <div className="posts-grid">
              {visiblePosts.map((post) => (
                <article className="post" key={post.id}>
                  {post.coverImage && <img src={post.coverImage} alt="" />}

                  <div className="post-info">
                    <div className="post-meta">
                      <span>{post.category}</span>

                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3>{post.title}</h3>

                    <p>{getPostPreview(post)}</p>

                    <div className="post-footer">
                      <span>
                        {Math.max(
                          1,
                          Math.ceil((post.content?.length || 0) / 1200),
                        )}{" "}
                        min read
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/post/${post.id}`, {
                            state: { backgroundLocation: location },
                          })
                        }
                        aria-label={`Read ${post.title}`}
                      >
                        Read article <b>↗</b>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">No notes found.</p>
          )}
        </section>

        {/* SOCIAL */}
        <section className="social-section" id="social">
          <div className="social-intro">
            <p className="eyebrow">Find me elsewhere</p>

            <h2>
              Come say
              <br />
              <em>hello.</em>
            </h2>
          </div>

          <div className="social-links">
            <a
              href="https://www.tiktok.com/@binu_abebe"
              target="_blank"
              rel="noreferrer"
              >
              <span className="social-icon" aria-label="TikTok">
                <SocialIcon name="tiktok" />
              </span>

              <span>
                <strong>Tiktok</strong>

                
              </span>

              <b>↗</b>
            </a>

            <a
              href="https://www.instagram.com/biniyam7185/?hl=en"
              target="_blank"
              rel="noreferrer"
              >
              <span className="social-icon" aria-label="Instagram">
                <SocialIcon name="instagram" />
              </span>

              <span>
                <strong>Instagram</strong>

                
              </span>

              <b>↗</b>
            </a>

            <a
              href="https://web.facebook.com/biniyam.abebe.98284?locale=fr_FR"
              target="_blank"
              rel="noreferrer"
            >
              <span className="social-icon" aria-label="Facebook">
                <SocialIcon name="facebook" />
              </span>

              <span>
                <strong>Facebook</strong>

              </span>

              <b>↗</b>
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2024 Biniyam Abebe</span>

        <div>
          <a href="https://www.instagram.com/biniyam7185/?hl=en">Instagram</a>
          <a href="https://www.tiktok.com/@binu_abebe">Tiktok</a>
          <a href="https://web.facebook.com/biniyam.abebe.98284?locale=fr_FR">Facebook</a>
          
        </div>
      </footer>
    </div>
  );
}

function ProtectedRoute({ isAdmin, authReady }) {
  if (!authReady) {
    return (
      <div className="site">
        <main className="admin-main">
          <p>Restoring admin session...</p>
        </main>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
}

function AdminLoginRoute({
  isAdmin,
  authReady,
  onLogin,
  darkMode,
  onToggleTheme,
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

function AdminContent({ onLogout, onPostSaved, onPostDeleted }) {
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
            onEditPost={(post) =>
              navigate("/admin/new-post", { state: { draft: post } })
            }
            onPostDeleted={onPostDeleted}
            onDrafts={() => navigate("/admin/drafts")}
          />
        }
      />
      <Route
        path = "dashboard"
        element={
          <Admin
            onNewPost={openNewPost}
            onEditPost={(post) =>
              navigate("/admin/new-post", { state: { draft: post } })
            }
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
            onEditPost={(post) =>
              navigate("/admin/new-post", { state: { draft: post } })
            }
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
            onEditDraft={(post) =>
              navigate("/admin/new-post", { state: { draft: post } })
            }
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
            onEditPost={(post) =>
              navigate("/admin/new-post", { state: { draft: post } })
            }
            onPostDeleted={() => {}}
            onDrafts={() => navigate("/admin/drafts")}
          />
        }
      />
      <Route path="profile" element={<ProfilePage onLogout={onLogout} />} />
    </Routes>
  );
}

function ArticleRoute({ darkMode, onToggleTheme }) {
  return (
    <>
      <Home
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        posts={[]}
        postsLoading={false}
      />
      <ArticlePage darkMode={darkMode} onToggleTheme={onToggleTheme} />
    </>
  );
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    refreshAccessToken()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
      .finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    fetchPublishedPosts()
      .then(setPosts)
      .catch((error) => console.error("Failed to load posts:", error))
      .finally(() => setPostsLoading(false));
  }, []);

  const handlePostSaved = (savedPost) => {
    setPosts((currentPosts) => {
      const remainingPosts = currentPosts.filter(
        (post) => post.id !== savedPost.id,
      );
      return savedPost.published
        ? [savedPost, ...remainingPosts]
        : remainingPosts;
    });
  };

  const handlePostDeleted = (postId) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId),
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsAdmin(false);
      navigate("/");
    }
  };

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route
          path="/"
          element={
            <Home
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode(!darkMode)}
              posts={posts}
              postsLoading={postsLoading}
            />
          }
        />
        <Route
          path="/about"
          element={
            <Home
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode(!darkMode)}
              posts={posts}
              postsLoading={postsLoading}
            />
          }
        />
        <Route
          path="/post/:id"
          element={
            <ArticleRoute
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode(!darkMode)}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminLoginRoute
              isAdmin={isAdmin}
              authReady={authReady}
              onLogin={() => setIsAdmin(true)}
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode(!darkMode)}
            />
          }
        />
        <Route
          element={<ProtectedRoute isAdmin={isAdmin} authReady={authReady} />}
        >
          <Route
            element={
              <AdminLayout
                darkMode={darkMode}
                onToggleTheme={() => setDarkMode(!darkMode)}
              />
            }
          >
            <Route
              path="/admin/*"
              element={
                <AdminContent
                  onLogout={handleLogout}
                  onPostSaved={handlePostSaved}
                  onPostDeleted={handlePostDeleted}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/post/:id"
            element={
              <ArticlePage
                darkMode={darkMode}
                onToggleTheme={() => setDarkMode(!darkMode)}
              />
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
