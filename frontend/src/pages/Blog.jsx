import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faTags, faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../styles/Blog.css';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'career', name: 'Career Tips', count: 4 },
    { id: 'job-search', name: 'Job Search', count: 3 },
    { id: 'interview', name: 'Interview Prep', count: 3 },
    { id: 'industry', name: 'Industry News', count: 2 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Skills Every Job Seeker Needs in 2024",
      excerpt: "Discover the most in-demand skills that will make you stand out in today's competitive job market.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "career",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Career Development", "Skills", "2024"]
    },
    {
      id: 2,
      title: "Mastering the Art of Virtual Interviews",
      excerpt: "Learn proven strategies to ace your virtual interviews, from technical setup to communication techniques.",
      author: "Michael Chen",
      date: "2024-01-12",
      category: "interview",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Virtual Interviews", "Remote Work", "Communication"]
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>RocketJobs Blog</h1>
          <p>Insights, tips, and strategies to accelerate your career journey</p>
        </div>
      </div>

      <div className="blog-container">
        <div className="blog-sidebar">
          <div className="search-section">
            <div className="search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="categories-section">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="blog-main">
          <div className="blog-header">
            <h2>
              {selectedCategory === 'all' ? 'All Articles' : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p>{filteredPosts.length} articles found</p>
          </div>

          <div className="blog-grid">
            {filteredPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-image">
                  <img src={post.image} alt={post.title} />
                  <div className="blog-card-category">{post.category}</div>
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-card-author">
                      <FontAwesomeIcon icon={faUser} />
                      {post.author}
                    </span>
                    <span className="blog-card-date">
                      <FontAwesomeIcon icon={faCalendar} />
                      {formatDate(post.date)}
                    </span>
                    <span className="blog-card-read-time">{post.readTime}</span>
                  </div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-tags">
                    <FontAwesomeIcon icon={faTags} />
                    {post.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button className="read-more-btn">
                    Read More <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
