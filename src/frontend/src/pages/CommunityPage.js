import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  ThumbsUp,
  Eye,
  Mail,
  Link as LinkIcon,
  Phone,
  Calendar,
  Target,
  Award,
  Star,
  Trophy,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/CommunityPage.css';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [reportedContent, setReportedContent] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [topReporters, setTopReporters] = useState([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const safetyTips = [
    {
      id: 1,
      title: "Check the Domain",
      content: "Always verify the URL domain before clicking links. Look for misspellings or suspicious domains.",
      icon: <LinkIcon size={24} />
    },
    {
      id: 2,
      title: "Verify Email Senders",
      content: "Check if emails come from legitimate addresses. Be wary of urgent requests from unknown senders.",
      icon: <Mail size={24} />
    },
    {
      id: 3,
      title: "Don't Share Personal Info",
      content: "Never provide passwords, SSNs, or bank details via email or suspicious websites.",
      icon: <Shield size={24} />
    },
    {
      id: 4,
      title: "Look for HTTPS",
      content: "Ensure websites use HTTPS (secure connection) before entering sensitive information.",
      icon: <CheckCircle size={24} />
    },
    {
      id: 5,
      title: "Trust Your Instincts",
      content: "If something feels too good to be true or urgent, take a moment to verify before acting.",
      icon: <Eye size={24} />
    }
  ];

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // Mock data for community reports
        const mockReports = [
          {
            id: 1,
            type: 'email',
            content: 'Urgent: Verify your NSFAS account immediately',
            domain: 'nsfas-verify.tk',
            riskLevel: 'high',
            reports: 23,
            upvotes: 18,
            dateReported: '2025-01-13',
            reportedBy: 'CyberGuard23'
          },
          {
            id: 2,
            type: 'link',
            content: 'https://secure-fnb-login.ml/verify',
            domain: 'secure-fnb-login.ml',
            riskLevel: 'high',
            reports: 31,
            upvotes: 27,
            dateReported: '2025-01-13',
            reportedBy: 'SafetyFirst'
          },
          {
            id: 3,
            type: 'phone',
            content: '+27 11 XXX XXXX - Claims to be from Capitec Bank',
            domain: 'Phone Scam',
            riskLevel: 'medium',
            reports: 12,
            upvotes: 8,
            dateReported: '2025-01-12',
            reportedBy: 'PhishHunter'
          },
          {
            id: 4,
            type: 'email',
            content: 'Congratulations! You\'ve won R50,000 lottery',
            domain: 'sa-lottery-winner.ga',
            riskLevel: 'high',
            reports: 45,
            upvotes: 41,
            dateReported: '2025-01-12',
            reportedBy: 'TechSavvy'
          },
          {
            id: 5,
            type: 'link',
            content: 'https://whatsapp-verify.com/secure',
            domain: 'whatsapp-verify.com',
            riskLevel: 'medium',
            reports: 8,
            upvotes: 6,
            dateReported: '2025-01-11',
            reportedBy: 'AlertUser'
          }
        ];

        const mockStats = {
          totalReportsThisWeek: 89,
          newThreatsIdentified: 12,
          communityMembers: 1247,
          threatsBlocked: 156
        };

        const mockTopReporters = [
          { id: 1, name: 'CyberGuard23', reports: 34, level: 'Expert', avatar: '🛡️' },
          { id: 2, name: 'SafetyFirst', reports: 28, level: 'Advanced', avatar: '🔒' },
          { id: 3, name: 'PhishHunter', reports: 22, level: 'Intermediate', avatar: '🎯' }
        ];

        setReportedContent(mockReports);
        setWeeklyStats(mockStats);
        setTopReporters(mockTopReporters);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch community data:', error);
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  const handleUpvote = (reportId) => {
    setReportedContent(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, upvotes: report.upvotes + 1 }
          : report
      )
    );
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % safetyTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + safetyTips.length) % safetyTips.length);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail size={16} />;
      case 'link': return <LinkIcon size={16} />;
      case 'phone': return <Phone size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="community-page loading">
        <Navbar />
        <div className="loading-spinner">
          <div className="cyber-spinner"></div>
          <p>Loading Community Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page">
      {/* Animated Background */}
      <div className="community-background">
        <div className="cyber-grid"></div>
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
      </div>

      <Navbar />

      <main className="community-main">
        <div className="community-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-icon">
              <Users size={40} />
            </div>
            <div className="header-content">
              <h1>Community Awareness</h1>
              <p>Join the fight against cyber threats. Together, we make the internet safer.</p>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="stats-section">
            <h2 className="section-title">This Week's Impact</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{weeklyStats.totalReportsThisWeek}</span>
                  <span className="stat-label">Reports Submitted</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Shield size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{weeklyStats.threatsBlocked}</span>
                  <span className="stat-label">Threats Blocked</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{weeklyStats.communityMembers}</span>
                  <span className="stat-label">Community Members</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Target size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{weeklyStats.newThreatsIdentified}</span>
                  <span className="stat-label">New Threats Found</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Tips Carousel */}
          <div className="tips-section">
            <h2 className="section-title">Safety Tips</h2>
            <div className="tips-carousel">
              <button className="carousel-btn prev" onClick={prevTip}>
                <ChevronLeft size={20} />
              </button>
              
              <div className="tip-card">
                <div className="tip-icon">
                  {safetyTips[currentTipIndex].icon}
                </div>
                <div className="tip-content">
                  <h3>{safetyTips[currentTipIndex].title}</h3>
                  <p>{safetyTips[currentTipIndex].content}</p>
                </div>
              </div>
              
              <button className="carousel-btn next" onClick={nextTip}>
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="carousel-indicators">
              {safetyTips.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTipIndex ? 'active' : ''}`}
                  onClick={() => setCurrentTipIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Top Reporters */}
          <div className="top-reporters-section">
            <h2 className="section-title">Top Community Defenders</h2>
            <div className="reporters-grid">
              {topReporters.map((reporter, index) => (
                <div key={reporter.id} className="reporter-card">
                  <div className="reporter-rank">
                    {index === 0 && <Trophy size={20} className="gold" />}
                    {index === 1 && <Award size={20} className="silver" />}
                    {index === 2 && <Star size={20} className="bronze" />}
                    <span>#{index + 1}</span>
                  </div>
                  <div className="reporter-info">
                    <span className="reporter-avatar">{reporter.avatar}</span>
                    <div className="reporter-details">
                      <h4>{reporter.name}</h4>
                      <span className="reporter-level">{reporter.level}</span>
                    </div>
                  </div>
                  <div className="reporter-stats">
                    <span className="report-count">{reporter.reports} reports</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reported Content Feed */}
          <div className="reports-section">
            <h2 className="section-title">Community Reports</h2>
            <div className="reports-table">
              <div className="table-header">
                <div className="header-cell type">Type</div>
                <div className="header-cell content">Content</div>
                <div className="header-cell risk">Risk Level</div>
                <div className="header-cell reports">Reports</div>
                <div className="header-cell date">Date</div>
                <div className="header-cell actions">Actions</div>
              </div>
              
              {reportedContent.map((report) => (
                <div key={report.id} className="table-row">
                  <div className="table-cell type">
                    <div className="type-indicator">
                      {getTypeIcon(report.type)}
                      <span>{report.type}</span>
                    </div>
                  </div>
                  
                  <div className="table-cell content">
                    <div className="content-preview">
                      <span className="content-text">
                        {report.content.length > 50 
                          ? `${report.content.substring(0, 50)}...` 
                          : report.content
                        }
                      </span>
                      <span className="domain-text">{report.domain}</span>
                    </div>
                  </div>
                  
                  <div className="table-cell risk">
                    <span 
                      className="risk-badge" 
                      style={{ 
                        backgroundColor: getRiskColor(report.riskLevel),
                        color: '#ffffff'
                      }}
                    >
                      {report.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="table-cell reports">
                    <span className="report-count">{report.reports}</span>
                  </div>
                  
                  <div className="table-cell date">
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{report.dateReported}</span>
                    </div>
                  </div>
                  
                  <div className="table-cell actions">
                    <button 
                      className="upvote-btn"
                      onClick={() => handleUpvote(report.id)}
                    >
                      <ThumbsUp size={16} />
                      <span>{report.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-card">
              <div className="cta-content">
                <h2>Help Protect the Community</h2>
                <p>Found something suspicious? Report it to help keep everyone safe.</p>
              </div>
              <button 
                className="cta-button"
                onClick={() => navigate('/detection-tool')}
              >
                <Shield size={20} />
                <span>Report New Suspicious Content</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
