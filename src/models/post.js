const { query } = require("../utils/database");

/**
 * Post model for database operations
 */

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */

const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
  scheduled_at = null,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, scheduled_at, is_published, created_at, is_deleted)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)
     RETURNING id, user_id, content, media_url, comments_enabled, scheduled_at, is_published, created_at`,
    [
      user_id,
      content,
      media_url,
      comments_enabled,
      scheduled_at,
      scheduled_at ? false : true,
    ]
  );
  return result.rows[0];
};

/**
 * Get post by ID
 * @param {number} postId - Post ID
 * @returns {Promise<Object|null>} Post object or null
 */
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.is_deleted = false AND (p.scheduled_at IS NULL OR p.scheduled_at <= NOW()) AND p.is_published = true`,
    [postId]
  );

  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = true WHERE id = $1 AND user_id = $2",
    [postId, userId]
  );

  return result.rowCount > 0;
};

const getFeedPosts = async (userId, limit = 10, offset = 0) => {
  const posts = await query(
    `SELECT p.*, u.username, u.full_name 
     FROM posts p 
     JOIN users u ON p.user_id = u.id 
     WHERE (p.user_id = $1 OR p.user_id IN (
       SELECT following_id FROM follows WHERE follower_id = $1
     ))
     AND p.is_deleted = false
     AND (p.scheduled_at IS NULL OR p.scheduled_at <= NOW())
     AND p.is_published = true
     ORDER BY p.created_at DESC 
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return posts.rows;
};
// This should include pagination and ordering by creation date

const updatePostModal = async (
  postId,
  userId,
  media_url,
  content,
  comments_enabled
) => {
  console.log("Updating post:", {
    postId,
    userId,
    media_url,
    content,
    comments_enabled,
  });

  const result = await query(
    `UPDATE posts
     SET content = $1, media_url = $2, comments_enabled = $3, updated_at = NOW()
     WHERE id = $4 AND user_id = $5 AND is_deleted = false
     RETURNING id, user_id, content, media_url, comments_enabled, updated_at`,
    [content, media_url, comments_enabled, postId, userId]
  );

  return result.rows[0]; // will be undefined if no match
};

const searchPosts = async (queryText, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.is_deleted = false
       AND p.is_published = true
       AND (p.scheduled_at IS NULL OR p.scheduled_at <= NOW())
       AND (p.content ILIKE $1)
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${queryText}%`, limit, offset]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePostModal,
  searchPosts
};
