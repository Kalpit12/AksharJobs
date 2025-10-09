import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, 
  faImage, 
  faFileAlt, 
  faExternalLinkAlt,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faDownload,
  faGithub,
  faGlobe,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';
import { FadeInUp } from './animations';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/PortfolioShowcase.css';

const PortfolioShowcase = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/portfolio/items')
      );

      if (response && response.ok) {
        const data = await response.json();
        setPortfolioItems(data.items || []);
      } else {
        // Mock data for demonstration
        setPortfolioItems([
          {
            id: 1,
            title: 'E-Commerce Platform',
            description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
            category: 'web_development',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            imageUrl: 'https://via.placeholder.com/400x250/3b82f6/ffffff?text=E-Commerce+Platform',
            liveUrl: 'https://example-ecommerce.com',
            githubUrl: 'https://github.com/user/ecommerce-platform',
            featured: true,
            createdAt: '2024-01-10T00:00:00Z'
          },
          {
            id: 2,
            title: 'Mobile Banking App',
            description: 'A secure mobile banking application with biometric authentication, real-time transactions, and financial analytics.',
            category: 'mobile_development',
            technologies: ['React Native', 'Firebase', 'Node.js', 'Biometric Auth'],
            imageUrl: 'https://via.placeholder.com/400x250/10b981/ffffff?text=Mobile+Banking+App',
            liveUrl: null,
            githubUrl: 'https://github.com/user/banking-app',
            featured: true,
            createdAt: '2024-01-05T00:00:00Z'
          },
          {
            id: 3,
            title: 'Data Visualization Dashboard',
            description: 'Interactive dashboard for analyzing business metrics with real-time data updates and customizable charts.',
            category: 'data_science',
            technologies: ['Python', 'D3.js', 'Flask', 'PostgreSQL'],
            imageUrl: 'https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Data+Dashboard',
            liveUrl: 'https://example-dashboard.com',
            githubUrl: 'https://github.com/user/data-dashboard',
            featured: false,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 4,
            title: 'AI Chatbot',
            description: 'Intelligent chatbot powered by machine learning for customer support with natural language processing.',
            category: 'artificial_intelligence',
            technologies: ['Python', 'TensorFlow', 'OpenAI API', 'FastAPI'],
            imageUrl: 'https://via.placeholder.com/400x250/f59e0b/ffffff?text=AI+Chatbot',
            liveUrl: 'https://example-chatbot.com',
            githubUrl: 'https://github.com/user/ai-chatbot',
            featured: false,
            createdAt: '2023-12-20T00:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      setError('Failed to load portfolio items');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'web_development':
        return faCode;
      case 'mobile_development':
        return faImage;
      case 'data_science':
        return faFileAlt;
      case 'artificial_intelligence':
        return faCode;
      default:
        return faCode;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'web_development':
        return '#3b82f6';
      case 'mobile_development':
        return '#10b981';
      case 'data_science':
        return '#8b5cf6';
      case 'artificial_intelligence':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'web_development':
        return 'Web Development';
      case 'mobile_development':
        return 'Mobile Development';
      case 'data_science':
        return 'Data Science';
      case 'artificial_intelligence':
        return 'AI/ML';
      default:
        return 'Other';
    }
  };

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredItems = portfolioItems.filter(item => item.featured);
  const regularItems = portfolioItems.filter(item => !item.featured);

  if (loading) {
    return (
      <div className="portfolio-showcase-container">
        <div className="portfolio-showcase-header">
          <h3>Portfolio Showcase</h3>
          <div className="loading-skeleton">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-showcase-container">
        <div className="portfolio-showcase-header">
          <h3>Portfolio Showcase</h3>
          <div className="error-message">
            <FontAwesomeIcon icon={faCode} />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-showcase-container">
      <div className="portfolio-showcase-header">
        <h3>Portfolio Showcase</h3>
        <div className="header-actions">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <FontAwesomeIcon icon={faFilter} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="web_development">Web Development</option>
              <option value="mobile_development">Mobile Development</option>
              <option value="data_science">Data Science</option>
              <option value="artificial_intelligence">AI/ML</option>
            </select>
          </div>
          <button 
            className="add-project-btn"
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Project
          </button>
        </div>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="no-projects">
          <FontAwesomeIcon icon={faCode} />
          <p>No portfolio projects yet</p>
          <span>Showcase your work by adding projects to your portfolio</span>
          <button 
            className="add-first-project-btn"
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="portfolio-content">
          {/* Featured Projects */}
          {featuredItems.length > 0 && (
            <div className="featured-section">
              <h4>Featured Projects</h4>
              <div className="featured-grid">
                {featuredItems.map((item, index) => (
                  <FadeInUp key={item.id} delay={index * 0.1}>
                    <div className="portfolio-item featured">
                      <div className="project-image">
                        <img src={item.imageUrl} alt={item.title} />
                        <div className="project-overlay">
                          <div className="project-actions">
                            {item.liveUrl && (
                              <button className="action-btn live">
                                <FontAwesomeIcon icon={faGlobe} />
                              </button>
                            )}
                            {item.githubUrl && (
                              <button className="action-btn github">
                                <FontAwesomeIcon icon={faGithubBrand} />
                              </button>
                            )}
                            <button className="action-btn view">
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </div>
                        </div>
                        <div className="featured-badge">Featured</div>
                      </div>
                      <div className="project-content">
                        <div className="project-header">
                          <h5>{item.title}</h5>
                          <div className="project-category">
                            <FontAwesomeIcon 
                              icon={getCategoryIcon(item.category)}
                              style={{ color: getCategoryColor(item.category) }}
                            />
                            {getCategoryLabel(item.category)}
                          </div>
                        </div>
                        <p className="project-description">{item.description}</p>
                        <div className="project-technologies">
                          {item.technologies.map((tech, idx) => (
                            <span key={idx} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                        <div className="project-links">
                          {item.liveUrl && (
                            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                              <FontAwesomeIcon icon={faExternalLinkAlt} />
                              Live Demo
                            </a>
                          )}
                          {item.githubUrl && (
                            <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                              <FontAwesomeIcon icon={faGithubBrand} />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            </div>
          )}

          {/* Regular Projects */}
          {regularItems.length > 0 && (
            <div className="projects-section">
              <h4>All Projects</h4>
              <div className="projects-grid">
                {regularItems.map((item, index) => (
                  <FadeInUp key={item.id} delay={index * 0.1}>
                    <div className="portfolio-item">
                      <div className="project-image">
                        <img src={item.imageUrl} alt={item.title} />
                        <div className="project-overlay">
                          <div className="project-actions">
                            {item.liveUrl && (
                              <button className="action-btn live">
                                <FontAwesomeIcon icon={faGlobe} />
                              </button>
                            )}
                            {item.githubUrl && (
                              <button className="action-btn github">
                                <FontAwesomeIcon icon={faGithubBrand} />
                              </button>
                            )}
                            <button className="action-btn view">
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="project-content">
                        <div className="project-header">
                          <h5>{item.title}</h5>
                          <div className="project-category">
                            <FontAwesomeIcon 
                              icon={getCategoryIcon(item.category)}
                              style={{ color: getCategoryColor(item.category) }}
                            />
                            {getCategoryLabel(item.category)}
                          </div>
                        </div>
                        <p className="project-description">{item.description}</p>
                        <div className="project-technologies">
                          {item.technologies.map((tech, idx) => (
                            <span key={idx} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                        <div className="project-links">
                          {item.liveUrl && (
                            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                              <FontAwesomeIcon icon={faExternalLinkAlt} />
                              Live Demo
                            </a>
                          )}
                          {item.githubUrl && (
                            <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                              <FontAwesomeIcon icon={faGithubBrand} />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {portfolioItems.length > 0 && (
        <div className="portfolio-footer">
          <button className="view-all-btn">
            View Full Portfolio
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioShowcase;
