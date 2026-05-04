import React, { useState, useEffect } from 'react';
import Card from '../components/Card/Card.jsx';
import Chart from '../components/Chart/Chart.jsx';
import Table from '../components/Table/Table.jsx';
import './Sales.css';

const Sales = () => {
  const [salesData, setSalesData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    fetchSalesData();
  }, [timeframe]);

  const fetchSalesData = () => {
    // Simulated sales data
    const monthlyData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Revenue',
        data: [15000, 23000, 18000, 29000],
        borderColor: '#00e5ff',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        pointBackgroundColor: '#00e5ff',
        fill: true
      }]
    };

    const yearlyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [42000, 51000, 45000, 58000, 63000, 59000, 68000, 72000, 65000, 78000, 83000, 91000],
        borderColor: '#00e5ff',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        pointBackgroundColor: '#00e5ff',
        fill: true
      }]
    };

    setSalesData(timeframe === 'month' ? monthlyData : yearlyData);

    setRevenueData({
      labels: ['Product Sales', 'Services', 'Subscriptions', 'Other'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ['#00e5ff', '#7c3aed', '#10b981', '#f59e0b']
      }]
    });

    setTopProducts([
      { id: 1, name: 'Premium Package', sales: 1247, revenue: 124700, growth: 23.5 },
      { id: 2, name: 'Standard Package', sales: 2341, revenue: 93640, growth: 15.2 },
      { id: 3, name: 'Basic Package', sales: 3892, revenue: 77840, growth: 8.7 },
      { id: 4, name: 'Enterprise Solution', sales: 452, revenue: 226000, growth: 42.1 },
      { id: 5, name: 'Starter Pack', sales: 5124, revenue: 51240, growth: -3.2 }
    ]);
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Name',
      render: (value) => <strong>{value}</strong>
    },
    {
      key: 'sales',
      label: 'Units Sold',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'growth',
      label: 'Growth',
      render: (value) => (
        <span className={`growth-indicator ${value >= 0 ? 'positive' : 'negative'}`}>
          {value >= 0 ? '↗' : '↘'} {Math.abs(value)}%
        </span>
      )
    }
  ];

  return (
    <div className="sales-page">
      <div className="page-header">
        <div>
          <h1>Sales Analytics</h1>
          <p className="page-description">
            Track and analyze your sales performance
          </p>
        </div>
        <div className="timeframe-selector">
          <button
            className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
            onClick={() => setTimeframe('month')}
          >
            This Month
          </button>
          <button
            className={`timeframe-btn ${timeframe === 'year' ? 'active' : ''}`}
            onClick={() => setTimeframe('year')}
          >
            This Year
          </button>
        </div>
      </div>

      <div className="sales-stats">
        <div className="sales-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(0, 229, 255, 0.2)' }}>
            <span style={{ color: '#00e5ff' }}>💰</span>
          </div>
          <div className="stat-details">
            <p className="stat-label">Total Revenue</p>
            <h2 className="stat-value">$85,400</h2>
            <p className="stat-change positive">+18.2% from last period</p>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
            <span style={{ color: '#7c3aed' }}>🛒</span>
          </div>
          <div className="stat-details">
            <p className="stat-label">Total Orders</p>
            <h2 className="stat-value">13,056</h2>
            <p className="stat-change positive">+12.5% from last period</p>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
            <span style={{ color: '#10b981' }}>📈</span>
          </div>
          <div className="stat-details">
            <p className="stat-label">Avg. Order Value</p>
            <h2 className="stat-value">$65.40</h2>
            <p className="stat-change positive">+5.1% from last period</p>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
            <span style={{ color: '#f59e0b' }}>🎯</span>
          </div>
          <div className="stat-details">
            <p className="stat-label">Conversion Rate</p>
            <h2 className="stat-value">3.8%</h2>
            <p className="stat-change negative">-0.3% from last period</p>
          </div>
        </div>
      </div>

      <div className="sales-charts">
        <Card 
          title="Revenue Trend" 
          subtitle={`${timeframe === 'month' ? 'Weekly' : 'Monthly'} revenue overview`}
          headerAction={
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: '#00e5ff' }}></span>
                Revenue
              </span>
            </div>
          }
        >
          {salesData && <Chart type="line" data={salesData} />}
        </Card>

        <Card title="Revenue Distribution" subtitle="By category">
          {revenueData && <Chart type="doughnut" data={revenueData} />}
        </Card>
      </div>

      <Card 
        title="Top Performing Products" 
        subtitle="Best sellers this period"
        noPadding
      >
        <Table columns={columns} data={topProducts} />
      </Card>
    </div>
  );
};

export default Sales;