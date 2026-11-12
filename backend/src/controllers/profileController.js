
import prisma from "../lib/prisma.js";

const publicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  profileImage: user.profileImage,
  createdAt: user.createdAt
});

const publicProfile = (user) => ({
  displayName: user.displayName,
  bio: user.bio,
  profileImage: user.profileImage
});

// GET /api/profile/public
export const getPublicProfile = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        role: "ADMIN"
      },
      select: {
        displayName: true,
        bio: true,
        profileImage: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: "Public profile not found."
      });
    }

    return res.status(200).json(publicProfile(user));
  } catch (error) {
    console.error("Failed to fetch public profile:", error);

    return res.status(500).json({
      error: "Failed to fetch public profile."
    });
  }
};

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId
      }
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(404).json({
        error: "Admin profile not found."
      });
    }

    return res.status(200).json(publicUser(user));

  } catch (error) {
    console.error("Failed to fetch profile:", error);

    return res.status(500).json({
      error: "Failed to fetch profile."
    });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { displayName, bio, profileImage } = req.body;

    if (
      displayName === undefined &&
      bio === undefined &&
      profileImage === undefined
    ) {
      return res.status(400).json({
        error: "At least one profile field is required."
      });
    }

    if (
      (displayName !== undefined && typeof displayName !== "string") ||
      (bio !== undefined && typeof bio !== "string") ||
      (profileImage !== undefined &&
        profileImage !== null &&
        typeof profileImage !== "string")
    ) {
      return res.status(400).json({
        error: "Invalid profile field values."
      });
    }

    if (displayName !== undefined && displayName.trim().length > 100) {
      return res.status(400).json({
        error: "Display name cannot exceed 100 characters."
      });
    }

    if (bio !== undefined && bio.length > 500) {
      return res.status(400).json({
        error: "Bio cannot exceed 500 characters."
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId
      }
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(404).json({
        error: "Admin profile not found."
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId
      },
      data: {
        ...(displayName !== undefined && {
          displayName: displayName.trim()
        }),
        ...(bio !== undefined && {
          bio: bio.trim()
        }),
        ...(profileImage !== undefined && {
          profileImage
        })
      }
    });

    return res.status(200).json(publicUser(updatedUser));

  } catch (error) {
    console.error("Failed to update profile:", error);

    return res.status(500).json({
      error: "Failed to update profile."
    });
  }
};
