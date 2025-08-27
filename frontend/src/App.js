import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import JobDescription from "./pages/JobDescription";
import JobDetails from "./pages/JobDetails";
import "./styles/Global.css";
import UploadResume from "./pages/UploadResume";
import JobListing from "./pages/JobListing";
import JobSearch from "./pages/JobSearch";
import MatchScore from "./pages/MatchScore";
import AppliedJobs from "./pages/AppliedJobs";
import RecruiterApplicants from "./pages/RecruiterApplicants";
import ProfilePage from "./pages/Profile";
import Home from "./pages/Home";
import AllJobs from "./pages/AllJobs";
import ViewTopCandidates from "./pages/ViewTopCandidates";
import ViewAllCandidates from "./pages/ViewAllCandidates";
import ResumeProfile from "./pages/ResumeProfile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TermsOfService from "./pages/termsofservice";
import About from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import TestHeader from "./pages/TestHeader";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PricingPlans from "./pages/PricingPlans";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Settings from "./pages/Settings";
import GigDashboard from "./pages/GigDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CvBrowser from "./components/CvBrowser";
import LocalLanguageAnalysisPage from "./pages/LocalLanguageAnalysisPage";
import LoadingDemo from "./pages/LoadingDemo";
import OAuthSuccess from "./pages/OAuthSuccess";
import OAuthSignup from "./pages/OAuthSignup";
import OAuthRoleSelection from "./pages/OAuthRoleSelection";
import UserProfileSetup from "./pages/UserProfileSetup";
import PageTransitionLoader from "./components/PageTransitionLoader";
import NavigationLoader from "./components/NavigationLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <PageTransitionLoader />
          <NavigationLoader />
          <Routes>
            {/* Public routes without Header */}
            <Route path="/" element={
              <>
                <Home/>
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
            <Route path="/login" element={<LoginPage />} />
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
            <Route path="/test-header" element={
              <>
                <Header />
                <TestHeader/>
              </>
            }/>
            <Route path="/privacy" element={<PrivacyPolicy/>}/>
            <Route path="/pricing" element={<PricingPlans/>}/>
            
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
            
                         {/* Recruiter-only routes */}
             <Route path="/recruiter-dashboard" element={
               <ProtectedRoute requiredRole="recruiter">
                 <>
                   <RecruiterDashboard />
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
             
             {/* Job Seeker-only routes */}
             <Route path="/jobseeker-dashboard" element={
               <ProtectedRoute requiredRole="jobSeeker">
                 <>
                   <JobSeekerDashboard />
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
            <Route path="/upload" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <UploadResume />
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
                  <JobDetails />
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
            <Route path="/appliedjobs" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <AppliedJobs />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Payment/>
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/payment-success" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <PaymentSuccess/>
                  <Footer />
                </>
              </ProtectedRoute>
            }/>
            <Route path="/settings" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Settings/>
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
                  <CvBrowser />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            {/* Loading Demo Route */}
            <Route path="/loading-demo" element={<LoadingDemo />} />
            
            {/* OAuth Routes */}
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/oauth-signup" element={<OAuthSignup />} />
            <Route path="/oauth-role-selection" element={<OAuthRoleSelection />} />
            <Route path="/user-profile-setup" element={<UserProfileSetup />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
