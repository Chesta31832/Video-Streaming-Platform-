import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import './Playlists.css';

const Playlists = () => {
  const { user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserPlaylists(user._id);
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylist.name.trim()) return;

    try {
      await apiService.createPlaylist(newPlaylist);
      setNewPlaylist({ name: '', description: '' });
      setShowCreateForm(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await apiService.deletePlaylist(playlistId);
        fetchPlaylists();
      } catch (error) {
        console.error('Failed to delete playlist:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="playlists">
      <div className="playlists-header">
        <h1>Your Playlists</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="create-playlist-btn"
        >
          + Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-modal">
          <form onSubmit={handleCreatePlaylist} className="create-form">
            <h3>Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
            />
            <div className="form-actions">
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      )}

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
                <div className="playlist-actions">
                  <button>Edit</button>
                  <button onClick={() => handleDeletePlaylist(playlist._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-playlists">
          <h2>No playlists yet</h2>
          <p>Create your first playlist to organize your videos</p>
        </div>
      )}
    </div>
  );
};

export default Playlists;
