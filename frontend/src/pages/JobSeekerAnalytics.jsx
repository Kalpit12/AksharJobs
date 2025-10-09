import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faChartBar, faChartPie, faChartArea,
  faEye, faCalendarAlt, faBuilding, faMapMarkerAlt,
  faStar, faThumbsUp, faClock, faArrowUp, faArrowDown,
  faArrowLeft, faRobot, faLightbulb, faBullseye,
  faArrowTrendUp, faArrowTrendDown, faMinus, faSpinner,
  faBriefcase, faUser, faFileAlt, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import { formatSalaryRange, getUserCountry } from '../utils/currencyUtils';
import '../styles/JobSeekerAnalytics.css';

const JobSeekerAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [analyticsData, setAnalyticsData] = useState({
    applications: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      trend: 0
    },
    responses: {
      total: 0,
      rate: 0,
      interviews: 0,
      offers: 0
    },
    skills: {
      topSkills: [],
      skillGaps: [],
      recommendations: []
    },
    market: {
      avgResponseTime: 0,
      salaryRange: { min: 0, max: 0 },
      topCompanies: [],
      topLocations: []
    },
    aiInsights: {
      profileScore: 0,
      suggestions: [],
      keywords: [],
      improvements: []
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Load analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.token) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(buildApiUrl('/api/analytics/jobseeker'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.token, selectedPeriod]);

  // Generate AI insights
  const generateAIInsights = async () => {
    if (!user?.token) return;
    
    try {
      setAiGenerating(true);
      const response = await fetch(buildApiUrl('/api/ai/analytics-insights'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          period: selectedPeriod,
          user_id: user.id 
        })
      });

      if (response.ok) {
        const insights = await response.json();
        setAnalyticsData(prev => ({
          ...prev,
          aiInsights: insights
        }));
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  if (isLoading) {
    return (
      <div className="analytics_loading">
        <FontAwesomeIcon icon={faSpinner} className="spinner" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="jobseeker_analytics">
      {/* Header */}
      <div className="analytics_header">
        <button className="back_btn" onClick={() => navigate('/jobseeker-dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Dashboard
        </button>
        <div className="header_content">
          <h1>Job Search Analytics</h1>
          <div className="header_controls">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period_select"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button 
              className="ai_insights_btn" 
              onClick={generateAIInsights}
              disabled={aiGenerating}
            >
              <FontAwesomeIcon icon={aiGenerating ? faSpinner : faRobot} className={aiGenerating ? 'spinning' : ''} />
              {aiGenerating ? 'Generating...' : 'AI Insights'}
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview_cards">
        <div className="overview_card applications">
          <div className="card_icon">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <div className="card_content">
            <h3>{analyticsData.applications.total}</h3>
            <p>Total Applications</p>
            <div className="trend">
              <FontAwesomeIcon 
                icon={analyticsData.applications.trend > 0 ? faArrowUp : analyticsData.applications.trend < 0 ? faArrowDown : faMinus} 
                className={analyticsData.applications.trend > 0 ? 'trend_up' : analyticsData.applications.trend < 0 ? 'trend_down' : 'trend_neutral'}
              />
              <span>{Math.abs(analyticsData.applications.trend)}%</span>
            </div>
          </div>
        </div>

        <div className="overview_card responses">
          <div className="card_icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="card_content">
            <h3>{analyticsData.responses.rate}%</h3>
            <p>Response Rate</p>
            <div className="trend">
              <FontAwesomeIcon icon={faEye} />
              <span>{analyticsData.responses.total} responses</span>
            </div>
          </div>
        </div>

        <div className="overview_card interviews">
          <div className="card_icon">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className="card_content">
            <h3>{analyticsData.responses.interviews}</h3>
            <p>Interviews</p>
            <div className="trend">
              <FontAwesomeIcon icon={faClock} />
              <span>This period</span>
            </div>
          </div>
        </div>

        <div className="overview_card offers">
          <div className="card_icon">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="card_content">
            <h3>{analyticsData.responses.offers}</h3>
            <p>Job Offers</p>
            <div className="trend">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>Success rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts_section">
        <div className="chart_container">
          <div className="chart_header">
            <h3>Application Trends</h3>
            <div className="chart_controls">
              <button className="chart_btn active">Applications</button>
              <button className="chart_btn">Responses</button>
              <button className="chart_btn">Interviews</button>
            </div>
          </div>
          <div className="chart_content">
            <div className="chart_placeholder">
              <FontAwesomeIcon icon={faChartLine} />
              <p>Application trends over time</p>
            </div>
          </div>
        </div>

        <div className="chart_container">
          <div className="chart_header">
            <h3>Skills Analysis</h3>
          </div>
          <div className="chart_content">
            <div className="skills_chart">
              {analyticsData.skills.topSkills.map((skill, index) => (
                <div key={index} className="skill_bar">
                  <div className="skill_info">
                    <span className="skill_name">{skill.name}</span>
                    <span className="skill_count">{skill.count}</span>
                  </div>
                  <div className="skill_progress">
                    <div 
                      className="skill_fill" 
                      style={{ width: `${(skill.count / analyticsData.skills.topSkills[0]?.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      {analyticsData.aiInsights && (
        <div className="ai_insights_section">
          <div className="section_header">
            <div className="header_left">
              <FontAwesomeIcon icon={faRobot} />
              <h2>AI-Powered Insights</h2>
            </div>
            <div className="profile_score">
              <span className="score_label">Profile Score</span>
              <span className="score_value">{analyticsData.aiInsights.profileScore}/100</span>
            </div>
          </div>

          <div className="insights_grid">
            <div className="insight_card suggestions">
              <div className="card_header">
                <FontAwesomeIcon icon={faLightbulb} />
                <h3>AI Suggestions</h3>
              </div>
              <div className="card_content">
                <ul>
                  {analyticsData.aiInsights.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="insight_card keywords">
              <div className="card_header">
                <FontAwesomeIcon icon={faBullseye} />
                <h3>Keywords to Include</h3>
              </div>
              <div className="card_content">
                <div className="keyword_tags">
                  {analyticsData.aiInsights.keywords.map((keyword, index) => (
                    <span key={index} className="keyword_tag">{keyword}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="insight_card improvements">
              <div className="card_header">
                <FontAwesomeIcon icon={faArrowTrendUp} />
                <h3>Profile Improvements</h3>
              </div>
              <div className="card_content">
                <ul>
                  {analyticsData.aiInsights.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Insights */}
      <div className="market_insights_section">
        <h2>Market Insights</h2>
        <div className="market_grid">
          <div className="market_card">
            <div className="card_header">
              <FontAwesomeIcon icon={faClock} />
              <h3>Average Response Time</h3>
            </div>
            <div className="card_content">
              <div className="metric_value">{analyticsData.market.avgResponseTime} days</div>
              <p>Time to hear back from employers</p>
            </div>
          </div>

          <div className="market_card">
            <div className="card_header">
              <FontAwesomeIcon icon={faChartBar} />
              <h3>Salary Range</h3>
            </div>
            <div className="card_content">
              <div className="metric_value">
                {formatSalaryRange(analyticsData.market.salaryRange.min, analyticsData.market.salaryRange.max, getUserCountry())}
              </div>
              <p>For your skill level and location</p>
            </div>
          </div>

          <div className="market_card">
            <div className="card_header">
              <FontAwesomeIcon icon={faBuilding} />
              <h3>Top Companies</h3>
            </div>
            <div className="card_content">
              <ul className="company_list">
                {analyticsData.market.topCompanies.map((company, index) => (
                  <li key={index}>{company.name} ({company.count} jobs)</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="market_card">
            <div className="card_header">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <h3>Top Locations</h3>
            </div>
            <div className="card_content">
              <ul className="location_list">
                {analyticsData.market.topLocations.map((location, index) => (
                  <li key={index}>{location.name} ({location.count} jobs)</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      {analyticsData.skills.skillGaps.length > 0 && (
        <div className="skill_gaps_section">
          <h2>Skill Gaps to Address</h2>
          <div className="skill_gaps_grid">
            {analyticsData.skills.skillGaps.map((gap, index) => (
              <div key={index} className="skill_gap_card">
                <div className="gap_header">
                  <h4>{gap.skill}</h4>
                  <span className="demand_level">{gap.demand}% demand</span>
                </div>
                <p>{gap.description}</p>
                <div className="gap_actions">
                  <button className="learn_btn">Learn More</button>
                  <button className="add_btn">Add to Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerAnalytics;
