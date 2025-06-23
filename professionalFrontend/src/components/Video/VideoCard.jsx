import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import './VideoCard.css';

const VideoCard = ({ video, showOwner = true, onUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = Math.abs(now - videoDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await apiService.toggleVideoLike(video._id);
      setLiked(!liked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = () => {
    navigate(`/watch/${video._id}`);
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    navigate(`/channel/${video.owner.userName}`);
  };

  return (
    <div className="video-card" onClick={handleVideoClick}>
      <div className="video-thumbnail">
        <img 
          src={video.thumbnail || '/default-thumbnail.png'} 
          alt={video.title}
          onError={(e) => {
            e.target.src = '/default-thumbnail.png';
          }}
        />
        {video.duration && (
          <span className="duration">{formatDuration(video.duration)}</span>
        )}
      </div>
      
      <div className="video-info">
        <div className="video-details">
          {showOwner && video.owner && (
            <div className="channel-avatar" onClick={handleChannelClick}>
              <img 
                src={video.owner.avatar || '/default-avatar.png'} 
                alt={video.owner.fullName}
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
            </div>
          )}
          
          <div className="video-meta">
            <h3 className="video-title" title={video.title}>
              {video.title}
            </h3>
            
            {showOwner && video.owner && (
              <p className="channel-name" onClick={handleChannelClick}>
                {video.owner.fullName || video.owner.userName}
              </p>
            )}
            
            <div className="video-stats">
              <span>{formatViews(video.views || 0)} views</span>
              <span>•</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>
            
            {video.description && (
              <p className="video-description">{video.description}</p>
            )}
          </div>
        </div>
        
        <div className="video-actions">
          <button 
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
          </button>
          
          <button className="more-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
