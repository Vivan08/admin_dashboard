import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { useTheme } from '../../context/ThemeContext';
import './Layout.css';

const Layout = () => {
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="layout">
      <Sidebar />
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;