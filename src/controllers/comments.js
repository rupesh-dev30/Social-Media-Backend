// TODO: Implement comments controller
// This controller should handle:
// - Creating comments on posts
// - Editing user's own comments
// - Deleting user's own comments
// - Getting comments for a post
// - Pagination for comments

const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} = require("../models/comment");
const logger = require("../utils/logger");

const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    const postId = req.params.postId;

    const comment = await createComment(postId, userId, content);
    res.status(201).json({ comment });
  } catch (error) {
    logger.critical("ERROR IN CREATE COMMENT:", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const update = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    const { content } = req.body;

    const updated = await updateComment(commentId, userId, content);
    if (!updated)
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });

    res.json({ message: "Comment updated", comment: updated });
  } catch (error) {
    logger.critical("ERROR IN UPDATE COMMENT", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const remove = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    const deleted = await deleteComment(commentId, userId);

    if (!deleted)
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    logger.critical("ERROR IN REMOVE COMMENT", err);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const comments = await getPostComments(postId, limit, offset);
    res.json({
      comments,
      pagination: { page, limit, hasMore: comments.length === limit },
    });
  } catch (err) {
    logger.critical("ERROR IN GET COMMENT", err);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  create,
  update,
  remove,
  getComments,
};
