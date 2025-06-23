const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          try {
            await this.refreshToken();
            // Retry original request
            const retryResponse = await fetch(url, {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });
            return await retryResponse.json();
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw refreshError;
          }
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(formData) {
    return this.request('/users/register', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async logout() {
    return this.request('/users/logout', { method: 'POST' });
  }

  async refreshToken(data) {
    return this.request('/users/refresh-token', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request('/users/current-user');
  }

  // Video endpoints
  async getAllVideos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/videos?${queryString}`);
  }

  async getVideoById(videoId) {
    return this.request(`/videos/${videoId}`);
  }

  async publishVideo(formData) {
    return this.request('/videos', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async updateVideo(videoId, data) {
    return this.request(`/videos/${videoId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteVideo(videoId) {
    return this.request(`/videos/${videoId}`, { method: 'DELETE' });
  }

  async togglePublishStatus(videoId) {
    return this.request(`/videos/toggle/publish/${videoId}`, { method: 'PATCH' });
  }

  // Comment endpoints
  async getVideoComments(videoId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/comments/${videoId}?${queryString}`);
  }

  async addComment(videoId, content) {
    return this.request(`/comments/${videoId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async updateComment(commentId, content) {
    return this.request(`/comments/c/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(commentId) {
    return this.request(`/comments/c/${commentId}`, { method: 'DELETE' });
  }

  // Like endpoints
  async toggleVideoLike(videoId) {
    return this.request(`/likes/toggle/v/${videoId}`, { method: 'POST' });
  }

  async toggleCommentLike(commentId) {
    return this.request(`/likes/toggle/c/${commentId}`, { method: 'POST' });
  }

  async getLikedVideos() {
    return this.request('/likes/videos');
  }

  // Subscription endpoints
  async toggleSubscription(channelId) {
    return this.request(`/subscriptions/c/${channelId}`, { method: 'POST' });
  }

  async getChannelSubscribers(subscriberId) {
    return this.request(`/subscriptions/u/${subscriberId}`);
  }

  async getSubscribedChannels(channelId) {
    return this.request(`/subscriptions/c/${channelId}`);
  }

  // Playlist endpoints
  async createPlaylist(data) {
    return this.request('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserPlaylists(userId) {
    return this.request(`/playlists/user/${userId}`);
  }

  async getPlaylistById(playlistId) {
    return this.request(`/playlists/${playlistId}`);
  }

  async updatePlaylist(playlistId, data) {
    return this.request(`/playlists/${playlistId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePlaylist(playlistId) {
    return this.request(`/playlists/${playlistId}`, { method: 'DELETE' });
  }

  async addVideoToPlaylist(videoId, playlistId) {
    return this.request(`/playlists/add/${videoId}/${playlistId}`, { method: 'PATCH' });
  }

  // Dashboard endpoints
  async getChannelStats() {
    return this.request('/dashboard/stats');
  }

  async getChannelVideos() {
    return this.request('/dashboard/videos');
  }

  // User profile endpoints
  async getUserChannelProfile(username) {
    return this.request(`/users/c/${username}`);
  }

  async getWatchHistory() {
    return this.request('/users/history');
  }

  async updateAvatar(formData) {
    return this.request('/users/avatar', {
      method: 'PATCH',
      body: formData,
      headers: {},
    });
  }

  async updateCoverImage(formData) {
    return this.request('/users/cover-image', {
      method: 'PATCH',
      body: formData,
      headers: {},
    });
  }
}

export const apiService = new ApiService();
