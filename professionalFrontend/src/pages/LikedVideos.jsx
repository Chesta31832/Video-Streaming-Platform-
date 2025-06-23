import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import VideoCard from '../components/Video/VideoCard';
import './LikedVideos.css';

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLikedVideos();
      setLikedVideos(response.data || []);
    } catch (error) {
      console.error('Failed to fetch liked videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="liked-videos">
      <h1>Liked Videos</h1>
      {likedVideos.length > 0 ? (
        <div className="videos-grid">
          {likedVideos.map((video) => (
            <VideoCard 
              key={video._id} 
              video={video} 
              onUpdate={fetchLikedVideos}
            />
          ))}
        </div>
      ) : (
        <div className="no-videos">
          <h2>No liked videos</h2>
          <p>Videos you like will appear here</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
