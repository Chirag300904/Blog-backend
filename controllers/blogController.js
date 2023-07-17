const mongoose = require("mongoose");
const blogModel = require("../models/blog.js");
const userModel = require("../models/user.js");

// Get all blog
exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");

    if (!blogs) {
      return res.status(200).send({
        message: "No blog found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "All blog found",
      success: true,
      blogCount: blogs.length,
      blogs: blogs,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error in getting blog", success: false });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(200).send({
        message: "No blog found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Blog found",
      success: true,
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error in getting single blog", success: false });
  }
};

// Create new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;

    // Validation
    if (!title || !image || !description || !user) {
      return res
        .status(400)
        .send({ message: "Please enter all required fields", success: false });
    }

    const existingUser = await userModel.findById(user);

    // Validating user
    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const newBlog = await blogModel({
      title: title,
      description: description,
      image: image,
      user: user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();

    await newBlog.save();

    return res.status(201).send({
      message: "Blog created",
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Error in creating blog", success: false });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: " Blog updated",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error in updating blog", success: false });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();

    return res.status(200).send({
      success: true,
      message: " Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error in deleting blog", success: false });
  }
};

// Get user blogs
exports.getUserBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userBlogs = await userModel.findById(id).populate("blogs");

    if (!userBlogs) {
      return res
        .status(404)
        .send({ message: "User don't have any blog", success: false });
    }

    return res.status(200).send({
      message: "User blogs found",
      success: true,
      userBlogs: userBlogs.blogs,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error in getting user blogs", success: false });
  }
};
