import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import VideoCard from '../components/Video/VideoCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, videosResponse] = await Promise.all([
        apiService.getChannelStats(),
        apiService.getChannelVideos()
      ]);
      
      setStats(statsResponse.data || {});
      setVideos(videosResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await apiService.deleteVideo(videoId);
        fetchDashboardData();
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      await apiService.togglePublishStatus(videoId);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count?.toString() || '0';
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }
  return (
    <div className="dashboard">
      {/* Gradient banner - Pink to Orange gradient like in image */}
      <div className="dashboard-banner">
        <div className="banner-gradient"></div>
      </div>

      {/* Profile Section */}
      <div className="dashboard-header">
        <div className="profile-section">
          <div className="profile-avatar">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} 
              alt={user?.fullName}
            />
          </div>
          <div className="profile-info">
            <h1 className="channel-name">{user?.fullName }</h1>
            <p className="channel-handle">{user?.username }</p>
            <div className="subscriber-info">
              <span className="subscriber-count">{formatCount(stats.totalSubscribers )} Subscribers</span>
              <span className="dot-separator">•</span>
              <span className="subscribed-count">{formatCount(stats.channelsSubscribedTo )} Subscribed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button 
            className={`nav-tab ${activeTab === 'playlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('playlist')}
          >
            Playlists
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'videos' && (
          <div className="content-tab">
            {videos.length > 0 ? (
              <div className="videos-grid">
                {videos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="no-content">
                <h3>No videos uploaded</h3>
                <p>This channel has not uploaded any videos yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlist' && (
          <div className="no-content">
            <h3>No playlists created</h3>
            <p>This channel has not created any playlists yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
