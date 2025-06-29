// TODO: Implement likes controller
// This controller should handle:
// - Liking posts
// - Unliking posts
// - Getting likes for a post
// - Getting posts liked by a user

const {
  addLike,
  removeLike,
  fetchPostLikes,
  fetchUserLikedPosts,
} = require("../models/like");
const logger = require("../utils/logger");

const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await addLike(userId, postId);
    res.json({ message: "POST LIKED SUCCESSFULLY" });
  } catch (error) {
    logger.critical("ERROR IN LIKE", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await removeLike(userId, postId);
    res.json({ message: "POST UNLIKED SUCCESSFULLY" });
  } catch (error) {
    logger.critical("ERROR IN UNLIKED POST: ", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const likes = await fetchPostLikes(postId);
    res.json({ likes });
  } catch (error) {
    logger.critical("ERROR IN GET POST LIKES", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const { userId } = req.params;

    const likedPosts = await fetchUserLikedPosts(userId);
    res.json({ likedPosts });
  } catch (error) {
    logger.critical("ERROR IN GET USERS LIKE", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
};
