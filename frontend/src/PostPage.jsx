import { useEffect, useState } from "react";
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

  // Newly selected files
  const [attachments, setAttachments] = useState([]);

  // Files already uploaded for this post
  const [existingAttachments, setExistingAttachments] =
    useState([]);

  const [saveStatus, setSaveStatus] = useState("");

  const [saving, setSaving] = useState(false);

  const [uploadingAttachments, setUploadingAttachments] =
    useState(false);

  /*
   * Load existing attachments when editing a post.
   */
  useEffect(() => {
    if (!draft?.id) {
      return;
    }

    const loadAttachments = async () => {
      try {
        const response = await apiFetch(
          `/attachments/post/${draft.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load attachments"
          );
        }

        setExistingAttachments(data);
      } catch (error) {
        console.error(
          "Failed to load attachments:",
          error
        );
      }
    };

    loadAttachments();
  }, [draft?.id]);

  /*
   * Cover image selection.
   */
  const handleCoverChange = (event) => {
    setCoverImage(
      event.target.files[0] || null
    );
  };

  /*
   * Attachment selection.
   *
   * Files are NOT uploaded here.
   * They are only stored in browser state.
   */
  const handleAttachmentChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".zip"
    ];

    const maxSize =
      20 * 1024 * 1024;

    const validFiles = [];
    const rejectedFiles = [];

    for (const file of selectedFiles) {
      const fileName =
        file.name.toLowerCase();

      const isAllowedType =
        allowedExtensions.some(
          (extension) =>
            fileName.endsWith(extension)
        );

      const isAllowedSize =
        file.size <= maxSize;

      if (
        isAllowedType &&
        isAllowedSize
      ) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(file.name);
      }
    }

    if (rejectedFiles.length > 0) {
      setSaveStatus(
        "Some files were rejected. Only PDF, DOC, DOCX, TXT, and ZIP files up to 20 MB are allowed."
      );
    }

    setAttachments(
      (currentFiles) => [
        ...currentFiles,
        ...validFiles
      ]
    );

    // Allows selecting the same file again.
    event.target.value = "";
  };

  /*
   * Remove a file that has not been uploaded yet.
   */
  const removeSelectedAttachment = (
    index
  ) => {
    setAttachments(
      (currentFiles) =>
        currentFiles.filter(
          (_, fileIndex) =>
            fileIndex !== index
        )
    );
  };

  /*
   * Delete an attachment that already exists.
   */
  const deleteExistingAttachment = async (
    attachmentId
  ) => {
    try {
      setSaveStatus(
        "Removing attachment..."
      );

      const response = await apiFetch(
        `/attachments/${attachmentId}`,
        {
          method: "DELETE"
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to remove attachment"
        );
      }

      setExistingAttachments(
        (currentAttachments) =>
          currentAttachments.filter(
            (attachment) =>
              attachment.id !==
              attachmentId
          )
      );

      setSaveStatus("");
    } catch (error) {
      console.error(
        "Failed to delete attachment:",
        error
      );

      setSaveStatus(
        error.message ||
          "Failed to remove attachment"
      );
    }
  };

  /*
   * Upload the cover image to Cloudinary.
   */
  const uploadCoverImage = async () => {
    if (!coverImage) {
      return (
        draft?.coverImage ||
        null
      );
    }

    const formData =
      new FormData();

    formData.append(
      "image",
      coverImage
    );

    const response =
      await apiFetch(
        "/upload",
        {
          method: "POST",
          body: formData
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to upload cover image"
      );
    }

    return data.imageUrl;
  };

  /*
   * Upload all newly selected attachments.
   *
   * The post must already exist before this runs.
   */
  const uploadAttachments = async (
    postId
  ) => {
    if (
      attachments.length === 0
    ) {
      return;
    }

    setUploadingAttachments(
      true
    );

    try {
      for (
        const file of attachments
      ) {
        setSaveStatus(
          `Uploading ${file.name}...`
        );

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "postId",
          String(postId)
        );

        const response =
          await apiFetch(
            "/attachments",
            {
              method: "POST",
              body: formData
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              `Failed to upload ${file.name}`
          );
        }

        setExistingAttachments(
          (currentAttachments) => [
            ...currentAttachments,
            data
          ]
        );
      }

      setAttachments([]);
    } finally {
      setUploadingAttachments(
        false
      );
    }
  };

  /*
   * Create or update the post.
   */
  const savePost = async (
    published
  ) => {
    try {
      setSaving(true);

      setSaveStatus(
        published
          ? "Publishing..."
          : "Saving..."
      );

      /*
       * Upload cover image first.
       */
      const imageUrl =
        await uploadCoverImage();

      const postData = {
        title: title.trim(),
        category,
        excerpt: excerpt.trim(),
        content: body.trim(),
        coverImage: imageUrl,
        published
      };

      let response;

      /*
       * Update existing post.
       */
      if (draft?.id) {
        response =
          await apiFetch(
            `/admin/posts/${draft.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                postData
              )
            }
          );
      }

      /*
       * Create new post.
       */
      else {
        response =
          await apiFetch(
            "/admin/posts",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                postData
              )
            }
          );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save post"
        );
      }

      /*
       * Now the post definitely exists.
       *
       * Attachments can safely be linked to it.
       */
      await uploadAttachments(
        data.id
      );

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

  /*
   * Decide whether the user wants
   * to save a draft or publish.
   */
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !excerpt.trim() ||
      !body.trim()
    ) {
      setSaveStatus(
        "Title, description, and story are required."
      );

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
    <div className="admin-page-content">
      <main className="post-editor-page">

        <button
          className="back-link"
          onClick={onBack}
          type="button"
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
            {saveStatus ||
              "Unsaved"}
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
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Give your post a name"
              />
            </label>

            <label className="editor-field">
              <span>
                Short description
              </span>

              <textarea
                value={excerpt}
                required
                onChange={(event) =>
                  setExcerpt(
                    event.target.value
                  )
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
                  setBody(
                    event.target.value
                  )
                }
                placeholder="Start writing here..."
                rows="14"
              />
            </label>

          </section>

          <aside className="editor-sidebar">

            <section className="editor-panel">
              <h2>
                Post settings
              </h2>

              <label className="editor-field">
                <span>
                  Category
                </span>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Personal
                  </option>

                  <option>
                    Notes
                  </option>

                  <option>
                    Medicine
                  </option>

                  <option>
                    Learning
                  </option>
                </select>
              </label>
            </section>

            <section className="editor-panel">
              <h2>
                Cover image
              </h2>

              <label className="upload-control">
                <span>
                  {coverImage
                    ? coverImage.name
                    : draft?.coverImage
                      ? "Current cover image"
                      : "Choose an image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleCoverChange
                  }
                />
              </label>

              <small>
                JPG, PNG, or WebP up to 5 MB.
              </small>

              {coverImage && (
                <small>
                  Image will be uploaded when you save the post.
                </small>
              )}
            </section>

            <section className="editor-panel">
              <h2>
                Attachments
              </h2>

              <label className="upload-control">
                <span>
                  ＋ Add files
                </span>

                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  onChange={
                    handleAttachmentChange
                  }
                />
              </label>

              <small>
                PDF, DOC, DOCX, TXT, or ZIP up to 20 MB each.
              </small>

              {attachments.length >
                0 && (
                <>
                  <small>
                    Ready to upload
                  </small>

                  <ul className="attachment-list">
                    {attachments.map(
                      (
                        file,
                        index
                      ) => (
                        <li
                          key={`${file.name}-${index}`}
                        >
                          <span>
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeSelectedAttachment(
                                index
                              )
                            }
                          >
                            Remove
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

              {existingAttachments.length >
                0 && (
                <>
                  <small>
                    Attached files
                  </small>

                  <ul className="attachment-list">
                    {existingAttachments.map(
                      (
                        attachment
                      ) => (
                        <li
                          key={
                            attachment.id
                          }
                        >
                          <a
                            href={
                              attachment.fileUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {
                              attachment.fileName
                            }
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              deleteExistingAttachment(
                                attachment.id
                              )
                            }
                          >
                            Remove
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

              {uploadingAttachments && (
                <small>
                  Uploading files...
                </small>
              )}
            </section>

            <div className="editor-actions">

              <button
                className="secondary-action"
                type="submit"
                name="action"
                value="draft"
                disabled={
                  saving ||
                  uploadingAttachments
                }
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
                disabled={
                  saving ||
                  uploadingAttachments
                }
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