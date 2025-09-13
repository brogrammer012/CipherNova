import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, Clock, Mail, Link as LinkIcon, MessageCircle, Search } from 'lucide-react';
import '../../styles/dashboard/RecentAnalyses.css';

const RecentAnalyses = () => {
  const recentAnalyses = [
    {
      id: 1,
      type: 'email',
      content: 'Urgent: Claim your R50,000 NSFAS bursary now!',
      riskLevel: 'high',
      riskScore: 85,
      timestamp: '2 hours ago',
      flags: ['Urgent language', 'Financial content', 'Suspicious sender']
    },
    {
      id: 2,
      type: 'link',
      content: 'bit.ly/wits-results-2024',
      riskLevel: 'medium',
      riskScore: 45,
      timestamp: '1 day ago',
      flags: ['Shortened URL', 'Cannot verify destination']
    },
    {
      id: 3,
      type: 'message',
      content: 'Congratulations! You have won a scholarship. WhatsApp me on +27 82 555 0123',
      riskLevel: 'high',
      riskScore: 78,
      timestamp: '2 days ago',
      flags: ['Scam pattern', 'Phone number detected', 'Prize claim']
    },
    {
      id: 4,
      type: 'email',
      content: 'Your university account will be suspended unless you verify your details',
      riskLevel: 'medium',
      riskScore: 52,
      timestamp: '3 days ago',
      flags: ['Urgent language', 'Account threat', 'Verification request']
    },
    {
      id: 5,
      type: 'link',
      content: 'https://up.ac.za/student-portal/login',
      riskLevel: 'low',
      riskScore: 15,
      timestamp: '1 week ago',
      flags: ['Legitimate domain']
    }
  ];

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
      case 'high': return <AlertTriangle size={16} />;
      case 'medium': return <Clock size={16} />;
      case 'low': return <CheckCircle size={16} />;
      default: return <Shield size={16} />;
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

  const truncateContent = (content, maxLength = 60) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="recent-analyses">
      <div className="analyses-card">
        <div className="analyses-header">
          <div className="header-icon">
            <Shield size={20} />
          </div>
          <h3 className="analyses-title">Recent Analyses</h3>
          <div className="analyses-count">{recentAnalyses.length}</div>
        </div>

        <div className="analyses-list">
          {recentAnalyses.map((analysis) => (
            <div key={analysis.id} className="analysis-item">
              <div className="analysis-header">
                <div className="analysis-type">
                  {getTypeIcon(analysis.type)}
                  <span>{analysis.type}</span>
                </div>
                <div 
                  className="risk-indicator"
                  style={{ 
                    color: getRiskColor(analysis.riskLevel),
                    borderColor: getRiskColor(analysis.riskLevel)
                  }}
                >
                  {getRiskIcon(analysis.riskLevel)}
                  <span>{analysis.riskLevel}</span>
                </div>
              </div>

              <div className="analysis-content">
                <p className="content-preview">
                  {truncateContent(analysis.content)}
                </p>
                <div className="analysis-meta">
                  <span className="risk-score">
                    Score: {analysis.riskScore}/100
                  </span>
                  <span className="timestamp">{analysis.timestamp}</span>
                </div>
              </div>

              {analysis.flags.length > 0 && (
                <div className="analysis-flags">
                  {analysis.flags.slice(0, 2).map((flag, index) => (
                    <span key={index} className="flag-tag">
                      {flag}
                    </span>
                  ))}
                  {analysis.flags.length > 2 && (
                    <span className="flag-more">
                      +{analysis.flags.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="analyses-footer">
          <Link to="/detection-tool" className="perform-analysis-btn">
            <Search size={18} />
            <span>Perform More Analyses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentAnalyses;
