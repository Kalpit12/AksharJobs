import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faClock,
  faComments,
  faHeadset,
  faRocket,
  faUsers,
  faBuilding,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: faEnvelope,
      title: 'Email Us',
      details: ['support@aksharjobs.com', 'info@aksharjobs.com'],
      description: 'Send us an email and we\'ll respond within 4 hours'
    },
    {
      icon: faPhone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+254 (0) 700 123 456'],
      description: 'Speak with our support team directly'
    },
    {
      icon: faMapMarkerAlt,
      title: 'Visit Us',
      details: ['123 Innovation Drive', 'Tech City, Nairobi, Kenya'],
      description: 'Our headquarters in the heart of Nairobi'
    },
    {
      icon: faClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
      description: 'East Africa Time (EAT)'
    }
  ];

  const departments = [
    {
      name: 'General Support',
      email: 'support@aksharjobs.com',
      description: 'Account issues, technical problems, general inquiries'
    },
    {
      name: 'Sales & Partnerships',
      email: 'sales@aksharjobs.com',
      description: 'Enterprise solutions, partnerships, bulk hiring'
    },
    {
      name: 'Product Feedback',
      email: 'feedback@aksharjobs.com',
      description: 'Feature requests, bug reports, product suggestions'
    },
    {
      name: 'Media & Press',
      email: 'press@aksharjobs.com',
      description: 'Press inquiries, interviews, media partnerships'
    }
  ];

  return (
    <div className="contact_us_wrapper">
      <Header />
      
      {/* Hero Section */}
      <section className="contact_hero">
        <div className="contact_hero_container">
          <div className="hero_content">
            <h1 className="hero_title">
              <FontAwesomeIcon icon={faHeadset} />
              Contact Us
            </h1>
            <p className="hero_subtitle">
              Have questions or need assistance? We're here to help! Reach out to our friendly support team 
              and we'll get back to you as soon as possible.
            </p>
            <div className="quick_stats">
              <div className="quick_stat">
                <FontAwesomeIcon icon={faClock} />
                <span>&lt; 4 Hour Response</span>
              </div>
              <div className="quick_stat">
                <FontAwesomeIcon icon={faUsers} />
                <span>24/7 Support</span>
              </div>
              <div className="quick_stat">
                <FontAwesomeIcon icon={faGlobe} />
                <span>Global Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="contact_methods_section">
        <div className="contact_container">
          <h2 className="section_title">Get In Touch</h2>
          <div className="contact_methods_grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact_method_card">
                <div className="method_icon">
                  <FontAwesomeIcon icon={info.icon} />
                </div>
                <h3>{info.title}</h3>
                <div className="method_details">
                  {info.details.map((detail, detailIndex) => (
                    <span key={detailIndex}>{detail}</span>
                  ))}
                </div>
                <p className="method_description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact_form_section">
        <div className="contact_container">
          <div className="contact_form_content">
            <div className="form_info">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and our team will get back to you within 24 hours.</p>
              
              <div className="departments_list">
                <h3>Direct Contact</h3>
                {departments.map((dept, index) => (
                  <div key={index} className="department_item">
                    <strong>{dept.name}</strong>
                    <a href={`mailto:${dept.email}`}>{dept.email}</a>
                    <p>{dept.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <form className="contact_form" onSubmit={handleSubmit}>
              <div className="form_row">
                <div className="form_field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form_field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div className="form_row">
                <div className="form_field">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div className="form_field">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select a category</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>
              
              <div className="form_field">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Please describe your question or issue in detail..."
                  rows="6"
                />
              </div>
              
              <button type="submit" className="submit_btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faRocket} className="spinning" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEnvelope} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
