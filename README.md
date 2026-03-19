# Video Streaming Platform 🎬

A complete full-stack video streaming application inspired by YouTube, built with modern web technologies. Stream, upload, like, comment, and subscribe to content creators.

## 📹 Project Overview

This project demonstrates a professional-grade full-stack application with:
- **Backend**: Robust REST API with Node.js/Express
- **Frontend**: Modern React SPA with smooth UX
- **Database**: MongoDB for scalable data storage
- **Cloud Storage**: Cloudinary for video hosting
- **Authentication**: JWT-based secure authentication

### Live Demo Features
- 🎥 Upload and stream videos
- 👤 User profiles and channels
- ❤️ Like/unlike videos
- 💬 Comment on videos
- 🔔 Subscribe to channels
- 📋 Create and manage playlists
- 🔍 Search and discover videos
- 📊 Channel dashboard with analytics
- 📝 Tweet/share feature
- 👁️ Watch history tracking

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│        Frontend (React + Vite)          │
│  - SPA with React Router                │
│  - Context API for state management     │
│  - Responsive UI                        │
└────────────────┬────────────────────────┘
                 │ REST API
                 ↓
┌─────────────────────────────────────────┐
│       Backend (Node.js/Express)         │
│  - RESTful API endpoints                │
│  - JWT authentication                   │
│  - Controllers & Services               │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
   ┌─────────┐      ┌───────────┐
   │ MongoDB │      │Cloudinary │
   │(Database)      │(Storage)  │
   └─────────┘      └───────────┘
```

## 📚 Project Structure

```
Video-Streaming-Platform-/
├── professionalBackend/          # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/          # Business logic
│   │   ├── models/               # MongoDB schemas
│   │   ├── routes/               # API endpoints
│   │   ├── middlewares/          # Auth, file upload
│   │   ├── utils/                # Helper functions
│   │   ├── app.js                # Express app
│   │   └── index.js              # Server entry
│   ├── package.json
│   └── README.md
│
├── professionalFrontend/         # React Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── context/              # Auth context
│   │   ├── services/             # API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB
- Cloudinary account
- Git

### Backend Setup

1. **Navigate to backend**
   ```bash
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
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=http://localhost:5173
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

4. **Start server**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd professionalFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API endpoint** in `src/services/apiService.js`
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api/v1';
   ```

4. **Start development**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 🔑 Key Features

### User System
- ✅ Registration & Login
- ✅ JWT Authentication
- ✅ Password Encryption (bcrypt)
- ✅ User Profiles
- ✅ Profile Updates

### Video Management
- ✅ Upload Videos (Cloudinary)
- ✅ Video Streaming
- ✅ Video Metadata
- ✅ View Count Tracking
- ✅ Delete Videos

### Social Features
- ✅ Like/Unlike Videos
- ✅ Comments on Videos
- ✅ Subscribe to Channels
- ✅ View Subscriber Count
- ✅ Create Playlists
- ✅ Add Videos to Playlists
- ✅ Tweet/Share Content

### Discovery & Search
- ✅ Home Feed
- ✅ Search Videos
- ✅ Browse by Category
- ✅ Trending Videos
- ✅ Recommendations

### Additional Features
- ✅ Watch History
- ✅ Channel Dashboard with Analytics
- ✅ Responsive Design
- ✅ Error Handling
- ✅ Loading States

## 🔗 API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Authentication
```
POST   /users/register          - Register new user
POST   /users/login             - User login
GET    /users/logout            - User logout
GET    /users/profile           - Get user profile
```

### Videos
```
POST   /videos/upload           - Upload video
GET    /videos                  - Get all videos
GET    /videos/:id              - Get video details
PUT    /videos/:id              - Update video
DELETE /videos/:id              - Delete video
```

### Comments
```
POST   /comments                - Add comment
GET    /comments/:videoId       - Get video comments
PUT    /comments/:id            - Update comment
DELETE /comments/:id            - Delete comment
```

### Likes
```
POST   /likes/toggle            - Like/unlike video
GET    /likes                   - Get user's likes
```

### Subscriptions
```
POST   /subscriptions/toggle    - Subscribe/unsubscribe
GET    /subscriptions           - Get subscriptions
```

### Playlists
```
POST   /playlists               - Create playlist
GET    /playlists               - Get user playlists
PUT    /playlists/:id           - Update playlist
DELETE /playlists/:id           - Delete playlist
```

### Dashboard
```
GET    /dashboard/stats         - Get channel stats
GET    /dashboard/videos        - Get uploaded videos
```

## 🛠️ Tech Stack Details

### Backend
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB + Mongoose 8.16.0
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Middleware**: Cookie-parser, CORS

### Frontend
- **UI Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 7.6.2
- **State Management**: Context API
- **Code Quality**: ESLint
- **Styling**: CSS

## 🔐 Security Features

- JWT-based authentication
- HTTP-only cookies for token storage
- Password hashing with bcrypt
- CORS protection
- Request validation
- Protected API routes
- Protected React routes

## 📊 Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String (Cloudinary URL),
  coverImage: String,
  description: String,
  isSubscribed: Boolean
}
```

### Video Model
```javascript
{
  videoFile: String (Cloudinary URL),
  thumbnail: String,
  title: String,
  description: String,
  duration: Number,
  views: Number,
  isPublished: Boolean,
  owner: ObjectId (ref: User)
}
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set up environment variables
2. Deploy code
3. MongoDB Atlas connection string
4. Cloudinary credentials

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set API endpoint to production backend

## 📈 Performance Optimizations

- Vite for fast development and build
- MongoDB indexes for queries
- Image optimization with Cloudinary
- Lazy loading of components
- Code splitting with React Router
- Pagination for large datasets

## 🧪 Testing & Development

```bash
# Backend
npm run dev          # Start development server
npm start            # Start production server

# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=8000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify CORS_ORIGIN matches frontend URL

### Frontend API Errors
- Confirm backend server is running
- Check API_BASE_URL in apiService.js
- Verify JWT token in browser storage

### File Upload Issues
- Check Cloudinary credentials
- Ensure multer middleware is configured
- File size limits set to 16KB (configurable)

## 👨‍💻 Author

**Chesta Singh**

## 📄 License

MIT - Feel free to use this project for learning and development.

## 🎓 Learning Resources

This project demonstrates:
- Full-stack MERN development
- RESTful API design
- JWT authentication
- Database design with MongoDB
- React patterns and hooks
- Vite build tool workflow
- Cloud storage integration
- State management with Context API

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📞 Support

For issues or questions, check the individual README files in:
- [Backend README](./professionalBackend/README.md)
- [Frontend README](./professionalFrontend/README.md)

---

**Built with ❤️ using modern web technologies**
