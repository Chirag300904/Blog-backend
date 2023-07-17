const express = require("express");
const cors = require("cors");
const morgon = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();

// Env Config
dotenv.config();

// Routes import
const userRoutes = require("./routes/userRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");

// Mongoose connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgon("dev"));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// Listening server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server listening on port ${PORT} in ${process.env.DEV_MODE} mode`
  );
});
