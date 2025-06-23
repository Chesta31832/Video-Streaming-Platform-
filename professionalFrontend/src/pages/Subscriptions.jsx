import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import VideoCard from '../components/Video/VideoCard';
import './Subscriptions.css';

const Subscriptions = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscriptionsResponse, videosResponse] = await Promise.all([
        apiService.getSubscribedChannels(user._id),
        apiService.getAllVideos({ limit: 20, sortBy: 'createdAt', sortType: 'desc' })
      ]);
      
      setSubscriptions(subscriptionsResponse.data || []);
      
      // Filter videos from subscribed channels
      const subscribedChannelIds = subscriptionsResponse.data?.map(sub => sub._id) || [];
      const subscribedVideos = videosResponse.data?.filter(video => 
        subscribedChannelIds.includes(video.owner?._id)
      ) || [];
      
      setVideos(subscribedVideos);
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (channelId) => {
    try {
      await apiService.toggleSubscription(channelId);
      fetchSubscriptionData();
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="subscriptions">
      <div className="subscriptions-header">
        <h1>Subscriptions</h1>
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Latest Videos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'channels' ? 'active' : ''}`}
            onClick={() => setActiveTab('channels')}
          >
            Channels
          </button>
        </div>
      </div>

      {activeTab === 'videos' && (
        <div className="videos-tab">
          {videos.length > 0 ? (
            <div className="videos-grid">
              {videos.map((video) => (
                <VideoCard 
                  key={video._id} 
                  video={video}
                  onUpdate={fetchSubscriptionData}
                />
              ))}
            </div>
          ) : (
            <div className="no-content">
              <h2>No videos from subscriptions</h2>
              <p>Subscribe to channels to see their latest videos here</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="channels-tab">
          {subscriptions.length > 0 ? (
            <div className="channels-grid">
              {subscriptions.map((channel) => (
                <div key={channel._id} className="channel-card">
                  <img 
                    src={channel.avatar || '/default-avatar.png'} 
                    alt={channel.fullName}
                    onClick={() => navigate(`/channel/${channel.userName}`)}
                  />
                  <div className="channel-info">
                    <h3 onClick={() => navigate(`/channel/${channel.userName}`)}>
                      {channel.fullName}
                    </h3>
                    <p>{channel.subscribersCount || 0} subscribers</p>
                    <button 
                      onClick={() => handleUnsubscribe(channel._id)}
                      className="unsubscribe-btn"
                    >
                      Unsubscribe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-content">
              <h2>No subscriptions yet</h2>
              <p>Subscribe to channels to see them here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
