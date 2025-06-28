import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      // Use direct admin service endpoint
      const response = await axios.get('http://localhost:8009/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success && response.data.data) {
        // Handle paginated response structure
        if (response.data.data.users) {
          setUsers(response.data.data.users);
        } else if (Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          setUsers([]);
        }
      } else if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      // Check if passwords match
      if (newUser.password !== newUser.confirm_password) {
        alert('Passwords do not match!');
        return;
      }

      // Create user via admin service
      const response = await axios.post('/admin-api/users', {
        email: newUser.email,
        password: newUser.password,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        role: 'user'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        await fetchUsers(); // Refresh the list
        setShowAddModal(false);
        setNewUser({
          email: '',
          password: '',
          confirm_password: '',
          first_name: '',
          last_name: '',
          phone: ''
        });
        alert('User added successfully!');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        alert('Error adding user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await axios.put(`/admin-api/users/${selectedUser.id}`, {
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        phone: selectedUser.phone,
        is_active: selectedUser.is_active
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        await fetchUsers(); // Refresh the list
        setShowEditModal(false);
        setSelectedUser(null);
        alert('User updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        alert('Error updating user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to delete user: ${userEmail}? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No admin token found');
        }

        // Try multiple endpoints for deletion
        let deleteSuccess = false;
        let errorMessage = '';

        try {
          // First try the admin-api endpoint
          await axios.delete(`/admin-api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          deleteSuccess = true;
        } catch (adminApiError) {
          console.log('Admin API delete failed, trying direct admin service...');
          try {
            // Try direct admin service endpoint
            const response = await axios.delete(`http://localhost:8009/api/v1/users/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.data && response.data.success) {
              deleteSuccess = true;
            } else {
              errorMessage = response.data?.message || 'Delete failed';
            }
          } catch (directError) {
            errorMessage = directError.response?.data?.message || directError.message;
          }
        }

        if (deleteSuccess) {
          // Remove user from local state immediately for better UX
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId && user._id !== userId));
          
          alert('User deleted successfully!');
          
          // Refresh the list after a short delay to ensure consistency
          setTimeout(() => {
            fetchUsers();
          }, 1000);
        } else {
          throw new Error(errorMessage || 'Failed to delete user');
        }

      } catch (error) {
        console.error('Error deleting user:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else if (error.response?.status === 403) {
          alert('You do not have permission to delete users. Please contact a super admin.');
        } else if (error.response?.status === 404) {
          alert('User not found. They may have already been deleted.');
          fetchUsers(); // Refresh to sync state
        } else {
          alert('Error deleting user: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      await axios.put(`/admin-api/users/${userId}`, {
        is_active: !currentStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      await fetchUsers(); // Refresh the list
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        alert('Error updating user status: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <button onClick={() => navigate('/admin')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>User Management</h1>
        <button onClick={() => setShowAddModal(true)} className="add-btn">
          ➕ Add User
        </button>
      </div>

      <div className="users-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="users-stats">
          <span>Total Users: {users.length}</span>
          <span>Active: {users.filter(u => u.is_active).length}</span>
          <span>Inactive: {users.filter(u => !u.is_active).length}</span>
        </div>
      </div>

      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Users Found</h3>
            <p>No users match your search criteria or no users exist yet.</p>
            <button onClick={() => setShowAddModal(true)} className="add-first-btn">
              Add First User
            </button>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id || user.email}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {(user.first_name?.[0] || '?').toUpperCase()}
                        {(user.last_name?.[0] || '').toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'Not provided'}</td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="edit-btn"
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`toggle-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                        title={user.is_active ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.is_active ? '🔒' : '🔓'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="delete-btn"
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={newUser.confirm_password}
                    onChange={(e) => setNewUser({...newUser, confirm_password: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleEditUser} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={selectedUser.first_name}
                    onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={selectedUser.last_name}
                    onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email (Read Only)</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedUser.is_active}
                    onChange={(e) => setSelectedUser({...selectedUser, is_active: e.target.checked})}
                  />
                  Active User
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
