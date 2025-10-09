import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandshake, 
  faBuilding, 
  faUsers, 
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faCheckCircle,
  faRocket,
  faChartLine,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ContactSales.css';

const ContactSales = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    companySize: '',
    industry: '',
    hiringNeeds: '',
    timeline: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Sales inquiry submitted:', formData);
    alert('Thank you for your inquiry! Our sales team will contact you within 24 hours.');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="contact_sales_wrapper">
      <Header />
      
      {/* Hero Section */}
      <section className="sales_hero">
        <div className="sales_hero_container">
          <div className="hero_content">
            <h1 className="hero_title">
              <FontAwesomeIcon icon={faHandshake} />
              Contact Our Sales Team
            </h1>
            <p className="hero_subtitle">
              Ready to transform your hiring process? Our enterprise solutions team is here to help you 
              find the perfect recruitment solution for your organization.
            </p>
            <div className="hero_features">
              <div className="feature_item">
                <FontAwesomeIcon icon={faRocket} />
                <span>Custom Solutions</span>
              </div>
              <div className="feature_item">
                <FontAwesomeIcon icon={faUsers} />
                <span>Dedicated Support</span>
              </div>
              <div className="feature_item">
                <FontAwesomeIcon icon={faChartLine} />
                <span>ROI Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact_form_section">
        <div className="sales_container">
          <div className="contact_content">
            <div className="contact_info">
              <h2>Get Started Today</h2>
              <p>Fill out the form and our sales team will reach out to discuss your specific hiring needs and create a customized solution.</p>
              
              <div className="contact_methods">
                <div className="contact_method">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <div>
                    <strong>Email Us</strong>
                    <span>sales@aksharjobs.com</span>
                  </div>
                </div>
                <div className="contact_method">
                  <FontAwesomeIcon icon={faPhone} />
                  <div>
                    <strong>Call Us</strong>
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="contact_method">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <div>
                    <strong>Schedule a Demo</strong>
                    <span>Book a personalized demo</span>
                  </div>
                </div>
              </div>
            </div>

            <form className="sales_form" onSubmit={handleSubmit}>
              <div className="form_grid">
                <div className="form_field">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div className="form_field">
                  <label>Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form_field">
                  <label>Business Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your business email"
                  />
                </div>
                
                <div className="form_field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form_field">
                  <label>Company Size *</label>
                  <select name="companySize" value={formData.companySize} onChange={handleChange} required>
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
                
                <div className="form_field">
                  <label>Industry *</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} required>
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form_field full_width">
                  <label>Hiring Needs</label>
                  <input
                    type="text"
                    name="hiringNeeds"
                    value={formData.hiringNeeds}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineers, Data Scientists"
                  />
                </div>
                
                <div className="form_field full_width">
                  <label>Timeline</label>
                  <select name="timeline" value={formData.timeline} onChange={handleChange}>
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate (within 1 month)</option>
                    <option value="short">Short-term (1-3 months)</option>
                    <option value="medium">Medium-term (3-6 months)</option>
                    <option value="long">Long-term (6+ months)</option>
                  </select>
                </div>
                
                <div className="form_field full_width">
                  <label>Additional Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your hiring challenges and requirements"
                    rows="4"
                  />
                </div>
              </div>
              
              <button type="submit" className="submit_btn">
                <FontAwesomeIcon icon={faRocket} />
                Request Demo & Pricing
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactSales;
