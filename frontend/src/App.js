import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import CommunityVerificationPage from "./pages/CommunityVerificationPage";
import ReferenceVerificationPage from "./pages/ReferenceVerificationPage";
import Community from "./pages/Community";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ModernJobDetails from "./pages/ModernJobDetails";
import JobListing from "./pages/JobListing";
import JobSearch from "./pages/JobSearch";
import Home from "./pages/Home";
import PublicJobs from "./pages/PublicJobs";
import AllJobs from "./pages/AllJobs";

import Header from "./components/Header";
import Footer from "./components/Footer";
import TermsOfService from "./pages/termsofservice";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PricingPlans from "./pages/PricingPlans";
import PremiumSubscription from "./pages/PremiumSubscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentCancelled from "./pages/PaymentCancelled";
import AdminControlPanel from "./pages/AdminControlPanel";
import AdminDashboard from "./pages/AdminDashboard";
import CVBrowser from "./components/CVBrowser/index.jsx";
import OAuthSuccess from "./pages/OAuthSuccess";
import OAuthRoleSelection from "./pages/OAuthRoleSelection";
import RecruiterRegistrationForm from "./pages/RecruiterRegistrationForm";
import Company from "./pages/Company";
import InternDashboard from "./pages/InternDashboard";
import JobSeekerRegistrationForm from "./pages/JobSeekerRegistrationFormComprehensive";
import PromoCodePage from "./pages/PromoCodePage";
import PostJob from "./pages/PostJob";
import SalaryGuide from "./pages/SalaryGuide";
import CareerAdvice from "./pages/CareerAdvice";
import RecruitmentSolutions from "./pages/RecruitmentSolutions";
import Resources from "./pages/Resources";
import ContactSales from "./pages/ContactSales";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import CookiePolicy from "./pages/CookiePolicy";
import ReferenceVerification from "./pages/ReferenceVerification";
import ReferenceVerificationStatus from "./pages/ReferenceVerificationStatus";
import MentorshipPrograms from "./pages/MentorshipPrograms";
import Scholarships from "./pages/Scholarships";
import TrainingPrograms from "./pages/TrainingPrograms";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Partners from "./pages/Partners";
import Sitemap from "./pages/Sitemap";
import Accessibility from "./pages/Accessibility";
import Security from "./pages/Security";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProfilePhotoProvider } from "./context/ProfilePhotoContext";

// Dashboard Redirect Component - Routes users to their role-specific dashboard
const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has completed profile
    const hasCompletedProfile = user.profileCompleted || user.hasCompletedProfile;

    // Route based on role
    if (user.role === 'jobSeeker') {
      if (!hasCompletedProfile) {
        navigate('/jobseeker-registration');
      } else {
        navigate('/jobseeker-dashboard');
      }
    } else if (user.role === 'recruiter') {
      if (!hasCompletedProfile) {
        navigate('/recruiter-registration');
      } else {
        navigate('/recruiter-dashboard');
      }
    } else if (user.role === 'intern') {
      navigate('/intern-dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  return <div style={{ padding: '50px', textAlign: 'center' }}>
    <h2>Redirecting to your dashboard...</h2>
  </div>;
};

// Settings Redirect Component
const SettingsRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'jobSeeker') {
      navigate('/jobseeker-settings');
    } else if (user?.role === 'recruiter') {
      navigate('/recruiter-settings');
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  return <div>Redirecting to settings...</div>;
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <NotificationProvider>
          <ProfilePhotoProvider>
            <div className="app-container">
          <Routes>
            {/* Public routes without Header */}
            <Route path="/" element={<Home/>}/>
            <Route path="/public-jobs" element={
              <>
                <PublicJobs />
                <Footer />
              </>
            }/>
            <Route path="/jobs" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <JobSearch />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/joblisting" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <JobListing />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/verify-user" element={<CommunityVerificationPage />} />
            <Route path="/reference-verification" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ReferenceVerification />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/recruiter-registration" element={<RecruiterRegistrationForm />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />
            <Route path="/jobseeker-registration" element={<JobSeekerRegistrationForm />} />
            <Route path="/complete-profile" element={<JobSeekerRegistrationForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<TermsOfService/>}/>
            <Route path="/blog" element={
              <>
                <Header />
                <Blog/>
                <Footer />
              </>
            }/>
            <Route path="/salary-guide" element={<SalaryGuide />} />
            <Route path="/career-advice" element={<CareerAdvice />} />
            <Route path="/recruitment-solutions" element={<RecruitmentSolutions />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact-sales" element={<ContactSales />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/verify-reference/:token" element={<ReferenceVerificationPage />} />
            <Route path="/reference-verification-status/:referenceId" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ReferenceVerificationStatus />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/mentorship-programs" element={
              <>
                <Header />
                <MentorshipPrograms />
                <Footer />
              </>
            } />
            <Route path="/scholarships" element={
              <>
                <Header />
                <Scholarships />
                <Footer />
              </>
            } />
            <Route path="/training-programs" element={
              <>
                <Header />
                <TrainingPrograms />
                <Footer />
              </>
            } />
            <Route path="/careers" element={
              <>
                <Header />
                <Careers />
                <Footer />
              </>
            } />
            <Route path="/press" element={
              <>
                <Header />
                <Press />
                <Footer />
              </>
            } />
            <Route path="/partners" element={
              <>
                <Header />
                <Partners />
                <Footer />
              </>
            } />
            <Route path="/sitemap" element={
              <>
                <Header />
                <Sitemap />
                <Footer />
              </>
            } />
            <Route path="/accessibility" element={
              <>
                <Header />
                <Accessibility />
                <Footer />
              </>
            } />
            <Route path="/security" element={
              <>
                <Header />
                <Security />
                <Footer />
              </>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/privacy" element={<PrivacyPolicy/>}/>
            <Route path="/pricing" element={<PricingPlans/>}/>
            <Route path="/premium" element={
              <>
                <Header />
                <PremiumSubscription />
                <Footer />
              </>
            }/>
            
            {/* Protected routes with role-based access */}
            
            <Route path="/promo-codes" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <PromoCodePage />
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/promo-code" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <PromoCodePage />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
                         {/* Recruiter-only routes */}
             <Route path="/recruiter-dashboard" element={
               <ProtectedRoute requiredRole="recruiter">
                 <>
                   <RecruiterDashboard />
                   <Footer />
                 </>
               </ProtectedRoute>
             } />
             
             
            <Route path="/post-job" element={
              <ProtectedRoute requiredRole="recruiter">
                <>
                  <Header />
                  <PostJob />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
             
             <Route path="/company" element={
               <ProtectedRoute requiredRole="recruiter">
                 <>
                   <Company />
                 </>
               </ProtectedRoute>
             } />
             
             {/* Job Seeker-only routes */}
             <Route path="/jobseeker-dashboard" element={
               <ProtectedRoute requiredRole="jobSeeker">
                 <JobSeekerDashboard />
               </ProtectedRoute>
             } />
             
             {/* Intern-only routes */}
             <Route path="/intern-dashboard" element={
               <ProtectedRoute requiredRole="intern">
                 <>
                   <InternDashboard />
                   <Footer />
                 </>
               </ProtectedRoute>
             } />
            
            {/* Admin-only routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <>
                  <AdminDashboard />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/control-panel" element={
              <ProtectedRoute requiredRole="admin">
                <>
                  <AdminControlPanel />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            
            {/* Other protected routes */}
            <Route path="/allJobs" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <AllJobs/>
                  <Footer />
                </>
              </ProtectedRoute>
            }/>

            <Route path="/joblisting" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <JobListing />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/job-details/:jobId" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ModernJobDetails />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/job-details" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <JobListing />
                  <Footer />
                </>
              </ProtectedRoute>
            } />

            <Route path="/payment-success" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <PaymentSuccess/>
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/payment-callback" element={<PaymentCallback />}/>
            <Route path="/payment-cancelled" element={<PaymentCancelled />}/>
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsRedirect />
              </ProtectedRoute>
            }/>
            <Route path="/community" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Community />
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/cv-browser" element={
              <ProtectedRoute requiredRole="recruiter">
                <>
                  <Header />
                  <CVBrowser />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            {/* OAuth Routes */}
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/oauth-role-selection" element={<OAuthRoleSelection />} />
          </Routes>
        </div>
          </ProfilePhotoProvider>
        </NotificationProvider>
      </AuthProvider>
      
    </Router>
  );
}

export default App;
