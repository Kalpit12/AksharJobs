import React from 'react';
import '../styles/CompanyLogos.css';

const CompanyLogos = () => {
  const companies = [
    { name: 'Safaricom', logo: 'S' },
    { name: 'KCB Bank', logo: 'K' },
    { name: 'Kenya Airways', logo: 'K' },
    { name: 'Equity Bank', logo: 'E' },
    { name: 'Co-operative Bank', logo: 'C' },
    { name: 'TalenMatch', logo: 'T' },
    { name: 'Safaricom', logo: 'S' },
    { name: 'KCB Bank', logo: 'K' },
    { name: 'Kenya Airways', logo: 'K' },
    { name: 'Equity Bank', logo: 'E' },
    { name: 'Co-operative Bank', logo: 'C' },
    { name: 'TalenMatch', logo: 'T' }
  ];

  return (
    <div className="company_logos_section">
      <div className="company_logos_container">
        <h3 className="company_logos_title">Trusted by Leading Companies</h3>
        <div className="company_logos_carousel">
          <div className="company_logos_track">
            {companies.map((company, index) => (
              <div key={index} className="company_logo_item">
                <div className="company_logo">
                  {company.logo}
                </div>
                <span className="company_name">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogos;
