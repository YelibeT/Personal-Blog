import { useEffect, useMemo, useState } from "react";
import AdminPage from "./Admin";
import AdminLogin from "./AdminLogin";
import "./App.css";
import DraftsPage from "./DraftsPage";
import PostPage from "./PostPage";
import { apiFetch } from "./api";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Admin authentication
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Navigation
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Public posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Admin drafts
  const [drafts, setDrafts] = useState([]);

  // Editor
  const [editorDraft, setEditorDraft] = useState(null);

  const [isPostEditor, setIsPostEditor] = useState(
    () => window.location.hash === "#admin/new-post",
  );

  const [isDraftsPage, setIsDraftsPage] = useState(
    () => window.location.hash === "#admin/drafts",
  );

  /*
   * Load published posts for visitors
   */
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await apiFetch("/posts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load posts",
          );
        }

        setPosts(data);
      } catch (error) {
        console.error("Failed to load public posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, []);

  /*
   * Handle hash routes
   */
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      setIsPostEditor(hash === "#admin/new-post");
      setIsDraftsPage(hash === "#admin/drafts");
    };

    window.addEventListener(
      "hashchange",
      handleHashChange,
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
    };
  }, []);

  /*
   * Load drafts from localStorage for now.
   *
   * We will replace this with the backend API
   * after the navigation/authentication is working.
   */
  useEffect(() => {
    const savedDrafts = JSON.parse(
      localStorage.getItem("blog-drafts") || "[]",
    );

    setDrafts(savedDrafts);
  }, []);

  /*
   * Save a draft
   */
  const saveDraft = (draft) => {
    const nextDrafts = [
      {
        ...draft,
        id: draft.id || Date.now(),
        updatedAt: new Date().toLocaleDateString(),
      },
      ...drafts.filter(
        (item) => item.id !== draft.id,
      ),
    ];

    setDrafts(nextDrafts);

    localStorage.setItem(
      "blog-drafts",
      JSON.stringify(nextDrafts),
    );
  };

  /*
   * Open post editor
   */
  const openEditor = (draft = null) => {
    setEditorDraft(draft);

    window.location.hash = "admin/new-post";

    setIsPostEditor(true);
    setIsDraftsPage(false);
    setIsAdmin(false);
  };

  /*
   * Search public posts
   */
  const visiblePosts = useMemo(() => {
    return posts.filter((post) =>
      `${post.title || ""} ${post.excerpt || ""} ${
        post.category || ""
      }`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [posts, query]);

  /*
   * ADMIN LOGIN
   */
  if (showAdminLogin) {
    return (
      <AdminLogin
        onLogin={() => {
          setShowAdminLogin(false);
          setIsAdmin(true);
        }}
        onBack={() => {
          setShowAdminLogin(false);
        }}
        darkMode={darkMode}
        onToggleTheme={() =>
          setDarkMode(!darkMode)
        }
      />
    );
  }

  /*
   * ADMIN DASHBOARD
   */
  if (isAdmin) {
    return (
      <AdminPage
        onBack={() => {
          setIsAdmin(false);
        }}
        onNewPost={() => {
          openEditor();
        }}
        onDrafts={() => {
          window.location.hash = "admin/drafts";

          setIsDraftsPage(true);
          setIsAdmin(false);
        }}
        darkMode={darkMode}
        onToggleTheme={() =>
          setDarkMode(!darkMode)
        }
      />
    );
  }

  /*
   * DRAFTS
   */
  if (isDraftsPage) {
    return (
      <DraftsPage
        drafts={drafts}
        onBack={() => {
          window.location.hash = "";

          setIsDraftsPage(false);
          setIsAdmin(true);
        }}
        onNewPost={() => {
          openEditor();
        }}
        onEditDraft={(draft) => {
          openEditor(draft);
        }}
        onDeleteDraft={(id) => {
          const nextDrafts = drafts.filter(
            (draft) => draft.id !== id,
          );

          setDrafts(nextDrafts);

          localStorage.setItem(
            "blog-drafts",
            JSON.stringify(nextDrafts),
          );
        }}
        darkMode={darkMode}
        onToggleTheme={() =>
          setDarkMode(!darkMode)
        }
      />
    );
  }

  /*
   * POST EDITOR
   */
  if (isPostEditor) {
    return (
      <PostPage
        draft={editorDraft}
        onSaveDraft={saveDraft}
        onBack={() => {
          window.location.hash = "";

          setIsPostEditor(false);
          setEditorDraft(null);
          setIsAdmin(true);
        }}
        darkMode={darkMode}
        onToggleTheme={() =>
          setDarkMode(!darkMode)
        }
      />
    );
  }

  /*
   * PUBLIC WEBSITE
   */
  return (
    <div
      className={
        darkMode ? "site dark" : "site"
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
        <a
          className="wordmark"
          href="#top"
          aria-label="Biniyam Abebe home"
        >
          <span>BA</span> Biniyam Abebe
        </a>

        <nav
          className={
            sidebarOpen ? "is-open" : ""
          }
        >
          <a
            href="#writing"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            Writing
          </a>

          <a
            href="#about"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            About
          </a>

          <a
            href="#newsletter"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            Newsletter
          </a>

          <button
            className="admin-link"
            onClick={() => {
              setSidebarOpen(false);
              setShowAdminLogin(true);
            }}
          >
            Admin ↗
          </button>
        </nav>

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          aria-label="Toggle color theme"
        >
          <span>
            {darkMode ? "☼" : "◐"}
          </span>
        </button>
      </header>

      <main id="top">
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

          <a
            className="text-link"
            href="#writing"
          >
            Explore the writing{" "}
            <span>↘</span>
          </a>

          <div className="intro-mark">
            ✳
          </div>
        </section>

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
                  setQuery(event.target.value)
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
              {visiblePosts.map((post) => (
                <article
                  className="post"
                  key={post.id}
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt=""
                    />
                  )}

                  <div className="post-info">
                    <div className="post-meta">
                      <span>
                        {post.category}
                      </span>

                      <span>
                        {new Date(
                          post.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h3>
                      {post.title}
                    </h3>

                    <p>
                      {post.excerpt ||
                        post.content}
                    </p>

                    <div className="post-footer">
                      <span>
                        {Math.max(
                          1,
                          Math.ceil(
                            (post.content
                              ?.length || 0) /
                              1200,
                          ),
                        )}{" "}
                        min read
                      </span>

                      <button
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
            <p className="empty-state">
              No notes found. Try another phrase.
            </p>
          )}
        </section>

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
              A short note when I have something
              worth sharing. No noise, just the
              good stuff.
            </p>

            {subscribed ? (
              <p className="success">
                You’re on the list. See you soon.
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
              Unsubscribe anytime. I respect your
              inbox.
            </small>
          </div>
        </section>

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
          <a href="#top">
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;