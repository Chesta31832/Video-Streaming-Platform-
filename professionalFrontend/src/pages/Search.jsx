import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import VideoCard from '../components/Video/VideoCard';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query, sortBy]);

  const searchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllVideos({
        query,
        sortBy: sortBy === 'relevance' ? 'createdAt' : sortBy,
        sortType: 'desc',
        limit: 20
      });
      
      // Filter videos based on search query (client-side filtering as fallback)
      const filteredVideos = response.data?.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description?.toLowerCase().includes(query.toLowerCase()) ||
        video.owner?.fullName?.toLowerCase().includes(query.toLowerCase())
      ) || [];
      
      setVideos(filteredVideos);
    } catch (error) {
      console.error('Search failed:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Search results for "{query}"</h2>
        <div className="search-filters">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="createdAt">Upload date</option>
            <option value="views">View count</option>
          </select>
        </div>
      </div>
      
      <div className="search-results">
        {videos.length > 0 ? (
          <div className="videos-grid">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No results found</h3>
            <p>Try different keywords or remove search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
