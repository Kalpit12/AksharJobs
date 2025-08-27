import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/LocalLanguageAnalysis.css';

const LocalLanguageAnalysisPage = () => {
  const navigate = useNavigate();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [demoResume, setDemoResume] = useState(`JINA: John Kamau
MAHALI: Nairobi, Kenya
KARANI: Software Developer

UZALISHI:
- BSc Computer Science, University of Nairobi
- Diploma in Software Engineering, JKUAT

KAZI:
Software Developer - Tech Solutions Ltd (2020-2023)
- Alitengeneza programu za web na mobile
- Alifanya kazi na timu ya watu 5
- Aliongeza ufanisi wa mfumo kwa 40%

PROGRAMU:
- JavaScript, React, Node.js
- Python, Django
- MySQL, MongoDB
- Git, Docker

LUGHA:
- Kiswahili (sanifu)
- English (fluent)
- Kikuyu (basic)

UJITUMIAJI:
- Timu kazi
- Kutatua matatizo
- Kujifunza haraka
- Mawasiliano mazuri`);



  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setAnalysisResult({
        languageMix: {
          swahili: 65,
          english: 30,
          kikuyu: 5
        },
        culturalFit: {
          score: 85,
          insights: [
            "Strong understanding of Kenyan workplace culture",
            "Good balance of formal and informal communication",
            "Demonstrates local business etiquette"
          ]
        },
        localBusinessContext: {
          sector: "Formal Tech Sector",
          marketUnderstanding: "High",
          recommendations: [
            "Emphasize local market knowledge",
            "Highlight community involvement",
            "Showcase local language skills"
          ]
        },
        talentScore: 88
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="local-language-page">
      <Header />
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🚀 Revolutionary Swahili & Local Language Resume Analysis
          </h1>
          <p className="hero-subtitle">
            Unlock 70% MORE Kenyan talent with AI-powered cultural intelligence
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">70%</span>
              <span className="stat-label">More Talent Access</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Local Languages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Accuracy Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="feature-overview">
        <h2>Why This Feature is Revolutionary</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Cultural Intelligence</h3>
            <p>AI understands Kenyan workplace culture, local business practices, and cultural nuances</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗣️</div>
            <h3>Multi-Language Support</h3>
            <p>Analyzes Swahili, English, Kikuyu, Kamba, Luhya, and other local languages</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Local Market Context</h3>
            <p>Identifies formal vs informal sector experience and local business understanding</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Analysis</h3>
            <p>Instant insights with Gemini AI technology for immediate decision making</p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="demo-section">
        <h2>See It In Action</h2>
        <div className="demo-container">
          <div className="demo-input">
            <h3>Input Resume (Swahili/Local Language)</h3>
            <textarea
              value={demoResume}
              onChange={(e) => setDemoResume(e.target.value)}
              placeholder="Paste resume in Swahili or local language..."
              className="resume-input"
            />
            <button 
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
          
          <div className="demo-output">
            <h3>AI Analysis Results</h3>
            {!analysisResult ? (
              <div className="placeholder-result">
                <p>Click "Analyze Resume" to see the magic happen!</p>
              </div>
            ) : (
              <div className="analysis-results">
                <div className="result-section">
                  <h4>Language Mix Analysis</h4>
                  <div className="language-bars">
                    <div className="language-bar">
                      <span>Swahili</span>
                      <div className="bar">
                        <div className="bar-fill" style={{width: `${analysisResult.languageMix.swahili}%`}}></div>
                      </div>
                      <span>{analysisResult.languageMix.swahili}%</span>
                    </div>
                    <div className="language-bar">
                      <span>English</span>
                      <div className="bar">
                        <div className="bar-fill" style={{width: `${analysisResult.languageMix.english}%`}}></div>
                      </div>
                      <span>{analysisResult.languageMix.english}%</span>
                    </div>
                    <div className="language-bar">
                      <span>Kikuyu</span>
                      <div className="bar">
                        <div className="bar-fill" style={{width: `${analysisResult.languageMix.kikuyu}%`}}></div>
                      </div>
                      <span>{analysisResult.languageMix.kikuyu}%</span>
                    </div>
                  </div>
                </div>

                <div className="result-section">
                  <h4>Cultural Fit Score</h4>
                  <div className="score-display">
                    <div className="score-circle">
                      <span className="score-number">{analysisResult.culturalFit.score}</span>
                      <span className="score-label">/100</span>
                    </div>
                    <div className="score-insights">
                      {analysisResult.culturalFit.insights.map((insight, index) => (
                        <div key={index} className="insight-item">✓ {insight}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="result-section">
                  <h4>Local Business Context</h4>
                  <div className="context-info">
                    <p><strong>Sector:</strong> {analysisResult.localBusinessContext.sector}</p>
                    <p><strong>Market Understanding:</strong> {analysisResult.localBusinessContext.marketUnderstanding}</p>
                    <div className="recommendations">
                      <strong>Recommendations:</strong>
                      <ul>
                        {analysisResult.localBusinessContext.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="result-section">
                  <h4>Overall Talent Score</h4>
                  <div className="talent-score">
                    <div className="talent-circle">
                      <span className="talent-number">{analysisResult.talentScore}</span>
                      <span className="talent-label">/100</span>
                    </div>
                    <p className="talent-description">
                      This candidate shows exceptional potential for Kenyan market success
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Features - Blurred Section */}
      <div className="advanced-features">
        <h2>Advanced Cultural Intelligence Features</h2>
        
        {/* Unlocked Content */}
        <div className="feature-content">
          <div className="feature-item">
            <h3>🌍 Cultural Context Analysis</h3>
            <p>Our AI understands the subtle cultural nuances that make or break hiring decisions in Kenya. From understanding local business etiquette to recognizing community values, we provide insights that traditional resume analysis tools simply cannot.</p>
          </div>
          
          <div className="feature-item">
            <h3>🗣️ Language Proficiency Assessment</h3>
            <p>Beyond basic language detection, we analyze how well candidates communicate in local contexts. This includes understanding of local idioms, business terminology, and cultural communication patterns.</p>
          </div>
        </div>

                 {/* Advanced Features */}
         <div className="locked-features">
           <div className="feature-item">
             <h3>🎯 Local Market Intelligence</h3>
             <p>
               Advanced market analysis that identifies candidates' understanding of local business dynamics, 
               informal sector experience, and community engagement patterns. This feature provides deep insights 
               into how well candidates will fit into Kenyan business environments.
             </p>
           </div>
           
           <div className="feature-item">
             <h3>⚡ Real-Time Cultural Scoring</h3>
             <p>
               Dynamic scoring system that evaluates candidates based on cultural fit, local market understanding, 
               and community values. This AI-powered system learns from successful hires to continuously improve 
               its cultural intelligence algorithms.
             </p>
           </div>
           
           <div className="feature-item">
             <h3>📊 Predictive Cultural Success</h3>
             <p>
               Machine learning algorithms that predict long-term success based on cultural alignment, 
               local market knowledge, and community integration potential. This feature helps identify 
               candidates who will thrive in Kenyan business environments.
             </p>
           </div>
         </div>
      </div>

             

       {/* Call to Action */}
       <div className="cta-section">
         <h2>Ready to Access 70% More Kenyan Talent?</h2>
         <p>Join the revolution in recruitment with AI-powered cultural intelligence</p>
         <div className="cta-buttons">
           <button className="cta-primary" onClick={() => navigate('/recruiter-dashboard')}>
             Back to Dashboard
           </button>
           <button className="cta-secondary">
             Contact Sales Team
           </button>
         </div>
       </div>
    </div>
  );
};

export default LocalLanguageAnalysisPage;
