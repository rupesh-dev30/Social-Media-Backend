const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const { updateComment } = require("../models/comment");
const {
  create,
  update,
  remove,
  getComments,
} = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 * TODO: Implement comment routes when comment functionality is added
 */

router.post("/post/:postId", authenticateToken, create);
router.put("/:commentId", authenticateToken, update);
router.delete("/:commentId", authenticateToken, remove);
router.get("/post/:postId", getComments);

module.exports = router;
