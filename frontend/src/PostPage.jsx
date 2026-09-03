import { useState } from "react";
import { apiFetch } from "./services/api";

function PostPage({
  draft,
  onPostSaved,
  onBack
}) {
  const [title, setTitle] = useState(
    draft?.title || ""
  );

  const [category, setCategory] = useState(
    draft?.category || "Personal"
  );

  const [excerpt, setExcerpt] = useState(
    draft?.excerpt || ""
  );

  const [body, setBody] = useState(
    draft?.content || ""
  );

  const [coverImage, setCoverImage] = useState(null);

  const [attachments, setAttachments] = useState([]);

  const [saveStatus, setSaveStatus] = useState("");

  const [saving, setSaving] = useState(false);

  const handleCoverChange = (event) => {
    setCoverImage(
      event.target.files[0] || null
    );
  };

  const handleAttachmentChange = (event) => {
    setAttachments(
      Array.from(event.target.files)
    );
  };

  const savePost = async (published) => {
    try {
      setSaving(true);

      setSaveStatus(
        published
          ? "Publishing..."
          : "Saving..."
      );

      const postData = {
        title: title.trim(),
        category,
        excerpt: excerpt.trim(),
        content: body.trim(),
        published
      };

      let response;

      if (draft?.id) {
        response = await apiFetch(
          `/admin/posts/${draft.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
          }
        );
      } else {
        response = await apiFetch(
          "/admin/posts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to save post"
        );
      }

      onPostSaved(data);

      setSaveStatus(
        published
          ? "Published"
          : "Draft saved"
      );

      setTimeout(() => {
        onBack();
      }, 700);
    } catch (error) {
      console.error(
        "Failed to save post:",
        error
      );

      setSaveStatus(
        error.message ||
        "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !excerpt.trim() || !body.trim()) {
      setSaveStatus("Title, description, and story are required.");
      return;
    }

    const action =
      event.nativeEvent
        .submitter?.value;

    await savePost(
      action === "publish"
    );
  };

  return (
    <div
      className="admin-page-content"
    >
      <main className="post-editor-page">
        <button
          className="back-link"
          onClick={onBack}
        >
          ← Back to dashboard
        </button>

        <div className="editor-heading">
          <div>
            <p className="eyebrow">
              Create something worth reading
            </p>

            <h1>
              {draft
                ? "Edit post"
                : "New post"}
            </h1>
          </div>

          <span className="editor-status">
            {saveStatus || "Unsaved"}
          </span>
        </div>

        <form
          className="post-editor"
          onSubmit={handleSubmit}
        >
          <section className="editor-main">
            <label className="editor-field">
              <span>Title</span>

              <input
                value={title}
                required
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Give your post a name"
              />
            </label>

            <label className="editor-field">
              <span>Short description</span>

              <textarea
                value={excerpt}
                required
                onChange={(event) =>
                  setExcerpt(event.target.value)
                }
                placeholder="What is this post about?"
                rows="3"
              />
            </label>

            <label className="editor-field">
              <span>Story</span>

              <textarea
                className="story-input"
                value={body}
                required
                onChange={(event) =>
                  setBody(event.target.value)
                }
                placeholder="Start writing here..."
                rows="14"
              />
            </label>
          </section>

          <aside className="editor-sidebar">
            <section className="editor-panel">
              <h2>Post settings</h2>

              <label className="editor-field">
                <span>Category</span>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option>Personal</option>
                  <option>Notes</option>
                  <option>Medicine</option>
                  <option>Learning</option>
                </select>
              </label>
            </section>

            <section className="editor-panel">
              <h2>Cover image</h2>

              <label className="upload-control">
                <span>
                  {coverImage
                    ? coverImage.name
                    : draft?.coverImage ||
                      "Choose an image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
              </label>

              <small>
                JPG, PNG, or WebP up to 5 MB.
              </small>
            </section>

            <section className="editor-panel">
              <h2>Attachments</h2>

              <label className="upload-control">
                <span>＋ Add files</span>

                <input
                  type="file"
                  multiple
                  onChange={handleAttachmentChange}
                />
              </label>

              {attachments.length > 0 && (
                <ul className="attachment-list">
                  {attachments.map((file) => (
                    <li key={file.name}>
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="editor-actions">
              <button
                className="secondary-action"
                type="submit"
                name="action"
                value="draft"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save as draft"}
              </button>

              <button
                className="primary-action editor-submit"
                type="submit"
                name="action"
                value="publish"
                disabled={saving}
              >
                {saving
                  ? "Please wait..."
                  : draft?.published
                    ? "Update post"
                    : "Post"}
              </button>
            </div>
          </aside>
        </form>
      </main>

    </div>
  );
}

export default PostPage;