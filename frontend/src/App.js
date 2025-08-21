import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import JobDescription from "./pages/JobDescription";
import "./styles/Global.css";
import UploadResume from "./pages/UploadResume";
import JobListing from "./pages/JobListing";
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
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PricingPlans from "./pages/PricingPlans";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Settings from "./pages/Settings";
import GigDashboard from "./pages/GigDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CvBrowser from "./components/CvBrowser";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Authenticated routes with Header */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
          <Route path="/allJobs" element={<AllJobs/>}/>
          <Route path="/job-description" element={<JobDescription />} />
          <Route path="/recruiterapplicants" element={<RecruiterApplicants />} />
          <Route path="/viewtopcandidates/:jobId" element={<ViewTopCandidates/>}/>
          <Route path="/viewallcandidates/:jobId" element={<ViewAllCandidates/>}/>
          <Route path="/profile/:userId" element={<ResumeProfile/>}/>
          <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/joblisting" element={<JobListing />} />
          <Route path="/match-score/:jobId" element={<MatchScore />} />
          <Route path="/appliedjobs" element={<AppliedJobs />} />

          <Route path="/terms" element={<TermsOfService/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/privacy" element={<PrivacyPolicy/>}/>
          <Route path="/pricing" element={<PricingPlans/>}/>
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/payment-success" element={<PaymentSuccess/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/gigs" element={<GigDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cv-browser" element={<CvBrowser />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
