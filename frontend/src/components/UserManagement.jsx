import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEdit, 
  faTrash, 
  faBan, 
  faCheckCircle, 
  faTimesCircle,
  faEye,
  faSearch,
  faFilter,
  faDownload,
  faUpload,
  faCrown,
  faUserTie,
  faUserGraduate,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendar,
  faFileLines,
  faShieldAlt,
  faKey,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { FadeInUp } from './animations';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/users')
      );

      if (response?.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        // Mock data for demonstration
        setUsers([
          {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@email.com',
            role: 'jobSeeker',
            status: 'active',
            avatar: null,
            lastActive: '2024-01-15T10:30:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            location: 'New York, NY',
            phone: '+1-555-0123',
            profileCompleted: true,
            resumeUploaded: true,
            applicationsCount: 5
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            role: 'recruiter',
            status: 'active',
            avatar: null,
            lastActive: '2024-01-15T09:15:00Z',
            createdAt: '2023-12-15T00:00:00Z',
            location: 'San Francisco, CA',
            phone: '+1-555-0456',
            profileCompleted: true,
            jobsPosted: 12,
            candidatesHired: 8
          },
          {
            id: 3,
            name: 'Mike Chen',
            email: 'mike.chen@admin.com',
            role: 'admin',
            status: 'active',
            avatar: null,
            lastActive: '2024-01-15T11:45:00Z',
            createdAt: '2023-11-01T00:00:00Z',
            location: 'Austin, TX',
            phone: '+1-555-0789',
            profileCompleted: true,
            adminLevel: 'super'
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            role: 'jobSeeker',
            status: 'suspended',
            avatar: null,
            lastActive: '2024-01-10T14:20:00Z',
            createdAt: '2024-01-05T00:00:00Z',
            location: 'Chicago, IL',
            phone: '+1-555-0321',
            profileCompleted: false,
            resumeUploaded: false,
            applicationsCount: 0,
            suspensionReason: 'Inappropriate content'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl(`/api/admin/users/${userId}/${action}`),
        { method: 'POST' }
      );

      if (response?.ok) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: action === 'activate' ? 'active' : 'suspended' }
            : user
        ));
      }
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/admin/users/bulk-action'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds: selectedUsers, action })
        }
      );

      if (response?.ok) {
        loadUsers(); // Refresh data
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const currentPageUsers = getCurrentPageUsers();
    const allSelected = currentPageUsers.every(user => selectedUsers.includes(user.id));
    
    if (allSelected) {
      setSelectedUsers([]);
    } else {
      const newSelected = [...new Set([...selectedUsers, ...currentPageUsers.map(user => user.id)])];
      setSelectedUsers(newSelected);
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return faCrown;
      case 'recruiter': return faUserTie;
      case 'jobSeeker': return faUserGraduate;
      default: return faUser;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#f59e0b';
      case 'recruiter': return '#10b981';
      case 'jobSeeker': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'suspended': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentPageUsers = getCurrentPageUsers();

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <button className="export-btn">
            <FontAwesomeIcon icon={faDownload} />
            Export Users
          </button>
          <button className="import-btn">
            <FontAwesomeIcon icon={faUpload} />
            Import Users
          </button>
        </div>
      </div>

      <div className="user-filters">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search users by name, email, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="jobSeeker">Job Seekers</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedUsers.length} user(s) selected</span>
          <div className="bulk-buttons">
            <button 
              className="bulk-btn activate"
              onClick={() => handleBulkAction('activate')}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Activate
            </button>
            <button 
              className="bulk-btn suspend"
              onClick={() => handleBulkAction('suspend')}
            >
              <FontAwesomeIcon icon={faBan} />
              Suspend
            </button>
            <button 
              className="bulk-btn delete"
              onClick={() => handleBulkAction('delete')}
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={currentPageUsers.length > 0 && currentPageUsers.every(user => selectedUsers.includes(user.id))}
                  onChange={handleSelectAll}
                />
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Profile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageUsers.map((user, index) => (
              <FadeInUp key={user.id} delay={index * 0.1}>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          {user.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="role-info">
                      <FontAwesomeIcon 
                        icon={getRoleIcon(user.role)} 
                        style={{ color: getRoleColor(user.role) }}
                      />
                      <span className="role-name">{user.role}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="last-active">
                      <FontAwesomeIcon icon={faCalendar} />
                      {formatDate(user.lastActive)}
                    </div>
                  </td>
                  <td>
                    <div className="profile-status">
                      <div className={`status-item ${user.profileCompleted ? 'completed' : 'incomplete'}`}>
                        <FontAwesomeIcon icon={faUser} />
                        Profile
                      </div>
                      {user.role === 'jobSeeker' && (
                        <div className={`status-item ${user.resumeUploaded ? 'completed' : 'incomplete'}`}>
                          <FontAwesomeIcon icon={faFileLines} />
                          Resume
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                        title="View Profile"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => window.open(`/admin/users/${user.id}/edit`, '_blank')}
                        title="Edit User"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          className="action-btn suspend"
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          title="Suspend User"
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      ) : (
                        <button 
                          className="action-btn activate"
                          onClick={() => handleUserAction(user.id, 'activate')}
                          title="Activate User"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                      )}
                      <button 
                        className="action-btn delete"
                        onClick={() => handleUserAction(user.id, 'delete')}
                        title="Delete User"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              </FadeInUp>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;