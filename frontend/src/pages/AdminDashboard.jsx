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
import BulkImport from '../components/BulkImport';
import DashboardTemplateEditor from '../components/DashboardTemplateEditor';
import AdminMessaging from '../components/AdminMessaging';
import ModernLoadingSpinner from '../components/ModernLoadingSpinner';
import QuickActions from '../components/QuickActions';
// import '../styles/AdminDashboard.css'; // Replaced by unified CSS

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
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');
    
    // Check if user is logged in and is admin
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Check if user has admin role (role could be 'admin' or userType could be 'admin')
    if (role !== 'admin' && userType !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchSystemStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only check on mount

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Skip stats fetch if no token
      if (!token) {
        console.log('⚠️ No token found, skipping stats fetch');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data);
      } else {
        console.error('❌ Failed to fetch admin stats:', response.status, response.statusText);
        // Set default stats instead of failing
        setSystemStats({
          totalJobSeekers: 0,
          totalRecruiters: 0,
          totalResumes: 0,
          totalJobs: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          monthlyActiveUsers: 0,
          dailyActiveUsers: 0
        });
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
      // Set default stats on error
      setSystemStats({
        totalJobSeekers: 0,
        totalRecruiters: 0,
        totalResumes: 0,
        totalJobs: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        monthlyActiveUsers: 0,
        dailyActiveUsers: 0
      });
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
            
            <QuickActions
              theme="admin"
              onBrowseJobs={() => setActiveView('jobseeker-matrix')}
              onUpdateResume={() => setActiveView('bulk-import')}
              onEditProfile={() => setActiveView('users')}
              customActions={[
                {
                  id: 'analytics',
                  text: 'VIEW ANALYTICS',
                  icon: 'faChartBar',
                  emoji: '📊',
                  onClick: () => setActiveView('analytics'),
                  description: 'View system analytics and reports'
                },
                {
                  id: 'plans',
                  text: 'MANAGE PLANS',
                  icon: 'faCreditCard',
                  emoji: '💳',
                  onClick: () => setActiveView('plans'),
                  description: 'Manage subscription plans'
                },
                {
                  id: 'settings',
                  text: 'SYSTEM SETTINGS',
                  icon: 'faCog',
                  emoji: '⚙️',
                  onClick: () => setActiveView('settings'),
                  description: 'Configure system settings'
                }
              ]}
            />
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
      case 'template-editor':
        return <DashboardTemplateEditor />;
      case 'messaging':
        return <AdminMessaging />;
      case 'users':
        return <UserManagement />;
      case 'swahili-analysis':
        return <SwahiliAnalysisManagement />;
      case 'bulk-import':
        return <BulkImport />;
      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <ModernLoadingSpinner 
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
