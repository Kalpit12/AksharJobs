import React from 'react';
import '../styles/TermsOfService.css';
import Header from '../components/Header';

const TermsOfService = () => {
  return (
    <div className="terms_section">
      <Header />
      <h1>Terms of Service</h1>
      <p>
        Welcome to <strong>TalentMatch</strong>. These Terms of Service (“Terms”) govern your use of our platform, including all features like resume-job matching, job listings, and dashboards.
        By accessing or using our services, you agree to these terms.
      </p>

      <div className="terms_content">
        <h2>1. Use of the Platform</h2>
        <p>
          You agree to use our platform only for lawful purposes. Job seekers and recruiters must provide accurate information and avoid misuse such as spam, impersonation, or fraudulent activity.
        </p>

        <h2>2. Account Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized access to your account.
        </p>

        <h2>3. Data Usage</h2>
        <p>
          Our AI analyzes your resume and job posts to provide recommendations. We do not share your personal information without your consent. Read our <a href="/privacy-policy">Privacy Policy</a> for more.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All platform content and algorithms are owned by TalentMatch. You may not copy, reproduce, or distribute any part of the service without permission.
        </p>

        <h2>5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the platform for any violations of these terms or suspicious activity.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          We may update these terms periodically. Continued use of our platform after changes means you agree to the revised terms.
        </p>

        <p>
          For questions, contact us at <a href="mailto:support@TalentMatch.ai">support@TalentMatch.ai</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
