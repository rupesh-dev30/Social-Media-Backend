const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { likePost, unlikePost, getPostLikes, getUserLikes } = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 * TODO: Implement like routes when like functionality is added
 */

router.post("/:postId", authenticateToken, likePost);
router.delete("/:postId", authenticateToken, unlikePost);
router.get("/:postId", getPostLikes);
router.get("/user/:userId", getUserLikes);

module.exports = router;
