
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "../App.css"

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
            <label htmlFor="display-name">Display name</label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={100}
              placeholder="Enter your display name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Write something about yourself..."
            />
            <small>{bio.length}/500 characters</small>
          </div>
        </section>

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
      </form>
    </div>
  );
}

export default ProfilePage;
