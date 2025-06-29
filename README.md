# Blog Application

A full-stack blog platform built with Node.js and Express.js, featuring user authentication, blog creation, and a responsive frontend.

## 🚀 Features

- **User Authentication**: Sign up and sign in functionality with JWT tokens
- **Blog Management**: Create, view, and browse blogs
- **Responsive Design**: Modern UI with CSS styling
- **RESTful API**: Well-structured backend API endpoints
- **File-based Storage**: JSON files for data persistence
- **Protected Routes**: Authentication middleware for secure access

## 🛠️ Tech Stack

**Backend:**

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- UUID for unique identifiers
- CORS for cross-origin requests

**Frontend:**

- HTML5
- CSS3
- Vanilla JavaScript
- Axios for HTTP requests

**Storage:**

- JSON files (users.json, blogs.json)

## 📁 Project Structure

```
blog/
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── files/
│   ├── users.json        # User data storage
│   └── blogs.json        # Blog data storage
└── frontend/
    ├── allBlogs.html     # Main blogs listing page
    ├── blog.html         # Individual blog view
    ├── createBlog.html   # Blog creation form
    ├── signIn.html       # User sign in page
    ├── signUp.html       # User registration page
    ├── scripts.js        # Client-side JavaScript
    ├── styles.css        # Authentication page styles
    └── blogStyles.css    # Blog-specific styles
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 📖 API Endpoints

### Authentication

| Method | Endpoint  | Description           | Authentication |
| ------ | --------- | --------------------- | -------------- |
| POST   | `/signup` | Register a new user   | No             |
| POST   | `/signin` | Sign in existing user | No             |

### Blog Management

| Method | Endpoint          | Description               | Authentication |
| ------ | ----------------- | ------------------------- | -------------- |
| GET    | `/allblogs`       | Get all blogs             | Required       |
| POST   | `/createBlog`     | Create a new blog         | Required       |
| GET    | `/blogDetail/:id` | Get specific blog details | Required       |

### Pages

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/`           | Main blogs listing page   |
| GET    | `/signup`     | User registration page    |
| GET    | `/signin`     | User sign in page         |
| GET    | `/createBlog` | Blog creation page        |
| GET    | `/blog/:id`   | Individual blog view page |

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in `localStorage` on the client side
- Protected routes require a valid token in the `token` header
- Token verification is handled by the `auth` middleware

## 💾 Data Storage

### Users (`files/users.json`)

```json
{
  "users": [
    {
      "id": "unique-uuid",
      "name": "User Name",
      "username": "username",
      "password": "password"
    }
  ]
}
```

### Blogs (`files/blogs.json`)

```json
{
  "blogs": [
    {
      "id": "unique-uuid",
      "title": "Blog Title",
      "content": "Blog content...",
      "userId": "author-user-id",
      "createdAt": "ISO-timestamp"
    }
  ]
}
```

## 🎨 Features Overview

### User Management

- **Sign Up**: New users can create accounts with name, username, and password
- **Sign In**: Existing users can authenticate and receive JWT tokens
- **Sign Out**: Clear local storage and redirect to sign in

### Blog Features

- **View All Blogs**: Browse all published blogs in a responsive grid layout
- **Create Blog**: Authenticated users can create new blog posts
- **View Individual Blog**: Read full blog content with author information
- **Navigation**: Easy navigation between different sections

### UI/UX

- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User feedback for actions and errors
- **Modern Styling**: Clean, professional appearance
- **Navigation Bar**: Easy access to main functions

## 🔧 Configuration

### Environment Setup

The application currently uses hardcoded paths in `index.js`. Update these for your environment:

```javascript
const filesPath = "F:/MITS Elevate/day7/blog/files";
const frontEndPath = "F:/MITS Elevate/day7/blog/frontend";
```

### Security

- JWT secret key is currently hardcoded (`secretId = "secretId"`)
- Consider using environment variables for production deployment
- Implement password hashing for enhanced security

## 🚀 Deployment

1. Update file paths in `index.js` to use relative paths or environment variables
2. Set environment variables for production configuration
3. Consider implementing a proper database for production use
4. Add HTTPS for secure token transmission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- File paths are hardcoded and need environment-specific configuration
- Passwords are stored in plain text (should implement hashing)
- Limited error handling in some API endpoints
- No data validation on the frontend

## 🔮 Future Enhancements

- [ ] Implement password hashing
- [ ] Add blog editing and deletion features
- [ ] Implement user profiles
- [ ] Add blog categories and tags
- [ ] Implement search functionality
- [ ] Add pagination for blogs
- [ ] Migrate to a proper database (MongoDB, PostgreSQL)
- [ ] Add file upload for blog images
- [ ] Implement email verification
- [ ] Add admin panel
- [ ] Implement comment system

## 📞 Support

For support, please open an issue in the repository or contact the development team.
