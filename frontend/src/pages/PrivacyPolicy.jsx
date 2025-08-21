import React from 'react';
import '../styles/PrivacyPolicy.css';
import Header from '../components/Header';
import BackButton from '../components/BackButton';

const PrivacyPolicy = () => {
  return (
    <div className="privacy_policy_section">
      <Header />
      <BackButton to="/jobseeker-dashboard" text="Back to Dashboard" />
      <h1>Privacy Policy</h1>
      <p>
        At <strong>TalentMatch</strong>, we respect your privacy and are committed to protecting the personal information you share with us.
        This Privacy Policy outlines how we collect, use, store, and protect your data.
      </p>

      <div className="privacy_policy_content">
        <h2>1. Information We Collect</h2>
        <p>
          We collect personal details such as your name, email, resume data, and job preferences when you use our platform.
          Recruiters may also submit job-related information such as job titles, descriptions, and company details.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          Your data is used solely for the purpose of enhancing your experience, including:
          <ul>
            <li>Matching resumes to job descriptions using AI</li>
            <li>Generating strength/weakness insights for seekers</li>
            <li>Getting job recommendations according to your resume</li>
          </ul>
        </p>

        <h2>3. Data Security</h2>
        <p>
          We implement strict security protocols to safeguard your information. All data transfers are encrypted and securely stored.
        </p>

        <h2>4. Sharing of Information</h2>
        <p>
          We do not sell or rent your data. Information is only shared with recruiters after your consent when applying for a job.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your data at any time via your dashboard.
        </p>

        <h2>6. Updates to Policy</h2>
        <p>
          We may update this policy occasionally. You will be notified of any major changes on your dashboard.
        </p>

        <p>
          If you have any questions or concerns, please contact us at <a href="mailto:support@TalentMatch.ai">support@TalentMatch.ai</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;