import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBriefcase,
  faEllipsisV,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faTrash,
  faEye,
  faDownload,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import ThemedLoadingSpinner from './ThemedLoadingSpinner';
import './ApplicationTrackerTable.css';

const ApplicationTrackerTable = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view applications');
      }

      // Get user role from localStorage
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
      
      // Use different endpoint based on user type
      let endpoint;
      if (userRole === 'intern') {
        endpoint = '/api/intern/applications';
      } else {
        endpoint = '/api/application-tracker/tracker/job-seeker/applications';
      }

      console.log('📋 Fetching applications for role:', userRole, 'from:', endpoint);

      const response = await axios.get(
        buildApiUrl(endpoint),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const applicationsData = response.data.applications || response.data || [];
      console.log('✅ Fetched applications:', applicationsData.length);
      setApplications(applicationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => 
        app.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        buildApiUrl(`/api/applications/${applicationId}/status`),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setApplications(prevApps =>
        prevApps.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      setOpenStatusDropdown(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: '#f59e0b',
      reviewing: '#3b82f6',
      shortlisted: '#10b981',
      rejected: '#ef4444',
      'interviewed & interested': '#8b5cf6',
      'interviewed & not interested': '#6b7280',
      'no/slow response': '#94a3b8'
    };
    return statusMap[status.toLowerCase()] || '#6b7280';
  };

  const getCompanyInitial = (company) => {
    return company?.charAt(0).toUpperCase() || 'C';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'string') return salary;
    
    // Handle stipend object {min, max, currency}
    if (salary.min !== undefined && salary.max !== undefined) {
      const currency = salary.currency || 'USD';
      const symbol = currency === 'USD' ? '$' : currency;
      return `${symbol}${salary.min} - ${symbol}${salary.max}`;
    }
    
    return 'Not specified';
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === paginatedApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(paginatedApplications.map(app => app._id));
    }
  };

  const toggleSelectApplication = (appId) => {
    setSelectedApplications(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedApplications([]);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <ThemedLoadingSpinner
        theme="default"
        size="large"
        text="Loading your applications..."
        fullScreen={false}
      />
    );
  }

  return (
    <div className="application-tracker-container">
      <div className="tracker-header">
        <h1>Applied Jobs</h1>
      </div>

      {/* Stats Card */}
      <div className="stats-card">
        <div className="stats-icon">
          <FontAwesomeIcon icon={faBriefcase} />
        </div>
        <div className="stats-content">
          <h3>Jobs You Have Applied</h3>
          <p className="stats-count">{applications.length} Jobs applied</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="tracker-controls">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={statusFilter === 'all' ? 'active' : ''}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={statusFilter === 'pending' ? 'active' : ''}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={statusFilter === 'shortlisted' ? 'active' : ''}
            onClick={() => setStatusFilter('shortlisted')}
          >
            Shortlisted
          </button>
          <button
            className={statusFilter === 'rejected' ? 'active' : ''}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="empty-state">
          <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '64px', color: '#ccc' }} />
          <h3>No applications found</h3>
          <p>You haven't applied to any jobs yet or no results match your filters.</p>
        </div>
      ) : (
        <>
          <div className="tracker-table-wrapper">
            <table className="tracker-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={
                        paginatedApplications.length > 0 &&
                        selectedApplications.length === paginatedApplications.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="company-cell">Company Name</th>
                  <th className="job-title-cell">Job Title</th>
                  <th className="salary-cell">Stipend</th>
                  <th className="date-cell">Applied Date</th>
                  <th className="interview-type-cell">Type</th>
                  <th className="status-cell">Status</th>
                  <th className="action-cell"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.map((app) => (
                  <tr key={app._id}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(app._id)}
                        onChange={() => toggleSelectApplication(app._id)}
                      />
                    </td>
                    <td className="company-cell">
                      <div className="company-info">
                        <div className="company-logo">
                          {app.companyLogo ? (
                            <img src={app.companyLogo} alt={app.company || app.companyName} />
                          ) : (
                            <div className="company-initial">
                              {getCompanyInitial(app.company || app.companyName)}
                            </div>
                          )}
                        </div>
                        <div className="company-details">
                          <div className="company-name" title={app.company || app.companyName || 'Company'}>
                            {app.company || app.companyName || 'Company'}
                          </div>
                          <div className="company-location" title={app.location || 'Location not specified'}>
                            {app.location || 'Location not specified'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="job-title-cell" title={app.jobTitle || app.job_title || 'Job Title'}>
                      {app.jobTitle || app.job_title || 'Job Title'}
                    </td>
                    <td className="salary-cell">
                      {formatSalary(app.internshipDetails?.stipend || app.salary || app.salary_range)}
                    </td>
                    <td className="date-cell">
                      {formatDate(app.appliedAt || app.applied_at)}
                    </td>
                    <td className="interview-type-cell">
                      <span className={`interview-badge ${(app.interviewType || app.internshipDetails?.remote_option || 'Virtual').toLowerCase()}`}>
                        {app.interviewType || app.internshipDetails?.remote_option || 'Virtual'}
                      </span>
                    </td>
                    <td className="status-cell">
                      <div
                        className="status-dropdown"
                        onClick={() => setOpenStatusDropdown(openStatusDropdown === app._id ? null : app._id)}
                      >
                        <div className="status-display">
                          <span
                            className="status-dot"
                            style={{ backgroundColor: getStatusColor(app.status) }}
                          />
                          <span className="status-text">{app.status}</span>
                          <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                        </div>

                        {openStatusDropdown === app._id && (
                          <div className="status-dropdown-menu">
                            <div
                              className="status-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app._id, 'Pending');
                              }}
                            >
                              Pending
                            </div>
                            <div
                              className="status-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app._id, 'Interviewed & Interested');
                              }}
                            >
                              Interviewed & Interested
                            </div>
                            <div
                              className="status-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app._id, 'Interviewed & Not Interested');
                              }}
                            >
                              Interviewed & Not Interested
                            </div>
                            <div
                              className="status-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app._id, 'Shortlisted');
                              }}
                            >
                              Shortlisted
                            </div>
                            <div
                              className="status-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app._id, 'Rejected');
                              }}
                            >
                              Rejected
                            </div>
                            <div
                              className="status-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app._id, 'No/Slow Response');
                              }}
                            >
                              No/Slow Response
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="action-cell">
                      <div className="action-menu-wrapper">
                        <button
                          className="action-menu-btn"
                          onClick={() => setOpenActionMenu(openActionMenu === app._id ? null : app._id)}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {openActionMenu === app._id && (
                          <div className="action-dropdown-menu">
                            <div className="action-option">
                              <FontAwesomeIcon icon={faEye} /> View Details
                            </div>
                            <div className="action-option">
                              <FontAwesomeIcon icon={faDownload} /> Download Resume
                            </div>
                            <div className="action-option danger">
                              <FontAwesomeIcon icon={faTrash} /> Withdraw Application
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
              </button>

              <div className="pagination-pages">
                {renderPagination().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationTrackerTable;

