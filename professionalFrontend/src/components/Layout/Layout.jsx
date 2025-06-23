import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
