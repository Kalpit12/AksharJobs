import React from 'react';
import '../styles/Contact.css';


const Contact = () => {
  return (
    <div className="Contact">
      
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for support and inquiries</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <h3>📧 Email Support</h3>
              <p>For general inquiries and support:</p>
              <a href="mailto:support@TalentMatch.ai" className="contact-link">
                support@TalentMatch.ai
              </a>
            </div>
            
            <div className="contact-card">
              <h3>💼 Business Inquiries</h3>
              <p>For business partnerships and enterprise solutions:</p>
              <a href="mailto:business@TalentMatch.ai" className="contact-link">
                business@TalentMatch.ai
              </a>
            </div>
            
            <div className="contact-card">
              <h3>🔧 Technical Support</h3>
              <p>For technical issues and platform support:</p>
              <a href="mailto:tech@TalentMatch.ai" className="contact-link">
                tech@TalentMatch.ai
              </a>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your full name" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="your.email@example.com" />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject">
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="business">Business Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" placeholder="Tell us how we can help you..."></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
        
        <div className="contact-footer">
          <p>We typically respond within 24 hours during business days.</p>
          <p>Thank you for choosing RocketJobs!</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
