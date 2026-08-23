import { useState } from "react";

function PostPage({ onBack, darkMode, onToggleTheme }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [saved, setSaved] = useState(false);

  const handleCoverChange = (event) => setCoverImage(event.target.files[0] || null);
  const handleAttachmentChange = (event) => setAttachments(Array.from(event.target.files));
  const handleSubmit = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <div className={darkMode ? "site dark" : "site"}>
      <header className="topbar post-topbar">
        <button className="wordmark post-back" onClick={onBack}>
          <span>BA</span> Biniyam Abebe
        </button>
        <div className="admin-label"><span className="status-dot" /> Writing a new post</div>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle color theme">
          <span>{darkMode ? "☼" : "◐"}</span>
        </button>
      </header>
      <main className="post-editor-page">
        <button className="back-link" onClick={onBack}>← Back to dashboard</button>
        <div className="editor-heading">
          <div><p className="eyebrow">Create something worth reading</p><h1>New post</h1></div>
          <span className="editor-status">Draft</span>
        </div>
        <form className="post-editor" onSubmit={handleSubmit}>
          <section className="editor-main">
            <label className="editor-field"><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a name" required /></label>
            <label className="editor-field"><span>Short description</span><textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="What is this post about?" rows="3" /></label>
            <label className="editor-field"><span>Story</span><textarea className="story-input" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Start writing here..." rows="14" required /></label>
          </section>
          <aside className="editor-sidebar">
            <section className="editor-panel"><h2>Post settings</h2><label className="editor-field"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Personal</option><option>Notes</option><option>Medicine</option><option>Learning</option></select></label></section>
            <section className="editor-panel"><h2>Cover image</h2><label className="upload-control"><span>{coverImage ? coverImage.name : "Choose an image"}</span><input type="file" accept="image/*" onChange={handleCoverChange} /></label><small>JPG, PNG, or WebP up to 5 MB.</small></section>
            <section className="editor-panel"><h2>Attachments</h2><label className="upload-control"><span>＋ Add files</span><input type="file" multiple onChange={handleAttachmentChange} /></label>{attachments.length > 0 && <ul className="attachment-list">{attachments.map((file) => <li key={file.name}>{file.name}</li>)}</ul>}</section>
            <button className="primary-action editor-submit" type="submit">{saved ? "Draft saved" : "Save draft"}</button>
          </aside>
        </form>
      </main>
      <footer><span>© 2024 Biniyam Abebe</span><button className="footer-back" onClick={onBack}>← Back to dashboard</button></footer>
    </div>
  );
}

export default PostPage;
