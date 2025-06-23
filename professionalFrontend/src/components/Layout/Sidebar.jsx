import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const menuItems = [
    { path: '/', icon: 'home', text: 'Home' },
    { path: '/liked-videos', icon: 'thumbs-up', text: 'Liked Videos', requireAuth: true },
    { path: '/history', icon: 'history', text: 'History', requireAuth: true },
    { path: '/dashboard', icon: 'video', text: 'Your Channel', requireAuth: true },
    { path: '/playlists', icon: 'playlist', text: 'Collection', requireAuth: true },
    { path: '/subscriptions', icon: 'users', text: 'Subscriptions', requireAuth: true },
  ];

  const getIcon = (iconName) => {
    const icons = {
      home: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>,
      'thumbs-up': <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>,
      history: <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>,
      video: <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>,
      playlist: <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>,
      users: <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 16.98 6h-.96c-.8 0-1.54.5-1.84 1.22l-1.42 3.28c-.4.92-.08 2 .68 2.64L16 15v7h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2.5 16v-7l-1.56-2.35c-.48-.72-1.32-1.02-2.09-.68l-1.42 3.28C2.5 15.5 2.5 16 2.96 16.37L5.5 22H8z"/>
    };
    return icons[iconName] || icons.home;
  };

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        {menuItems.map((item) => {
          if (item.requireAuth && !user) return null;
          
          return (
            <div 
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                {getIcon(item.icon)}
              </svg>
              <span className="nav-text">{item.text}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
