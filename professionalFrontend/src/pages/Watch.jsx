import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import VideoCard from '../components/Video/VideoCard';
import './Watch.css';

const Watch = () => {
  const { videoId } = useParams();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const [videoResponse, commentsResponse, relatedResponse] = await Promise.all([
        apiService.getVideoById(videoId),
        apiService.getVideoComments(videoId),
        apiService.getAllVideos({ limit: 10 })
      ]);

      setVideo(videoResponse.data);
      setComments(commentsResponse.data || []);
      setRelatedVideos(relatedResponse.data?.filter(v => v._id !== videoId) || []);
    } catch (error) {
      console.error('Failed to fetch video data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      await apiService.toggleVideoLike(videoId);
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user || !video?.owner) return;
    try {
      await apiService.toggleSubscription(video.owner._id);
      setSubscribed(!subscribed);
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    
    try {
      await apiService.addComment(videoId, commentText);
      setCommentText('');
      fetchVideoData(); // Refresh comments
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!video) {
    return <div className="error-container"><h2>Video not found</h2></div>;
  }

  return (
    <div className="watch-page">
      <div className="watch-content">
        <div className="video-player">
          <video controls width="100%" poster={video.thumbnail}>
            <source src={video.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="video-info">
          <h1>{video.title}</h1>
          <div className="video-actions">
            <div className="video-stats">
              <span>{video.views || 0} views</span>
              <span>•</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="action-buttons">
              <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                👍 Like
              </button>
              <button className="share-btn">📤 Share</button>
            </div>
          </div>
          
          <div className="channel-info">
            <div className="channel-details">
              <img src={video.owner?.avatar || '/default-avatar.png'} alt="Channel" />
              <div>
                <h3>{video.owner?.fullName}</h3>
                <p>{video.owner?.subscribersCount || 0} subscribers</p>
              </div>
            </div>
            {user && user._id !== video.owner?._id && (
              <button 
                className={`subscribe-btn ${subscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
          
          <div className="video-description">
            <p>{video.description}</p>
          </div>
        </div>

        <div className="comments-section">
          <h3>{comments.length} Comments</h3>
          
          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <img src={user.avatar || '/default-avatar.png'} alt="Your avatar" />
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Comment</button>
            </form>
          )}
          
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <img src={comment.owner?.avatar || '/default-avatar.png'} alt="Commenter" />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="commenter-name">{comment.owner?.fullName}</span>
                    <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="related-videos">
        <h3>Related Videos</h3>
        {relatedVideos.map((relatedVideo) => (
          <VideoCard key={relatedVideo._id} video={relatedVideo} />
        ))}
      </div>
    </div>
  );
};

export default Watch;
