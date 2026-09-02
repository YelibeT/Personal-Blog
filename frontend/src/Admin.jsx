import { useEffect, useState } from "react";
import { apiFetch } from "./services/api";

function AdminPage({
  onBack,
  onNewPost,
  onDrafts,
  darkMode,
  onToggleTheme
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, profile, settings
  const [profileData, setProfileData] = useState({
    siteName: "Biniyam Abebe",
    siteDescription: "Independent Writer & Med-Student",
    introText: "I'm Biniyam,",
    aboutText: "Your about section goes here.",
    email: "contact@example.com",
    newsletter: {
      description: "Get my latest writing delivered to your inbox.",
      subscribers: 248
    },
    socialLinks: {
      twitter: "",
      github: "",
      linkedin: ""
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

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const publishedPosts = posts.filter((post) => post.published);
  const drafts = posts.filter((post) => !post.published);

  return (
    <div className={darkMode ? "site dark" : "site"}>
      <header className="topbar admin-topbar">
        <button
          className="wordmark admin-back"
          onClick={onBack}
          aria-label="Biniyam Abebe home"
        >
          <span>BA</span> Biniyam Abebe
        </button>

        <nav className="admin-nav">
          <button 
            className={activeTab === "dashboard" ? "admin-nav-active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button 
            className={activeTab === "profile" ? "admin-nav-active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button 
            className={activeTab === "settings" ? "admin-nav-active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>

          <button onClick={onDrafts}>
            Drafts
          </button>
        </nav>

        <div className="admin-label">
          <span className="status-dot" /> Admin workspace
        </div>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
        >
          <span>{darkMode ? "☼" : "◐"}</span>
        </button>
      </header>

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

                        <span>
                          {post.published
                            ? "Published"
                            : "Draft"}
                        </span>
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

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="admin-panel-full">
            <div className="admin-heading">
              <div>
                <p className="eyebrow">Manage Your Profile</p>
                <h1>Profile Settings</h1>
                <p className="admin-subtitle">
                  Update your personal information and how you appear across the site.
                </p>
              </div>
            </div>

            <div className="profile-form">
              <div className="form-section">
                <h2>Personal Information</h2>
                
                <div className="form-group">
                  <label>Site Name / Display Name</label>
                  <input
                    type="text"
                    value={profileData.siteName}
                    onChange={(e) => handleProfileChange("siteName", e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label>Site Description / Tagline</label>
                  <input
                    type="text"
                    value={profileData.siteDescription}
                    onChange={(e) => handleProfileChange("siteDescription", e.target.value)}
                    placeholder="e.g., Independent Writer & Med-Student"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Bio / About Text</label>
                  <textarea
                    value={profileData.aboutText}
                    onChange={(e) => handleProfileChange("aboutText", e.target.value)}
                    placeholder="Tell visitors about yourself..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Social Links</h2>
                
                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    type="text"
                    value={profileData.socialLinks.twitter}
                    onChange={(e) => handleNestedChange("socialLinks", "twitter", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub</label>
                  <input
                    type="text"
                    value={profileData.socialLinks.github}
                    onChange={(e) => handleNestedChange("socialLinks", "github", e.target.value)}
                    placeholder="https://github.com/yourprofile"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="text"
                    value={profileData.socialLinks.linkedin}
                    onChange={(e) => handleNestedChange("socialLinks", "linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="primary-action" 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
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

      <footer className="admin-footer">
        <span>© 2024 {profileData.siteName}</span>

        <span>
          Admin workspace <i>✳</i>
        </span>

        <button
          className="footer-back"
          onClick={onBack}
        >
          ← Back to site
        </button>
      </footer>
    </div>
  );
}

export default AdminPage;