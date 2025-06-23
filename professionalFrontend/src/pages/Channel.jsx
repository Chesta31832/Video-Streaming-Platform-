import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import VideoCard from '../components/Video/VideoCard';
import './Channel.css';

const Channel = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    if (username) {
      fetchChannelData();
    }
  }, [username]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch channel profile
      const profileResponse = await apiService.getUserChannelProfile(username);
      setChannelData(profileResponse.data);
      setSubscriberCount(profileResponse.data.subscribersCount || 0);
      setIsSubscribed(profileResponse.data.isSubscribed || false);

      // Fetch channel videos - using dashboard endpoint for owner, public videos for others
      let videosResponse;
      if (user && user.userName === username) {
        videosResponse = await apiService.getChannelVideos();
      } else {
        videosResponse = await apiService.getAllVideos({
          owner: profileResponse.data._id,
          page: 1,
          limit: 20
        });
      }
      setVideos(videosResponse.data || []);

      // Fetch playlists if available
      try {
        const playlistsResponse = await apiService.getUserPlaylists(profileResponse.data._id);
        setPlaylists(playlistsResponse.data || []);
      } catch (playlistError) {
        console.log('Playlists not available:', playlistError);
      }

    } catch (error) {
      console.error('Failed to fetch channel data:', error);
      setError('Failed to load channel data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      return;
    }

    try {
      await apiService.toggleSubscription(channelData._id);
      setIsSubscribed(!isSubscribed);
      setSubscriberCount(prev => isSubscribed ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const formatSubscriberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading channel...</p>
      </div>
    );
  }

  if (error || !channelData) {
    return (
      <div className="error-container">
        <h2>Channel not found</h2>
        <p>{error || 'The channel you\'re looking for doesn\'t exist.'}</p>
      </div>
    );
  }

  return (
    <div className="channel-page">
      {/* Channel Banner */}
      <div className="channel-banner">
        {channelData.coverImage ? (
          <img src={channelData.coverImage} alt="Channel banner" />
        ) : (
          <div className="banner-gradient"></div>
        )}
      </div>

      {/* Channel Info */}
      <div className="channel-header">
        <div className="channel-info">
          <div className="channel-avatar">
            <img 
              src={channelData.avatar || '/default-avatar.png'} 
              alt={channelData.fullName}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>
          <div className="channel-details">
            <h1 className="channel-name">{channelData.fullName}</h1>
            <div className="channel-handle">@{channelData.userName}</div>
            <div className="channel-stats">
              <span>{formatSubscriberCount(subscriberCount)} subscribers</span>
              <span>•</span>
              <span>{videos.length} videos</span>
            </div>
          </div>
        </div>

        {user && user.userName !== username && (
          <div className="channel-actions">
            <button 
              className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
              onClick={handleSubscribe}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        )}
      </div>

      {/* Channel Navigation */}
      <div className="channel-nav">
        <button 
          className={`nav-btn ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
        <button 
          className={`nav-btn ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </button>
        <button 
          className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      {/* Channel Content */}
      <div className="channel-content">
        {activeTab === 'videos' && (
          <div className="videos-tab">
            {videos.length > 0 ? (
              <div className="videos-grid">
                {videos.map((video) => (
                  <VideoCard 
                    key={video._id} 
                    video={video} 
                    showOwner={false}
                    onUpdate={fetchChannelData}
                  />
                ))}
              </div>
            ) : (
              <div className="no-content">
                <h3>No videos yet</h3>
                <p>This channel hasn't uploaded any videos.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="playlists-tab">
            {playlists.length > 0 ? (
              <div className="playlists-grid">
                {playlists.map((playlist) => (
                  <div key={playlist._id} className="playlist-card">
                    <div className="playlist-thumbnail">
                      <img 
                        src={playlist.thumbnail || '/default-thumbnail.png'} 
                        alt={playlist.name}
                      />
                      <div className="playlist-count">
                        {playlist.videos?.length || 0} videos
                      </div>
                    </div>
                    <div className="playlist-info">
                      <h3>{playlist.name}</h3>
                      <p>{playlist.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">
                <h3>No playlists yet</h3>
                <p>This channel hasn't created any playlists.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about-tab">
            <div className="about-section">
              <h3>About</h3>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-label">Joined</span>
                  <span className="stat-value">
                    {new Date(channelData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total views</span>
                  <span className="stat-value">
                    {videos.reduce((total, video) => total + (video.views || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
