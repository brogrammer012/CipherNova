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
import { getCommunityData } from '../api';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [reportedContent, setReportedContent] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [topReporters, setTopReporters] = useState([]);
  const [currentTip, setCurrentTip] = useState(0);
  const [upvotedReports, setUpvotedReports] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'dateReported', direction: 'desc' });

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
        // Load community reports from localStorage 
        const userReports = JSON.parse(localStorage.getItem('communityReports') || '[]');
        
        // Fetch reports from backend API
        const { data: backendReports } = await getCommunityData();
        
        // Map backend response to frontend format with null checks
        const mappedBackendReports = backendReports
          .filter(report => report && report.content) // Filter out reports with no content
          .map(report => ({
            id: report.id,
            type: report.type || 'Link', // Default to 'Link' if type is null
            content: report.content || '', // Ensure content is never null/undefined
            domain: (() => {
              try {
                // Extract domain from URL
                const content = report.content || '';
                const url = new URL(content.startsWith('http') ? content : `https://${content}`);
                return url.hostname;
              } catch {
                return 'Unknown';
              }
            })(),
            riskLevel: report.risk_level?.toLowerCase() || 'low',
            reports: report.reports || 0,
            dateReported: report.date || new Date().toLocaleDateString(),
            upvotes: Math.floor(Math.random() * 10) // Random upvotes since not in backend
          }));

        // Combine user reports with backend reports, user reports first
        const allReports = [...userReports, ...mappedBackendReports];
        setReportedContent(allReports);

        // Calculate stats from real data
        const mockStats = {
          totalReportsThisWeek: allReports.length,
          newThreatsIdentified: allReports.filter(r => r.riskLevel === 'high').length,
          communityMembers: 1247 // Keep this as mock for now
        };

        const mockTopReporters = [
          { id: 1, name: 'CyberGuard23', reports: 34, level: 'Expert', avatar: '🛡️' },
          { id: 2, name: 'SafetyFirst', reports: 28, level: 'Advanced', avatar: '🔒' },
          { id: 3, name: 'PhishHunter', reports: 22, level: 'Intermediate', avatar: '🎯' }
        ];

        setWeeklyStats(mockStats);
        setTopReporters(mockTopReporters);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch community data:', error);
        // Fallback to localStorage data only
        const userReports = JSON.parse(localStorage.getItem('communityReports') || '[]');
        setReportedContent(userReports);
        
        const fallbackStats = {
          totalReportsThisWeek: userReports.length,
          newThreatsIdentified: userReports.filter(r => r.riskLevel === 'high').length,
          communityMembers: 1247
        };
        
        setWeeklyStats(fallbackStats);
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
    setCurrentTip((prev) => (prev + 1) % safetyTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + safetyTips.length) % safetyTips.length);
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
    switch (type.toLowerCase()) {
      case 'email': return <Mail size={16} />;
      case 'link': return <LinkIcon size={16} />;
      case 'phone': return <Phone size={16} />;
      default: return <Shield size={16} />;
    }
  };

  // Calculate pagination with null checks
  const filteredReports = reportedContent.filter(report => {
    if (!report) return false;
    
    const content = (report.content || '').toLowerCase();
    const domain = (report.domain || '').toLowerCase();
    const type = (report.type || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return content.includes(searchLower) ||
           domain.includes(searchLower) ||
           type.includes(searchLower);
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReports.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
                  {safetyTips[currentTip].icon}
                </div>
                <div className="tip-content">
                  <h3>{safetyTips[currentTip].title}</h3>
                  <p>{safetyTips[currentTip].content}</p>
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
                  className={`indicator ${index === currentTip ? 'active' : ''}`}
                  onClick={() => setCurrentTip(index)}
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
                      {/* <span className="reporter-level">{reporter.level}</span> */}
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
              </div>
              
              {currentItems.map((report) => (
                <div key={report.id} className="table-row">
                  <div className="table-cell type">
                    <div className="type-indicator">
                      {getTypeIcon(report.type || 'unknown')}
                      <span>{report.type || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="table-cell content">
                    <div className="content-preview">
                      <span className="content-text">
                        {(report.content || '').length > 50 
                          ? `${(report.content || '').substring(0, 50)}...` 
                          : (report.content || 'No content')
                        }
                      </span>
                      <span className="domain-text">{report.domain || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="table-cell risk">
                    <span 
                      className="risk-badge" 
                      style={{ 
                        backgroundColor: getRiskColor(report.riskLevel || 'low')
                      }}
                    >
                      {(report.riskLevel || 'low').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="table-cell reports">
                    <span className="report-count">{report.reports || 0}</span>
                  </div>
                  
                  <div className="table-cell date">
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{report.dateReported || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {[...Array(totalPages).keys()].map((pageNumber) => (
                <button key={pageNumber} onClick={() => paginate(pageNumber + 1)} className={currentPage === pageNumber + 1 ? 'active' : ''}>
                  {pageNumber + 1}
                </button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
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
