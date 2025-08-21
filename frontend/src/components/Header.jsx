import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const recruiterAvatar = "https://tse1.mm.bing.net/th?id=OIP.SLlIMAFQM9EeKfUS610FdwAAAA&pid=Api&P=0&h=180";
  const jobSeekerAvatar = "https://www.w3schools.com/w3images/avatar2.png";

  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const loadUserdata = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/auth/get_user?userId=${userId}`);
      if (response.data) {
        setUserName(response.data.firstName);
        setUserImage(response.data.profileImage || (userRole === "recruiter" ? recruiterAvatar : jobSeekerAvatar));
        // Check if user has premium subscription
        const paymentData = localStorage.getItem('paymentData');
        if (paymentData) {
          const payment = JSON.parse(paymentData);
          setIsPremium(payment.status === 'success' && payment.planName !== 'Basic');
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [userId, userRole, recruiterAvatar, jobSeekerAvatar]);

  useEffect(() => {
    loadUserdata();
  }, [loadUserdata]);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadUserdata();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [loadUserdata]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeDropdowns = () => {
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header')) {
        closeDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo-container" onClick={() => navigate(userRole === "recruiter" ? "/recruiter-dashboard" : "/jobseeker-dashboard")}>
            <img src="/RocketJobs_Logo.jpg" alt="RocketJobs Logo" className="header-logo-img" />
            <div className="logo-text">
              <h1 className="header-logo">RocketJobs</h1>
              <p className="header-tagline">Where Opportunity Meets Talent</p>
            </div>
          </div>
        </div>

        <div className="header-right">
                     

          <div className="header-profile">
            <div className={`profile-dropdown ${isProfileDropdownOpen ? 'open' : ''}`}>
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <img src={userImage} alt="Profile" className="profile-image" />
                <span className="profile-name">
                  {userName}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
                             {isProfileDropdownOpen && (
                 <div className="profile-dropdown-content">
                   {userRole === "recruiter" ? (
                     <>
                       <NavLink to="/recruiter-dashboard" onClick={closeDropdowns}>
                         <span className="dropdown-icon">🏠</span>
                         Dashboard
                       </NavLink>
                       <NavLink to="/allJobs" onClick={closeDropdowns}>
                         <span className="dropdown-icon">💼</span>
                         All Jobs Posted
                       </NavLink>
                       <NavLink to="/job-description" onClick={closeDropdowns}>
                         <span className="dropdown-icon">📝</span>
                         Post a Job
                       </NavLink>
                       <NavLink to="/recruiterApplicants" onClick={closeDropdowns}>
                         <span className="dropdown-icon">👥</span>
                         View Applicants
                       </NavLink>
                       <NavLink to="/analytics-dashboard" onClick={closeDropdowns}>
                         <span className="dropdown-icon">📊</span>
                         Analytics
                       </NavLink>
                       <div className="dropdown-divider"></div>
                       <NavLink to="/profile" onClick={closeDropdowns}>
                         <span className="dropdown-icon">👤</span>
                         Profile
                       </NavLink>
                       <NavLink to="/settings" onClick={closeDropdowns}>
                         <span className="dropdown-icon">⚙️</span>
                         Settings & Privacy
                       </NavLink>
                       <NavLink to="/pricing" onClick={closeDropdowns} className="premium-upgrade-btn">
                         <span className="dropdown-icon">🚀</span>
                         Upgrade to Premium
                       </NavLink>
                       <button onClick={handleLogout} className="logout-btn">
                         <span className="dropdown-icon">🚪</span>
                         Logout
                       </button>
                     </>
                   ) : (
                     <>
                       <NavLink to="/jobseeker-dashboard" onClick={closeDropdowns}>
                         <span className="dropdown-icon">🏠</span>
                         Dashboard
                       </NavLink>
                       <NavLink to="/joblisting" onClick={closeDropdowns}>
                         <span className="dropdown-icon">🔍</span>
                         Browse Jobs
                       </NavLink>
                       <NavLink to="/appliedjobs" onClick={closeDropdowns}>
                         <span className="dropdown-icon">📊</span>
                         Match Scores
                       </NavLink>
                       <NavLink to="/upload" onClick={closeDropdowns}>
                         <span className="dropdown-icon">📄</span>
                         Update Resume
                       </NavLink>
                       <NavLink to="/gigs" onClick={closeDropdowns}>
                         <span className="dropdown-icon">💼</span>
                         Gig Marketplace
                       </NavLink>
                       <div className="dropdown-divider"></div>
                       <NavLink to="/profile" onClick={closeDropdowns}>
                         <span className="dropdown-icon">👤</span>
                         Profile
                       </NavLink>
                       <NavLink to="/settings" onClick={closeDropdowns}>
                         <span className="dropdown-icon">⚙️</span>
                         Settings & Privacy
                       </NavLink>
                       <NavLink to="/pricing" onClick={closeDropdowns} className="premium-upgrade-btn">
                         <span className="dropdown-icon">🚀</span>
                         Upgrade to Premium
                       </NavLink>
                       <button onClick={handleLogout} className="logout-btn">
                         <span className="dropdown-icon">🚪</span>
                         Logout
                       </button>
                     </>
                   )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
