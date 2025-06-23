import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Channel from './pages/Channel';
import Dashboard from './pages/Dashboard';
import LikedVideos from './pages/LikedVideos';
import History from './pages/History';
import Search from './pages/Search';
import Playlists from './pages/Playlists';
import Subscriptions from './pages/Subscriptions';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App = () => {
  console.log('App component rendering'); // Debug log

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/watch/:videoId" element={<Watch />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/channel/:username" element={<Channel />} />
                  
                  {/* Protected Routes */}
                  <Route path="/upload" element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/liked-videos" element={
                    <ProtectedRoute>
                      <LikedVideos />
                    </ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  } />
                  <Route path="/playlists" element={
                    <ProtectedRoute>
                      <Playlists />
                    </ProtectedRoute>
                  } />
                  <Route path="/subscriptions" element={
                    <ProtectedRoute>
                      <Subscriptions />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;