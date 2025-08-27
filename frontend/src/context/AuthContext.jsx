import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Helper function to normalize role values
  const normalizeRole = (role) => {
    if (!role) return null;
    const normalized = role.toLowerCase().replace(/[_-]/g, '');
    
    if (normalized.includes('recruiter')) return 'recruiter';
    if (normalized.includes('jobseeker') || normalized.includes('jobseeker')) return 'jobSeeker';
    if (normalized.includes('admin') || normalized.includes('administrator')) return 'admin';
    
    return role; // Return original if no match
  };

  useEffect(() => {
    // Check for existing authentication on app load
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');
    const firstName = localStorage.getItem('userFirstName');
    const lastName = localStorage.getItem('userLastName');

    if (token && role && userId) {
      const normalizedRole = normalizeRole(role);
      setUser({
        token,
        role: normalizedRole,
        userId,
        email,
        firstName,
        lastName
      });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const { token, role, userId, email, firstName, lastName, ...otherData } = userData;
    const normalizedRole = normalizeRole(role);
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', normalizedRole);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    
    setUser({ token, role: normalizedRole, userId, email, firstName, lastName, ...otherData });
    setIsAuthenticated(true);
    
    // Redirect based on role
    if (normalizedRole === 'admin') {
      navigate('/admin');
    } else if (normalizedRole === 'recruiter') {
      navigate('/recruiter-dashboard');
    } else {
      navigate('/jobseeker-dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    
    const userRole = user.role.toLowerCase();
    const required = requiredRole.toLowerCase();
    
    // Handle different role formats
    if (required === 'recruiter') {
      return userRole === 'recruiter';
    } else if (required === 'jobseeker') {
      return userRole === 'jobseeker' || userRole === 'job_seeker';
    } else if (required === 'admin') {
      return userRole === 'admin' || userRole === 'administrator';
    }
    
    return userRole === required;
  };

  const isJobSeeker = () => hasRole('jobSeeker');
  const isRecruiter = () => hasRole('recruiter');
  const isAdmin = () => hasRole('admin');

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
    isJobSeeker,
    isRecruiter,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
