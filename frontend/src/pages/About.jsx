import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faRocket, 
  faBullseye, 
  faGlobe, 
  faHeart,
  faLightbulb,
  faShield,
  faChartLine,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/About.css';

const About = () => {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    console.log('📄 About page loaded');
    console.log('📄 About page - isAuthenticated:', isAuthenticated);
    console.log('📄 About page - loading:', loading);
    console.log('📄 About page - user:', user);
  }, [isAuthenticated, user, loading]);
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/default-avatar.png",
      description: "Visionary leader with 10+ years in tech innovation"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "AI expert and technology architect"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Creative director focused on user experience"
    },
    {
      name: "David Thompson",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Full-stack developer passionate about clean code"
    }
  ];

  const values = [
    {
      icon: faRocket,
      title: "Innovation",
      description: "We constantly push boundaries to create cutting-edge solutions that revolutionize the job market."
    },
    {
      icon: faUsers,
      title: "Community",
      description: "Building connections between talented professionals and forward-thinking companies worldwide."
    },
    {
      icon: faBullseye,
      title: "Excellence",
      description: "Committed to delivering exceptional results and exceeding expectations in everything we do."
    },
    {
      icon: faHeart,
      title: "Passion",
      description: "Driven by our love for helping people find their dream careers and companies find perfect talent."
    }
  ];

  const stats = [
    { number: "50K+", label: "Job Seekers" },
    { number: "500+", label: "Companies" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="about_wrapper">
      {/* Hero Section */}
      <section className="about_hero">
        <div className="about_hero_container">
          <div className="about_hero_content">
            <h1 className="about_hero_title">About AksharJobs</h1>
            <p className="about_hero_subtitle">
              We're revolutionizing the way people find careers and companies discover talent. 
              Our AI-powered platform connects the right people with the right opportunities, 
              creating meaningful matches that drive success.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission_section">
        <div className="mission_container">
          <div className="mission_content">
            <div className="mission_text">
              <h2 className="mission_title">Our Mission</h2>
              <p className="mission_description">
                To democratize career opportunities by leveraging artificial intelligence to create 
                perfect matches between job seekers and employers. We believe everyone deserves to 
                find work they love and companies deserve to find talent that drives their success.
              </p>
              <div className="mission_highlights">
                <div className="mission_highlight">
                  <FontAwesomeIcon icon={faLightbulb} className="highlight_icon" />
                  <span>AI-Powered Matching</span>
                </div>
                <div className="mission_highlight">
                  <FontAwesomeIcon icon={faGlobe} className="highlight_icon" />
                  <span>Global Reach</span>
                </div>
                <div className="mission_highlight">
                  <FontAwesomeIcon icon={faShield} className="highlight_icon" />
                  <span>Secure Platform</span>
                </div>
              </div>
            </div>
            <div className="mission_image">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Team collaboration"
                className="mission_img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about_stats_section">
        <div className="about_stats_container">
          <h2 className="about_stats_title">Our Impact</h2>
          <div className="about_stats_grid">
            {stats.map((stat, index) => (
              <div key={index} className="about_stat_card">
                <div className="about_stat_number">{stat.number}</div>
                <div className="about_stat_label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values_section">
        <div className="values_container">
          <h2 className="values_title">Our Values</h2>
          <p className="values_subtitle">
            The principles that guide everything we do at AksharJobs
          </p>
          <div className="values_grid">
            {values.map((value, index) => (
              <div key={index} className="value_card">
                <div className="value_icon">
                  <FontAwesomeIcon icon={value.icon} />
                </div>
                <h3 className="value_title">{value.title}</h3>
                <p className="value_description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team_section">
        <div className="team_container">
          <h2 className="team_title">Meet Our Team</h2>
          <p className="team_subtitle">
            The passionate individuals behind AksharJobs' success
          </p>
          <div className="team_grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team_card">
                <div className="team_image_container">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="team_image"
                  />
                </div>
                <div className="team_info">
                  <h3 className="team_name">{member.name}</h3>
                  <p className="team_role">{member.role}</p>
                  <p className="team_description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about_cta_section">
        <div className="about_cta_container">
          <div className="about_cta_content">
            <h2 className="about_cta_title">Ready to Join Our Journey?</h2>
            <p className="about_cta_subtitle">
              Whether you're looking for your next career opportunity or seeking top talent, 
              we're here to help you succeed.
            </p>
            <div className="about_cta_buttons">
              <button className="about_cta_button primary">
                <FontAwesomeIcon icon={faHandshake} />
                Get Started
              </button>
              <button className="about_cta_button secondary">
                <FontAwesomeIcon icon={faChartLine} />
                View Jobs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
