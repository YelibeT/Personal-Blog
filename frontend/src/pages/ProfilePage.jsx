
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "../App.css"

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [editingDetails, setEditingDetails] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load the current admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetch("/profile");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load profile.");
        }

        setProfile(data);
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
        setProfileImage(data.profileImage || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Select a new profile image
  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size cannot exceed 5 MB.");
      return;
    }

    setError("");
    setMessage("");
    setProfileImageFile(file);
  };

  // Upload the selected image to Cloudinary
  const uploadProfileImage = async () => {
    if (!profileImageFile) return profileImage;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", profileImageFile);
      formData.append("purpose", "user_profile");

      const response = await apiFetch("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to upload profile image."
        );
      }

      // Accept either response field until the upload controller
      // response shape is confirmed.
      const uploadedImageUrl = data.url || data.profileImage;

      if (!uploadedImageUrl) {
        throw new Error("The upload response did not contain an image URL.");
      }

      setProfileImage(uploadedImageUrl);
      setProfileImageFile(null);

      return uploadedImageUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  // Save public profile details
  const handleSaveProfile = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const uploadedImageUrl = await uploadProfileImage();

      const response = await apiFetch("/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          bio,
          profileImage: uploadedImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setProfile(data);
      setDisplayName(data.displayName || "");
      setBio(data.bio || "");
      setProfileImage(data.profileImage || "");

      setMessage("Profile updated successfully.");
      setEditingDetails(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelDetailsEdit = () => {
    setDisplayName(profile.displayName || "");
    setBio(profile.bio || "");
    setEditingDetails(false);
    setError("");
    setMessage("");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await apiFetch("/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage(data.message || "Password changed successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p className="error-message">
          {error || "Could not load your profile."}
        </p>
      </div>
    );
  }

  const imagePreview = profileImageFile
    ? URL.createObjectURL(profileImageFile)
    : profileImage;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your public profile information.</p>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="profile-form" onSubmit={handleSaveProfile}>
        <section className="profile-section">
          <h2>Public profile</h2>
          <p>This information can be displayed to visitors of your blog.</p>

          <div className="profile-image-section">
            <div className="profile-image-preview">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                />
              ) : (
                <span>
                  {displayName?.charAt(0)?.toUpperCase() || "A"}
                </span>
              )}
            </div>

            <div className="profile-image-controls">
              <label htmlFor="profile-image">
                Profile picture
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />

              <small>Maximum file size: 5 MB.</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="display-name">Name</label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              disabled={!editingDetails}
              maxLength={100}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              disabled={!editingDetails}
              maxLength={500}
              rows={5}
              placeholder="Write something about yourself..."
            />
            <small>{bio.length}/500 characters</small>
          </div>
        </section>

        <div className="profile-actions">
          {!editingDetails ? (
            <button
              className="secondary"
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                setEditingDetails(true);
              }}
            >
              Edit name and bio
            </button>
          ) : (
            <button
              className="secondary"
              type="button"
              onClick={handleCancelDetailsEdit}
              disabled={saving || uploadingImage}
            >
              Cancel
            </button>
          )}

          {(editingDetails || profileImageFile) && (
            <button
              type="submit"
              disabled={saving || uploadingImage}
            >
              {uploadingImage
                ? "Uploading image..."
                : saving
                  ? "Saving..."
                  : "Save changes"}
            </button>
          )}
        </div>

        <section className="profile-section">
          <h2>Account information</h2>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email || ""}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={profile.username || ""}
              disabled
            />
          </div>
        </section>
      </form>

      <form className="profile-form" onSubmit={handleChangePassword}>
        <section className="profile-section">
          <h2>Change password</h2>
          <p>Verify your current password before choosing a new one.</p>

          <div className="form-group">
            <label htmlFor="current-password">Current password</label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />
            <small>At least 8 characters; maximum 72 UTF-8 bytes.</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="profile-actions">
            <button type="submit" disabled={changingPassword}>
              {changingPassword ? "Changing password..." : "Change password"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

export default ProfilePage;
