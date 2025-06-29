const { getCommentsByPost } = require("../models/comment.js");
const { getLikeCount, checkLikedByMe } = require("../models/like.js");
const {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePostModal,
} = require("../models/post.js");
const logger = require("../utils/logger");

/**
 * Create a new post
 */
const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled, scheduled_at } =
      req.validatedData;
    const userId = req.user.id;

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled,
      scheduled_at: scheduled_at || null,
    });

    logger.verbose(`User ${userId} created post ${post.id}`);

    res.status(201).json({
      message: scheduled_at
        ? "Post scheduled successfully"
        : "Post created successfully",
      post,
    });
  } catch (error) {
    logger.critical("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single post by ID
 */
const getById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    logger.critical("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts by a specific user
 */
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get user posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user's posts
 */
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get my posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a post
 */
const remove = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const success = await deletePost(postId, userId);

    if (!success) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    logger.verbose(`User ${userId} deleted post ${postId}`);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    logger.critical("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement getFeed controller for content feed functionality
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await getFeedPosts(userId);
    const enhancedPosts = await Promise.all(
      posts.map(async (post) => {
        const [likes, comments, likedByMe] = await Promise.all([
          getLikeCount(post.id),
          getCommentsByPost(post.id),
          checkLikedByMe(userId, post.id),
        ]);
        return { ...post, likes, commentsCount: comments.length, likedByMe };
      })
    );
    res.json({ posts: enhancedPosts });
  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.user.id;
    const { content, media_url, comments_enabled } = req.body;

    const updatedPost = await updatePostModal(
      postId,
      userId,
      media_url,
      content,
      comments_enabled
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    logger.critical("ERROR IN UPDATE POST", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const search = async (req, res) => {
  try {
    const queryText = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const results = await searchPosts(queryText, limit, offset);

    res.json({
      results,
      pagination: {
        page,
        limit,
        hasMore: results.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Search posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  updatePost,
  search
};
