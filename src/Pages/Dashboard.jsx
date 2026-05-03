import React, { useState, useEffect } from 'react';
import Card from '../components/Card/Card';
import Chart from '../components/Chart/Chart';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    growthRate: 0
  });

  const [salesData, setSalesData] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    // Simulated API response
    setTimeout(() => {
      setStats({
        totalRevenue: 125430,
        totalUsers: 8542,
        totalOrders: 1247,
        growthRate: 23.5
      });

      setSalesData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: '#00e5ff',
          backgroundColor: 'rgba(0, 229, 255, 0.1)',
          pointBackgroundColor: '#00e5ff',
          fill: true
        }]
      });

      setUserGrowthData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [1200, 1900, 2400, 3100, 3800, 4500],
          backgroundColor: [
            '#00e5ff', '#7c3aed', '#10b981', 
            '#f59e0b', '#ef4444', '#3b82f6'
          ]
        }]
      });

      setCategoryData({
        labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            '#00e5ff',
            '#7c3aed',
            '#10b981',
            '#f59e0b',
            '#ef4444'
          ]
        }]
      });
    }, 500);
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: '💰',
      color: '#00e5ff'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+8.2%',
      icon: '👥',
      color: '#7c3aed'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+23.1%',
      icon: '📦',
      color: '#10b981'
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate}%`,
      change: '+5.3%',
      icon: '📈',
      color: '#f59e0b'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Made a purchase', time: '5 min ago', amount: '$299' },
    { id: 2, user: 'Jane Smith', action: 'Registered account', time: '12 min ago', amount: '-' },
    { id: 3, user: 'Mike Johnson', action: 'Left a review', time: '1 hour ago', amount: '-' },
    { id: 4, user: 'Sarah Williams', action: 'Made a purchase', time: '2 hours ago', amount: '$549' },
    { id: 5, user: 'Tom Brown', action: 'Updated profile', time: '3 hours ago', amount: '-' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name}! Here's what's happening today.
          </p>
        </div>
        <button className="refresh-btn">
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-title">{stat.title}</p>
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-change positive">{stat.change} from last month</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <Card title="Sales Overview" subtitle="Monthly sales performance">
          {salesData && <Chart type="line" data={salesData} />}
        </Card>

        <Card title="User Growth" subtitle="New user registrations">
          {userGrowthData && <Chart type="bar" data={userGrowthData} />}
        </Card>
      </div>

      <div className="bottom-grid">
        <Card 
          title="Sales by Category" 
          subtitle="Product category breakdown"
          className="category-chart"
        >
          {categoryData && <Chart type="doughnut" data={categoryData} />}
        </Card>

        <Card 
          title="Recent Activity" 
          subtitle="Latest user actions"
          noPadding
        >
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="activity-item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="activity-info">
                  <p className="activity-user">{activity.user}</p>
                  <p className="activity-action">{activity.action}</p>
                </div>
                <div className="activity-meta">
                  <span className="activity-time">{activity.time}</span>
                  {activity.amount !== '-' && (
                    <span className="activity-amount">{activity.amount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {user?.role === 'admin' && (
        <Card title="Admin Quick Actions" className="admin-actions">
          <div className="action-buttons">
            <button className="action-btn">
              <span>👥</span>
              Manage Users
            </button>
            <button className="action-btn">
              <span>📊</span>
              View Reports
            </button>
            <button className="action-btn">
              <span>⚙️</span>
              System Settings
            </button>
            <button className="action-btn">
              <span>📧</span>
              Send Notifications
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;