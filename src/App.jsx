import { useMemo, useState } from "react";
import "./App.css";

const posts = [
  {
    title: "A slower way to make a living",
    excerpt:
      "On building a practice around attention, good questions, and making fewer things better.",
    category: "Work & life",
    date: "Jun 18, 2024",
    read: "8 min read",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    feature: true,
  },
  {
    title: "The tiny rituals that keep me curious",
    excerpt: "A field guide to leaving the door open for better ideas.",
    category: "Notes",
    date: "May 29, 2024",
    read: "5 min read",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Designing for the edges",
    excerpt: "The most useful details tend to live where the happy path ends.",
    category: "Design",
    date: "Apr 12, 2024",
    read: "6 min read",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "A small case for changing your mind",
    excerpt: "Certainty is useful. So is knowing when to put it down.",
    category: "Work & life",
    date: "Mar 08, 2024",
    read: "4 min read",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85",
  },
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const visiblePosts = useMemo(
    () =>
      posts.filter((post) =>
        `${post.title} ${post.excerpt} ${post.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className={darkMode ? "site dark" : "site"}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Biniyam Abebe home">
          <span>BA</span> Biniyam Abebe
        </a>
        <nav>
          <a href="#writing">Writing</a>
          <a href="#about">About</a>
          <a href="#newsletter">Newsletter</a>
        </nav>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle color theme"
        >
          <span>{darkMode ? "☼" : "◐"}</span>{" "}
          {darkMode ? "Daylight" : "Night mode"}
        </button>
      </header>
      <main id="top">
        <section className="intro" id="about">
          <p className="eyebrow">
            INDEPENDENT WRITER & MED-STUDENT <span>✳</span> Est. 2018
          </p>
          <h1>
            Notes on making
            <br />
            <em>room for wonder.</em>
          </h1>
          <p className="intro-copy">
            I’m Biniyam, a medical student and lifelong learner writing about
            creative work, everyday rituals, and the good stuff hiding in
            plain sight.
          </p>
          <a className="text-link" href="#writing">
            Explore the writing <span>↘</span>
          </a>
          <div className="intro-mark">✳</div>
        </section>
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
          {visiblePosts.length ? (
            <div className="posts-grid">
              {visiblePosts.map((post) => (
                <article
                  className={post.feature ? "post feature-post" : "post"}
                  key={post.title}
                >
                  <img src={post.image} alt="" />
                  <div className="post-info">
                    <div className="post-meta">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="post-footer">
                      <span>{post.read}</span>
                      <button aria-label={`Read ${post.title}`}>
                        Read article <b>↗</b>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">No notes found. Try another phrase.</p>
          )}
        </section>
        <section className="newsletter" id="newsletter">
          <div>
            <p className="eyebrow">A letter, occasionally</p>
            <h2>
              Good things,
              <br />
              <em>in your inbox.</em>
            </h2>
          </div>
          <div className="signup">
            <p>
              A short note when I have something worth sharing. No noise, just
              the good stuff.
            </p>
            {subscribed ? (
              <p className="success">You’re on the list. See you soon.</p>
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
                  Subscribe <span>↗</span>
                </button>
              </form>
            )}
            <small>Unsubscribe anytime. I respect your inbox.</small>
          </div>
        </section>
        <section className="social-section" id="social">
          <div className="social-intro">
            <p className="eyebrow">Find me elsewhere</p>
            <h2>Come say<br /><em>hello.</em></h2>
          </div>
          <div className="social-links">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><span className="social-icon">◎</span><span><strong>Instagram</strong><small>Photos & fragments</small></span><b>↗</b></a>
            <a href="https://www.are.na/" target="_blank" rel="noreferrer"><span className="social-icon">◌</span><span><strong>Are.na</strong><small>Collected references</small></span><b>↗</b></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><span className="social-icon">in</span><span><strong>LinkedIn</strong><small>Work & collaborations</small></span><b>↗</b></a>
            <a href="/rss.xml"><span className="social-icon">◔</span><span><strong>RSS</strong><small>Read every note</small></span><b>↗</b></a>
          </div>
        </section>
      </main>
      <footer>
        <span>© 2024 Biniyam Abebe</span>
        <span>
          Made with intention <i>✳</i>
        </span>
        <div>
          <a href="#top">Instagram</a>
          <a href="#top">Are.na</a>
          <a href="#top">RSS</a>
        </div>
      </footer>
    </div>
  );
}

export default App;