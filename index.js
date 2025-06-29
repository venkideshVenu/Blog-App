const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const jwt = require("jsonwebtoken");
const { create } = require("domain");

const app = express();
app.use(express.json());

app.use(cors());

const filesPath = "F:/MITS Elevate/day7/blog/files";
const frontEndPath = "F:/MITS Elevate/day7/blog/frontend";

app.use(express.static(frontEndPath));

const secretId = "secretId";

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
    const user = jwt.verify(token, secretId);
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

// function to find user from token
function getUser(token) {
  try {
    const u = jwt.verify(token, secretId);
    const username = u.username;
    const users = getUserFromFiles();
    return users.find((us) => us.username === username);
  } catch (err) {
    console.error("Error verifying token:", err);
    return null;
  }
}

// read users from users.json
function getUserFromFiles() {
  const data = fs.readFileSync(filesPath + "/users.json", "utf8");

  let fileUsers = [];
  try {
    if (data) {
      const parsed = JSON.parse(data);
      fileUsers = parsed.users || [];
      return fileUsers;
    }
  } catch (parseErr) {
    console.error("Error parsing users.json", parseErr);
    return [];
  }
}

// save users to users.json
function saveUserFile(fileUsers) {
  try {
    fs.writeFileSync(
      filesPath + "/users.json",
      JSON.stringify({ users: fileUsers }, null, 2)
    );
    return true;
  } catch (err) {
    console.error("Error writing to file:", err);
    return false;
  }
}

// read blogs from blogs.json
function getBlogFromFiles() {
  try {
    const data = fs.readFileSync(filesPath + "/blogs.json", "utf8");
    if (!data) return [];

    const parsed = JSON.parse(data);
    return parsed.blogs || [];
  } catch (parseErr) {
    console.error("Error in getBlogFromFiles:", parseErr);
    return [];
  }
}

// save blogs to blogs.json
function saveBlogFile(fileBlogs) {
  try {
    fs.writeFileSync(
      filesPath + "/blogs.json",
      JSON.stringify({ blogs: fileBlogs }, null, 2)
    );
    return true;
  } catch (err) {
    console.error("Error writing to blogs file:", err);
    return false;
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
app.post("/signup", (req, res) => {
  console.log("post signUp");
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  if (!name || !username || !password) {
    res.send({
      status: 404,
      message: "All fileds must be present",
    });
  }

  const users = getUserFromFiles();

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.send({
      message: "User Already Exists, Try to log in with other details",
    });
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    password: password,
  };

  users.push(user);

  const status = saveUserFile(users);

  if (status) {
    res.send({
      status: 200,
      message: "User created successfully",
    });
  } else {
    res.status(500).send("Internal Server Error");
  }
});

// Sign in
app.post("/signin", (req, res) => {
  console.log("post signin");

  const username = req.body.username;
  const password = req.body.password;

  const users = getUserFromFiles();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    res.send({
      message: "User Not found ",
    });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretId);

  res.send({
    status: 200,
    token: token,
    message: "Successfully Signed In",
  });
});

// get all blogs
app.get("/allblogs", auth, (req, res) => {
  console.log("get allblogs");

  const token = req.headers.token;

  const user = getUser(token);

  if (!user) {
    res.send({
      status: 401,
      message: "Unauthorized access User not Found",
    });
  }

  const blogs = getBlogFromFiles();

  res.send({
    status: 200,
    message: "Blogs retreived successfully",
    user: user,
    blogs: blogs,
  });
});

// create blog
app.post("/createBlog", (req, res) => {
  console.log("post createBlog");

  const { title, content } = req.body;
  const token = req.headers.token;

  if (!token) {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized access",
    });
  }

  const user = getUser(token);

  if (!user) {
    return res.status(401).send({
      status: 401,
      message: "User not found",
    });
  }

  if (!title || !content) {
    return res.status(400).send({
      status: 400,
      message: "Empty title or content",
    });
  }

  const blogs = getBlogFromFiles();

  const blog = {
    id: uuidv4(),
    title: title,
    content: content,
    userId: user.id,
    createdAt: new Date().toISOString(),
  };

  blogs.push(blog);

  saveBlogFile(blogs);

  res.send({
    status: 201,
    message: "Successfully created blog",
    blog: blog,
  });
});

app.get("/blogDetail/:id", (req, res) => {
  console.log("get Detail/id");

  const blogId = req.params.id;
  const token = req.headers.token;

  if (!token) {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized access",
    });
  }

  const currentUser = getUser(token);
  if (!currentUser) {
    return res.status(401).send({
      status: 401,
      message: "User not found",
    });
  }

  const blogs = getBlogFromFiles();
  const blog = blogs.find((b) => b.id === blogId);

  if (!blog) {
    return res.status(404).send({
      status: 404,
      message: "Blog not found",
    });
  }

  // Get the author of the blog
  const users = getUserFromFiles();
  const user = users.find((u) => u.id === blog.userId);

  res.send({
    status: 200,
    message: "Blog Retrieved Successfully",
    blog: blog,
    user: user,
  });
});

app.listen(3000);
