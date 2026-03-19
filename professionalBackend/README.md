# Video Streaming Platform - Backend

A robust Node.js/Express backend API for a YouTube-like video streaming platform with MongoDB database integration, cloud storage via Cloudinary, and JWT authentication.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.16.0
- **Authentication**: JWT (jsonwebtoken) + BCrypt password hashing
- **File Storage**: Cloudinary for video and image uploads
- **File Upload**: Multer
- **Other**: Cookie-parser, CORS, Dotenv

## ✨ Features

### User Management
- User registration and login
- JWT-based authentication with secure HTTP cookies
- Password hashing with bcrypt
- User profile management

### Video Features
- Upload videos to Cloudinary
- Video metadata management
- Video search and filtering
- View history tracking

### Social Features
- **Comments**: Users can comment on videos
- **Likes**: Like/unlike videos
- **Subscriptions**: Subscribe to channels
- **Playlists**: Create and manage playlists
- **Tweets**: Share short content
- **Dashboard**: Analytics and channel statistics

### Advanced Features
- Pagination support with mongoose-aggregate-paginate-v2
- CORS-enabled for frontend integration
- Request validation and error handling
- Modular architecture with separate routes, controllers, and models

## 📁 Project Structure

```
src/
├── app.js                 # Express application setup
├── index.js              # Server entry point
├── constants.js          # Application constants
├── controllers/          # Business logic
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   └── dashboard.controller.js
├── models/              # MongoDB schemas
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   └── tweet.model.js
├── routes/              # API route definitions
│   ├── user.route.js
│   ├── video.route.js
│   ├── comment.route.js
│   ├── like.route.js
│   ├── playlist.route.js
│   ├── subscription.route.js
│   ├── tweet.route.js
│   └── dashboard.route.js
├── middlewares/         # Custom middleware
│   ├── auth.middleware.js      # JWT verification
│   └── multer.middleware.js    # File upload handling
├── db/                  # Database configuration
│   └── index.js
└── utils/               # Utility functions
    ├── apiError.js
    ├── apiResponse.js
    ├── asyncHandler.js
    └── cloudinary.js
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Cloudinary account (for media storage)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd professionalBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/video-streaming
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:8000`

## 📚 API Endpoints

### Base URL: `/api/v1`

| Feature | Endpoints |
|---------|-----------|
| **Users** | `POST /users/register`, `POST /users/login`, `GET /users/profile` |
| **Videos** | `POST /videos/upload`, `GET /videos`, `GET /videos/:id`, `DELETE /videos/:id` |
| **Comments** | `POST /comments`, `GET /comments/:videoId`, `DELETE /comments/:id` |
| **Likes** | `POST /likes/toggle`, `GET /likes` |
| **Subscriptions** | `POST /subscriptions/toggle`, `GET /subscriptions` |
| **Playlists** | `POST /playlists`, `GET /playlists`, `PUT /playlists/:id`, `DELETE /playlists/:id` |
| **Tweets** | `POST /tweets`, `GET /tweets`, `DELETE /tweets/:id` |
| **Dashboard** | `GET /dashboard/stats`, `GET /dashboard/videos` |

## 🔐 Authentication

All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
Tokens are also stored in HTTP-only cookies for enhanced security.

## 🛠️ Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server

## 📝 Notes

- Passwords are hashed using bcrypt before storage
- All file uploads are securely handled via Multer and stored on Cloudinary
- CORS is configured to accept requests from specified origins
- Request body size is limited to 16KB for security

## 👨‍💻 Author

Chesta Singh

## 📄 License

ISC