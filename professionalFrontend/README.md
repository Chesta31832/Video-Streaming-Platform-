# Video Streaming Platform - Frontend

A modern React-based frontend for a YouTube-like video streaming platform with features like video discovery, streaming, user authentication, and social interactions.

## 🚀 Tech Stack

- **React** 19.1.0 - User interface library
- **Vite** 6.3.5 - Lightning-fast build tool
- **React Router DOM** 7.6.2 - Client-side routing
- **ESLint** - Code quality and linting

## ✨ Features

### User Authentication
- User registration and login
- Secure JWT-based authentication
- Protected routes for authenticated users
- Session management with Context API

### Video Discovery & Playback
- Home page with video feed
- Video search functionality
- Video detail page with watch functionality
- Video recommendations

### User Features
- **Channel**: View user channels with video listings
- **Upload**: Upload new videos (protected route)
- **Dashboard**: Personal analytics and channel management
- **Liked Videos**: View all liked videos
- **History**: Watch history tracking
- **Subscriptions**: Browse subscribed channels
- **Playlists**: Create and manage playlists

### Social Features
- Video comments
- Like/unlike videos
- Subscribe to channels
- Follow user activity

## 📁 Project Structure

```
src/
├── App.jsx              # Main application component
├── App.css              # Application styles
├── main.jsx             # React entry point
├── index.css            # Global styles
├── assets/              # Static assets (images, etc.)
├── components/
│   ├── ProtectedRoute.jsx         # Route guard for authenticated pages
│   └── Layout/
│       ├── Layout.jsx             # Main layout wrapper
│       ├── Header.jsx             # Navigation header
│       ├── Sidebar.jsx            # Navigation sidebar
│       ├── Layout.css
│       ├── Header.css
│       └── Sidebar.css
│   └── Video/
│       ├── VideoCard.jsx          # Video card component
│       └── VideoCard.css
├── context/
│   └── AuthContext.jsx            # Authentication context (JWT, user state)
├── pages/
│   ├── Home.jsx & Home.css                  # Homepage with video feed
│   ├── Watch.jsx & Watch.css                # Video watch page
│   ├── Login.jsx                             # Login page
│   ├── Register.jsx                          # Registration page
│   ├── Upload.jsx & Upload.css               # Video upload page
│   ├── Channel.jsx & Channel.css             # User channel page
│   ├── Dashboard.jsx & Dashboard.css         # Analytics dashboard
│   ├── LikedVideos.jsx & LikedVideos.css     # Liked videos list
│   ├── History.jsx & History.css             # Watch history
│   ├── Search.jsx & Search.css               # Search results
│   ├── Playlists.jsx & Playlists.css         # Playlist management
│   ├── Subscriptions.jsx & Subscriptions.css # Subscribed channels
│   ├── Auth.css                              # Auth page styles
├── services/
│   └── apiService.js    # API client for backend communication
└── index.html           # HTML template
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend server running (see professionalBackend README)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd professionalFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update `src/services/apiService.js` with your backend URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api/v1';
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📚 Available Scripts

- **`npm run dev`** - Start development server with Vite (HMR enabled)
- **`npm run build`** - Build optimized production bundle
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality

## 🎯 Key Components

### AuthContext
Manages global authentication state:
- User login/logout
- JWT token storage and retrieval
- Protected route access control
- User profile information

### ProtectedRoute
Wrapper component that:
- Checks user authentication status
- Redirects unauthenticated users to login
- Allows access to protected pages

### Layout
Main application layout with:
- Responsive header with navigation
- Sidebar for quick access
- Main content area

### Pages
Each page component handles:
- Fetching data from backend API
- Rendering UI with React components
- User interactions and state management
- Error handling and loading states

## 🔐 Authentication Flow

1. User registers/logs in → Backend verifies credentials and returns JWT
2. Frontend stores JWT in localStorage/cookies
3. JWT attached to all subsequent API requests
4. Protected routes check authentication before rendering
5. Logout clears stored JWT

## 🎨 Styling

- CSS Modules and standard CSS files for component styling
- Responsive design for desktop and mobile
- Consistent styling across all pages

## 🚀 Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains optimized static files ready for deployment

3. Deploy to services like:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## 🔗 Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

Access in components via `import.meta.env.VITE_API_URL`

## 📝 Notes

- React Router provides client-side routing without page reloads
- Vite provides HMR for instant component updates during development
- Authentication state persists across page refreshes via localStorage
- All API calls go through the centralized `apiService.js`

## 👨‍💻 Author

Chesta Singh

## 📄 License

MIT (Private)
