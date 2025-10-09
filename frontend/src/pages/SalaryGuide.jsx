import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, 
  faChartLine, 
  faMapMarkerAlt, 
  faBriefcase,
  faGraduationCap,
  faSearch,
  faArrowUp,
  faInfoCircle,
  faBuilding,
  faUsers,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/SalaryGuide.css';

const SalaryGuide = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  // Salary data by role
  const salaryData = [
    {
      role: 'Software Engineer',
      junior: { min: 60000, max: 90000 },
      mid: { min: 90000, max: 130000 },
      senior: { min: 130000, max: 180000 },
      growth: '+12%',
      demand: 'Very High'
    },
    {
      role: 'Data Scientist',
      junior: { min: 70000, max: 100000 },
      mid: { min: 100000, max: 140000 },
      senior: { min: 140000, max: 200000 },
      growth: '+15%',
      demand: 'Very High'
    },
    {
      role: 'Product Manager',
      junior: { min: 80000, max: 110000 },
      mid: { min: 110000, max: 150000 },
      senior: { min: 150000, max: 220000 },
      growth: '+10%',
      demand: 'High'
    },
    {
      role: 'UX/UI Designer',
      junior: { min: 50000, max: 75000 },
      mid: { min: 75000, max: 105000 },
      senior: { min: 105000, max: 140000 },
      growth: '+8%',
      demand: 'High'
    },
    {
      role: 'DevOps Engineer',
      junior: { min: 65000, max: 95000 },
      mid: { min: 95000, max: 135000 },
      senior: { min: 135000, max: 190000 },
      growth: '+14%',
      demand: 'Very High'
    },
    {
      role: 'Marketing Manager',
      junior: { min: 45000, max: 70000 },
      mid: { min: 70000, max: 100000 },
      senior: { min: 100000, max: 140000 },
      growth: '+6%',
      demand: 'Medium'
    }
  ];

  // Location multipliers
  const locationData = [
    { city: 'Nairobi, Kenya', multiplier: 1.0, cost: 'Medium' },
    { city: 'Mombasa, Kenya', multiplier: 0.85, cost: 'Low' },
    { city: 'Kisumu, Kenya', multiplier: 0.75, cost: 'Low' },
    { city: 'Remote (Global)', multiplier: 1.2, cost: 'Variable' },
    { city: 'Cape Town, SA', multiplier: 1.1, cost: 'Medium' },
    { city: 'Lagos, Nigeria', multiplier: 0.9, cost: 'Medium' }
  ];

  // Industry insights
  const industryInsights = [
    {
      industry: 'Technology',
      avgSalary: '$95,000',
      growth: '+18%',
      jobs: '2,500+',
      icon: faBriefcase
    },
    {
      industry: 'Finance',
      avgSalary: '$85,000',
      growth: '+8%',
      jobs: '1,200+',
      icon: faChartLine
    },
    {
      industry: 'Healthcare',
      avgSalary: '$75,000',
      growth: '+12%',
      jobs: '800+',
      icon: faUsers
    },
    {
      industry: 'Education',
      avgSalary: '$55,000',
      growth: '+5%',
      jobs: '600+',
      icon: faGraduationCap
    }
  ];

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="salary_guide_wrapper">
      <Header />
      
      {/* Hero Section */}
      <section className="salary_hero">
        <div className="salary_hero_container">
          <div className="hero_content">
            <h1 className="hero_title">
              <FontAwesomeIcon icon={faMoneyBillWave} />
              Salary Guide 2024
            </h1>
            <p className="hero_subtitle">
              Get accurate salary insights for your career decisions. Explore compensation data across roles, 
              locations, and experience levels to negotiate with confidence.
            </p>
            
            <div className="salary_search">
              <div className="search_filters">
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="filter_select"
                >
                  <option value="">Select Role</option>
                  {salaryData.map(role => (
                    <option key={role.role} value={role.role}>{role.role}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="filter_select"
                >
                  <option value="">Select Location</option>
                  {locationData.map(location => (
                    <option key={location.city} value={location.city}>{location.city}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedExperience} 
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="filter_select"
                >
                  <option value="">Experience Level</option>
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="mid">Mid-level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
                
                <button className="search_btn">
                  <FontAwesomeIcon icon={faSearch} />
                  Search Salaries
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Salary Data Table */}
      <section className="salary_data_section">
        <div className="salary_container">
          <h2 className="section_title">Salary Ranges by Role</h2>
          <div className="salary_table_container">
            <table className="salary_table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Junior (0-2 yrs)</th>
                  <th>Mid-level (3-5 yrs)</th>
                  <th>Senior (5+ yrs)</th>
                  <th>Growth</th>
                  <th>Demand</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.map((role, index) => (
                  <tr key={index} className={selectedRole === role.role ? 'highlighted' : ''}>
                    <td className="role_name">
                      <FontAwesomeIcon icon={faBriefcase} />
                      {role.role}
                    </td>
                    <td className="salary_range">
                      {formatSalary(role.junior.min)} - {formatSalary(role.junior.max)}
                    </td>
                    <td className="salary_range">
                      {formatSalary(role.mid.min)} - {formatSalary(role.mid.max)}
                    </td>
                    <td className="salary_range">
                      {formatSalary(role.senior.min)} - {formatSalary(role.senior.max)}
                    </td>
                    <td className="growth_rate">
                      <FontAwesomeIcon icon={faArrowUp} />
                      {role.growth}
                    </td>
                    <td className={`demand_level ${role.demand.toLowerCase().replace(' ', '_')}`}>
                      {role.demand}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Location Insights */}
      <section className="location_insights">
        <div className="salary_container">
          <h2 className="section_title">Salary by Location</h2>
          <div className="location_grid">
            {locationData.map((location, index) => (
              <div key={index} className="location_card">
                <div className="location_header">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <h3>{location.city}</h3>
                </div>
                <div className="location_details">
                  <div className="multiplier">
                    <span className="label">Salary Multiplier:</span>
                    <span className="value">{location.multiplier}x</span>
                  </div>
                  <div className="cost_of_living">
                    <span className="label">Cost of Living:</span>
                    <span className={`value ${location.cost.toLowerCase()}`}>{location.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Insights */}
      <section className="industry_insights">
        <div className="salary_container">
          <h2 className="section_title">Industry Overview</h2>
          <div className="industry_grid">
            {industryInsights.map((industry, index) => (
              <div key={index} className="industry_card">
                <div className="industry_icon">
                  <FontAwesomeIcon icon={industry.icon} />
                </div>
                <h3>{industry.industry}</h3>
                <div className="industry_stats">
                  <div className="stat">
                    <span className="stat_label">Avg Salary</span>
                    <span className="stat_value">{industry.avgSalary}</span>
                  </div>
                  <div className="stat">
                    <span className="stat_label">Growth</span>
                    <span className="stat_value growth">{industry.growth}</span>
                  </div>
                  <div className="stat">
                    <span className="stat_label">Open Jobs</span>
                    <span className="stat_value">{industry.jobs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salary Tips */}
      <section className="salary_tips">
        <div className="salary_container">
          <h2 className="section_title">Salary Negotiation Tips</h2>
          <div className="tips_grid">
            <div className="tip_card">
              <div className="tip_icon">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <h3>Research Market Rates</h3>
              <p>Use our salary data and industry reports to understand current market rates for your role and experience level.</p>
            </div>
            <div className="tip_card">
              <div className="tip_icon">
                <FontAwesomeIcon icon={faArrowUp} />
              </div>
              <h3>Highlight Your Value</h3>
              <p>Document your achievements, certifications, and unique skills that justify higher compensation.</p>
            </div>
            <div className="tip_card">
              <div className="tip_icon">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <h3>Consider Total Package</h3>
              <p>Evaluate benefits, stock options, remote work flexibility, and growth opportunities alongside base salary.</p>
            </div>
            <div className="tip_card">
              <div className="tip_icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3>Time It Right</h3>
              <p>Best times to negotiate: during performance reviews, after completing major projects, or when receiving job offers.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SalaryGuide;
