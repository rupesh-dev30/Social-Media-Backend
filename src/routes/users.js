const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
  searchUsers,
  getProfileWithStats,
  updateProfile,
} = require("../controllers/users");

const router = express.Router();

/**
 * User-related routes
 * TODO: Implement user routes when follow functionality is added
 */

router
  .post("/follow/:userId",authenticateToken,follow)
  .delete("/unfollow/:userId",authenticateToken,unfollow)
  .get("/following/me",authenticateToken,getMyFollowing)
  .get("/followers/me",authenticateToken,getMyFollowers)
  .get("/stats/:userId",getFollowStats)
  .get("/search", searchUsers)
  .get("/profile/:userId", getProfileWithStats)
  .put("/profile", authenticateToken, updateProfile)

module.exports = router;
