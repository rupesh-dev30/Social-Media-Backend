const { query } = require("../utils/database");

/**
 * Comment model for managing post comments
 * TODO: Implement this model for the comment functionality
 */

// TODO: Implement createComment function
const createComment = async (postId, userId, content) => {
  const result = await query(
    `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [postId, userId, content]
  );
  return result.rows[0];
};
// TODO: Implement updateComment function
const updateComment = async (commentId, userId, content) => {
  const result = await query(
    `UPDATE comments
     SET content = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [content, commentId, userId]
  );
  return result.rows[0];
};
// TODO: Implement deleteComment function
const deleteComment = async (commentId, userId) => {
  const result = await query(
    `DELETE FROM comments
     WHERE id = $1 AND user_id = $2`,
    [commentId, userId]
  );
  return result.rowCount > 0;
};
// TODO: Implement getPostComments function
const getPostComments = async (postId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT c.*, u.username FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC
     LIMIT $2 OFFSET $3`,
    [postId, limit, offset]
  );
  return result.rows;
};
// TODO: Implement getCommentById function
const getCommentById = async (commentId) => {
  const result = await query(
    `SELECT c.*, u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [commentId]
  );

  return result.rows[0] || null;
};

const getCommentsByPost = async (postId) => {
  const result = await query(
    `SELECT c.*, u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return result.rows;
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
  getCommentById,
  getCommentsByPost,
};
