import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@dashboard.com');
      setPassword('admin123');
    } else {
      setEmail('user@dashboard.com');
      setPassword('user123');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo gradient-text">◈</div>
          <h1 className="login-title">NEXUS</h1>
          <p className="login-subtitle">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn"
                onClick={() => quickLogin('admin')}
              >
                👑 Admin Login
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => quickLogin('user')}
              >
                👤 User Login
              </button>
            </div>
          </div>
        </form>

        <div className="login-footer">
          <p>
            <a href="#forgot">Forgot Password?</a>
          </p>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <p>Real-time Analytics</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <p>Secure Access</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <p>Lightning Fast</p>
          </div>
        </div>
      </div>

      <div className="login-background">
        <div className="bg-gradient bg-gradient-1"></div>
        <div className="bg-gradient bg-gradient-2"></div>
        <div className="bg-gradient bg-gradient-3"></div>
      </div>
    </div>
  );
};

export default Login;