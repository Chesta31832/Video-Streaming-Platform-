import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import './Upload.css';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'videoFile' || e.target.name === 'thumbnail') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.videoFile) {
      setError('Please select a video file');
      setLoading(false);
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a video title');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('videoFile', formData.videoFile);
      
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      const response = await apiService.publishVideo(formDataToSend);
      setSuccess('Video uploaded successfully!');
      
      // Redirect to video page after 2 seconds
      setTimeout(() => {
        navigate(`/watch/${response.data._id}`);
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Video upload failed');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-container">
      <div className="upload-form-container">
        <h2 className="upload-title">Upload Video</h2>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label className="form-label">Video File *</label>
            <div className="file-input-container">
              <input
                type="file"
                name="videoFile"
                className="file-input"
                onChange={handleChange}
                accept="video/*"
                required
              />
              {formData.videoFile && (
                <div className="file-info">
                  <span className="file-name">{formData.videoFile.name}</span>
                  <span className="file-size">({formatFileSize(formData.videoFile.size)})</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Video Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              required
              maxLength={100}
            />
            <div className="char-count">{formData.title.length}/100</div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell viewers about your video"
              rows={4}
              maxLength={5000}
            />
            <div className="char-count">{formData.description.length}/5000</div>
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail (Optional)</label>
            <div className="file-input-container">
              <input
                type="file"
                name="thumbnail"
                className="file-input"
                onChange={handleChange}
                accept="image/*"
              />
              {formData.thumbnail && (
                <div className="file-info">
                  <span className="file-name">{formData.thumbnail.name}</span>
                  <span className="file-size">({formatFileSize(formData.thumbnail.size)})</span>
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {loading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <span className="progress-text">Uploading... {uploadProgress}%</span>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="upload-btn"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
