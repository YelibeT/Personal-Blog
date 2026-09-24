import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "./services/api";

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);

  const [coverImage, setCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);

  const [attachments, setAttachments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) {
      return;
    }

    const loadPost = async () => {
      try {
        const response = await apiFetch(`/admin/posts/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load post.");
        }

        setTitle(data.title || "");
        setContent(data.content || "");
        setCategory(data.category || "Personal");
        setExcerpt(data.excerpt || "");
        setPublished(data.published || false);
        setCoverImage(data.coverImage || "");

        const attachmentsResponse = await apiFetch(
          `/attachments/post/${id}`
        );

        const attachmentsData = await attachmentsResponse.json();

        if (attachmentsResponse.ok) {
          setAttachments(attachmentsData);
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, editing]);

  const handleCoverImageChange = (event) => {
    setCoverImageFile(event.target.files[0] || null);
  };

  const uploadCoverImage = async () => {
    if (!coverImageFile) {
      return coverImage;
    }

    setUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("image", coverImageFile);

      const response = await apiFetch("/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload cover image."
        );
      }

      setCoverImage(data.imageUrl);
      setCoverImageFile(null);

      return data.imageUrl;
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAttachmentSelection = (event) => {
    const files = Array.from(event.target.files || []);

    setSelectedFiles((currentFiles) => [
      ...currentFiles,
      ...files
    ]);

    event.target.value = "";
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const uploadAttachments = async (postId) => {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploadingAttachments(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("postId", postId);

        const response = await apiFetch("/attachments", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              `Failed to upload ${file.name}.`
          );
        }

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          data
        ]);
      }

      setSelectedFiles([]);
    } finally {
      setUploadingAttachments(false);
    }
  };

  const deleteExistingAttachment = async (attachmentId) => {
    const confirmed = window.confirm(
      "Remove this attachment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(
        `/attachments/${attachmentId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete attachment."
        );
      }

      setAttachments((currentAttachments) =>
        currentAttachments.filter(
          (attachment) => attachment.id !== attachmentId
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const savePost = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const uploadedCoverImage = await uploadCoverImage();

      const postData = {
        title,
        content,
        category,
        excerpt,
        coverImage: uploadedCoverImage,
        published
      };

      const endpoint = editing
        ? `/admin/posts/${id}`
        : "/admin/posts";

      const method = editing ? "PUT" : "POST";

      const response = await apiFetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save post."
        );
      }

      const postId = data.id;

      await uploadAttachments(postId);

      setMessage(
        editing
          ? "Post updated successfully."
          : "Post created successfully."
      );

      if (!editing) {
        navigate(`/admin/posts/${postId}/edit`);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-main">
        <div className="empty-admin">
          <strong>Loading post...</strong>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-main post-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">
            {editing ? "Edit article" : "New article"}
          </p>

          <h1>
            {editing ? "Edit Post" : "Create Post"}
          </h1>

          <p className="admin-subtitle">
            Write your story and manage its files separately.
          </p>
        </div>
      </div>

      {(error || message) && (
        <div
          className={
            error
              ? "empty-admin post-feedback error"
              : "empty-admin post-feedback"
          }
        >
          <strong>{error || message}</strong>
        </div>
      )}

      <form
        className="post-form"
        onSubmit={savePost}
      >
        <section className="form-section">
          <h2>Story</h2>

          <label className="form-group">
            <span>Title</span>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Post title"
              required
            />
          </label>

          <label className="form-group">
            <span>Category</span>

            <input
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              placeholder="Personal"
            />
          </label>

          <label className="form-group">
            <span>Excerpt</span>

            <textarea
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              placeholder="Short description of the post"
              rows="3"
            />
          </label>

          <label className="form-group">
            <span>Content</span>

            <textarea
              className="post-content-editor"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="Write your story here..."
              rows="18"
              required
            />
          </label>
        </section>

        <section className="form-section">
          <h2>Cover image</h2>

          {coverImage && (
            <img
              src={coverImage}
              alt="Post cover"
              className="post-cover-preview"
            />
          )}

          <label className="form-group">
            <span>Choose cover image</span>

            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
            />

            <small>
              JPG, PNG, or WebP up to 5 MB.
            </small>

            {coverImageFile && (
              <small>
                Selected: {coverImageFile.name}
              </small>
            )}
          </label>
        </section>

        <section className="form-section attachments-section">
          <div className="section-heading-row">
            <div>
              <h2>Attachments</h2>

              <p className="section-description">
                Add files readers can download separately
                from your story.
              </p>
            </div>
          </div>

          <label className="attachment-picker">
            <span className="attachment-picker-title">
              Choose files
            </span>

            <span className="attachment-picker-description">
              PDF, DOC, DOCX, TXT, or ZIP up to 20 MB each.
            </span>

            <input
              type="file"
              multiple
              onChange={handleAttachmentSelection}
              accept=".pdf,.doc,.docx,.txt,.zip"
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="attachment-list">
              <h3>Ready to upload</h3>

              {selectedFiles.map((file, index) => (
                <div
                  className="attachment-item"
                  key={`${file.name}-${index}`}
                >
                  <div className="attachment-info">
                    <strong>{file.name}</strong>

                    <span>
                      {formatFileSize(file.size)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="attachment-remove"
                    onClick={() =>
                      removeSelectedFile(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {attachments.length > 0 && (
            <div className="attachment-list">
              <h3>Attached files</h3>

              {attachments.map((attachment) => (
                <div
                  className="attachment-item"
                  key={attachment.id}
                >
                  <div className="attachment-info">
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {attachment.fileName}
                    </a>

                    <span>
                      {formatFileSize(
                        attachment.fileSize
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="attachment-remove"
                    onClick={() =>
                      deleteExistingAttachment(
                        attachment.id
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadingAttachments && (
            <p className="attachment-status">
              Uploading attachments...
            </p>
          )}
        </section>

        <section className="form-section">
          <h2>Publishing</h2>

          <label className="publish-toggle">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) =>
                setPublished(event.target.checked)
              }
            />

            <span>
              Publish this post
            </span>
          </label>
        </section>

        <div className="form-actions">
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </button>

          <button
            className="primary-action"
            type="submit"
            disabled={
              saving ||
              uploadingCover ||
              uploadingAttachments
            }
          >
            {uploadingCover
              ? "Uploading cover..."
              : uploadingAttachments
                ? "Uploading files..."
                : saving
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Create post"}
          </button>
        </div>
      </form>
    </main>
  );
}

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const size = bytes / Math.pow(1024, index);

  return `${size.toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

export default PostPage;