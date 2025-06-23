import React, { useState, useEffect } from 'react';
import VideoCard from '../components/Video/VideoCard';
import { apiService } from '../services/apiService';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching videos...'); // Debug log
      const response = await apiService.getAllVideos({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortType: 'desc'
      });
      console.log('Videos response:', response); // Debug log
      setVideos(response.data || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError('Failed to load videos. Make sure your backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading videos</h2>
        <p>{error}</p>
        <button onClick={fetchVideos} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="videos-grid">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard 
              key={video._id} 
              video={video} 
              onUpdate={fetchVideos}
            />
          ))
        ) : (
          <div className="no-videos">
            <h2>No videos found</h2>
            <p>Be the first to upload a video!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
