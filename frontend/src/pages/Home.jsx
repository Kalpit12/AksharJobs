import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faRocket, 
  faHandshake, 
  faMapMarkerAlt, 
  faClock, 
  faBuilding,
  faEye,
  faLaptopCode,
  faUsers,
  faShieldAlt,
  faGlobe,
  faLightbulb,
  faChartLine,
  faBriefcase,
  faStar,
  faArrowRight,
  faArrowLeft,
  faLock,
  faSpinner,
  faUserGraduate,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import CompanyLogos from '../components/CompanyLogos';
import GeminiChatbot from '../components/GeminiChatbot';
import JobMagicBento from '../components/JobMagicBento';
import CircularGallery from '../components/CircularGallery';
import TestimonialOverlay from '../components/TestimonialOverlay';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useCountUp from '../hooks/useCountUp';
import { formatSalary, getUserCountry } from '../utils/currencyUtils';
import { FadeInUp, SlideIn, ScaleIn, StaggerChildren, AnimatedCounter, TypeWriter } from '../components/animations';
import { motion } from 'framer-motion';
import '../styles/Home.css';
import HeroImage from '../assets/HERO 3.jpg';
import Header from '../components/Header';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  
  // Debug authentication state (reduced logging)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Home component - isAuthenticated:', isAuthenticated, 'loading:', loading);
    }
  }, [isAuthenticated, loading]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [buttonClickStates, setButtonClickStates] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoPlayRef = useRef(null);

  // Scroll-triggered animations
  const [featuresRef, featuresVisible] = useIntersectionObserver();
  const [statsRef, statsVisible] = useIntersectionObserver();
  const [testimonialsRef, testimonialsVisible] = useIntersectionObserver();

  // Feature card refs for magic bento effect
  const featureCardRefs = useRef([]);

  // Animated counters
  const activeJobsCount = useCountUp(150, 0, 2000, statsVisible);
  const companiesCount = useCountUp(50, 0, 2000, statsVisible);
  const successRateCount = useCountUp(95, 0, 2000, statsVisible);
  const userSatisfactionCount = useCountUp(98, 0, 2000, statsVisible);

  // Trigger animations on component mount
  useEffect(() => {
    console.log('Home component loaded, triggering animations');
    setIsLoaded(true);
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Grace Muthoni",
      role: "Senior Software Engineer",
      company: "Microsoft",
      quote: "RocketJobs helped me land my dream role at Microsoft. The AI matching is incredibly accurate and saved me months of job searching!",
      initials: "GM",
      rating: 5,
      companyColor: "#00A4EF"
    },
    {
      id: 2,
      name: "Michael Njoroge",
      role: "Product Manager",
      company: "Google",
      quote: "The platform's efficiency and quality of candidates exceeded our expectations. We've hired 15+ amazing professionals through RocketJobs!",
      initials: "MN",
      rating: 5,
      companyColor: "#4285F4"
    },
    {
      id: 3,
      name: "Amina Hassan",
      role: "Data Scientist",
      company: "Apple",
      quote: "I found my perfect role at Apple in just 2 weeks! The platform's AI recommendations were spot-on and the interview prep was invaluable.",
      initials: "AH",
      rating: 5,
      companyColor: "#000000"
    },
    {
      id: 4,
      name: "David Kimani",
      role: "UX Designer",
      company: "Netflix",
      quote: "The quality of opportunities on RocketJobs is unmatched. I'm now working at Netflix and couldn't be happier with my career growth!",
      initials: "DK",
      rating: 5,
      companyColor: "#E50914"
    },
    {
      id: 5,
      name: "Sarah Wanjiku",
      role: "Marketing Director",
      company: "Amazon",
      quote: "From local startups to global tech giants - RocketJobs opened doors I never knew existed. The career guidance was exceptional!",
      initials: "SW",
      rating: 5,
      companyColor: "#FF9900"
    },
    {
      id: 6,
      name: "James Ochieng",
      role: "DevOps Engineer",
      company: "Safaricom",
      quote: "RocketJobs connected me with Safaricom's innovation team. The platform's global reach and local expertise made all the difference!",
      initials: "JO",
      rating: 5,
      companyColor: "#0066CC"
    },
    {
      id: 7,
      name: "Faith Njeri",
      role: "Backend Developer",
      company: "Cellulant",
      quote: "We've hired some of our best team members through RocketJobs. The quality is outstanding.",
      initials: "FN"
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
      name: "Emma Wanjira",
      role: "Frontend Developer",
      company: "Andela",
      quote: "The platform's modern interface and seamless experience made my job search enjoyable.",
      initials: "EW"
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

  // Testimonials data for CircularGallery with detailed testimonials
  const testimonialItems = [
    { 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face", 
      text: "Microsoft",
      name: "Grace Muthoni",
      role: "Senior Software Engineer",
      quote: "RocketJobs helped me land my dream role at Microsoft. The AI matching is incredibly accurate and saved me months of job searching!",
      companyColor: "#00A4EF"
    },
    { 
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop&crop=face", 
      text: "Google",
      name: "Michael Njoroge",
      role: "Product Manager",
      quote: "The platform's efficiency and quality of candidates exceeded our expectations. We've hired 15+ amazing professionals through RocketJobs!",
      companyColor: "#4285F4"
    },
    { 
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop&crop=face", 
      text: "Apple",
      name: "Amina Hassan",
      role: "Data Scientist",
      quote: "I found my perfect role at Apple in just 2 weeks! The platform's AI recommendations were spot-on and the interview prep was invaluable.",
      companyColor: "#000000"
    },
    { 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop&crop=face", 
      text: "Netflix",
      name: "David Kimani",
      role: "UX Designer",
      quote: "The quality of opportunities on RocketJobs is unmatched. I'm now working at Netflix and couldn't be happier with my career growth!",
      companyColor: "#E50914"
    },
    { 
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop&crop=face", 
      text: "Amazon",
      name: "Sarah Wanjiku",
      role: "Marketing Director",
      quote: "From local startups to global tech giants - RocketJobs opened doors I never knew existed. The career guidance was exceptional!",
      companyColor: "#FF9900"
    },
    { 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop&crop=face", 
      text: "Safaricom",
      name: "James Ochieng",
      role: "DevOps Engineer",
      quote: "RocketJobs connected me with Safaricom's innovation team. The platform's global reach and local expertise made all the difference!",
      companyColor: "#0066CC"
    },
    { 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face", 
      text: "Cellulant",
      name: "Faith Njeri",
      role: "Backend Developer",
      quote: "We've hired some of our best team members through RocketJobs. The quality is outstanding.",
      companyColor: "#00D4AA"
    },
    { 
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop&crop=face", 
      text: "KCB Bank",
      name: "Robert Mwangi",
      role: "Business Analyst",
      quote: "RocketJobs understands the unique needs of African professionals and global companies.",
      companyColor: "#FF6B35"
    }
  ];

  // Carousel functions with smooth transitions
  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentTestimonialIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToTestimonial = (index) => {
    if (isTransitioning || index === currentTestimonialIndex) return;
    setIsTransitioning(true);
    setCurrentTestimonialIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-play functionality with pause on hover
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(goToNext, 3000); // Reduced to 3 seconds for faster sliding
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentTestimonialIndex]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Magic Bento glow effect handlers
  const handleCardMouseMove = (e, cardRef) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    cardRef.current.style.setProperty('--glow-x', `${x}%`);
    cardRef.current.style.setProperty('--glow-y', `${y}%`);
  };

  const handleCardMouseLeave = (cardRef) => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--glow-intensity', '0');
  };

  const handleCardMouseEnter = (cardRef) => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--glow-intensity', '1');
  };

  // Micro-interaction functions
  const handleButtonClick = (buttonId, callback) => {
    setButtonClickStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setButtonClickStates(prev => ({ ...prev, [buttonId]: false }));
    }, 200);
    if (callback) callback();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        if (isAuthenticated) {
          navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
        } else {
          navigate('/signup');
        }
      }, 1000);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  // Testimonial navigation functions
  const nextTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="home_wrapper">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero_section">
        <div className="hero_container">
          <div className="hero_content">
            {/* Top Content - Text, Search & Stats */}
            <div className="hero_top">
              <h1 className="hero_title">
                Find Your Dream Job Faster Than Ever
              </h1>
              
              <p className="hero_subtitle">
                Connect with top companies and discover opportunities that match your skills, passion, and career goals. Our intelligent platform makes job hunting effortless.
              </p>
              
              {/* Search Bar */}
              <div className="hero_search">
                <div className="search_container">
                  <input 
                    type="text" 
                    placeholder="Search for a job, company, or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="search_input"
                  />
                  <button 
                    className="search_button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <FontAwesomeIcon icon={faSpinner} className="spinning" />
                    ) : (
                      <FontAwesomeIcon icon={faSearch} />
                    )}
                  </button>
                </div>
              </div>
              
              
              <div className="hero_actions">
                <button 
                  className="cta_primary"
                  onClick={() => navigate('/signup')}
                >
                  <FontAwesomeIcon icon={faRocket} />
                  Get Started Free
                </button>
                <button 
                  className="cta_secondary"
                  onClick={() => navigate('/jobs')}
                >
                  <FontAwesomeIcon icon={faSearch} />
                  Browse Jobs
                </button>
              </div>
            </div>

            {/* Bottom Content - Image */}
            <div className="hero_image">
              <div className="image_container">
                <img 
                  src={HeroImage} 
                  alt="Professional using laptop for job search" 
                  className="hero_main_image"
                />
                <div className="image_overlay">
                  <div className="floating_badge">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Join 50K+ Professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Portal Statistics & Value Section */}
      <section className="job_portal_stats_section">
        <div className="job_portal_stats_container">
          <div className="job_portal_content">
            <FadeInUp>
              <h2 className="job_portal_main_title">Your Gateway to Career Success</h2>
              <p className="job_portal_description">
                Join thousands of professionals who trust AksharJobs to accelerate their career journey. 
                Our AI-powered platform connects top talent with leading companies worldwide.
              </p>
            </FadeInUp>
            
            <div className="job_portal_metrics">
              <StaggerChildren staggerDelay={0.1}>
                <ScaleIn delay={0.1}>
                  <div className="metric_card">
                    <div className="metric_icon">
                      <FontAwesomeIcon icon={faBriefcase} />
                    </div>
                    <div className="metric_content">
                      <AnimatedCounter value="1000" suffix="+" className="metric_number" />
                      <span className="metric_label">Active Job Listings</span>
                      <p className="metric_desc">Fresh opportunities posted daily</p>
                    </div>
                  </div>
                </ScaleIn>
                
                <ScaleIn delay={0.2}>
                  <div className="metric_card">
                    <div className="metric_icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="metric_content">
                      <AnimatedCounter value="5000" suffix="+" className="metric_number" />
                      <span className="metric_label">Registered Professionals</span>
                      <p className="metric_desc">Skilled candidates ready to work</p>
                    </div>
                  </div>
                </ScaleIn>
                
                <ScaleIn delay={0.3}>
                  <div className="metric_card">
                    <div className="metric_icon">
                      <FontAwesomeIcon icon={faHandshake} />
                    </div>
                    <div className="metric_content">
                      <AnimatedCounter value="95" suffix="%" className="metric_number" />
                      <span className="metric_label">Match Success Rate</span>
                      <p className="metric_desc">AI-powered perfect matches</p>
                    </div>
                  </div>
                </ScaleIn>
                
                <ScaleIn delay={0.4}>
                  <div className="metric_card">
                    <div className="metric_icon">
                      <FontAwesomeIcon icon={faRocket} />
                    </div>
                    <div className="metric_content">
                      <AnimatedCounter value="72" suffix="h" className="metric_number" />
                      <span className="metric_label">Average Hire Time</span>
                      <p className="metric_desc">Fast-track your hiring process</p>
                    </div>
                  </div>
                </ScaleIn>
              </StaggerChildren>
            </div>

            <div className="job_portal_highlights">
              <div className="highlight_grid">
                <SlideIn direction="left" delay={0.2}>
                  <div className="highlight_item">
                    <FontAwesomeIcon icon={faGlobe} className="highlight_icon" />
                    <div className="highlight_content">
                      <h4>Global Opportunities</h4>
                      <p>Access jobs from startups to Fortune 500 companies worldwide</p>
                    </div>
                  </div>
                </SlideIn>
                
                <SlideIn direction="right" delay={0.3}>
                  <div className="highlight_item">
                    <FontAwesomeIcon icon={faLightbulb} className="highlight_icon" />
                    <div className="highlight_content">
                      <h4>Smart Job Matching</h4>
                      <p>Our AI analyzes your skills to find the perfect career fit</p>
                    </div>
                  </div>
                </SlideIn>
                
                <SlideIn direction="left" delay={0.4}>
                  <div className="highlight_item">
                    <FontAwesomeIcon icon={faShieldAlt} className="highlight_icon" />
                    <div className="highlight_content">
                      <h4>Verified Companies</h4>
                      <p>All employers are thoroughly vetted for legitimacy and quality</p>
                    </div>
                  </div>
                </SlideIn>
                
                <SlideIn direction="right" delay={0.5}>
                  <div className="highlight_item">
                    <FontAwesomeIcon icon={faChartLine} className="highlight_icon" />
                    <div className="highlight_content">
                      <h4>Career Growth</h4>
                      <p>Track your progress and get insights for career advancement</p>
                    </div>
                  </div>
                </SlideIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="job_categories_section">
        <div className="job_categories_container">
          <FadeInUp>
            <h2 className="job_categories_title">Explore Opportunities by Category</h2>
            <p className="job_categories_subtitle">
              Find your perfect match across diverse industries and roles
            </p>
          </FadeInUp>
          
          <div className="job_categories_grid">
            <StaggerChildren staggerDelay={0.1}>
              <ScaleIn delay={0.1}>
                <div className="job_category_card">
                  <div className="category_icon">
                    <FontAwesomeIcon icon={faLaptopCode} />
                  </div>
                  <h3>Technology & IT</h3>
                  <p className="category_count">250+ Jobs</p>
                  <p className="category_desc">Software Development, Data Science, Cybersecurity</p>
                  <div className="category_tags">
                    <span>React</span>
                    <span>Python</span>
                    <span>AWS</span>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.2}>
                <div className="job_category_card">
                  <div className="category_icon">
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <h3>Marketing & Sales</h3>
                  <p className="category_count">180+ Jobs</p>
                  <p className="category_desc">Digital Marketing, Business Development, Content</p>
                  <div className="category_tags">
                    <span>SEO</span>
                    <span>Social Media</span>
                    <span>Analytics</span>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.3}>
                <div className="job_category_card">
                  <div className="category_icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <h3>Human Resources</h3>
                  <p className="category_count">95+ Jobs</p>
                  <p className="category_desc">Talent Acquisition, HR Operations, Training</p>
                  <div className="category_tags">
                    <span>Recruitment</span>
                    <span>HRIS</span>
                    <span>Training</span>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.4}>
                <div className="job_category_card">
                  <div className="category_icon">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <h3>Finance & Banking</h3>
                  <p className="category_count">120+ Jobs</p>
                  <p className="category_desc">Investment Banking, Fintech, Accounting</p>
                  <div className="category_tags">
                    <span>Excel</span>
                    <span>SQL</span>
                    <span>Risk</span>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.5}>
                <div className="job_category_card">
                  <div className="category_icon">
                    <FontAwesomeIcon icon={faRocket} />
                  </div>
                  <h3>Design & Creative</h3>
                  <p className="category_count">85+ Jobs</p>
                  <p className="category_desc">UI/UX Design, Graphic Design, Branding</p>
                  <div className="category_tags">
                    <span>Figma</span>
                    <span>Adobe</span>
                    <span>Sketch</span>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.6}>
                <div className="job_category_card">
                  <div className="category_icon">
                    <FontAwesomeIcon icon={faHandshake} />
                  </div>
                  <h3>Operations & Management</h3>
                  <p className="category_count">140+ Jobs</p>
                  <p className="category_desc">Project Management, Operations, Strategy</p>
                  <div className="category_tags">
                    <span>Agile</span>
                    <span>Lean</span>
                    <span>Strategy</span>
                  </div>
                </div>
              </ScaleIn>
            </StaggerChildren>
          </div>
          
          <FadeInUp delay={0.8}>
            <div className="view_all_categories">
              <button 
                className="view_all_btn"
                onClick={() => navigate('/public-jobs')}
              >
                <FontAwesomeIcon icon={faArrowRight} />
                View All Categories
              </button>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Trending Jobs Section */}
      <section className="trending_jobs_section">
        <div className="trending_jobs_container">
          <div className="trending_header">
            <SlideIn direction="left">
              <div className="trending_text">
                <h2 className="trending_title">🔥 Trending This Week</h2>
                <p className="trending_subtitle">
                  Hot job opportunities that are getting the most applications
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <div className="trending_stats">
                <div className="trending_stat">
                  <span className="stat_number">2.5K+</span>
                  <span className="stat_label">Applications</span>
                </div>
                <div className="trending_stat">
                  <span className="stat_number">150+</span>
                  <span className="stat_label">New Jobs</span>
                </div>
              </div>
            </SlideIn>
          </div>
          
          <div className="trending_jobs_grid">
            <StaggerChildren staggerDelay={0.15}>
              <ScaleIn delay={0.1}>
                <div className="trending_job_card">
                  <div className="trending_badge">🔥 Hot</div>
                  <div className="job_company_logo">G</div>
                  <h3 className="job_title">Senior Full Stack Developer</h3>
                  <p className="job_company">Google Kenya</p>
                  <div className="job_meta">
                    <span className="job_location">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Nairobi, Remote
                    </span>
                    <span className="job_salary">{formatSalary("$80,000 - $120,000", getUserCountry())}</span>
                  </div>
                  <div className="job_skills">
                    <span>React</span>
                    <span>Node.js</span>
                    <span>TypeScript</span>
                  </div>
                  <div className="job_applications">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>45 applications</span>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.2}>
                <div className="trending_job_card">
                  <div className="trending_badge">🚀 New</div>
                  <div className="job_company_logo">S</div>
                  <h3 className="job_title">Product Manager</h3>
                  <p className="job_company">Safaricom PLC</p>
                  <div className="job_meta">
                    <span className="job_location">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Nairobi, Hybrid
                    </span>
                    <span className="job_salary">{formatSalary("$60,000 - $90,000", getUserCountry())}</span>
                  </div>
                  <div className="job_skills">
                    <span>Strategy</span>
                    <span>Analytics</span>
                    <span>Agile</span>
                  </div>
                  <div className="job_applications">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>32 applications</span>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.3}>
                <div className="trending_job_card">
                  <div className="trending_badge">⭐ Featured</div>
                  <div className="job_company_logo">E</div>
                  <h3 className="job_title">Data Scientist</h3>
                  <p className="job_company">Equity Bank</p>
                  <div className="job_meta">
                    <span className="job_location">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Nairobi, On-site
                    </span>
                    <span className="job_salary">{formatSalary("$70,000 - $100,000", getUserCountry())}</span>
                  </div>
                  <div className="job_skills">
                    <span>Python</span>
                    <span>ML</span>
                    <span>SQL</span>
                  </div>
                  <div className="job_applications">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>28 applications</span>
                  </div>
                </div>
              </ScaleIn>
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features_section">
        <div className="features_container">
          <div className="features_header">
            <h2 className="features_title">Why Choose AksharJobs?</h2>
            <p className="features_subtitle">
              Discover the powerful features that make AksharJobs your ideal partner for career growth and talent acquisition.
            </p>
          </div>
          <div ref={featuresRef} className={`features_grid ${featuresVisible ? 'visible' : ''}`}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                ref={el => featureCardRefs.current[index] = el}
                className={`feature_card feature_card--border-glow ${featuresVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseMove={(e) => handleCardMouseMove(e, { current: featureCardRefs.current[index] })}
                onMouseEnter={() => handleCardMouseEnter({ current: featureCardRefs.current[index] })}
                onMouseLeave={() => handleCardMouseLeave({ current: featureCardRefs.current[index] })}
              >
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

      {/* Programs Section */}
      <section className="programs_section">
        <div className="programs_container">
          <div className="programs_header">
            <h2 className="programs_title">Coming Soon: Exciting New Programs</h2>
            <p className="programs_subtitle">
              We're working on amazing new features to enhance your career journey
            </p>
          </div>
          
          <div className="programs_grid">
            <div className="program_card mentorship">
              <div className="program_icon">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
              <h3 className="program_title">Mentorship Programs</h3>
              <p className="program_description">
                Connect with industry experts and accelerate your career growth through personalized mentorship.
              </p>
              <div className="program_features">
                <span className="feature_tag">Expert Guidance</span>
                <span className="feature_tag">Career Acceleration</span>
                <span className="feature_tag">Network Building</span>
              </div>
              <Link to="/mentorship-programs" className="program_button">
                Learn More
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>

            <div className="program_card scholarships">
              <div className="program_icon">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <h3 className="program_title">Scholarships</h3>
              <p className="program_description">
                Discover amazing scholarship opportunities to support your educational journey and career development.
              </p>
              <div className="program_features">
                <span className="feature_tag">Merit-Based Awards</span>
                <span className="feature_tag">Financial Support</span>
                <span className="feature_tag">Prestigious Programs</span>
              </div>
              <Link to="/scholarships" className="program_button">
                Learn More
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>

            <div className="program_card training">
              <div className="program_icon">
                <FontAwesomeIcon icon={faLaptopCode} />
              </div>
              <h3 className="program_title">Training Programs</h3>
              <p className="program_description">
                Enhance your skills with comprehensive training programs designed by industry experts.
              </p>
              <div className="program_features">
                <span className="feature_tag">Technical Skills</span>
                <span className="feature_tag">Career Growth</span>
                <span className="feature_tag">Certifications</span>
              </div>
              <Link to="/training-programs" className="program_button">
                Learn More
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Timeline */}
      <section className="success_timeline_section">
        <div className="success_timeline_container">
          <div className="timeline_header">
            <h2 className="timeline_title">Your Success Journey Starts Here</h2>
            <p className="timeline_subtitle">
              Follow the proven path that thousands of professionals have taken to land their dream jobs
            </p>
          </div>
          
          <div className="timeline_wrapper">
            <div className="timeline_line"></div>
            
            <StaggerChildren staggerDelay={0.2}>
              <SlideIn direction="left" delay={0.1}>
                <div className="timeline_item left">
                  <div className="timeline_content">
                    <div className="timeline_icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <h3>Create Profile</h3>
                    <p>Build your professional profile with our AI-guided setup. Upload your resume and let our system analyze your strengths.</p>
                    <div className="timeline_stats">
                      <span className="stat">2 minutes</span>
                      <span className="stat_label">Average setup time</span>
                    </div>
                  </div>
                </div>
              </SlideIn>
              
              <SlideIn direction="right" delay={0.3}>
                <div className="timeline_item right">
                  <div className="timeline_content">
                    <div className="timeline_icon">
                      <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <h3>AI Job Matching</h3>
                    <p>Our intelligent algorithm scans thousands of opportunities and presents you with personalized job matches based on your skills and preferences.</p>
                    <div className="timeline_stats">
                      <span className="stat">95%</span>
                      <span className="stat_label">Match accuracy</span>
                    </div>
                  </div>
                </div>
              </SlideIn>
              
              <SlideIn direction="left" delay={0.5}>
                <div className="timeline_item left">
                  <div className="timeline_content">
                    <div className="timeline_icon">
                      <FontAwesomeIcon icon={faHandshake} />
                    </div>
                    <h3>Apply & Connect</h3>
                    <p>Apply to jobs with one click and connect directly with hiring managers. Our platform facilitates seamless communication throughout the process.</p>
                    <div className="timeline_stats">
                      <span className="stat">3x</span>
                      <span className="stat_label">Higher response rate</span>
                    </div>
                  </div>
                </div>
              </SlideIn>
              
              <SlideIn direction="right" delay={0.7}>
                <div className="timeline_item right">
                  <div className="timeline_content">
                    <div className="timeline_icon">
                      <FontAwesomeIcon icon={faRocket} />
                    </div>
                    <h3>Land Your Dream Job</h3>
                    <p>Join thousands of successful professionals who found their perfect career match. Start your journey to professional success today!</p>
                    <div className="timeline_stats">
                      <span className="stat">72h</span>
                      <span className="stat_label">Average hire time</span>
                    </div>
                  </div>
                </div>
              </SlideIn>
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Job Market Insights */}
      <section className="market_insights_section">
        <div className="market_insights_container">
          <div className="insights_header">
            <div className="insights_text">
              <h2 className="insights_title">📊 Live Job Market Insights</h2>
              <p className="insights_subtitle">
                Real-time data to guide your career decisions
              </p>
            </div>
            
            <div className="insights_badge">
              <FontAwesomeIcon icon={faChartLine} />
              <span>Updated Daily</span>
            </div>
          </div>
          
          <div className="insights_grid">
            <StaggerChildren staggerDelay={0.15}>
              <ScaleIn delay={0.1}>
                <div className="insight_card trending">
                  <div className="insight_header">
                    <h3>🔥 Trending Skills</h3>
                    <span className="trend_indicator up">↗ +15%</span>
                  </div>
                  <div className="skill_bars">
                    <div className="skill_bar">
                      <span className="skill_name">React.js</span>
                      <div className="skill_progress">
                        <div className="skill_fill" style={{width: '92%'}}></div>
                      </div>
                      <span className="skill_percent">92%</span>
                    </div>
                    <div className="skill_bar">
                      <span className="skill_name">Python</span>
                      <div className="skill_progress">
                        <div className="skill_fill" style={{width: '88%'}}></div>
                      </div>
                      <span className="skill_percent">88%</span>
                    </div>
                    <div className="skill_bar">
                      <span className="skill_name">Cloud (AWS)</span>
                      <div className="skill_progress">
                        <div className="skill_fill" style={{width: '85%'}}></div>
                      </div>
                      <span className="skill_percent">85%</span>
                    </div>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.3}>
                <div className="insight_card salary">
                  <div className="insight_header">
                    <h3>💰 Salary Trends</h3>
                    <span className="trend_indicator up">↗ +8%</span>
                  </div>
                  <div className="salary_chart">
                    <div className="salary_item">
                      <span className="role">Senior Developer</span>
                      <span className="salary_range">{formatSalary("$80,000 - $120,000", getUserCountry())}</span>
                    </div>
                    <div className="salary_item">
                      <span className="role">Product Manager</span>
                      <span className="salary_range">{formatSalary("$70,000 - $110,000", getUserCountry())}</span>
                    </div>
                    <div className="salary_item">
                      <span className="role">Data Scientist</span>
                      <span className="salary_range">{formatSalary("$75,000 - $115,000", getUserCountry())}</span>
                    </div>
                    <div className="salary_item">
                      <span className="role">UX Designer</span>
                      <span className="salary_range">{formatSalary("$60,000 - $95,000", getUserCountry())}</span>
                    </div>
                  </div>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={0.5}>
                <div className="insight_card market">
                  <div className="insight_header">
                    <h3>📈 Market Activity</h3>
                    <span className="trend_indicator up">↗ +22%</span>
                  </div>
                  <div className="market_stats">
                    <div className="market_stat">
                      <div className="stat_icon">
                        <FontAwesomeIcon icon={faBriefcase} />
                      </div>
                      <div className="stat_info">
                        <span className="stat_number">1,247</span>
                        <span className="stat_label">New Jobs This Week</span>
                      </div>
                    </div>
                    <div className="market_stat">
                      <div className="stat_icon">
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                      <div className="stat_info">
                        <span className="stat_number">3,891</span>
                        <span className="stat_label">Active Candidates</span>
                      </div>
                    </div>
                    <div className="market_stat">
                      <div className="stat_icon">
                        <FontAwesomeIcon icon={faHandshake} />
                      </div>
                      <div className="stat_info">
                        <span className="stat_number">456</span>
                        <span className="stat_label">Successful Hires</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* MagicBento Feature Showcase */}
      <section className="magic-bento-section">
        <div className="magic-bento-container">
          <h2 className="magic-bento-title">Interactive Platform Features</h2>
          <p className="magic-bento-subtitle">
            Experience the power of our platform with these interactive features
          </p>
          <JobMagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="59, 130, 246"
          />
        </div>
      </section>

      {/* Section Divider */}
      <div className="section_divider"></div>

      {/* Platform Stats Section */}
      <section className="platform_stats_section">
        <div className="platform_stats_container">
          <div className="platform_stats_content">
            {/* Left Side - Text Content */}
            <SlideIn direction="left">
              <div className="platform_stats_text">
                <h2 className="platform_stats_title">Platform</h2>
                <p className="platform_stats_description">
                  Elevate your career journey with our innovative platform that continuously connects talent with opportunity — driving success and growth way up.
                </p>
                <button className="platform_stats_button">
                  EXPLORE JOBS
                </button>
              </div>
            </SlideIn>
            
            {/* Right Side - Statistics Cards */}
            <StaggerChildren staggerDelay={0.15}>
              <ScaleIn>
                <div className="stat_card">
                  <AnimatedCounter value="45" suffix="%" className="stat_percentage" />
                  <div className="stat_label">JOB MATCHES</div>
                </div>
              </ScaleIn>
              <ScaleIn>
                <div className="stat_card">
                  <AnimatedCounter value="29" suffix="%" className="stat_percentage" />
                  <div className="stat_label">HIRING SPEED</div>
                </div>
              </ScaleIn>
              <ScaleIn>
                <div className="stat_card">
                  <AnimatedCounter value="42" suffix="%" className="stat_percentage" />
                  <div className="stat_label">CAREER GROWTH</div>
                </div>
              </ScaleIn>
              <ScaleIn>
                <div className="stat_card">
                  <AnimatedCounter value="98" suffix="%" className="stat_percentage" />
                  <div className="stat_label">SUCCESS RATE</div>
                </div>
              </ScaleIn>
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <CompanyLogos />

      {/* How It Works Section */}
      <section className="how_it_works_section">
        <div className="how_it_works_container">
          <h2 className="how_it_works_title">How It Works</h2>
          <p className="how_it_works_subtitle">
            Get started in just a few simple steps
          </p>
          
          <div className="steps_grid">
            <div className="step_card">
              <div className="step_number">1</div>
              <div className="step_icon">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
              <h3 className="step_title">Create Your Profile</h3>
              <p className="step_description">
                Sign up and build a comprehensive profile showcasing your skills, experience, and career goals.
              </p>
            </div>
            
            <div className="step_card">
              <div className="step_number">2</div>
              <div className="step_icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3 className="step_title">Find Opportunities</h3>
              <p className="step_description">
                Use our AI-powered search to discover jobs that match your skills and preferences.
              </p>
            </div>
            
            <div className="step_card">
              <div className="step_number">3</div>
              <div className="step_icon">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="step_title">Connect & Apply</h3>
              <p className="step_description">
                Apply to jobs with one click and connect directly with recruiters and hiring managers.
              </p>
            </div>
            
            <div className="step_card">
              <div className="step_number">4</div>
              <div className="step_icon">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <h3 className="step_title">Land Your Dream Job</h3>
              <p className="step_description">
                Get hired faster with our streamlined process and AI-powered matching system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section with CircularGallery */}
      <section className="testimonials_section">
        <div className="testimonials_container">
          <h2 className="testimonials_title">Success Stories from Our Community</h2>
          <p className="testimonials_subtitle">
            Hear from professionals across Kenya and beyond about their journey with RocketJobs
          </p>
          
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery 
              items={testimonialItems}
              bend={3} 
              textColor="#ffffff" 
              borderRadius={0.05} 
              scrollEase={0.02}
            />
            <TestimonialOverlay 
              items={testimonialItems}
            />
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section_divider"></div>

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
                <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
              </div>
              <div className="footer_logo_text">AksharJobs</div>
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
            <p>&copy; 2024 AksharJobs. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <GeminiChatbot userType="jobSeeker" />
    </div>
  );
};

export default Home;