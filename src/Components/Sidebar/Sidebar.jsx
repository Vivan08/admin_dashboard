import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: '📊',
      roles: ['admin', 'user']
    },
    {
      name: 'Users',
      path: '/users',
      icon: '👥',
      roles: ['admin']
    },
    {
      name: 'Sales',
      path: '/sales',
      icon: '💰',
      roles: ['admin', 'user']
    },
    {
      name: 'Products',
      path: '/products',
      icon: '📦',
      roles: ['admin', 'user']
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: '⚙️',
      roles: ['admin', 'user']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">
          {mobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon gradient-text">◈</div>
            {!sidebarCollapsed && <h1 className="logo-text">NEXUS</h1>}
          </div>
          <button 
            className="collapse-btn desktop-only"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {filteredNavItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.name}</span>}
              {!sidebarCollapsed && <span className="nav-indicator"></span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <img 
              src={user?.avatar} 
              alt={user?.name}
              className="user-avatar"
            />
            {!sidebarCollapsed && (
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;