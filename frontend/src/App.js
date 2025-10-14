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
import JobSeekerNetworking from "./pages/JobSeekerNetworking";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobSeekerAnalytics from "./pages/JobSeekerAnalytics";
import JobDescription from "./pages/JobDescription";
import ModernJobDetails from "./pages/ModernJobDetails";
import "./styles/Global.css";
import "./styles/ViewportAdjustments.css";
import ModernResumeUpload from "./pages/ModernResumeUpload";
import JobListing from "./pages/JobListing";
import JobSearch from "./pages/JobSearch";
import MatchScore from "./pages/MatchScore";

import RecruiterApplicants from "./pages/RecruiterApplicants";
import ModernApplicationTracker from "./pages/ModernApplicationTracker";
import ProfilePage from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import RecruiterCompleteProfile from "./pages/RecruiterCompleteProfile";
import Home from "./pages/Home";
import PublicJobs from "./pages/PublicJobs";
import AllJobs from "./pages/AllJobs";

import RecruiterTracker from "./pages/RecruiterTracker";
import ViewTopCandidates from "./pages/ViewTopCandidates";
import ViewAllCandidates from "./pages/ViewAllCandidates";
import ResumeProfile from "./pages/ResumeProfile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TermsOfService from "./pages/termsofservice";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import TestHeader from "./pages/TestHeader";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import JobSeekerSettings from "./pages/JobSeekerSettings";
import RecruiterSettings from "./pages/RecruiterSettings";
import PricingPlans from "./pages/PricingPlans";
import PremiumSubscription from "./pages/PremiumSubscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentCancelled from "./pages/PaymentCancelled";
import GigDashboard from "./pages/GigDashboard";
import AdminControlPanel from "./pages/AdminControlPanel";
import AdminDashboard from "./pages/AdminDashboard";
import CVBrowser from "./components/CVBrowser/index.jsx";
import LocalLanguageAnalysisPage from "./pages/LocalLanguageAnalysisPage";
import OAuthSuccess from "./pages/OAuthSuccess";
import OAuthSignup from "./pages/OAuthSignup";
import OAuthRoleSelection from "./pages/OAuthRoleSelection";
import UserProfileSetup from "./pages/UserProfileSetup";
import CompanyDetailsForm from "./pages/CompanyDetailsForm";
import RecruiterRegistrationForm from "./pages/RecruiterRegistrationForm";
import Company from "./pages/Company";
import InternDetailsForm from "./pages/InternDetailsForm";
import NewInternDetailsForm from "./pages/NewInternDetailsForm";
import InternSuccess from "./pages/InternSuccess";
import InternDashboard from "./pages/InternDashboard";
import JobSeekerRegistrationForm from "./pages/JobSeekerRegistrationFormComprehensive";
import JobSeekerRegistrationSuccess from "./pages/JobSeekerRegistrationSuccess";
import PromoCodePage from "./pages/PromoCodePage";
import ContactMe from "./pages/ContactMe";
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
import ResumeUpload from "./pages/ResumeUpload";
import Sitemap from "./pages/Sitemap";
import Accessibility from "./pages/Accessibility";
import Security from "./pages/Security";
import Status from "./pages/Status";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProfilePhotoProvider } from "./context/ProfilePhotoContext";

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
            <Route path="/networking" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <JobSeekerNetworking />
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
            <Route path="/company-details" element={<CompanyDetailsForm />} />
            <Route path="/recruiter-registration" element={<RecruiterRegistrationForm />} />
            <Route path="/intern-details" element={
              <ErrorBoundary>
                <InternDetailsForm />
              </ErrorBoundary>
            } />
            <Route path="/new-intern-details" element={<NewInternDetailsForm />} />
            <Route path="/intern-success" element={<InternSuccess />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <JobSeekerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/jobseeker-registration" element={<JobSeekerRegistrationForm />} />
            <Route path="/jobseeker-registration-success" element={<JobSeekerRegistrationSuccess />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<TermsOfService/>}/>
            <Route path="/about" element={
              <>
                <Header />
                <About/>
                <Footer />
              </>
            }/>
            <Route path="/blog" element={
              <>
                <Header />
                <Blog/>
                <Footer />
              </>
            }/>
            <Route path="/contact" element={
              <>
                <Header />
                <Contact/>
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
            <Route path="/resume-upload" element={
              <>
                <Header />
                <ResumeUpload />
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
            <Route path="/status" element={
              <>
                <Header />
                <Status />
                <Footer />
              </>
            } />
            <Route path="/test-header" element={
              <>
                <Header />
                <TestHeader/>
              </>
            }/>
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
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ProfilePage />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
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
             <Route path="/recruiter-tracker" element={
               <ProtectedRoute requiredRole="recruiter">
                 <>
                   <Header />
                   <RecruiterTracker />
                   <Footer />
                 </>
               </ProtectedRoute>
             } />
             
             <Route path="/local-language-analysis" element={
               <ProtectedRoute requiredRole="recruiter">
                 <>
                   <LocalLanguageAnalysisPage />
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
                 <>
                   <JobSeekerDashboard />
                   <Footer />
                 </>
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
            <Route path="/complete-profile" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <CompleteProfile />
              </ProtectedRoute>
            } />
             <Route path="/recruiter-complete-profile" element={
               <ProtectedRoute requiredRole="recruiter">
                 <>
                   <RecruiterCompleteProfile />
                   <Footer />
                 </>
               </ProtectedRoute>
             } />
             <Route path="/application-tracker" element={
               <ProtectedRoute>
                 <>
                   <Header />
                   <ModernApplicationTracker />
                   <Footer />
                 </>
               </ProtectedRoute>
             } />
             <Route path="/resume-builder" element={
               <ProtectedRoute requiredRole="jobSeeker">
                 <>
                   <ResumeBuilder />
                   <Footer />
                 </>
               </ProtectedRoute>
             } />
             <Route path="/jobseeker-analytics" element={
               <ProtectedRoute requiredRole="jobSeeker">
                 <>
                   <JobSeekerAnalytics />
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
            
            {/* Analytics dashboard - accessible by both recruiters and job seekers */}
            <Route path="/analytics-dashboard" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <AnalyticsDashboard />
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
            <Route path="/job-description" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <JobDescription />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/recruiterapplicants" element={
              <ProtectedRoute requiredRole="recruiter">
                <>
                  <Header />
                  <RecruiterApplicants />
                  <Footer />
                </>
              </ProtectedRoute>
            } />

            <Route path="/viewtopcandidates/:jobId" element={
              <ProtectedRoute requiredRole="recruiter">
                <>
                  <Header />
                  <ViewTopCandidates/>
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/viewallcandidates/:jobId" element={
              <ProtectedRoute requiredRole="recruiter">
                <>
                  <Header />
                  <ViewAllCandidates/>
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/profile/:userId" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ResumeProfile/>
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/contact/:userId?" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ContactMe />
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            {/* Resume upload routes - both redirect to modern service */}
            <Route path="/upload-resume" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ModernResumeUpload />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/modern-upload" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ModernResumeUpload />
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
            <Route path="/match-score/:jobId" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <MatchScore />
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
            <Route path="/jobseeker-settings" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <JobSeekerSettings />
              </ProtectedRoute>
            }/>
            <Route path="/recruiter-settings" element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterSettings />
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
            <Route path="/gigs" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <GigDashboard />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
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
            <Route path="/oauth-signup" element={<OAuthSignup />} />
            <Route path="/oauth-role-selection" element={<OAuthRoleSelection />} />
            <Route path="/user-profile-setup" element={<UserProfileSetup />} />
          </Routes>
        </div>
          </ProfilePhotoProvider>
        </NotificationProvider>
      </AuthProvider>
      
    </Router>
  );
}

export default App;
