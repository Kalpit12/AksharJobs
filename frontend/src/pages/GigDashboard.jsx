import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigApi } from '../api/gigApi';

import BackButton from '../components/BackButton';
import '../styles/GigDashboard.css';

const GigDashboard = () => {
    const navigate = useNavigate();
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        location_type: '',
        max_budget: ''
    });
    const [categories, setCategories] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Get user role from localStorage
        const role = localStorage.getItem('role');
        setUserRole(role || '');
        
        loadGigs();
        loadCategories(role);
    }, [filters]);

    const loadGigs = async () => {
        try {
            setLoading(true);
            const result = await gigApi.getGigs(filters);
            if (result.success) {
                setGigs(result.gigs);
            }
        } catch (err) {
            setError(err.error || 'Failed to load gigs');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async (role) => {
        try {
            const result = await gigApi.getCategories(role);
            if (result.success) {
                setCategories(result.categories);
            }
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            status: '',
            location_type: '',
            max_budget: ''
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'status-open';
            case 'in_progress': return 'status-progress';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    };

    const formatCurrency = (amount) => {
        return `KES ${amount.toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-KE');
    };

    if (loading) {
        return (
            <div className="gig-dashboard">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading gigs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gig-dashboard">
            {/* Back Button */}
            <BackButton to="/jobseeker-dashboard" text="Back" />

            <div className="dashboard-header">
                <h1>Hustle Economy Gig Marketplace</h1>
                <p>Find freelance opportunities or post your own gigs</p>
                {userRole && (
                    <div className="user-role-info">
                        <span className="role-badge">
                            {userRole === 'recruiter' ? '🏢 Company Account' : '👤 Service Provider'}
                        </span>
                        <p className="role-description">
                            {userRole === 'recruiter' 
                                ? 'Post company projects and hire talent' 
                                : 'Offer your services and skills'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Category</label>
                        <select 
                            value={filters.category} 
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status</label>
                        <select 
                            value={filters.status} 
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Location Type</label>
                        <select 
                            value={filters.location_type} 
                            onChange={(e) => handleFilterChange('location_type', e.target.value)}
                        >
                            <option value="">All Locations</option>
                            <option value="remote">Remote</option>
                            <option value="on-site">On-Site</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Max Budget (KES)</label>
                        <input 
                            type="number" 
                            placeholder="Enter amount"
                            value={filters.max_budget} 
                            onChange={(e) => handleFilterChange('max_budget', e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-actions">
                    <button className="btn btn-secondary" onClick={clearFilters}>
                        Clear Filters
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                        Post New Gig
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Gigs Grid */}
            <div className="gigs-grid">
                {gigs.length === 0 ? (
                    <div className="no-gigs">
                        <div className="no-gigs-icon">💼</div>
                        <h3>No gigs found</h3>
                        <p>Try adjusting your filters or be the first to post a gig!</p>
                    </div>
                ) : (
                    gigs.map(gig => (
                        <div key={gig._id} className="gig-card">
                            <div className="gig-header">
                                <h3 className="gig-title">{gig.title}</h3>
                                <span className={`status-badge ${getStatusColor(gig.status)}`}>
                                    {gig.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <p className="gig-description">{gig.description}</p>

                            <div className="gig-details">
                                <div className="detail-item">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">{gig.category}</span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Budget:</span>
                                    <span className="detail-value">
                                        {formatCurrency(gig.budget.min_amount)} - {formatCurrency(gig.budget.max_amount)}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Duration:</span>
                                    <span className="detail-value">{gig.duration} days</span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Location:</span>
                                    <span className="detail-value">
                                        {gig.location.type.charAt(0).toUpperCase() + gig.location.type.slice(1)}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Deadline:</span>
                                    <span className="detail-value">{formatDate(gig.deadline)}</span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Applications:</span>
                                    <span className="detail-value">{gig.applications_count}</span>
                                </div>
                            </div>

                            <div className="gig-skills">
                                <span className="skills-label">Skills Required:</span>
                                <div className="skills-tags">
                                    {gig.skills_required.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="gig-actions">
                                <button className="btn btn-outline">View Details</button>
                                <button className="btn btn-primary">Apply Now</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Gig Modal would go here */}
            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Gig</h2>
                        <p>This feature is coming soon!</p>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowCreateForm(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GigDashboard;
