import { useEffect, useState } from "react";
import { apiFetch } from "./services/api";

function AdminPage({
  onNewPost,
  onEditPost,
  onPostDeleted,
  onDrafts,
  initialTab = "dashboard"
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab); // dashboard or settings
  const [profileData, setProfileData] = useState({
    siteName: "Biniyam Abebe",
    newsletter: {
      description: "Get my latest writing delivered to your inbox.",
      subscribers: 248
    },
    homepage: {
      heroHeading: "Heading",
      heroSubheading: "Heading",
      heroText: "I'm Biniyam,"
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await apiFetch("/admin/posts");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load posts");
        }

        setPosts(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleNestedChange = (parent, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Here you would typically send this to your backend
      // const response = await apiFetch("/admin/profile", { method: "PUT", body: JSON.stringify(profileData) });
      // For now, just save to localStorage
      localStorage.setItem("profileData", JSON.stringify(profileData));
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (post) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title || "Untitled post"}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(`/admin/posts/${post.id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts((currentPosts) =>
        currentPosts.filter((currentPost) => currentPost.id !== post.id)
      );
      onPostDeleted(post.id);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const publishedPosts = posts.filter((post) => post.published);
  const drafts = posts.filter((post) => !post.published);

  return (
    <div className="admin-page-content">
      <main className="admin-main">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <>
            <div className="admin-heading">
              <div>
                <p className="eyebrow">Good morning, {profileData.siteName.split(" ")[0]}</p>

                <h1>Content overview</h1>

                <p className="admin-subtitle">
                  Keep your corner of the internet thoughtful and up to date.
                </p>
              </div>

              <button
                className="primary-action"
                onClick={onNewPost}
              >
                ＋ New post
              </button>
            </div>

            {error && (
              <div className="empty-admin">
                <strong>{error}</strong>
              </div>
            )}

            <div className="admin-stats">
              <div>
                <span>Published posts</span>

                <strong>
                  {loading ? "..." : publishedPosts.length}
                </strong>

                <small className="neutral">
                  {publishedPosts.length === 1
                    ? "1 published post"
                    : `${publishedPosts.length} published posts`}
                </small>
              </div>

              <div>
                <span>Newsletter readers</span>

                <strong>{profileData.newsletter.subscribers}</strong>

                <small className="positive">
                  ↑ 12% this month
                </small>
              </div>

              <div>
                <span>Page views</span>

                <strong>1,842</strong>

                <small className="positive">
                  ↑ 18% this month
                </small>
              </div>

              <button
                className="admin-stat-button"
                onClick={onDrafts}
              >
                <span>Drafts</span>

                <strong>
                  {loading ? "..." : drafts.length}
                </strong>

                <small className="neutral">
                  View saved drafts
                </small>
              </button>
            </div>

            <div className="admin-content-grid">
              <section className="admin-panel posts-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Your library</p>

                    <h2>Recent writing</h2>
                  </div>

                  <button
                    className="quiet-action"
                    onClick={onDrafts}
                  >
                    View drafts ↗
                  </button>
                </div>

                {loading ? (
                  <div className="empty-admin">
                    <span>✳</span>
                    <strong>Loading your writing...</strong>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="admin-post-list">
                    {posts.slice(0, 5).map((post) => (
                      <article
                        className="admin-post-row"
                        key={post.id}
                      >
                        <div>
                          <span className="draft-category">
                            {post.published ? "Published" : "Draft"}
                          </span>

                          <h3>{post.title}</h3>

                          <p>
                            {post.excerpt ||
                              "No description yet."}
                          </p>
                        </div>

                        <div className="admin-post-row-actions">
                          <span>
                            {post.published
                              ? "Published"
                              : "Draft"}
                          </span>

                          <button
                            className="quiet-action"
                            onClick={() => onEditPost(post)}
                          >
                            Edit
                          </button>

                          <button
                            className="quiet-action delete-action"
                            onClick={() => handleDeletePost(post)}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-admin">
                    <span>✳</span>

                    <strong>
                      Your first story starts here.
                    </strong>

                    <p>
                      Write something worth coming back to.
                    </p>

                    <button
                      className="primary-action small-action"
                      onClick={onNewPost}
                    >
                      ＋ Start a draft
                    </button>
                  </div>
                )}
              </section>

              <section className="admin-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Audience</p>

                    <h2>Newsletter</h2>
                  </div>

                  <button 
                    className="quiet-action"
                    onClick={() => setActiveTab("settings")}
                  >
                    Manage ↗
                  </button>
                </div>

                <div className="audience-number">
                  <strong>{profileData.newsletter.subscribers}</strong>
                  <span>subscribers</span>
                </div>

                <div className="mini-chart">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

                <p className="chart-note">
                  Your list is growing steadily.
                </p>
              </section>
            </div>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="admin-panel-full">
            <div className="admin-heading">
              <div>
                <p className="eyebrow">Manage Settings</p>
                <h1>Site Configuration</h1>
                <p className="admin-subtitle">
                  Configure your homepage and other site settings.
                </p>
              </div>
            </div>

            <div className="profile-form">
              <div className="form-section">
                <h2>Homepage Configuration</h2>
                
                <div className="form-group">
                  <label>Hero Heading</label>
                  <input
                    type="text"
                    value={profileData.homepage.heroHeading}
                    onChange={(e) => handleNestedChange("homepage", "heroHeading", e.target.value)}
                    placeholder="Main heading"
                  />
                </div>

                <div className="form-group">
                  <label>Hero Subheading</label>
                  <input
                    type="text"
                    value={profileData.homepage.heroSubheading}
                    onChange={(e) => handleNestedChange("homepage", "heroSubheading", e.target.value)}
                    placeholder="Subheading"
                  />
                </div>

                <div className="form-group">
                  <label>Intro Text</label>
                  <textarea
                    value={profileData.homepage.heroText}
                    onChange={(e) => handleNestedChange("homepage", "heroText", e.target.value)}
                    placeholder="Introduction text..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Newsletter Configuration</h2>
                
                <div className="form-group">
                  <label>Newsletter Description</label>
                  <textarea
                    value={profileData.newsletter.description}
                    onChange={(e) => handleNestedChange("newsletter", "description", e.target.value)}
                    placeholder="Describe your newsletter..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Subscriber Count (Display Only)</label>
                  <input
                    type="number"
                    value={profileData.newsletter.subscribers}
                    onChange={(e) => handleNestedChange("newsletter", "subscribers", parseInt(e.target.value))}
                    placeholder="248"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="primary-action" 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default AdminPage;