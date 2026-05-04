import React, { useState, useEffect } from 'react';
import Card from '../components/Card/Card.jsx';
import Table from '../components/Table/Table.jsx';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Real API integration - JSONPlaceholder
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      
      // Transform data to match our needs
      const transformedUsers = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        company: user.company.name,
        city: user.address.city,
        phone: user.phone,
        status: Math.random() > 0.3 ? 'active' : 'inactive',
        role: Math.random() > 0.5 ? 'user' : 'admin',
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          .toLocaleDateString()
      }));

      setUsers(transformedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => <span className="user-id">#{value}</span>
    },
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div className="user-name-cell">
          <div className="user-avatar-small">
            {value.charAt(0)}
          </div>
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`role-badge ${value}`}>
          {value === 'admin' ? '👑' : '👤'} {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value}
        </span>
      )
    },
    {
      key: 'company',
      label: 'Company'
    },
    {
      key: 'joinDate',
      label: 'Join Date'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="action-buttons-small">
          <button 
            className="action-btn-small edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            ✏️
          </button>
          <button 
            className="action-btn-small delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            🗑️
          </button>
        </div>
      )
    }
  ];

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
    alert(`Edit user: ${user.name}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleAddUser = () => {
    alert('Add new user functionality');
  };

  const exportUsers = () => {
    const csv = [
      Object.keys(users[0]).join(','),
      ...users.map(user => Object.values(user).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-description">
            Manage and monitor all registered users
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={exportUsers}>
            📥 Export CSV
          </button>
          <button className="primary-btn" onClick={handleAddUser}>
            ➕ Add User
          </button>
        </div>
      </div>

      <div className="users-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon">👥</div>
          <div>
            <p className="user-stat-label">Total Users</p>
            <h3 className="user-stat-value">{users.length}</h3>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="user-stat-icon">✅</div>
          <div>
            <p className="user-stat-label">Active</p>
            <h3 className="user-stat-value">
              {users.filter(u => u.status === 'active').length}
            </h3>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="user-stat-icon">👑</div>
          <div>
            <p className="user-stat-label">Admins</p>
            <h3 className="user-stat-value">
              {users.filter(u => u.role === 'admin').length}
            </h3>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="user-stat-icon">👤</div>
          <div>
            <p className="user-stat-label">Regular Users</p>
            <h3 className="user-stat-value">
              {users.filter(u => u.role === 'user').length}
            </h3>
          </div>
        </div>
      </div>

      <Card title="All Users" subtitle={`${users.length} total users`} noPadding>
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={users}
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-avatar">
                {selectedUser.name.charAt(0)}
              </div>
              <div className="user-detail-grid">
                <div className="user-detail-item">
                  <label>Name</label>
                  <p>{selectedUser.name}</p>
                </div>
                <div className="user-detail-item">
                  <label>Username</label>
                  <p>{selectedUser.username}</p>
                </div>
                <div className="user-detail-item">
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="user-detail-item">
                  <label>Phone</label>
                  <p>{selectedUser.phone}</p>
                </div>
                <div className="user-detail-item">
                  <label>Company</label>
                  <p>{selectedUser.company}</p>
                </div>
                <div className="user-detail-item">
                  <label>City</label>
                  <p>{selectedUser.city}</p>
                </div>
                <div className="user-detail-item">
                  <label>Role</label>
                  <p>
                    <span className={`role-badge ${selectedUser.role}`}>
                      {selectedUser.role === 'admin' ? '👑' : '👤'} {selectedUser.role}
                    </span>
                  </p>
                </div>
                <div className="user-detail-item">
                  <label>Status</label>
                  <p>
                    <span className={`status-badge ${selectedUser.status}`}>
                      {selectedUser.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button 
                className="primary-btn"
                onClick={() => handleEdit(selectedUser)}
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;