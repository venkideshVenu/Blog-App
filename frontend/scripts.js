const baseUrl = "http://localhost:3000";

function checkAuth() {
  console.log("Checking authentication...");
  if (!localStorage.getItem("token")) {
    showToast("Please Sign in to Continue");
    setTimeout(() => {
      window.location.href = "/signin";
    }, 1000);
    return false;
  }
  return true;
}

if (
  window.location.pathname !== "/signin" &&
  window.location.pathname !== "/signup"
) {
  checkAuth();
}

// Add sign out function
function signOut() {
  localStorage.removeItem("token");
  showToast("Signed out successfully");
  setTimeout(() => {
    window.location.href = "/signin";
  }, 1000);
}

async function signUp() {
  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!name || !username || !password) {
    showToast("All Fields must be present");
    return;
  }

  try {
    const response = await axios.post(baseUrl + "/signup", {
      name: name,
      username: username,
      password: password,
    });

    showToast(response.data.message);
    setTimeout(() => {
      window.location.href = "/signin";
    }, 1500);
  } catch (error) {
    console.error("Error during signup:", error);
    showToast(
      error.response?.data?.message || "Failed to sign up. Please try again."
    );
  }
}

async function signIn() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showToast("All Fields must be present");
    return;
  }

  try {
    const response = await axios.post(baseUrl + "/signin", {
      username: username,
      password: password,
    });

    localStorage.setItem("token", response.data.token);

    showToast(response.data.message);
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    console.error("Error during signin:", error);
    showToast(
      error.response?.data?.message || "Failed to sign in. Please try again."
    );
  }
}

async function fetchBlogs() {
  if (!checkAuth()) return;

  try {
    const response = await axios.get(baseUrl + "/allblogs", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    const blogs = response.data.blogs;
    const user = response.data.user;

    const blogList = document.getElementById("blogContainer");
    blogList.innerHTML = "";

    blogs.forEach((blog) => {

      const blogItem = document.createElement("div");
      blogItem.className = "blog-card";
      blogItem.onclick = () => {
        // Move the logging inside the click handler
        const blogId = blog._id || blog.id;
        console.log("Clicking blog with ID:", blogId);
        console.log("Full blog object:", blog);
        window.location.href = `/blog/${blogId}`;
      };
      blogItem.innerHTML = `
        <h2>${blog.title}</h2>
        <p class="blog-excerpt">${blog.content.substring(0, 100)}...</p>
        <div class="blog-meta">
          <span class="author">By ${user.username}</span>
          <span class="date">${new Date(
            blog.createdAt
          ).toLocaleDateString()}</span>
        </div>
      `;
      blogList.appendChild(blogItem);
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    showToast("Failed to load blogs. Please try again.");
  }
}

async function createBlog(event) {
  event.preventDefault();
  if (!checkAuth()) return;

  const title = document.getElementById("blogTitle").value;
  const content = document.getElementById("blogContent").value;

  if (!title || !content) {
    showToast("Title and Content are required");
    return;
  }

  try {
    const response = await axios.post(
      baseUrl + "/createBlog",
      {
        title: title,
        content: content,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    console.log(response);
    showToast(response.data.message);

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    console.error("Error creating blog:", error);
    showToast("Failed to create blog. Please try again.");
  }
}

function getBlogIdFromUrl() {
  const path = window.location.pathname;
  console.log("Analyzing path:", path);
  if (path.startsWith("/blog/")) {
    const id = path.split("/").pop();
    console.log("Extracted blog ID:", id);
    return id;
  }
  console.log("Not a blog detail URL");
  return null;
}

async function fetchBlogDetail(blogId) {
  if (!checkAuth()) return;

  if (!blogId || blogId === "undefined") {
    console.error("Invalid blog ID:", blogId);
    showToast("Invalid blog ID");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
    return;
  }

  try {
    const response = await axios.get(`${baseUrl}/blogDetail/${blogId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    const blog = response.data.blog;
    const user = response.data.user;

    // Update the DOM with blog details
    document.querySelector(".blog-title").textContent = blog.title;
    document.querySelector(".author").textContent = `By ${user.username}`;
    document.querySelector(".date").textContent = new Date(
      blog.createdAt
    ).toLocaleDateString();
    document.querySelector(".blog-content").innerHTML = blog.content;
  } catch (error) {
    console.error("Error fetching blog details:", error);
    showToast("Failed to load blog. Please try again.");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// Add this at the end of the file
document.addEventListener("DOMContentLoaded", function () {
  console.log("Current path:", window.location.pathname);

  // Check if we're on the main blogs page
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/allBlogs"
  ) {
    console.log("Loading all blogs");
    fetchBlogs();
  }

  // Check if we're on a blog detail page
  const blogId = getBlogIdFromUrl();
  if (blogId) {
    console.log("Loading blog detail for ID:", blogId);
    fetchBlogDetail(blogId);
  }
});
