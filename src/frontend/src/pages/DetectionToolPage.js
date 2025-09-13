import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Mail, 
  Link as LinkIcon, 
  Flag,
  Trash2,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CrowdBlacklist from '../components/CrowdBlacklist';
import '../styles/pages/DetectionToolPage.css';

const DetectionToolPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState('email');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCrowdBlacklist, setShowCrowdBlacklist] = useState(false);

  // Analysis logic for different content types
  const analyzeContent = (content, type) => {
    const result = {
      riskScore: 0,
      riskLevel: 'low',
      flags: [],
      suggestions: [],
      highlightedContent: content,
      detectedType: type
    };

    // Auto-detect type if not specified
    if (type === 'auto') {
      if (content.includes('@') && content.includes('.')) {
        result.detectedType = 'email';
      } else if (content.startsWith('http') || content.includes('www.')) {
        result.detectedType = 'link';
      } else {
        result.detectedType = 'email'; // Default to email for text content
      }
    }

    // Email analysis
    if (result.detectedType === 'email') {
      // Check for suspicious domains
      const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'mailinator'];
      if (suspiciousDomains.some(domain => content.toLowerCase().includes(domain))) {
        result.riskScore += 30;
        result.flags.push('Temporary email service detected');
      }

      // Check for urgent language
      const urgentKeywords = ['urgent', 'immediate', 'expires today', 'act now', 'limited time'];
      urgentKeywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword.toLowerCase())) {
          result.riskScore += 15;
          result.flags.push(`Urgent language detected: "${keyword}"`);
          result.highlightedContent = result.highlightedContent.replace(
            new RegExp(keyword, 'gi'), 
            `<mark class="risk-high">${keyword}</mark>`
          );
        }
      });

      // Check for financial keywords
      const financialKeywords = ['bursary', 'scholarship', 'R50000', 'money', 'payment', 'bank details'];
      financialKeywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword.toLowerCase())) {
          result.riskScore += 20;
          result.flags.push(`Financial content detected: "${keyword}"`);
          result.highlightedContent = result.highlightedContent.replace(
            new RegExp(keyword, 'gi'), 
            `<mark class="risk-medium">${keyword}</mark>`
          );
        }
      });
    }

    // Link analysis
    if (result.detectedType === 'link') {
      // Check for URL shorteners
      const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly'];
      if (shorteners.some(shortener => content.includes(shortener))) {
        result.riskScore += 25;
        result.flags.push('Shortened URL detected - cannot verify destination');
      }

      // Check for suspicious TLDs
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
      if (suspiciousTlds.some(tld => content.includes(tld))) {
        result.riskScore += 35;
        result.flags.push('Suspicious domain extension detected');
      }

      // Check for typosquatting
      const legitimateDomains = ['nsfas.org.za', 'wits.ac.za', 'uct.ac.za', 'up.ac.za'];
      legitimateDomains.forEach(domain => {
        const variations = [
          domain.replace('o', '0'),
          domain.replace('a', '@'),
          domain.replace('.', '-'),
          'secure-' + domain
        ];
        variations.forEach(variation => {
          if (content.includes(variation) && !content.includes(domain)) {
            result.riskScore += 40;
            result.flags.push(`Possible typosquatting of ${domain}`);
          }
        });
      });
    }


    // Determine risk level and suggestions
    if (result.riskScore >= 50) {
      result.riskLevel = 'high';
      result.suggestions = [
        'Do not interact with this content',
        'Delete immediately',
        'Report to your institution\'s IT security team',
        'Add to community blacklist to warn others'
      ];
    } else if (result.riskScore >= 25) {
      result.riskLevel = 'medium';
      result.suggestions = [
        'Exercise caution before interacting',
        'Verify sender through official channels',
        'Do not provide personal information',
        'Consider reporting if suspicious'
      ];
    } else {
      result.riskLevel = 'low';
      result.suggestions = [
        'Content appears relatively safe',
        'Still verify sender if requesting information',
        'Trust your instincts if something feels off'
      ];
    }

    return result;
  };

  const handleAnalyze = () => {
    if (!inputValue.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const result = analyzeContent(inputValue, inputType);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleNewAnalysis = () => {
    setInputValue('');
    setAnalysisResult(null);
    setInputType('auto');
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff7f';
      default: return '#888888';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle size={24} />;
      case 'medium': return <Clock size={24} />;
      case 'low': return <CheckCircle size={24} />;
      default: return <Shield size={24} />;
    }
  };

  return (
    <div className="detection-tool-page">
      {/* Background Effects */}
      <div className="page-background">
        <div className="cyber-grid"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="tool-main">
        <div className="tool-container">
          {!analysisResult ? (
            /* Input Section */
            <div className="input-section">
              {/* Page Header */}
              <div className="page-header">
                <div className="header-icon">
                  <Shield size={48} />
                </div>
                <div className="header-content">
                  <h1>Threat Detection Tool</h1>
                  <p>Analyze suspicious emails and links to protect yourself from cyber threats</p>
                </div>
                <button 
                  className="community-btn"
                  onClick={() => setShowCrowdBlacklist(!showCrowdBlacklist)}
                >
                  <Users size={20} />
                  <span>Community Reports</span>
                </button>
              </div>

              <div className="input-card">
                <div className="input-header">
                  <h2>Submit Content for Analysis</h2>
                  <p>Choose the type of content and paste it below for threat analysis</p>
                </div>

                <div className="input-controls">
                  {/* Modern Type Selector */}
                  <div className="type-selector-modern">
                    <div className="selector-label">Content Type</div>
                    <div className="selector-buttons">
                      <button 
                        className={`type-btn ${inputType === 'email' ? 'active' : ''}`}
                        onClick={() => setInputType('email')}
                      >
                        <Mail size={20} />
                        <span>Email</span>
                      </button>
                      <button 
                        className={`type-btn ${inputType === 'link' ? 'active' : ''}`}
                        onClick={() => setInputType('link')}
                      >
                        <LinkIcon size={20} />
                        <span>Link</span>
                      </button>
                    </div>
                  </div>

                  <div className="input-area">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={inputType === 'email' ? 
                        "Paste the suspicious email content here..." : 
                        "Paste the suspicious link or URL here..."
                      }
                      className="content-input"
                      rows={8}
                    />
                  </div>

                  <button 
                    onClick={handleAnalyze}
                    disabled={!inputValue.trim() || isAnalyzing}
                    className="analyze-button"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="spinner"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        <span>Analyze {inputType === 'email' ? 'Email' : 'Link'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="results-section">
              <div className="results-header">
                <div className="risk-score" style={{ borderColor: getRiskColor(analysisResult.riskLevel) }}>
                  <div className="risk-icon" style={{ color: getRiskColor(analysisResult.riskLevel) }}>
                    {getRiskIcon(analysisResult.riskLevel)}
                  </div>
                  <div className="risk-info">
                    <h2>Risk Level: <span style={{ color: getRiskColor(analysisResult.riskLevel) }}>
                      {analysisResult.riskLevel.toUpperCase()}
                    </span></h2>
                    <p>Score: {analysisResult.riskScore}/100</p>
                  </div>
                </div>

                <button onClick={handleNewAnalysis} className="new-analysis-btn">
                  <Search size={16} />
                  New Analysis
                </button>
              </div>

              <div className="results-content">
                {/* Analyzed Content */}
                <div className="content-analysis">
                  <h3>Analyzed Content ({analysisResult.detectedType})</h3>
                  <div 
                    className="highlighted-content"
                    dangerouslySetInnerHTML={{ __html: analysisResult.highlightedContent }}
                  />
                </div>

                {/* Flags */}
                {analysisResult.flags.length > 0 && (
                  <div className="flags-section">
                    <h3>Security Flags</h3>
                    <div className="flags-list">
                      {analysisResult.flags.map((flag, index) => (
                        <div key={index} className="flag-item">
                          <Flag size={16} />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div className="suggestions-section">
                  <h3>Recommended Actions</h3>
                  <div className="suggestions-list">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-item">
                        <CheckCircle size={16} />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="action-btn delete-btn">
                    <Trash2 size={16} />
                    Delete Content
                  </button>
                  <button className="action-btn report-btn">
                    <Flag size={16} />
                    Report to Institution
                  </button>
                  {analysisResult.riskLevel !== 'low' && (
                    <button 
                      className="action-btn blacklist-btn"
                      onClick={() => setShowCrowdBlacklist(true)}
                    >
                      <Users size={16} />
                      Add to Community Blacklist
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Crowd Blacklist Modal */}
      {showCrowdBlacklist && (
        <CrowdBlacklist 
          onClose={() => setShowCrowdBlacklist(false)}
          initialContent={analysisResult ? inputValue : ''}
          contentType={analysisResult ? analysisResult.detectedType : 'message'}
        />
      )}
    </div>
  );
};

export default DetectionToolPage;
