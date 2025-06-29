require("dotenv").config();
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { UserModel, BlogModel } = require("./db");

mongoose.connect(process.env.MONGO_CONNECTION_URL);

const app = express();
app.use(express.json());

app.use(cors());

const frontEndPath = "f:/100x Projects/blog/frontend";

app.use(express.static(frontEndPath));

function auth(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    console.error("Unauthorized access: Token not found");
    return res.status(401).send({
      status: 401,
      message: "Unauthorized access Token not Found",
    });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).send({
      status: 401,
      message: "Unauthorized access User not Found",
    });
  }
}

// get all htmls
app.get("/signup", (req, res) => {
  res.sendFile(frontEndPath + "/signUp.html");
});

app.get("/signin", (req, res) => {
  res.sendFile(frontEndPath + "/signIn.html");
});

app.get("/", (req, res) => {
  res.sendFile(frontEndPath + "/allBlogs.html");
});

app.get("/createBlog", (req, res) => {
  res.sendFile(frontEndPath + "/createBlog.html");
});

app.get("/blog/:id", (req, res) => {
  res.sendFile(frontEndPath + "/blog.html");
});

// Sign up
app.post("/signup", async (req, res) => {
  console.log("post signUp");
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).send({
      status: 400,
      message: "All fields must be present",
    });
  }

  try {
    const existingUser = await UserModel.findOne({
      username: username,
    });

    if (existingUser) {
      return res.status(409).send({
        status: 409,
        message: "User Already Exists, Try to log in with other details",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name: name,
      username: username,
      password: hashedPassword,
    };

    const createdUser = await UserModel.create(user);
    res.status(201).send({
      status: 201,
      message: "User Created Successfully",
      user: {
        id: createdUser._id,
        name: createdUser.name,
        username: createdUser.username,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
});

// Sign in
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username: username });
  if (!username || !password) {
    return res.status(400).send({
      status: 400,
      message: "Username and password are required",
    });
  }

  try {
    const user = await UserModel.findOne({
      username: username,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({
        status: 401,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    res.send({
      status: 200,
      token: token,
      message: "Successfully Signed In",
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
});

// get all blogs
app.get("/allblogs", auth, async (req, res) => {
  console.log("get allblogs");

  try {
    const user = req.user;
    const blogs = await BlogModel.find();

    res.send({
      status: 200,
      message: "Blogs retrieved successfully",
      user: user,
      blogs: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send({
      status: 500,
      message: "Error fetching blogs",
    });
  }
});

// create blog
app.post("/createBlog", auth, async (req, res) => {
  console.log("post createBlog");
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send({
      status: 400,
      message: "Empty title or content",
    });
  }

  const blog = await BlogModel.create({
    title: title,
    content: content,
    userId: req.user.id,
  });

  res.send({
    status: 201,
    message: "Successfully created blog",
    blog: blog,
  });
});

app.get("/blogDetail/:id", auth, async (req, res) => {
  console.log("get Detail/id");

  const blogId = req.params.id;
  const blog = await BlogModel.findById(blogId);

  if (!blog) {
    return res.status(404).send({
      status: 404,
      message: "Blog not found",
    });
  }

  const user = await UserModel.findById(blog.userId);
  res.send({
    status: 200,
    message: "Blog Retrieved Successfully",
    blog: blog,
    user: user,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend served from: ${frontEndPath}`);
});
