const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 * TODO: Implement this model for the like functionality
 */

const addLike = async (userId, postId) => {
  const result = await query(
    `INSERT INTO likes (user_id, post_id, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

const removeLike = async (userId, postId) => {
  await query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
};

const fetchPostLikes = async (postId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM likes l
     JOIN users u ON l.user_id = u.id
     WHERE l.post_id = $1`,
    [postId]
  );
  return result.rows;
};

const fetchUserLikedPosts = async (userId) => {
  const result = await query(
    `SELECT p.*
     FROM likes l
     JOIN posts p ON l.post_id = p.id
     WHERE l.user_id = $1`,
    [userId]
  );
  return result.rows;
};

const hasUserLikedPost = async (userId, postId) => {
  const result = await query(
    `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

const getLikeCount = async (postId) => {
  const result = await query(
    'SELECT COUNT(*) AS count FROM likes WHERE post_id = $1',
    [postId]
  );
  return parseInt(result.rows[0].count, 10);
};


const checkLikedByMe = async (userId, postId) => {
  const result = await query(
    'SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2 LIMIT 1',
    [userId, postId]
  );
  return result.rowCount > 0;
};


module.exports = {
	addLike,
  removeLike,
  fetchPostLikes,
  fetchUserLikedPosts,
  hasUserLikedPost,
	checkLikedByMe,
	getLikeCount
};
