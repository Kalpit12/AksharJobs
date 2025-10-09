import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';

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
    if (normalized.includes('intern')) return 'intern';
    if (normalized.includes('admin') || normalized.includes('administrator')) return 'admin';
    
    return role; // Return original if no match
  };

  useEffect(() => {
    console.log('🔐 AuthContext useEffect triggered - checking localStorage');
    
    // Clean up any 'undefined' values in localStorage
    const cleanupLocalStorage = () => {
      const keys = ['userEmail', 'userFirstName', 'userLastName'];
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value === 'undefined') {
          localStorage.removeItem(key);
        }
      });
    };
    
    cleanupLocalStorage();
    
    // Check for existing authentication on app load
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail') || localStorage.getItem('email');
    const firstName = localStorage.getItem('userFirstName') || localStorage.getItem('firstName');
    const lastName = localStorage.getItem('userLastName') || localStorage.getItem('lastName');
    const userType = localStorage.getItem('userType');

    console.log('🔐 AuthContext - localStorage values:', {
      token: token ? 'EXISTS' : 'NULL',
      role: role || 'NULL',
      userId: userId || 'NULL',
      email: email || 'NULL',
      firstName: firstName || 'NULL',
      lastName: lastName || 'NULL',
      userType: userType || 'NULL'
    });

    if (token && role && userId) {
      console.log('🔐 AuthContext - Valid tokens found, logging in user');
      const normalizedRole = normalizeRole(role);
      // Only set valid user data (not 'undefined' strings)
      const validEmail = email && email !== 'undefined' ? email : '';
      const validFirstName = firstName && firstName !== 'undefined' ? firstName : '';
      const validLastName = lastName && lastName !== 'undefined' ? lastName : '';
      
      setUser({
        token,
        role: normalizedRole,
        userId,
        email: validEmail,
        firstName: validFirstName,
        lastName: validLastName,
        userType: userType || normalizedRole
      });
      setIsAuthenticated(true);
      console.log('🔐 AuthContext - User logged in:', { role: normalizedRole, userId });
      
      // Check if intern needs to complete profile (on page load)
      if (normalizedRole === 'intern') {
        // Check with backend if profile is completed
        fetch(buildApiUrl('/api/interns/profile'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          console.log('🔐 AuthContext - Intern profile check:', data);
          // If no profile found or error, redirect to details form
          if (!data || data.error || !data.profileCompleted) {
            console.log('🔐 AuthContext - Intern profile incomplete, redirecting to details form');
            navigate('/intern-details', {
              state: {
                userData: {
                  email: validEmail,
                  firstName: validFirstName,
                  lastName: validLastName,
                  userId: userId,
                  bulkImported: true
                }
              }
            });
          }
        })
        .catch(err => {
          console.log('🔐 AuthContext - Profile check error, assuming incomplete:', err);
          // On error (like 404), assume profile is incomplete
          navigate('/intern-details', {
            state: {
              userData: {
                email: validEmail,
                firstName: validFirstName,
                lastName: validLastName,
                userId: userId,
                bulkImported: true
              }
            }
          });
        });
      }
    } else {
      console.log('🔐 AuthContext - No valid tokens found, user not authenticated');
      // Ensure user state is cleared and isAuthenticated is false
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [navigate]);

  const login = (userData, shouldNavigate = true, intendedDestination = null) => {
    console.log('🔐 AuthContext login() called with:', { userData, shouldNavigate, intendedDestination });
    console.trace('🔐 Login function call stack:');
    
    const { token, role, userId, email, firstName, lastName, ...otherData } = userData;
    const normalizedRole = normalizeRole(role);
    
    // Validate and clean user data before storing
    const validEmail = email && email !== 'undefined' ? email : '';
    const validFirstName = firstName && firstName !== 'undefined' ? firstName : '';
    const validLastName = lastName && lastName !== 'undefined' ? lastName : '';
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', normalizedRole);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', validEmail);
    localStorage.setItem('userFirstName', validFirstName);
    localStorage.setItem('userLastName', validLastName);
    localStorage.setItem('email', validEmail);
    localStorage.setItem('firstName', validFirstName);
    localStorage.setItem('lastName', validLastName);
    
    // Store userType if available
    if (otherData.userType) {
      localStorage.setItem('userType', otherData.userType);
    }
    
    setUser({ token, role: normalizedRole, userId, email: validEmail, firstName: validFirstName, lastName: validLastName, ...otherData });
    setIsAuthenticated(true);
    
    console.log('🔐 AuthContext - User logged in via login() function:', { 
      role: normalizedRole, 
      userId, 
      shouldNavigate, 
      intendedDestination, 
      profileCompleted: otherData.profileCompleted,
      bulkImported: otherData.bulkImported,
      allData: otherData
    });
    
    // Only redirect if shouldNavigate is true (default behavior)
    if (shouldNavigate) {
      // Check for intended destination first (from ProtectedRoute)
      const storedIntendedDestination = sessionStorage.getItem('intendedDestination');
      const targetDestination = intendedDestination || storedIntendedDestination;
      
      if (targetDestination && targetDestination !== '/login') {
        console.log('🔐 AuthContext - Redirecting to intended destination:', targetDestination);
        sessionStorage.removeItem('intendedDestination'); // Clean up
        navigate(targetDestination);
        return;
      }
      
      // Check if intern needs to complete profile (bulk-imported interns)
      // Use loose equality to catch false, undefined, null, 0, ""
      if (normalizedRole === 'intern' && !otherData.profileCompleted) {
        console.log('🔐 AuthContext - Intern profile incomplete, redirecting to details form');
        console.log('   - profileCompleted value:', otherData.profileCompleted);
        console.log('   - Navigating to /intern-details');
        navigate('/intern-details', {
          state: {
            userData: {
              email: validEmail,
              firstName: validFirstName,
              lastName: validLastName,
              userId: userId,
              bulkImported: otherData.bulkImported
            }
          }
        });
        return;
      }
      
      // Default dashboard redirect
      console.log('🔐 AuthContext - Navigating to dashboard for role:', normalizedRole);
      if (normalizedRole === 'admin') {
        navigate('/admin');
      } else if (normalizedRole === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (normalizedRole === 'intern') {
        navigate('/intern-dashboard');
      } else {
        navigate('/jobseeker-dashboard');
      }
    }
  };

  const logout = () => {
    console.log('🔐 AuthContext - logout() called, clearing all auth data');
    
    // Clear all authentication-related localStorage items
    const authKeys = [
      'token', 'role', 'userId', 'userEmail', 'userFirstName', 'userLastName',
      'user', 'authToken', 'userRole', 'currentUser', 'userData'
    ];
    
    authKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🔐 Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear any session storage that might persist state
    sessionStorage.removeItem('intendedDestination');
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('🔐 AuthContext - logout() complete, user should be logged out');
    console.log('🔐 AuthContext - isAuthenticated set to:', false);
    console.log('🔐 AuthContext - user set to:', null);
    
    // Force a page reload to ensure all components reset their state
    window.location.href = '/';
  };

  // Force clear all authentication data (for debugging)
  const forceLogout = () => {
    console.log('🔐 Force logout - clearing all localStorage data');
    
    // Clear all possible auth-related localStorage keys
    const authKeys = [
      'token', 'role', 'userId', 'userEmail', 'userFirstName', 'userLastName',
      'authToken', 'user', 'userRole', 'currentUser', 'userData'
    ];
    
    authKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🔐 Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    setUser(null);
    setIsAuthenticated(false);
    console.log('🔐 Force logout complete - user should now see login/signup');
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
    } else if (required === 'intern') {
      return userRole === 'intern';
    } else if (required === 'admin') {
      return userRole === 'admin' || userRole === 'administrator';
    }
    
    return userRole === required;
  };

  const isJobSeeker = () => hasRole('jobSeeker');
  const isRecruiter = () => hasRole('recruiter');
  const isIntern = () => hasRole('intern');
  const isAdmin = () => hasRole('admin');

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    forceLogout,
    updateUser,
    hasRole,
    isJobSeeker,
    isRecruiter,
    isIntern,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
