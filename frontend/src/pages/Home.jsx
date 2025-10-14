import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';
import '../styles/HomeOverrides.css';
import akLogo from '../assets/FINAL AKLOGO.jpg';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const glowCard = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)",
      transition: { duration: 0.3 }
    }
  };

  // Counter animation hook
  const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
      if (!hasStarted) return;
      
      let startTime;
      let animationFrame;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, hasStarted]);

    return [count, setHasStarted];
  };

  const [jobsCount, startJobsCount] = useCountUp(10000);
  const [accuracyCount, startAccuracyCount] = useCountUp(98);
  const [recruitersCount, startRecruitersCount] = useCountUp(500);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      image: "👩‍💻",
      text: "Akshar Jobs AI matched me with my dream role in just 3 days. The precision was incredible!"
    },
    {
      name: "Michael Chen",
      role: "HR Director",
      company: "Global Industries",
      image: "👨‍💼",
      text: "The AI shortlisting saved us 80% of recruitment time. Game-changing platform."
    },
    {
      name: "Priya Sharma",
      role: "Data Scientist",
      company: "Analytics Pro",
      image: "👩‍🔬",
      text: "The resume insights helped me land interviews at top companies. Highly recommended!"
    }
  ];

  return (
    <div className="new-landing">
      {/* Navbar */}
      <motion.nav 
        className="futuristic-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <div className="nav-brand">
            <img src={akLogo} alt="Akshar Jobs" className="nav-logo" />
            <div className="brand-text">
              <span className="brand-name">Akshar Jobs</span>
              <span className="brand-tagline">CONNECT | DISCOVER | ELEVATE</span>
                </div>
              </div>
              
          <div className="nav-links">
            <a href="#jobs" className="nav-link">Find Jobs</a>
            <a href="#post" className="nav-link">Post Jobs</a>
            <a href="#ai-features" className="nav-link">AI Features</a>
            <a href="#about" className="nav-link">About</a>
            <button className="nav-link-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-cta-btn" onClick={() => navigate('/signup')}>
              Get Started
              <span className="btn-glow"></span>
                </button>
              </div>
            </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-animation">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
                  </div>
        
        <div className="neural-network">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="neural-node" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}></div>
          ))}
                    </div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Empowering Careers Through
              <span className="gradient-text"> Artificial Intelligence</span>
            </h1>
            
            <p className="hero-subtitle">
              Akshar Jobs connects professionals and recruiters through intelligent AI matching — 
              helping you Connect, Discover, and Elevate.
            </p>

            <div className="hero-tagline">
              <div className="tagline-item">
                <span className="tagline-glow"></span>
                CONNECT
                    </div>
              <div className="tagline-divider"></div>
              <div className="tagline-item">
                <span className="tagline-glow"></span>
                DISCOVER
                    </div>
              <div className="tagline-divider"></div>
              <div className="tagline-item">
                <span className="tagline-glow"></span>
                ELEVATE
                  </div>
            </div>

            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigate('/jobs')}>
                <span>Find Jobs</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="cta-secondary" onClick={() => navigate('/post-job')}>
                <span>Post a Job</span>
              </button>
              {isAuthenticated && user?.role === 'jobSeeker' && (
                <button className="cta-secondary" onClick={() => navigate('/jobseeker-dashboard')}>
                  <span>Go to Dashboard</span>
                </button>
              )}
                    </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hero-visual"
          >
            <div className="floating-elements">
              <div className="float-icon briefcase">💼</div>
              <div className="float-icon resume">📄</div>
              <div className="float-icon chip">🔷</div>
              <div className="float-icon search">🔍</div>
              <div className="float-icon globe">🌐</div>
              <div className="float-icon rocket">🚀</div>
              <div className="float-logo">
                <img src={akLogo} alt="Akshar Jobs" className="hero-logo" />
                <div className="logo-glow-ring"></div>
                    </div>
                  </div>
            <div className="ai-globe">
              <div className="globe-ring"></div>
              <div className="globe-ring ring-2"></div>
              <div className="globe-core"></div>
                    </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <motion.section 
        className="how-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="section-header">
          <h2 className="section-title">How Akshar Jobs Works</h2>
          <p className="section-subtitle">Our AI bridges the gap between talent and opportunity</p>
        </motion.div>

        <div className="how-grid">
          {[
            {
              icon: "📤",
              title: "Upload Your Resume",
              description: "Our AI understands your strengths and experience in seconds"
            },
            {
              icon: "🤖",
              title: "AI Analyzes Skills",
              description: "It identifies roles that fit you perfectly with 98% accuracy"
            },
            {
              icon: "⚡",
              title: "Get Matched Instantly",
              description: "Discover opportunities that elevate your career instantly"
            },
            {
              icon: "📊",
              title: "Track & Improve",
              description: "Get personalized AI feedback for continuous growth"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={glowCard}
              whileHover="hover"
              className="how-card glass-card"
            >
              <div className="card-icon">{item.icon}</div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>
              <div className="card-glow-border"></div>
            </motion.div>
          ))}
                  </div>
      </motion.section>

      {/* For Seekers & Recruiters */}
      <motion.section 
        className="audience-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="audience-grid">
          <motion.div variants={glowCard} whileHover="hover" className="audience-card glass-panel">
            <div className="panel-icon">🎯</div>
            <h3 className="panel-title">For Job Seekers</h3>
            <ul className="panel-features">
              <li>
                <span className="feature-check">✓</span>
                Personalized job recommendations
              </li>
              <li>
                <span className="feature-check">✓</span>
                Resume match scoring
              </li>
              <li>
                <span className="feature-check">✓</span>
                Career insights & analytics
              </li>
              <li>
                <span className="feature-check">✓</span>
                AI-powered skill gap analysis
              </li>
            </ul>
            <button className="panel-cta" onClick={() => navigate('/signup')}>
              Start Your Journey
              <span className="cta-arrow">→</span>
              </button>
          </motion.div>

          <motion.div variants={glowCard} whileHover="hover" className="audience-card glass-panel recruiter-panel">
            <div className="panel-icon">🏢</div>
            <h3 className="panel-title">For Recruiters</h3>
            <ul className="panel-features">
              <li>
                <span className="feature-check">✓</span>
                Post jobs effortlessly
              </li>
              <li>
                <span className="feature-check">✓</span>
                AI candidate shortlisting
              </li>
              <li>
                <span className="feature-check">✓</span>
                Analytics dashboard
              </li>
              <li>
                <span className="feature-check">✓</span>
                Smart talent pool management
              </li>
            </ul>
            <button className="panel-cta recruiter-cta" onClick={() => navigate('/post-job')}>
              Hire Smarter
              <span className="cta-arrow">→</span>
            </button>
          </motion.div>
              </div>
      </motion.section>

      {/* AI Insights / Statistics */}
      <motion.section 
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        onViewportEnter={() => {
          startJobsCount(true);
          startAccuracyCount(true);
          startRecruitersCount(true);
        }}
      >
        <div className="stats-bg-effects">
          <div className="stats-particle"></div>
          <div className="stats-particle"></div>
          <div className="stats-particle"></div>
          </div>
          
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            variants={fadeInUp}
          >
            <div className="stat-icon">📊</div>
            <div className="stat-number">{jobsCount.toLocaleString()}+</div>
            <div className="stat-label">Jobs Matched</div>
            <div className="stat-glow"></div>
          </motion.div>

          <motion.div 
            className="stat-card"
            variants={fadeInUp}
          >
            <div className="stat-icon">🎯</div>
            <div className="stat-number">{accuracyCount}%</div>
            <div className="stat-label">AI Match Precision</div>
            <div className="stat-glow"></div>
          </motion.div>

          <motion.div 
            className="stat-card"
            variants={fadeInUp}
          >
            <div className="stat-icon">🌍</div>
            <div className="stat-number">{recruitersCount}+</div>
            <div className="stat-label">Global Recruiters</div>
            <div className="stat-glow"></div>
          </motion.div>
                  </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="testimonials-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="section-header">
          <h2 className="section-title">Real Stories. Real Success.</h2>
          <p className="section-subtitle">Hear how professionals and companies found success through Akshar Jobs</p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
                key={index} 
              variants={glowCard}
              whileHover="hover"
              className="testimonial-card glass-card"
            >
              <div className="testimonial-avatar">{testimonial.image}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-name">{testimonial.name}</div>
                <div className="author-role">{testimonial.role} at {testimonial.company}</div>
                </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            </motion.div>
            ))}
          </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        className="final-cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="cta-wave-bg">
          <svg viewBox="0 0 1200 200" className="wave-svg">
            <path d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z" fill="url(#waveGradient)">
              <animate attributeName="d" 
                dur="10s" 
                repeatCount="indefinite"
                values="
                  M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z;
                  M0,100 Q300,150 600,100 T1200,100 L1200,200 L0,200 Z;
                  M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z
                "
              />
            </path>
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="final-cta-content">
          <h2 className="final-cta-title">Join the Future of Hiring</h2>
          <p className="final-cta-text">
            Whether you're searching for your next role or your next great hire — 
            Akshar Jobs connects ambition with opportunity.
          </p>
          <button className="final-cta-button" onClick={() => navigate('/signup')}>
            Get Started — It's Free
            <span className="button-pulse"></span>
                </button>
              </div>
      </motion.section>

      {/* Footer */}
      <footer className="futuristic-footer">
        <div className="footer-glow-line"></div>
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <a href="#about" className="footer-link">About</a>
              <a href="#careers" className="footer-link">Careers</a>
              <a href="#contact" className="footer-link">Contact</a>
                </div>

            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <a href="#blog" className="footer-link">Blog</a>
              <a href="#faqs" className="footer-link">FAQs</a>
              <a href="#terms" className="footer-link">Terms</a>
              <a href="#privacy" className="footer-link">Privacy</a>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Connect</h4>
              <div className="social-links">
                <a href="#linkedin" className="social-link">LinkedIn</a>
                <a href="#twitter" className="social-link">Twitter</a>
                <a href="#github" className="social-link">GitHub</a>
              </div>
            </div>
            
            <div className="footer-column">
              <div className="footer-brand">
                <img src={akLogo} alt="Akshar Jobs" className="footer-logo" />
                <div className="footer-tagline">CONNECT | DISCOVER | ELEVATE</div>
              </div>
            </div>
              </div>

          <div className="footer-bottom">
            <p className="footer-credit">
              © 2025 Akshar Jobs. Empowering Careers Through Artificial Intelligence.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating AI Chatbot */}
      <motion.button
        className="ai-chatbot-fab"
        onClick={() => navigate('/contact')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="fab-pulse"></span>
        <span className="fab-pulse pulse-2"></span>
        <div className="fab-icon">🤖</div>
        <div className="fab-text">AI Help</div>
      </motion.button>
    </div>
  );
};

export default Home;
