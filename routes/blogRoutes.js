const express = require("express");
const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getUserBlog,
} = require("../controllers/blogController");

const router = express.Router();

// Routes
// Get all blogs
router.get("/all-blog", getAllBlog);

// Get single blog
router.get("/get-blog/:id", getBlogById);

// Get user blogs
router.get("/user-blog/:id", getUserBlog);

// Create new blog
router.post("/create-blog", createBlog);

// Update blog
router.put("/update-blog/:id", updateBlog);

// Delete blog
router.delete("/delete-blog/:id", deleteBlog);

module.exports = router;
