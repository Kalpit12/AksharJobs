import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faEye, 
  faEdit, 
  faBan, 
  faTrash, 
  faUserCheck,
  faUserTimes,
  faDownload,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, userTypeFilter]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchUsers();
        alert(`User ${action} successfully!`);
      } else {
        throw new Error(`Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users to perform this action.');
      return;
    }

    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/users/bulk-action', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action: action
        })
      });
      
      if (response.ok) {
        await fetchUsers();
        setSelectedUsers([]);
        alert(`Bulk ${action} completed successfully!`);
      } else {
        throw new Error(`Failed to perform bulk ${action}`);
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      alert(`Failed to perform bulk ${action}. Please try again.`);
    }
  };

  const exportUsers = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Failed to export users. Please try again.');
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return <div className="loading">Loading Users...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>User Management</h2>
        <p>Manage user accounts, monitor activity, and control access</p>
      </div>

      <div className="user-controls">
        <div className="search-filters">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search users by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="job_seeker">Job Seekers</option>
              <option value="recruiter">Recruiters</option>
            </select>
          </div>
        </div>

        <div className="bulk-actions">
          <button 
            className="bulk-btn suspend"
            onClick={() => handleBulkAction('suspend')}
            disabled={selectedUsers.length === 0}
          >
            <FontAwesomeIcon icon={faBan} />
            Suspend Selected
          </button>
          
          <button 
            className="bulk-btn activate"
            onClick={() => handleBulkAction('activate')}
            disabled={selectedUsers.length === 0}
          >
            <FontAwesomeIcon icon={faUserCheck} />
            Activate Selected
          </button>
          
          <button 
            className="bulk-btn delete"
            onClick={() => handleBulkAction('delete')}
            disabled={selectedUsers.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete Selected
          </button>
        </div>

        <div className="export-actions">
          <button 
            className="export-btn"
            onClick={() => exportUsers('csv')}
          >
            <FontAwesomeIcon icon={faDownload} />
            Export CSV
          </button>
          
          <button 
            className="refresh-btn"
            onClick={fetchUsers}
          >
            <FontAwesomeIcon icon={faRefresh} />
            Refresh
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleAllUsers}
                />
              </th>
              <th>User</th>
              <th>Type</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className={user.status}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                  />
                </td>
                <td className="user-info">
                  <div className="user-avatar">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <span className="user-name">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="user-email">{user.email}</span>
                    {user.companyName && (
                      <span className="user-company">{user.companyName}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`user-type ${user.userType}`}>
                    {user.userType === 'job_seeker' ? 'Job Seeker' : 'Recruiter'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="subscription-info">
                    <span className="plan-name">{user.subscription?.plan || 'Basic'}</span>
                    <span className="plan-status">{user.subscription?.status || 'active'}</span>
                  </div>
                </td>
                <td>
                  {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                </td>
                <td className="actions">
                  <button
                    className="action-btn view"
                    onClick={() => setShowUserDetails(user)}
                    title="View Details"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  
                  <button
                    className="action-btn edit"
                    onClick={() => {/* Handle edit */}}
                    title="Edit User"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  
                  {user.status === 'active' ? (
                    <button
                      className="action-btn suspend"
                      onClick={() => handleUserAction(user._id, 'suspend')}
                      title="Suspend User"
                    >
                      <FontAwesomeIcon icon={faBan} />
                    </button>
                  ) : (
                    <button
                      className="action-btn activate"
                      onClick={() => handleUserAction(user._id, 'activate')}
                      title="Activate User"
                    >
                      <FontAwesomeIcon icon={faUserCheck} />
                    </button>
                  )}
                  
                  <button
                    className="action-btn delete"
                    onClick={() => handleUserAction(user._id, 'delete')}
                    title="Delete User"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {showUserDetails && (
        <div className="user-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUserDetails(null)}
              >
                ×
              </button>
            </div>
            
            <div className="user-details-content">
              <div className="user-profile">
                <div className="profile-image">
                  {showUserDetails.profileImage ? (
                    <img src={showUserDetails.profileImage} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder large">
                      {showUserDetails.firstName?.charAt(0)}{showUserDetails.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="profile-info">
                  <h4>{showUserDetails.firstName} {showUserDetails.lastName}</h4>
                  <p><strong>Email:</strong> {showUserDetails.email}</p>
                  <p><strong>Phone:</strong> {showUserDetails.phoneNumber || 'Not provided'}</p>
                  <p><strong>User Type:</strong> {showUserDetails.userType === 'job_seeker' ? 'Job Seeker' : 'Recruiter'}</p>
                  {showUserDetails.companyName && (
                    <p><strong>Company:</strong> {showUserDetails.companyName}</p>
                  )}
                  {showUserDetails.companyWebsite && (
                    <p><strong>Website:</strong> <a href={showUserDetails.companyWebsite} target="_blank" rel="noopener noreferrer">{showUserDetails.companyWebsite}</a></p>
                  )}
                </div>
              </div>
              
              <div className="user-stats">
                <h4>Account Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">
                      {showUserDetails.createdAt ? new Date(showUserDetails.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">Last Active</span>
                    <span className="stat-value">
                      {showUserDetails.lastActive ? new Date(showUserDetails.lastActive).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">Status</span>
                    <span className={`stat-value status-${showUserDetails.status}`}>
                      {showUserDetails.status}
                    </span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">Subscription</span>
                    <span className="stat-value">
                      {showUserDetails.subscription?.plan || 'Basic'} - {showUserDetails.subscription?.status || 'active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
