import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Trophy, 
  Target, 
  Shield, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  Award,
  Zap,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getDashboardData, getUserAnalyses, getLeaderboard, getCommunityReports, getUserStats } from '../api';
import '../styles/pages/DashboardPage.css';

const DashboardPage = ({ user = { firstName: 'Alex', xp: 1200 } }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [communityReports, setCommunityReports] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls with mock data for now
        const mockDashboardData = {
          user: { firstName: 'Alex', xp: 1250 },
          badges: [
            { id: 1, name: 'First Analysis', icon: '🔍', description: 'Completed your first phishing analysis' },
            { id: 2, name: 'Sharp Eye', icon: '👁️', description: 'Detected 10 high-risk threats' },
            { id: 3, name: 'Community Helper', icon: '🤝', description: 'Reported 5 phishing attempts' }
          ]
        };
        
        const mockAnalyses = [
          { id: 1, type: 'Email', content: 'Urgent: Verify your account...', riskScore: 85, riskLevel: 'high', date: '2025-01-13', time: '14:30', status: 'completed' },
          { id: 2, type: 'Link', content: 'https://secure-bank-login.com', riskScore: 45, riskLevel: 'medium', date: '2025-01-13', time: '12:15', status: 'completed' },
          { id: 3, type: 'Email', content: 'Congratulations! You won...', riskScore: 92, riskLevel: 'high', date: '2025-01-12', time: '16:45', status: 'completed' },
          { id: 4, type: 'Link', content: 'https://github.com/example', riskScore: 15, riskLevel: 'low', date: '2025-01-12', time: '10:20', status: 'completed' }
        ];
        
        const mockLeaderboard = [
          { id: 1, name: 'Sarah Chen', xp: 2450, avatar: '👩‍💻' },
          { id: 2, name: 'Mike Johnson', xp: 2100, avatar: '👨‍🔬' },
          { id: 3, name: 'Alex Rivera', xp: 1250, avatar: '👤' }
        ];
        
        const mockCommunityReports = [
          { id: 1, title: 'Fake NSFAS Bursary Email', domain: 'nsfas-bursary.tk', reportedBy: 'Community', date: '2025-01-13' },
          { id: 2, title: 'Phishing Bank Login', domain: 'secure-fnb-login.ml', reportedBy: 'Security Team', date: '2025-01-13' },
          { id: 3, title: 'Suspicious WhatsApp Link', domain: 'whatsapp-verify.ga', reportedBy: 'User Report', date: '2025-01-12' }
        ];
        
        const mockUserStats = {
          streak: 7,
          highestQuizScore: 95,
          totalReports: 12,
          analysesThisWeek: 8,
          threatsDetected: 23
        };
        
        setDashboardData(mockDashboardData);
        setRecentAnalyses(mockAnalyses);
        setLeaderboard(mockLeaderboard);
        setCommunityReports(mockCommunityReports);
        setUserStats(mockUserStats);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = '/';
  };
  
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };
  
  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return <XCircle size={16} />;
      case 'medium': return <AlertTriangle size={16} />;
      case 'low': return <CheckCircle size={16} />;
      default: return <Eye size={16} />;
    }
  };
  
  if (loading) {
    return (
      <div className="dashboard-page loading">
        <Navbar />
        <div className="loading-spinner">
          <div className="cyber-spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="cyber-grid"></div>
        <div className="floating-particles">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Logout Button - Mobile */}
      <div className="mobile-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Personalized Greeting */}
          <div className="greeting-section">
            <h1 className="greeting-title">
              Welcome, {dashboardData?.user?.firstName || 'User'}!
            </h1>
            <p className="greeting-subtitle">
              Ready to defend against cyber threats today?
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Points + Badges Card */}
            <div className="dashboard-card points-badges-card">
              <div className="card-header">
                <Trophy className="card-icon" />
                <h2>Your Progress</h2>
              </div>
              <div className="xp-section">
                <div className="xp-display">
                  <span className="current-xp">{dashboardData?.user?.xp || 0}</span>
                  <span className="xp-label">XP Points</span>
                </div>
                <div className="xp-description">
                  <p>Keep analyzing threats to earn more points!</p>
                </div>
              </div>
              <div className="badges-section">
                <h3>Recent Badges</h3>
                <div className="badges-grid">
                  {dashboardData?.badges?.slice(0, 3).map(badge => (
                    <div key={badge.id} className="badge-item" title={badge.description}>
                      <span className="badge-icon">{badge.icon}</span>
                      <span className="badge-name">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="dashboard-card recent-analyses-card">
              <div className="card-header">
                <Shield className="card-icon" />
                <h2>Your Recent Analyses</h2>
              </div>
              <div className="analyses-list">
                {recentAnalyses.slice(0, 4).map(analysis => (
                  <div key={analysis.id} className="analysis-item">
                    <div className="analysis-type">
                      <Target size={16} />
                      <span>{analysis.type}</span>
                    </div>
                    <div className="analysis-content">
                      {analysis.content.substring(0, 40)}...
                    </div>
                    <div className="analysis-meta">
                      <div className="risk-score" style={{ color: getRiskColor(analysis.riskLevel) }}>
                        {getRiskIcon(analysis.riskLevel)}
                        <span>{analysis.riskScore}</span>
                      </div>
                      <div className="analysis-date">
                        <Calendar size={12} />
                        <span>{analysis.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="cta-button"
                onClick={() => navigate('/detection-tool')}
              >
                <span>Perform More Analyses</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Leaderboard Preview */}
            <div className="dashboard-card leaderboard-card">
              <div className="card-header">
                <TrendingUp className="card-icon" />
                <h2>Top Defenders</h2>
              </div>
              <div className="leaderboard-list">
                {leaderboard.map((user, index) => (
                  <div key={user.id} className="leaderboard-item">
                    <div className="rank">
                      {index === 0 && <Trophy size={16} className="gold" />}
                      {index === 1 && <Award size={16} className="silver" />}
                      {index === 2 && <Star size={16} className="bronze" />}
                      <span>#{index + 1}</span>
                    </div>
                    <div className="user-info">
                      <span className="avatar">{user.avatar}</span>
                      <span className="name">{user.name}</span>
                    </div>
                    <div className="user-stats">
                      <span className="xp">{user.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Reports Preview */}
            <div className="dashboard-card community-reports-card">
              <div className="card-header">
                <Users className="card-icon" />
                <h2>Latest Threats</h2>
              </div>
              <div className="reports-list">
                {communityReports.slice(0, 3).map(report => (
                  <div key={report.id} className="report-item">
                    <div className="report-info">
                      <h4>{report.title}</h4>
                      <p className="report-domain">{report.domain}</p>
                    </div>
                    <div className="report-meta">
                      <span className="reported-by">{report.reportedBy}</span>
                      <span className="report-date">{report.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="see-more-btn"
                onClick={() => navigate('/community')}
              >
                See More Reports
              </button>
            </div>

            {/* Gamification Summary */}
            <div className="dashboard-card gamification-card">
              <div className="card-header">
                <Zap className="card-icon" />
                <h2>Your Stats</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">
                    <Clock size={20} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats?.streak || 0}</span>
                    <span className="stat-label">Day Streak</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <BarChart3 size={20} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats?.highestQuizScore || 0}%</span>
                    <span className="stat-label">Best Quiz</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Shield size={20} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats?.totalReports || 0}</span>
                    <span className="stat-label">Reports</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Eye size={20} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{userStats?.threatsDetected || 0}</span>
                    <span className="stat-label">Threats Found</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
