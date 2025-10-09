import React, { useEffect,useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const userId=localStorage.getItem("userId");
  const userRole = localStorage.getItem("role"); // Get role from localStorage
  const recruiterAvatar = "https://tse1.mm.bing.net/th?id=OIP.SLlIMAFQM9EeKfUS610FdwAAAA&pid=Api&P=0&h=180"; // Default for recruiters
  const jobSeekerAvatar = "https://www.w3schools.com/w3images/avatar2.png"; // Default for job seekers

  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  
  const loadUserdata = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/auth/get_user?userId=${userId}`);
      if (response.data) {
        setUserName(response.data.firstName);
        setUserLastName(response.data.lastName || "");
        setUserImage(response.data.profileImage || (userRole === "recruiter" ? recruiterAvatar : jobSeekerAvatar));
        // Check if user has premium subscription
        const paymentData = localStorage.getItem('paymentData');
        if (paymentData) {
          try {
            const payment = JSON.parse(paymentData);
            setIsPremium(payment.status === 'success' && payment.planName !== 'Basic');
          } catch (error) {
            console.error("Error parsing payment data:", error);
            // Fallback: set as premium if there's any payment data
            setIsPremium(true);
          }
        } else {
          // For testing: set as premium by default
          setIsPremium(true);
        }
        console.log("User data:", response.data);
        console.log("Premium status:", isPremium);
        console.log("Payment data:", localStorage.getItem('paymentData'));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [userId, userRole, recruiterAvatar, jobSeekerAvatar])
  
  useEffect(() => {
    loadUserdata()
  }, [loadUserdata])

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadUserdata();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [loadUserdata]);

  useEffect(() => {
    console.log("Premium status changed to:", isPremium);
  }, [isPremium])
  const handleLogout = () => {
    localStorage.clear(); // ✅ Clear stored user data
    navigate("/login"); // ✅ Redirect to login page
  };

  console.log("=== SIDEBAR DEBUG INFO ===");
  console.log("Sidebar rendering - userName:", userName, "userLastName:", userLastName, "userRole:", userRole);
  console.log("isPremium:", isPremium);
  console.log("userId:", userId);
  console.log("userImage:", userImage);
  console.log("==========================");
  
  // Force premium status for testing
  const forcePremium = true;
  
  return (
    <div className="sidebar">
      
      {userRole === "recruiter" ? (
        <>
          <h2>Recruiter Panel</h2>
          
          {/* TEST BADGE - This should always be visible */}
          <div style={{
            background: 'lime',
            color: 'black',
            padding: '10px',
            margin: '10px 0',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '3px solid black'
          }}>
            🧪 TEST BADGE - SHOULD BE VISIBLE 🧪
          </div>
          
          <div className="sidebar-header">
        <img src={userImage} alt="Profile" className="sidebar_profile-image" />
        <h3>
          {userName || 'Recruiter'} {userLastName || 'User'}
          <div 
            style={{
              background: '#FF0000',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: '900',
              textTransform: 'uppercase',
              marginLeft: '20px',
              boxShadow: '0 8px 25px rgba(255, 0, 0, 0.8)',
              border: '4px solid yellow',
              display: 'inline-block',
              position: 'relative',
              zIndex: 9999,
              minWidth: '80px',
              textAlign: 'center'
            }}
          >
            ⭐ PRO ⭐
          </div>
        </h3>
      </div>
          <NavLink to="/recruiter-dashboard" activeClassName="active-link">Dashboard</NavLink>
          <NavLink to="/allJobs" activeClassName="active-link">All Jobs posted</NavLink>
          <NavLink to="/recruiterApplicants" activeClassName="active-link">View Applicants</NavLink>
          <NavLink to="/job-description" activeClassName="active-link">Post a Job</NavLink>
          <NavLink to="/profile" activeClassName="active-link">Profile</NavLink>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      ) : (
        <>
          <h2>Job Seeker Panel</h2>
          <div className="sidebar-header">
        <img src={userImage} alt="Profile" className="sidebar_profile-image" />
        <h3>{userName}</h3>
      </div>
          <NavLink to="/jobseeker-dashboard" activeClassName="active-link">Dashboard</NavLink>
          <NavLink to="/jobs" activeClassName="active-link">Find Jobs</NavLink>
          <NavLink to="/joblisting" activeClassName="active-link">All Jobs</NavLink>
          <NavLink to="/application-tracker" activeClassName="active-link">Application Tracker</NavLink>
          <NavLink to="/upload" activeClassName="active-link">Update Resume</NavLink>
          <NavLink to="/profile" activeClassName="active-link">Profile</NavLink>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
