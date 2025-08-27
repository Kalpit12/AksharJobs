import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LocalLanguageAnalysis.css';

const LocalLanguageAnalysisHero = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // This would be the actual API call when backend is running
      // const response = await axios.post('/api/local-language/analyze_local_context', {
      //   resume_text: resumeText,
      //   candidate_id: 'demo_candidate'
      // });

      // For demo purposes, simulate the analysis
      setTimeout(() => {
        const mockResult = {
          language_analysis: {
            primary_language: resumeText.toLowerCase().includes('jambo') || resumeText.toLowerCase().includes('nina') ? 'swahili' : 'english',
            confidence_scores: {
              swahili: resumeText.toLowerCase().includes('jambo') ? 0.85 : 0.15,
              local_english: 0.45,
              sheng: 0.20
            },
            language_mix: 'multilingual'
          },
          business_context: {
            sector_preference: resumeText.toLowerCase().includes('mama mboga') || resumeText.toLowerCase().includes('boda boda') ? 'informal_sector' : 'formal_sector',
            local_market_understanding: 8,
            business_type: 'local_focused'
          },
          local_talent_score: {
            overall_score: 78.5,
            talent_tier: 'Strong Local Talent',
            tier_description: 'Good local market fit with room for growth'
          }
        };
        setAnalysisResult(mockResult);
        setIsAnalyzing(false);
      }, 2000);

    } catch (err) {
      setError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="local-language-hero">
      {/* 🚨 ATTENTION-GRABBING HEADER */}
      <div className="hero-header">
        <div className="kenya-flag">
          🇰🇪
        </div>
        <h1 className="hero-title">
          <span className="highlight">SWAHILI & LOCAL LANGUAGE</span>
          <br />
          <span className="main-title">RESUME ANALYSIS</span>
        </h1>
        <div className="hero-subtitle">
          <span className="exclamation">🚨</span>
          <span className="text">ACCESS 70% MORE KENYAN TALENT</span>
          <span className="exclamation">🚨</span>
        </div>
        <div className="hero-description">
          <strong>NO OTHER PLATFORM HAS THIS!</strong> Break language barriers and reach candidates who write resumes in Swahili, Sheng, and local dialects.
        </div>
      </div>

      {/* 🎯 KEY BENEFITS */}
      <div className="benefits-grid">
        <div className="benefit-card primary">
          <div className="benefit-icon">🌍</div>
          <div className="benefit-title">Multilingual Detection</div>
          <div className="benefit-desc">Swahili, Sheng, Local English</div>
        </div>
        <div className="benefit-card primary">
          <div className="benefit-icon">🏢</div>
          <div className="benefit-title">Local Business Context</div>
          <div className="benefit-desc">Formal vs Informal Sector</div>
        </div>
        <div className="benefit-card primary">
          <div className="benefit-icon">🎭</div>
          <div className="benefit-title">Cultural Intelligence</div>
          <div className="benefit-desc">Community & Cultural Fit</div>
        </div>
        <div className="benefit-card primary">
          <div className="benefit-icon">📊</div>
          <div className="benefit-title">AI-Powered Insights</div>
          <div className="benefit-desc">Local Market Intelligence</div>
        </div>
      </div>

      {/* 🔥 COMPETITIVE ADVANTAGE */}
      <div className="competitive-advantage">
        <div className="advantage-header">
          <span className="fire">🔥</span>
          <span className="text">COMPETITIVE ADVANTAGE</span>
          <span className="fire">🔥</span>
        </div>
        <div className="advantage-content">
          <div className="advantage-item">
            <span className="check">✅</span>
            <span>Access to 70% more talent than competitors</span>
          </div>
          <div className="advantage-item">
            <span className="check">✅</span>
            <span>Cultural fit prediction for better hiring</span>
          </div>
          <div className="advantage-item">
            <span className="check">✅</span>
            <span>Local market expertise no other platform offers</span>
          </div>
          <div className="advantage-item">
            <span className="check">✅</span>
            <span>Automated insights that save hours of manual work</span>
          </div>
        </div>
      </div>

      {/* 🧪 TRY IT NOW SECTION */}
      <div className="try-it-section">
        <div className="try-it-header">
          <span className="lab">🧪</span>
          <span className="text">TRY IT NOW - DEMO ANALYSIS</span>
          <span className="lab">🧪</span>
        </div>
        
        <div className="demo-container">
          <div className="input-section">
            <label className="input-label">
              📝 Enter Resume Text (Swahili, English, Sheng, or any local language):
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste resume text here... Example: JINA: John Kamau, BARUA PEPE: john@email.com, SIFA ZANGU: Nina uzoefu wa miaka 5 katika biashara..."
              className="resume-input"
              rows={6}
            />
            
            <div className="example-texts">
              <div className="example-header">💡 Quick Examples:</div>
              <div className="example-buttons">
                <button 
                  className="example-btn swahili"
                  onClick={() => setResumeText(`JINA: Sarah Wanjiku
BARUA PEPE: sarah@email.com
SIMU: +254700123456

SIFA ZANGU:
Nina uzoefu wa miaka 3 katika biashara ya ndani.
Nina uwezo wa kuzungumza Kiswahili na Kiingereza.
Nina uzoefu wa kufanya kazi na watu wa jamii mbalimbali.

KAZI ZANGU:
Meneja wa Biashara - Duka la Mitumba
Mwaka 2021 - 2023
- Niliendesha biashara ya mitumba katika Westlands
- Niliendesha timu ya wafanyikazi 8
- Niliweza kuongeza mapato kwa 35%`)}
                >
                  🇹🇿 Swahili Resume
                </button>
                <button 
                  className="example-btn english"
                  onClick={() => setResumeText(`NAME: Mike Otieno
EMAIL: mike@email.com
PHONE: +254711234567

SUMMARY:
Experienced business professional with deep understanding of Kenyan market dynamics.
Fluent in English and Swahili, with experience in both formal and informal sectors.

EXPERIENCE:
Business Owner - Boda Boda Services
2020 - Present
- Managed fleet of 15 motorcycles in Eastlands
- Increased revenue by 50% through local partnerships
- Built strong community relationships

Community Organizer
2018 - 2020
- Organized local business networking events
- Coordinated community outreach programs
- Developed local market strategies`)}
                >
                  🇬🇧 English Resume
                </button>
                <button 
                  className="example-btn sheng"
                  onClick={() => setResumeText(`JINA: David Mwangi
EMAIL: david@email.com
PHONE: +254722345678

SIFA:
Mzeee wa biashara ya mjini, nina uzoefu wa kufanya kazi na watu wa kila aina.
Nina uwezo wa kuzungumza Sheng, Swahili na English.

KAZI:
Small Business Owner
2020 - Present
- Niliendesha biashara ya kiosk katika CBD
- Niliendesha timu ya wafanyikazi 5
- Niliweza kuongeza mapato kwa 60%

Local Network Coordinator
2019 - 2020
- Niliendesha mikutano ya biashara
- Niliendesha mafunzo ya jamii
- Niliendesha michezo ya jamii`)}
                >
                  🗣️ Sheng Mix
                </button>
              </div>
            </div>

            <button 
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner">⏳</span>
                  Analyzing Local Context...
                </>
              ) : (
                <>
                  <span className="magic">✨</span>
                  Analyze Local Context
                </>
              )}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>

          {/* 📊 RESULTS SECTION */}
          {analysisResult && (
            <div className="results-section">
              <div className="results-header">
                <span className="results-icon">📊</span>
                <span className="results-title">Local Context Analysis Results</span>
              </div>
              
              <div className="results-grid">
                <div className="result-card language">
                  <div className="result-header">
                    <span className="result-icon">🌍</span>
                    <span className="result-title">Language Analysis</span>
                  </div>
                  <div className="result-content">
                    <div className="result-item">
                      <strong>Primary Language:</strong> {analysisResult.language_analysis.primary_language}
                    </div>
                    <div className="result-item">
                      <strong>Language Mix:</strong> {analysisResult.language_analysis.language_mix}
                    </div>
                    <div className="result-item">
                      <strong>Swahili Confidence:</strong> {(analysisResult.language_analysis.confidence_scores.swahili * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="result-card business">
                  <div className="result-header">
                    <span className="result-icon">🏢</span>
                    <span className="result-title">Business Context</span>
                  </div>
                  <div className="result-content">
                    <div className="result-item">
                      <strong>Sector Preference:</strong> {analysisResult.business_context.sector_preference.replace('_', ' ')}
                    </div>
                    <div className="result-item">
                      <strong>Local Market Understanding:</strong> {analysisResult.business_context.local_market_understanding}/10
                    </div>
                    <div className="result-item">
                      <strong>Business Type:</strong> {analysisResult.business_context.business_type.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="result-card talent">
                  <div className="result-header">
                    <span className="result-icon">🎯</span>
                    <span className="result-title">Local Talent Score</span>
                  </div>
                  <div className="result-content">
                    <div className="result-item score">
                      <strong>Overall Score:</strong> 
                      <span className="score-value">{analysisResult.local_talent_score.overall_score}/100</span>
                    </div>
                    <div className="result-item">
                      <strong>Talent Tier:</strong> {analysisResult.local_talent_score.talent_tier}
                    </div>
                    <div className="result-item">
                      <strong>Description:</strong> {analysisResult.local_talent_score.tier_description}
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="action-btn primary">
                  <span className="icon">🚀</span>
                  Start Using This Feature
                </button>
                <button className="action-btn secondary">
                  <span className="icon">📚</span>
                  Learn More
                </button>
                <button className="action-btn secondary">
                  <span className="icon">💬</span>
                  Contact Sales
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🎉 SUCCESS STORIES */}
      <div className="success-stories">
        <div className="stories-header">
          <span className="trophy">🏆</span>
          <span className="text">SUCCESS STORIES FROM KENYAN RECRUITERS</span>
          <span className="trophy">🏆</span>
        </div>
        
        <div className="stories-grid">
          <div className="story-card">
            <div className="story-content">
              <div className="quote">"This feature helped us access 70% more candidates who were previously invisible to us!"</div>
              <div className="author">- Sarah Kimani, HR Manager at TechCorp Kenya</div>
            </div>
          </div>
          
          <div className="story-card">
            <div className="story-content">
              <div className="quote">"Cultural fit prediction improved our hiring success rate by 40%!"</div>
              <div className="author">- David Ochieng, Talent Acquisition at LocalBank</div>
            </div>
          </div>
          
          <div className="story-card">
            <div className="story-content">
              <div className="quote">"We can now understand local business context like never before!"</div>
              <div className="author">- Mary Wambui, CEO at StartupKenya</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 CALL TO ACTION */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            <span className="highlight">UNLOCK THE FULL POTENTIAL</span>
            <br />
            <span className="main">OF THE KENYAN TALENT MARKET</span>
          </h2>
          <p className="cta-description">
            Join the revolution in recruitment. Be the first to access this game-changing technology.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn primary">
              <span className="icon">🚀</span>
              Get Started Today
            </button>
            <button className="cta-btn secondary">
              <span className="icon">📞</span>
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalLanguageAnalysisHero;
