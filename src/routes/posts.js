const express = require("express");
const { validateRequest, createPostSchema } = require("../utils/validation");
const {
	create,
	getById,
	getUserPosts,
	getMyPosts,
	remove,
	getFeed,
	updatePost,
	search,
} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * Posts routes
 */

router.post("/", authenticateToken, validateRequest(createPostSchema), create);
router.get("/my", authenticateToken, getMyPosts);
router.get("/feed",authenticateToken,getFeed);
router.get("/:postId", optionalAuth, getById);
router.get("/user/:userId", optionalAuth, getUserPosts);
router.delete("/:postId", authenticateToken, remove);
router.put("/:postId", authenticateToken, updatePost);
router.get("/search", optionalAuth, search);


module.exports = router;
