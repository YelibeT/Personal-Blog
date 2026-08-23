function DraftsPage({ drafts, onBack, onNewPost, onEditDraft, onDeleteDraft, darkMode, onToggleTheme }) {
  return (
    <div className={darkMode ? "site dark" : "site"}>
      <header className="topbar admin-topbar">
        <button className="wordmark admin-back" onClick={onBack} aria-label="Biniyam Abebe home"><span>BA</span> Biniyam Abebe</button>
        <nav className="admin-nav"><button onClick={onBack}>Dashboard</button><button className="admin-nav-active">Drafts</button></nav>
        <div className="admin-label"><span className="status-dot" /> Draft library</div>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle color theme"><span>{darkMode ? "☼" : "◐"}</span></button>
      </header>
      <main className="admin-main drafts-page">
        <button className="back-link" onClick={onBack}>← Back to dashboard</button>
        <div className="admin-heading">
          <div><p className="eyebrow">Your workspace</p><h1>Saved drafts</h1><p className="admin-subtitle">Return to an unfinished thought whenever you are ready.</p></div>
          <button className="primary-action" onClick={onNewPost}>＋ New post</button>
        </div>
        {drafts.length ? (
          <div className="draft-list">
            {drafts.map((draft) => (
              <article className="draft-row" key={draft.id}>
                <div><span className="draft-category">{draft.category}</span><h2>{draft.title || "Untitled draft"}</h2><p>{draft.excerpt || "No description yet."}</p><small>Last saved {draft.updatedAt}</small></div>
                <div className="draft-row-actions"><button className="quiet-action" onClick={() => onEditDraft(draft)}>Open ↗</button><button className="quiet-action delete-action" onClick={() => onDeleteDraft(draft.id)}>Delete</button></div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-admin drafts-empty"><span>✳</span><strong>No saved drafts yet.</strong><p>Your unfinished posts will appear here.</p><button className="primary-action small-action" onClick={onNewPost}>＋ Start writing</button></div>
        )}
      </main>
      <footer className="admin-footer"><span>© 2024 Biniyam Abebe</span><button className="footer-back" onClick={onBack}>← Back to site</button></footer>
    </div>
  );
}

export default DraftsPage;
