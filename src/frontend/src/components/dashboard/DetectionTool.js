import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Clock, Mail, Link as LinkIcon, MessageCircle } from 'lucide-react';
import './DetectionTool.css';

const DetectionTool = () => {
  const [inputType, setInputType] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAnalyses] = useState([
    {
      id: 1,
      type: 'email',
      content: 'Urgent: Claim your R50,000 bursary now!',
      riskLevel: 'high',
      score: 92,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'link',
      content: 'https://secure-banking-update.co.za',
      riskLevel: 'medium',
      score: 67,
      timestamp: '1 day ago'
    },
    {
      id: 3,
      type: 'message',
      content: 'Hi, this is from your university admin...',
      riskLevel: 'low',
      score: 23,
      timestamp: '3 days ago'
    }
  ]);

  const handleAnalyze = () => {
    if (!inputValue.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      alert(`Analysis complete! Risk score: ${Math.floor(Math.random() * 100)}`);
      setInputValue('');
    }, 3000);
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle size={16} />;
      case 'medium': return <Clock size={16} />;
      case 'low': return <CheckCircle size={16} />;
      default: return <Shield size={16} />;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00FF7F';
      default: return '#cccccc';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail size={16} />;
      case 'link': return <LinkIcon size={16} />;
      case 'message': return <MessageCircle size={16} />;
      default: return <Shield size={16} />;
    }
  };

  return (
    <div className="detection-tool">
      <div className="detection-card">
        <div className="detection-header">
          <div className="header-icon">
            <Shield size={24} />
          </div>
          <div className="header-content">
            <h2 className="detection-title">Threat Detection Tool</h2>
            <p className="detection-subtitle">Analyze suspicious messages, emails, and links</p>
          </div>
        </div>

        <div className="detection-form">
          <div className="input-type-selector">
            <button 
              className={`type-btn ${inputType === 'email' ? 'active' : ''}`}
              onClick={() => setInputType('email')}
            >
              <Mail size={16} />
              Email
            </button>
            <button 
              className={`type-btn ${inputType === 'link' ? 'active' : ''}`}
              onClick={() => setInputType('link')}
            >
              <LinkIcon size={16} />
              Link
            </button>
            <button 
              className={`type-btn ${inputType === 'message' ? 'active' : ''}`}
              onClick={() => setInputType('message')}
            >
              <MessageCircle size={16} />
              Message
            </button>
          </div>

          <div className="input-section">
            <textarea
              className="detection-input"
              placeholder={`Paste ${inputType} content here...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={4}
            />
            <button 
              className={`analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputValue.trim()}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Analyze Threat
                </>
              )}
            </button>
          </div>
        </div>

        <div className="recent-analyses">
          <h3 className="analyses-title">Recent Analyses</h3>
          <div className="analyses-list">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="analysis-item">
                <div className="analysis-header">
                  <div className="analysis-type">
                    {getTypeIcon(analysis.type)}
                    <span className="type-text">{analysis.type}</span>
                  </div>
                  <div className="analysis-risk" style={{ color: getRiskColor(analysis.riskLevel) }}>
                    {getRiskIcon(analysis.riskLevel)}
                    <span className="risk-score">{analysis.score}%</span>
                  </div>
                </div>
                <div className="analysis-content">
                  {analysis.content}
                </div>
                <div className="analysis-timestamp">
                  {analysis.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionTool;
