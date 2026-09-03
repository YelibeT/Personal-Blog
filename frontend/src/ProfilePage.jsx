import { useEffect, useState } from "react";
import { apiFetch } from "./services/api";

function ProfilePage({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiFetch("/auth/me");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load profile");
        }

        setProfile(data);
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
        setProfileImage(data.profileImage || "");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await apiFetch("/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio, profileImage })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      setProfile(data);
      setMessage("Profile changes saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setChangingPassword(true);
    setMessage("");
    setError("");

    try {
      const response = await apiFetch("/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password changed. Please sign in again.");
      await onLogout();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <main className="admin-main"><div className="empty-admin"><strong>Loading profile...</strong></div></main>;
  }

  return (
    <main className="admin-main profile-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Your account</p>
          <h1>Profile</h1>
          <p className="admin-subtitle">Manage how you appear on the blog.</p>
        </div>
      </div>

      {(error || message) && (
        <div className={error ? "empty-admin profile-feedback error" : "empty-admin profile-feedback"}>
          <strong>{error || message}</strong>
        </div>
      )}

      <form className="profile-form" onSubmit={saveProfile}>
        <section className="form-section profile-identity">
          <h2>Public profile</h2>
          <div className="profile-picture-wrap">
            {profileImage ? (
              <img src={profileImage} alt="Current profile" className="profile-picture" />
            ) : (
              <span className="profile-picture profile-picture-placeholder">
                {(displayName || profile?.username || "A").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <label className="form-group">
            <span>Profile picture URL</span>
            <input
              type="url"
              value={profileImage}
              onChange={(event) => setProfileImage(event.target.value)}
              placeholder="https://example.com/profile.jpg"
            />
            <small>Image storage is not configured; save a hosted image URL or reference.</small>
          </label>
          <label className="form-group">
            <span>Display name</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Your name" />
          </label>
          <label className="form-group">
            <span>Bio</span>
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell readers about yourself" rows="5" />
          </label>
        </section>

        <section className="form-section">
          <h2>Account</h2>
          <dl className="profile-account-details">
            <div><dt>Email</dt><dd>{profile?.email}</dd></div>
            <div><dt>Username</dt><dd>{profile?.username}</dd></div>
          </dl>
        </section>

        <div className="form-actions">
          <button className="primary-action" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      <form className="profile-form profile-security" onSubmit={changePassword}>
        <section className="form-section">
          <h2>Security</h2>
          <label className="form-group">
            <span>Current password</span>
            <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required autoComplete="current-password" />
          </label>
          <label className="form-group">
            <span>New password</span>
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength="8" required autoComplete="new-password" />
          </label>
          <div className="form-actions">
            <button className="secondary-action" type="submit" disabled={changingPassword}>
              {changingPassword ? "Changing..." : "Change password"}
            </button>
          </div>
        </section>
      </form>

      <section className="profile-account-actions">
        <h2>Account access</h2>
        <button className="quiet-action delete-action" type="button" onClick={onLogout}>Log out</button>
      </section>
    </main>
  );
}

export default ProfilePage;