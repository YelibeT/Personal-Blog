import posts from "./posts";

function AdminPage({ onBack, onNewPost, darkMode, onToggleTheme }) {
  return (
    <div className={darkMode ? "site dark" : "site"}>
      <header className="topbar admin-topbar">
        <button className="wordmark admin-back" onClick={onBack}>
          <span>BA</span> Biniyam Abebe
        </button>
        <div className="admin-label"><span className="status-dot" /> Admin workspace</div>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle color theme">
          <span>{darkMode ? "☼" : "◐"}</span>
        </button>
      </header>
      <main className="admin-main">
        <div className="admin-heading">
          <div><p className="eyebrow">Good morning, Biniyam</p><h1>Content overview</h1><p className="admin-subtitle">Keep your corner of the internet thoughtful and up to date.</p></div>
          <button className="primary-action" onClick={onNewPost}>＋ New post</button>
        </div>
        <div className="admin-stats">
          <div><span>Published posts</span><strong>{posts.length}</strong><small className="neutral">No posts yet</small></div>
          <div><span>Newsletter readers</span><strong>248</strong><small className="positive">↑ 12% this month</small></div>
          <div><span>Page views</span><strong>1,842</strong><small className="positive">↑ 18% this month</small></div>
          <div><span>Drafts</span><strong>3</strong><small className="neutral">Ready when you are</small></div>
        </div>
        <div className="admin-content-grid">
          <section className="admin-panel posts-panel"><div className="panel-heading"><div><p className="eyebrow">Your library</p><h2>Recent writing</h2></div><button className="quiet-action">View all ↗</button></div><div className="empty-admin"><span>✳</span><strong>Your first story starts here.</strong><p>Write something worth coming back to.</p><button className="primary-action small-action" onClick={onNewPost}>＋ Start a draft</button></div></section>
          <section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">Audience</p><h2>Newsletter</h2></div><button className="quiet-action">Manage ↗</button></div><div className="audience-number"><strong>248</strong><span>subscribers</span></div><div className="mini-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><p className="chart-note">Your list is growing steadily.</p></section>
        </div>
      </main>
      <footer className="admin-footer"><span>© 2024 Biniyam Abebe</span><span>Admin workspace <i>✳</i></span><button className="footer-back" onClick={onBack}>← Back to site</button></footer>
    </div>
  );
}

export default AdminPage;