import React from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import heroImage from '../assets/placeholder_hero.png'; // Replace with your actual hero image

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="Home">
      {/* Header with RocketJobs Logo */}
      <Header />
      
      {/* Hero Section - Introduction and Call to Action */}
      <section className="home_hero">
        <div className="home_hero_content">
          <h1>Find the Perfect Job or Candidate with AI-Powered Matching!</h1>
          <p>
            Our platform uses advanced AI to connect job seekers with ideal
            opportunities and recruiters with top talent, streamlining the hiring
            process.
          </p>
          <div className="home_hero_buttons">
            <button
              className="home_get_started_btn"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
            <button className="home_login_btn" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
        <div className="home_hero_background">
          <img src={heroImage} alt="Hero Background" />
        </div>
      </section>

      
      {/* Job Seeker Journey Section */}
      <section className="home_seeker_journey">
        <h2>For Job Seekers: Your Path to the Perfect Job</h2>
        <div className="home_journey_steps">
          <div className="home_journey_step">
            <span className="home_step_number">1</span>
            <h3>Create Your Profile</h3>
            <p>
              Sign up or log in to build your profile and showcase your skills and
              experience.
            </p>
            <span className="home_journey_icon">👤</span> {/* User Icon */}
          </div>
          <div className="home_journey_step">
            <span className="home_step_number">2</span>
            <h3>Upload Your Resume</h3>
            <p>
              Upload your resume (PDF or DOC) to enable our AI to analyze your
              qualifications.
            </p>
            <span className="home_journey_icon">📄</span> {/* Document Icon */}
          </div>
          <div className="home_journey_step">
            <span className="home_step_number">3</span>
            <h3>Get AI-Powered Matches</h3>
            <p>
              Receive personalized job recommendations based on your skills,
              experience, and preferences.
            </p>
            <span className="home_journey_icon">🤖</span> {/* AI Brain Icon */}
          </div>
          <div className="home_journey_step">
            <span className="home_step_number">4</span>
            <h3>Explore Job Listings</h3>
            <p>
              Browse relevant job openings, filter by criteria, and view match
              scores to find the best opportunities.
            </p>
            <span className="home_journey_icon">🔍</span> {/* Search Icon */}
          </div>
          <div className="home_journey_step">
            <span className="home_step_number">5</span>
            <h3>Apply and Track</h3>
            <p>
              Apply for jobs directly through the platform and track the status of
              your applications.
            </p>
            <span className="home_journey_icon">🚀</span> {/* Rocket Icon */}
          </div>
        </div>
      </section>

      {/* Recruiter Journey Section */}
      <section className="home_recruiter_journey">
        <h2>For Recruiters: Find Your Ideal Candidates</h2>
        <div className="home_journey_steps">
          <div className="home_journey_step">
            <span className="home_step_number">1</span>
            <h3>Create Your Account</h3>
            <p>
              Sign up or log in to access our powerful recruitment tools and start
              finding top talent.
            </p>
            <span className="home_journey_icon">🏢</span> {/* Company Icon */}
          </div>
          <div className="home_journey_step">
            <span className="home_step_number">2</span>
            <h3>Post a Job</h3>
            <p>
              Create detailed job listings with requirements and attract qualified
              candidates.
            </p>
            <span className="home_journey_icon">✍️</span> {/* Writing Icon */}
          </div>
          <div className="home_journey_step">
            <span className="home_step_number">3</span>
            <h3>Evaluate Candidates</h3>
            <p>
              Review candidate profiles, view match scores, and get hiring
              recommendations to make informed decisions.
            </p>
            <span className="home_journey_icon">📊</span> {/* Bar Chart Icon */}
          </div>
          <div className="home_journey_step">
            <span className="home_step_number">4</span>
            <h3>Manage Applications</h3>
            <p>
              Shortlist candidates, schedule interviews, and track the progress of
              your hiring process.
            </p>
            <span className="home_journey_icon">📅</span> {/* Calendar Icon */}
          </div>
        </div>
      </section>

      {/* Key Features Section - Moved Down, Can Be Optional */}
      <section className="home_features">
        <h2>Why Choose Us?</h2>
        <div className="home_feature_list">
          <div className="home_feature_item">
            <span className="home_feature_icon">🤖</span>
            <h3>AI-Based Matching</h3>
            <p>Matches resumes with job descriptions using AI.</p>
          </div>
          <div className="home_feature_item">
            <span className="home_feature_icon">📊</span>
            <h3>Skill Gap Analysis</h3>
            <p>Identifies missing skills for job seekers.</p>
          </div>
          <div className="home_feature_item">
            <span className="home_feature_icon">💼</span>
            <h3>Job Recommendations</h3>
            <p>Personalized job suggestions based on skills & experience.</p>
          </div>
          <div className="home_feature_item">
            <span className="home_feature_icon">🏆</span>
            <h3>Candidate Ranking</h3>
            <p>Get top-matching candidates automatically.</p>
          </div>
          <div className="home_feature_item">
            <span className="home_feature_icon">📄</span>
            <h3>Easy Resume Upload</h3>
            <p>Upload PDF/DOC and get instant matching.</p>
          </div>
          <div className="home_feature_item">
            <span className="home_feature_icon">📈</span>
            <h3>Real-Time Tracking</h3>
            <p>Track job applications & recruiter responses.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section - Can be simplified further */}
      <section className="home_faq">
        <h2>Frequently Asked Questions</h2>
        <div className="home_faq_list">
          <div className="home_faq_item">
            <h3>How does AI match resumes with jobs?</h3>
            <p>AI analyzes skills, experience, and keywords.</p>
          </div>
          <div className="home_faq_item">
            <h3>Do I need to upload a resume?</h3>
            <p>Uploading enhances matching accuracy.</p>
          </div>
          <div className="home_faq_item">
            <h3>Is my data secure?</h3>
            <p>We prioritize data security and privacy.</p>
          </div>
          <div className="home_faq_item">
            <h3> What file formats are accepted for resume uploads?</h3>
            <p>We currently accept resumes in PDF and DOC/DOCX formats.</p>
          </div>
          <div className="home_faq_item">
            <h3>What happens to my resume data after I apply for a job?</h3>
            <p>Your resume data is securely stored and shared with the recruiter for the specific job you applied for. We adhere to strict privacy policies.</p>
          </div>
          <div className="home_faq_item">
            <h3> How many candidates does the platform show?</h3>
            <p>The platform provides ranking and detailed information. You can also view all applicants.</p>
          </div>
          <div className="home_faq_item">
            <h3>What information is provided in the candidate profiles?</h3>
            <p> Candidate profiles include resume data, match scores, skill analysis, and hiring recommendations.</p>
          </div>
          <div className="home_faq_item">
            <h3>Can I schedule interviews through the platform?</h3>
            <p> Yes, you can schedule and manage interviews directly through the platform.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home_footer">
  <div className="home_footer_wrapper">
    <div className="home_footer_brand">
      <h3>AI Resume Matcher</h3>
      <p>Connecting talent with opportunity through smart AI.</p>
    </div>
    <div className="home_footer_info">
      <p>Contact: <a href="mailto:support@TalentMatch.ai">support@TalentMatch.ai</a></p>
      <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
    </div>
  </div>


        <div className="home_footer_links">
          <a href="/about">About Us</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
     </footer>
    </div>
  );
};

export default Home;