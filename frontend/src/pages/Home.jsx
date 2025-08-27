import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faRocket, 
  faHandshake, 
  faMapMarkerAlt, 
  faClock, 
  faBuilding,
  faChevronLeft,
  faChevronRight,
  faEye,
  faLaptopCode,
  faUsers,
  faShieldAlt,
  faGlobe,
  faLightbulb,
  faChartLine,
  faBriefcase,
  faStar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const autoPlayRef = useRef(null);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Software Engineer",
      company: "TechCorp",
      quote: "RocketJobs helped me find my dream role in just 2 weeks. The AI matching is incredibly accurate!",
      initials: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      quote: "The platform's efficiency and quality of candidates exceeded our expectations. Highly recommended!",
      initials: "MC"
    },
    {
      id: 3,
      name: "Amina Hassan",
      role: "Data Scientist",
      company: "Safaricom",
      quote: "As a Kenyan professional, RocketJobs opened doors to opportunities I never thought possible.",
      initials: "AH"
    },
    {
      id: 4,
      name: "David Kimani",
      role: "UX Designer",
      company: "M-Pesa",
      quote: "The platform's focus on African talent and global opportunities is game-changing for our region.",
      initials: "DK"
    },
    {
      id: 5,
      name: "Grace Wanjiku",
      role: "Marketing Director",
      company: "Equity Bank",
      quote: "RocketJobs connected us with exceptional talent that perfectly matched our company culture.",
      initials: "GW"
    },
    {
      id: 6,
      name: "James Ochieng",
      role: "DevOps Engineer",
      company: "KCB Group",
      quote: "The AI-powered matching system is incredibly intelligent. It's like having a personal career advisor.",
      initials: "JO"
    },
    {
      id: 7,
      name: "Lisa Wang",
      role: "HR Manager",
      company: "Google",
      quote: "We've hired some of our best team members through RocketJobs. The quality is outstanding.",
      initials: "LW"
    },
    {
      id: 8,
      name: "Robert Mwangi",
      role: "Business Analyst",
      company: "Co-op Bank",
      quote: "RocketJobs understands the unique needs of African professionals and global companies.",
      initials: "RM"
    },
    {
      id: 9,
      name: "Emma Njeri",
      role: "Frontend Developer",
      company: "Jumia",
      quote: "The platform's modern interface and seamless experience made my job search enjoyable.",
      initials: "EN"
    },
    {
      id: 10,
      name: "Thomas Odhiambo",
      role: "Sales Manager",
      company: "Safaricom",
      quote: "RocketJobs helped me transition to a new industry with confidence and success.",
      initials: "TO"
    }
  ];

  // Featured jobs data
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      arrangement: "Remote",
      logo: "TC"
    },
    {
      id: 2,
      title: "Data Scientist",
      company: "DataStudio",
      location: "New York, NY",
      type: "Full-time",
      arrangement: "Hybrid",
      logo: "DS"
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "DesignHub",
      location: "Austin, TX",
      type: "Contract",
      arrangement: "On-site",
      logo: "DH"
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateCorp",
      location: "Seattle, WA",
      type: "Full-time",
      arrangement: "Remote",
      logo: "IC"
    }
  ];

  // Features data
  const features = [
    {
      icon: faLaptopCode,
      title: "AI-Powered Matching",
      description: "Our advanced AI algorithm analyzes your skills, experience, and preferences to find the perfect job matches."
    },
    {
      icon: faUsers,
      title: "Top Talent Pool",
      description: "Access a curated network of qualified professionals and connect with the best candidates for your organization."
    },
    {
      icon: faRocket,
      title: "Fast & Efficient",
      description: "Streamlined hiring process that saves time and resources while ensuring quality matches."
    },
    {
      icon: faShieldAlt,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and data protection to keep your information safe and confidential."
    },
    {
      icon: faGlobe,
      title: "Global Reach",
      description: "Connect with opportunities and talent from around the world, expanding your horizons."
    },
    {
      icon: faLightbulb,
      title: "Smart Insights",
      description: "Get valuable analytics and insights to make informed decisions about your career or hiring strategy."
    }
  ];

  // Stats data
  const stats = [
    { number: "25+", label: "Active Jobs" },
    { number: "150+", label: "Job Seekers" },
    { number: "12+", label: "Companies" },
    { number: "87%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
    { number: "8+", label: "Industries" }
  ];

  // Carousel functions
  const goToNext = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonialIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(goToNext, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (isAuthenticated) {
        // If user is authenticated, navigate to jobs with search term
        navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
      } else {
        // If user is not authenticated, redirect to signup
        navigate('/signup');
      }
    }
  };

  return (
    <div className="home_wrapper">
      {/* Header */}
      <header className="home_header">
        <div className="header_container">
          <div className="logo_section">
            <div className="logo_icon">
              <FontAwesomeIcon icon={faRocket} />
            </div>
            <div className="logo_text">
              <div className="logo_title">RocketJobs</div>
              <div className="logo_subtitle">AI-Powered Job Matching</div>
            </div>
          </div>
          
          <nav className="nav_links">
            <a href="#" className="nav_link active">
              <FontAwesomeIcon icon={faEye} />
              Home
            </a>
            <a href="#" className="nav_link">
              <FontAwesomeIcon icon={faBriefcase} />
              Jobs
            </a>
            <a href="#" className="nav_link">
              <FontAwesomeIcon icon={faUsers} />
              About
            </a>
          </nav>
          
          <div className="header_actions">
            <Link to="/login" className="btn btn_secondary">Sign In</Link>
            <Link to="/signup" className="btn btn_primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero_section">
        <div className="hero_container">
          <h1 className="hero_title">Find Your Perfect Job Match</h1>
          <p className="hero_subtitle">
            Connect with top employers and discover opportunities that align with your skills, 
            experience, and career goals. Our AI-powered matching system ensures the perfect fit 
            for both job seekers and recruiters.
          </p>
          <div className="hero_actions">
            <button 
              className="hero_btn primary" 
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/jobs');
                } else {
                  navigate('/signup');
                }
              }}
            >
              <FontAwesomeIcon icon={faBriefcase} />
              Find Jobs Now
            </button>
            <button 
              className="hero_btn secondary" 
              onClick={() => navigate('/signup')}
            >
              <FontAwesomeIcon icon={faRocket} />
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search_section">
        <div className="search_container">
          <h2 className="search_title">What are you looking for?</h2>
          <form className="search_form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search_input"
              placeholder="Job title, keywords, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="search_button"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  navigate('/signup');
                }
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
              Browse All
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="features_section">
        <div className="features_container">
          <h2 className="features_title">Why Choose RocketJobs?</h2>
          <p className="features_subtitle">
            Discover the features that make RocketJobs the preferred choice for job seekers and employers worldwide.
          </p>
          <div className="features_grid">
            {features.map((feature, index) => (
              <div key={index} className="feature_card">
                <div className="feature_icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3 className="feature_title">{feature.title}</h3>
                <p className="feature_description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats_section">
        <div className="stats_container">
          <h2 className="stats_title">Platform Statistics</h2>
          <div className="stats_grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat_card">
                <div className="stat_number">{stat.number}</div>
                <div className="stat_label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="recent_jobs_section">
        <div className="recent_jobs_container">
          <h2 className="recent_jobs_title">Featured Opportunities</h2>
          <p className="recent_jobs_subtitle">
            Discover the latest job openings from top companies across various industries.
          </p>
          <div className="jobs_grid">
            {featuredJobs.map((job) => (
              <div key={job.id} className="job_card">
                <div className="job_header">
                  <div className="job_logo">{job.logo}</div>
                  <div className="job_info">
                    <h3>{job.title}</h3>
                    <div className="job_company">{job.company}</div>
                  </div>
                </div>
                <div className="job_details">
                  <div className="job_detail">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    {job.location}
                  </div>
                  <div className="job_detail">
                    <FontAwesomeIcon icon={faClock} />
                    {job.type}
                  </div>
                  <div className="job_detail">
                    <FontAwesomeIcon icon={faBuilding} />
                    {job.arrangement}
                  </div>
                </div>
                <div className="job_actions">
                  <button className="job_action_btn">View Details</button>
                  <button className="job_action_btn primary">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="testimonials_section">
        <div className="testimonials_container">
          <h2 className="testimonials_title">Success Stories from Our Community</h2>
          <p className="testimonials_subtitle">
            Hear from professionals across Kenya and beyond about their journey with RocketJobs
          </p>
          
          <div className="testimonials_carousel">
            <button 
              className="carousel_button prev"
              onClick={goToPrevious}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            <div className="testimonials_track">
              <div className="testimonials_slide">
                <div className="testimonial_card">
                  <div className="testimonial_avatar">
                    {testimonials[currentTestimonialIndex].initials}
                  </div>
                  <div className="testimonial_content">
                    <p className="testimonial_quote">
                      {testimonials[currentTestimonialIndex].quote}
                    </p>
                    <div className="testimonial_author">
                      <div className="testimonial_name">
                        {testimonials[currentTestimonialIndex].name}
                      </div>
                      <div className="testimonial_role">
                        {testimonials[currentTestimonialIndex].role}
                      </div>
                      <div className="testimonial_company">
                        {testimonials[currentTestimonialIndex].company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="carousel_button next"
              onClick={goToNext}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          
          <div className="testimonial_indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentTestimonialIndex ? 'active' : ''}`}
                onClick={() => goToTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta_section">
        <div className="cta_container">
          <h2 className="cta_title">Ready to Find Your Perfect Match?</h2>
          <p className="cta_description">
            Join thousands of professionals who have already discovered their dream careers through RocketJobs. 
            Start your journey today and unlock endless possibilities.
          </p>
          <div className="cta_buttons">
            <a href="#" className="cta_btn primary">
              <FontAwesomeIcon icon={faRocket} />
              Get Started
            </a>
            <a href="#" className="cta_btn secondary">
              <FontAwesomeIcon icon={faChartLine} />
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer_container">
          <div className="footer_brand">
            <div className="footer_logo">
              <div className="footer_logo_icon">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <div className="footer_logo_text">RocketJobs</div>
            </div>
            <p className="footer_tagline">
              Connecting top talent with amazing opportunities through AI-powered job matching. 
              Your career journey starts here.
            </p>
          </div>
          
          <div className="footer_links">
            <div className="footer_column">
              <h3>Company</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Partners</a></li>
              </ul>
            </div>
            
            <div className="footer_column">
              <h3>Job Seekers</h3>
              <ul>
                <li><a href="#">Browse Jobs</a></li>
                <li><a href="#">Upload Resume</a></li>
                <li><a href="#">Create Profile</a></li>
                <li><a href="#">Salary Guide</a></li>
                <li><a href="#">Career Advice</a></li>
              </ul>
            </div>
            
            <div className="footer_column">
              <h3>Employers</h3>
              <ul>
                <li><a href="#">Post a Job</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Recruitment Solutions</a></li>
                <li><a href="#">Resources</a></li>
                <li><a href="#">Contact Sales</a></li>
              </ul>
            </div>
            
            <div className="footer_column">
              <h3>Support & Legal</h3>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer_bottom">
            <p>&copy; 2024 RocketJobs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;