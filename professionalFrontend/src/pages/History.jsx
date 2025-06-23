import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import VideoCard from '../components/Video/VideoCard';
import './History.css';

const History = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const fetchWatchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiService.getWatchHistory();
      setWatchHistory(response.data || []);
    } catch (error) {
      console.error('Failed to fetch watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      // This would need a clear history endpoint
      setWatchHistory([]);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="history">
      <div className="history-header">
        <h1>Watch History</h1>
        {watchHistory.length > 0 && (
          <button onClick={clearHistory} className="clear-btn">
            Clear All History
          </button>
        )}
      </div>
      
      {watchHistory.length > 0 ? (
        <div className="videos-grid">
          {watchHistory.map((video, index) => (
            <VideoCard 
              key={`${video._id}-${index}`} 
              video={video} 
              onUpdate={fetchWatchHistory}
            />
          ))}
        </div>
      ) : (
        <div className="no-videos">
          <h2>No watch history</h2>
          <p>Videos you watch will appear here</p>
        </div>
      )}
    </div>
  );
};

export default History;
