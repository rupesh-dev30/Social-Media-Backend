const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
} = require("../models/follow");
const { getUserProfile, findUsersByName, updateUserProfile } = require("../models/user");
const logger = require("../utils/logger");

const follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (followerId == followingId) {
      return res.status(400).json({ error: "Self Follow Not Allowed" });
    }

    await followUser(followerId, followingId);
    res.json({ message: "Followed Successfull" });
  } catch (error) {
    logger.critical("ERROR IN FOLLOW: ", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    await unfollowUser(followerId, followingId);
    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    logger.critical("ERROR IN UNFOLLOW: ", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const getMyFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await getFollowing(userId);
    res.json({ following });
  } catch (error) {
    logger.critical("ERROR IN GET MY FOLLOWING: ", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const getMyFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await getFollowers(userId);
    res.json({ followers });
  } catch (error) {
    logger.critical("ERROR IN GET MY FOLLOWER", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const getFollowStats = async (req, res) => {
  try {
    const id = req.params.userId;
    const counts = await getFollowCounts(id);
    res.json({ counts });
  } catch (error) {
    logger.critical("ERROR IN FOLOW COUNT", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await findUsersByName(name, limit, offset);

    res.json({
      users,
      pagination: {
        page,
        limit,
        hasMore: users.length === limit,
      },
    });
  } catch (error) {
    logger.critical("ERROR IN USER SEARCH", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const getProfileWithStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await getUserProfile(parseInt(userId));

    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ profile });
  } catch (error) {
    logger.critical("ERROR IN GET USER PROFILE", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, password } = req.body;

    const updated = await updateUserProfile(userId, { full_name, password });

    if (!updated) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (error) {
    logger.critical("ERROR IN UPDATE PROFILE", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
  searchUsers,
  getProfileWithStats,
  updateProfile,
};
