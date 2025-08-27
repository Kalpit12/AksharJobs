import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/AdminSidebar';
import Header from '../components/AdminHeader';
import JobSeekerMatrix from '../components/JobSeekerMatrix';
import RecruiterMatrix from '../components/RecruiterMatrix';
import PlanManagement from '../components/PlanManagement';
import AnalyticsDashboard from '../components/AdminAnalyticsDashboard';
import UserManagement from '../components/UserManagement';
import SwahiliAnalysisManagement from '../components/SwahiliAnalysisManagement';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [systemStats, setSystemStats] = useState({
    totalJobSeekers: 0,
    totalRecruiters: 0,
    totalResumes: 0,
    totalJobs: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    monthlyActiveUsers: 0,
    dailyActiveUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get admin user info
  const adminName = localStorage.getItem('firstName') || 'Admin';
  const adminEmail = localStorage.getItem('email') || 'admin@rocketmatch.com';

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchSystemStats();
  }, [navigate]);

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data);
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="admin-dashboard-main">
            <h2>Welcome back, {adminName}!</h2>
            <p className="admin-subtitle">System Control Center - Manage your platform</p>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Job Seekers</h3>
                <p className="stat-number">{systemStats.totalJobSeekers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Recruiters</h3>
                <p className="stat-number">{systemStats.totalRecruiters}</p>
              </div>
              <div className="stat-card">
                <h3>Total Resumes</h3>
                <p className="stat-number">{systemStats.totalResumes}</p>
              </div>
              <div className="stat-card">
                <h3>Total Jobs</h3>
                <p className="stat-number">{systemStats.totalJobs}</p>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <p className="stat-number">{systemStats.activeUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Monthly Active Users</h3>
                <p className="stat-number">{systemStats.monthlyActiveUsers}</p>
              </div>
            </div>
            
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => setActiveView('jobseeker-matrix')}>
                  Manage Job Seeker Features
                </button>
                <button onClick={() => setActiveView('recruiter-matrix')}>
                  Manage Recruiter Features
                </button>
                <button onClick={() => setActiveView('plans')}>
                  Manage Subscription Plans
                </button>
                <button onClick={() => setActiveView('users')}>
                  Manage Users
                </button>
                <button onClick={() => setActiveView('swahili-analysis')}>
                  Manage Swahili Analysis
                </button>
              </div>
            </div>
          </div>
        );
      case 'jobseeker-matrix':
        return <JobSeekerMatrix />;
      case 'recruiter-matrix':
        return <RecruiterMatrix />;
      case 'plans':
        return <PlanManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <UserManagement />;
      case 'swahili-analysis':
        return <SwahiliAnalysisManagement />;
      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <LoadingSpinner 
          type="pulse" 
          size="large" 
          text="Loading Admin Dashboard..." 
          showText={true}
        />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="admin-content">
        <Header />
        <main className="admin-main">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
