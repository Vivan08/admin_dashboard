import React, { useState, useEffect } from 'react';
import Card from '../components/Card/Card';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, setThemeMode } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    notifications: true,
    emailAlerts: true,
    darkMode: theme === 'dark',
    twoFactor: false,
    language: 'English',
    timezone: 'UTC-8 (Pacific Time)'
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          name: user?.name || prev.name,
          email: user?.email || prev.email,
          role: user?.role || prev.role,
          darkMode: theme === 'dark'
        }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [user, theme]);

  // Update dark mode when theme changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Handle dark mode toggle immediately
    if (name === 'darkMode') {
      setThemeMode(checked ? 'dark' : 'light');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data
    updateUser({ name: formData.name, email: formData.email });
    
    // Save all settings to localStorage
    const settingsToSave = {
      notifications: formData.notifications,
      emailAlerts: formData.emailAlerts,
      twoFactor: formData.twoFactor,
      language: formData.language,
      timezone: formData.timezone
    };
    
    localStorage.setItem('settings', JSON.stringify(settingsToSave));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-description">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span>
            Profile
          </button>
          <button
            className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <span>⚙️</span>
            Preferences
          </button>
          <button
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <span>🔒</span>
            Security
          </button>
          <button
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <span>🔔</span>
            Notifications
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <Card title="Profile Information" subtitle="Update your personal details">
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    disabled
                    className="form-input disabled"
                  />
                  <p className="form-hint">Contact admin to change your role</p>
                </div>

                <div className="form-group">
                  <label htmlFor="avatar">Profile Avatar</label>
                  <div className="avatar-upload">
                    <img src={user?.avatar} alt="Avatar" className="avatar-preview" />
                    <button type="button" className="secondary-btn">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    Save Changes
                  </button>
                  {saved && (
                    <span className="save-indicator">✓ Saved successfully!</span>
                  )}
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card title="Preferences" subtitle="Customize your experience">
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <select 
                    id="language" 
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select 
                    id="timezone" 
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (CET)</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={formData.darkMode}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span>Enable Dark Mode</span>
                  </label>
                  <p className="form-hint">Currently using {theme === 'dark' ? 'dark' : 'light'} mode</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    Save Preferences
                  </button>
                  {saved && (
                    <span className="save-indicator">✓ Preferences saved!</span>
                  )}
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security Settings" subtitle="Protect your account">
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    type="password"
                    id="current-password"
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    type="password"
                    id="new-password"
                    className="form-input"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="twoFactor"
                      checked={formData.twoFactor}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span>Enable Two-Factor Authentication</span>
                  </label>
                  <p className="form-hint">Add an extra layer of security to your account</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    Update Security Settings
                  </button>
                  {saved && (
                    <span className="save-indicator">✓ Security settings updated!</span>
                  )}
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card title="Notification Settings" subtitle="Choose what you want to be notified about">
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="notification-section">
                  <h4>Email Notifications</h4>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="emailAlerts"
                        checked={formData.emailAlerts}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      <span>Receive email alerts</span>
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                      />
                      <span>Weekly summary emails</span>
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                      />
                      <span>Marketing emails</span>
                    </label>
                  </div>
                </div>

                <div className="notification-section">
                  <h4>Push Notifications</h4>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      <span>Enable push notifications</span>
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                      />
                      <span>New message notifications</span>
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                      />
                      <span>System update notifications</span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    Save Notification Settings
                  </button>
                  {saved && (
                    <span className="save-indicator">✓ Notifications saved!</span>
                  )}
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
