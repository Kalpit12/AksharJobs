import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faVideo, 
  faDownload, 
  faExternalLinkAlt,
  faFileAlt,
  faChartLine,
  faUsers,
  faLightbulb,
  faGraduationCap,
  faBriefcase,
  faSearch,
  faFilter,
  faStar,
  faCalendar,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Resources.css';

const Resources = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const resources = [
    {
      id: 1,
      type: 'guide',
      category: 'job-search',
      title: 'Complete Job Search Guide 2024',
      description: 'Comprehensive guide covering every aspect of modern job searching from resume writing to salary negotiation.',
      downloadUrl: '#',
      fileSize: '2.5 MB',
      downloads: 1240,
      rating: 4.8,
      icon: faBookOpen,
      featured: true
    },
    {
      id: 2,
      type: 'template',
      category: 'resume',
      title: 'ATS-Optimized Resume Templates',
      description: 'Professional resume templates designed to pass Applicant Tracking Systems and impress recruiters.',
      downloadUrl: '#',
      fileSize: '1.8 MB',
      downloads: 2350,
      rating: 4.9,
      icon: faFileAlt,
      featured: true
    },
    {
      id: 3,
      type: 'webinar',
      category: 'skills',
      title: 'Future Skills for Tech Professionals',
      description: 'Live webinar covering emerging technologies and skills that will be in high demand.',
      downloadUrl: '#',
      duration: '45 min',
      attendees: 890,
      rating: 4.7,
      icon: faVideo,
      featured: false
    },
    {
      id: 4,
      type: 'checklist',
      category: 'interview',
      title: 'Interview Preparation Checklist',
      description: 'Step-by-step checklist to ensure you\'re fully prepared for any job interview.',
      downloadUrl: '#',
      fileSize: '0.5 MB',
      downloads: 3200,
      rating: 4.9,
      icon: faCheckCircle,
      featured: false
    },
    {
      id: 5,
      type: 'report',
      category: 'market',
      title: 'Kenya Tech Salary Report 2024',
      description: 'Comprehensive analysis of technology sector salaries and trends in Kenya.',
      downloadUrl: '#',
      fileSize: '4.2 MB',
      downloads: 680,
      rating: 4.6,
      icon: faChartLine,
      featured: true
    },
    {
      id: 6,
      type: 'course',
      category: 'networking',
      title: 'Professional Networking Masterclass',
      description: 'Learn how to build and leverage professional relationships for career advancement.',
      downloadUrl: '#',
      duration: '2 hours',
      enrolled: 450,
      rating: 4.8,
      icon: faUsers,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: faBookOpen },
    { id: 'job-search', name: 'Job Search', icon: faSearch },
    { id: 'resume', name: 'Resume & CV', icon: faFileAlt },
    { id: 'skills', name: 'Skills Development', icon: faGraduationCap },
    { id: 'interview', name: 'Interview Prep', icon: faBriefcase },
    { id: 'market', name: 'Market Insights', icon: faChartLine },
    { id: 'networking', name: 'Networking', icon: faUsers }
  ];

  const featuredResources = resources.filter(resource => resource.featured);
  const filteredResources = activeFilter === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeFilter);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'guide': return faBookOpen;
      case 'template': return faFileAlt;
      case 'webinar': return faVideo;
      case 'checklist': return faCheckCircle;
      case 'report': return faChartLine;
      case 'course': return faGraduationCap;
      default: return faBookOpen;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'guide': return '#3b82f6';
      case 'template': return '#10b981';
      case 'webinar': return '#f59e0b';
      case 'checklist': return '#ef4444';
      case 'report': return '#8b5cf6';
      case 'course': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  return (
    <div className="resources_wrapper">
      <Header />
      
      {/* Hero Section */}
      <section className="resources_hero">
        <div className="resources_hero_container">
          <div className="hero_content">
            <h1 className="hero_title">
              <FontAwesomeIcon icon={faLightbulb} />
              Career Resources Hub
            </h1>
            <p className="hero_subtitle">
              Access our comprehensive library of career resources, guides, templates, and tools 
              designed to accelerate your professional growth and job search success.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="featured_resources_section">
        <div className="resources_container">
          <h2 className="section_title">Featured Resources</h2>
          <div className="featured_grid">
            {featuredResources.map(resource => (
              <div key={resource.id} className="featured_card">
                <div className="featured_badge">Featured</div>
                <div className="resource_icon" style={{ backgroundColor: getTypeColor(resource.type) }}>
                  <FontAwesomeIcon icon={getTypeIcon(resource.type)} />
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="resource_stats">
                  <span className="stat">
                    <FontAwesomeIcon icon={faDownload} />
                    {resource.downloads || resource.attendees || resource.enrolled} {resource.type === 'webinar' ? 'attendees' : resource.type === 'course' ? 'enrolled' : 'downloads'}
                  </span>
                  <div className="rating">
                    <FontAwesomeIcon icon={faStar} />
                    {resource.rating}
                  </div>
                </div>
                <button className="download_btn">
                  <FontAwesomeIcon icon={faDownload} />
                  {resource.type === 'webinar' ? 'Register' : resource.type === 'course' ? 'Enroll' : 'Download'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="filter_section">
        <div className="resources_container">
          <div className="filter_tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter_tab ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                <FontAwesomeIcon icon={category.icon} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="all_resources_section">
        <div className="resources_container">
          <div className="resources_grid">
            {filteredResources.map(resource => (
              <div key={resource.id} className="resource_card">
                <div className="resource_type_badge" style={{ backgroundColor: getTypeColor(resource.type) }}>
                  <FontAwesomeIcon icon={getTypeIcon(resource.type)} />
                  {resource.type}
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="resource_meta">
                  {resource.fileSize && (
                    <span className="meta_item">
                      <FontAwesomeIcon icon={faFileAlt} />
                      {resource.fileSize}
                    </span>
                  )}
                  {resource.duration && (
                    <span className="meta_item">
                      <FontAwesomeIcon icon={faCalendar} />
                      {resource.duration}
                    </span>
                  )}
                  <div className="rating">
                    <FontAwesomeIcon icon={faStar} />
                    {resource.rating}
                  </div>
                </div>
                <button className="resource_btn">
                  <FontAwesomeIcon icon={resource.type === 'webinar' ? faExternalLinkAlt : faDownload} />
                  {resource.type === 'webinar' ? 'Watch' : resource.type === 'course' ? 'Access' : 'Download'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
