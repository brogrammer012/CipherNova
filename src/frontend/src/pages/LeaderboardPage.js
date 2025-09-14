import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Info, Award, Zap, Users, ChevronRight, Star, Flame } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/LeaderboardPage.css';

const LeaderboardTable = ({ users, currentUserId }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedAndFilteredUsers = useMemo(() => {
    let filteredUsers = [...users];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.rank.toString().includes(query) ||
        user.points.toString().includes(query)
      );
    }

    // Sort users
    return filteredUsers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig, searchQuery]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="leaderboard-table-container">
      <div className="table-header">
        <h3 className="section-title">Top Contributors</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rank')}>
                <div className="header-content">
                  Rank
                  <SortIcon columnKey="rank" />
                </div>
              </th>
              <th onClick={() => handleSort('name')}>
                <div className="header-content">
                  User
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th onClick={() => handleSort('points')}>
                <div className="header-content">
                  Points
                  <SortIcon columnKey="points" />
                </div>
              </th>
              <th>
                <div className="header-content">
                  Streak
                  <Flame size={16} />
                </div>
              </th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredUsers.map((user) => (
              <tr 
                key={user.id} 
                className={`${user.id === currentUserId ? 'current-user' : ''} ${user.rank <= 3 ? 'top-three' : ''}`}
              >
                <td className="rank-cell">
                  <span className={`rank-badge ${user.rank <= 3 ? `rank-${user.rank}` : ''}`}>
                    {user.rank}
                  </span>
                </td>
                <td className="user-cell">
                  <div className="user-info">
                    <span className="user-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <span className="avatar-placeholder">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="user-name">{user.name}</span>
                    {user.id === currentUserId && (
                      <span className="you-badge">You</span>
                    )}
                  </div>
                </td>
                <td className="points-cell">{user.points}</td>
                <td className="streak-cell">
                  <div className="streak">
                    <Flame size={16} className={`streak-icon ${user.streak > 0 ? 'active' : ''}`} />
                    <span>{user.streak} days</span>
                  </div>
                </td>
                <td className="badges-cell">
                  <div className="badges">
                    {user.badges.slice(0, 3).map((badge, idx) => (
                      <span key={idx} className="badge" title={badge.replace('_', ' ')}>
                        {badge === 'first_report' && '🎯'}
                        {badge === 'link_buster' && '🔗'}
                        {badge === 'daily_streak' && '🔥'}
                        {badge === 'safety_first' && '✅'}
                        {badge === 'top_contributor' && '🏆'}
                      </span>
                    ))}
                    {user.badges.length > 3 && (
                      <span className="more-badges" title={`${user.badges.length - 3} more badges`}>
                        +{user.badges.length - 3}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BadgesSection = ({ badges, userBadges }) => {
  return (
    <section className="badges-section">
      <h2 className="section-title">Available Badges</h2>
      <div className="badges-grid">
        {badges.map((badge) => {
          const isEarned = userBadges.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
              data-tooltip={isEarned ? badge.description : `Earn this badge by: ${badge.requirement}`}
            >
              <div className="badge-icon">
                {badge.icon}
                {!isEarned && <div className="badge-lock">🔒</div>}
              </div>
              <h3 className="badge-name">{badge.name}</h3>
              {isEarned && <span className="badge-earned">Earned</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const LeaderboardPage = () => {
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState({
    topUsers: [],
    allUsers: [],
    userStats: null,
    badges: [
      { 
        id: 'first_report', 
        name: 'First Report', 
        icon: '🎯', 
        description: 'Submitted your first phishing report',
        requirement: 'Submit your first report'
      },
      { 
        id: 'link_buster', 
        name: 'Link Buster', 
        icon: '🔗', 
        description: 'Reported 10+ suspicious links',
        requirement: 'Report 10+ suspicious links'
      },
      { 
        id: 'daily_streak', 
        name: 'Daily Streak', 
        icon: '🔥', 
        description: 'Maintained a 7-day reporting streak',
        requirement: 'Maintain a 7-day reporting streak'
      },
      { 
        id: 'safety_first', 
        name: 'Safety First', 
        icon: '✅', 
        description: 'Reported unconfirmed suspicious content',
        requirement: 'Report content that gets confirmed as suspicious'
      },
      { 
        id: 'top_contributor', 
        name: 'Top Contributor', 
        icon: '🏆', 
        description: 'Ranked in the top 10 contributors',
        requirement: 'Reach top 10 on the leaderboard'
      },
      { 
        id: 'community_leader', 
        name: 'Community Leader', 
        icon: '👑', 
        description: 'Helped 10+ community members',
        requirement: 'Help 10+ community members'
      },
    ],
    currentUserId: 15
  });

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setLeaderboardData({
            topUsers: [
              { id: 1, name: 'CyberNinja', points: 1250, avatar: null, streak: 7, badges: ['first_report', 'link_buster', 'daily_streak'] },
              { id: 2, name: 'PhishBuster', points: 1100, avatar: null, streak: 5, badges: ['first_report', 'safety_first'] },
              { id: 3, name: 'SecureSentry', points: 980, avatar: null, streak: 3, badges: ['first_report'] }
            ],
            allUsers: Array.from({ length: 50 }, (_, i) => ({
              id: i + 1,
              name: `User${i + 1}`,
              points: 950 - (i * 10) + Math.floor(Math.random() * 50),
              rank: i + 1,
              streak: Math.floor(Math.random() * 15) + 1,
              badges: [
                'first_report',
                ...(i % 3 === 0 ? ['link_buster'] : []),
                ...(i % 5 === 0 ? ['daily_streak'] : []),
                ...(i % 4 === 0 ? ['safety_first'] : []),
                ...(i < 10 ? ['top_contributor'] : [])
              ].filter(Boolean)
            })),
            userStats: {
              rank: 15,
              points: 720,
              streak: 5,
              badges: ['first_report', 'safety_first']
            },
            badges: [
              { id: 'first_report', name: 'First Report', icon: '🎯', description: 'Submitted first report', requirement: 'Submit your first report' },
              { id: 'link_buster', name: 'Link Buster', icon: '🔗', description: 'Reported 10+ suspicious links', requirement: 'Report 10+ suspicious links' },
              { id: 'daily_streak', name: 'Daily Streak', icon: '🔥', description: '3+ day reporting streak', requirement: 'Maintain a 7-day reporting streak' },
              { id: 'safety_first', name: 'Safety First', icon: '✅', description: 'Reported unconfirmed suspicious content', requirement: 'Report content that gets confirmed as suspicious' },
              { id: 'top_contributor', name: 'Top Contributor', icon: '🏆', description: 'Top 10 on the leaderboard', requirement: 'Reach top 10 on the leaderboard' },
              { id: 'community_leader', name: 'Community Leader', icon: '👑', description: 'Helped 10+ community members', requirement: 'Help 10+ community members' },
            ],
            currentUserId: 15
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const { topUsers, allUsers, userStats, badges, currentUserId } = leaderboardData;
  const userBadges = userStats?.badges || [];

  return (
    <div className="leaderboard-page">
      <Navbar />
      <div className="leaderboard-container">
        {/* Hero Section */}
        <section className="leaderboard-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <Trophy className="trophy-icon" />
              CyberPulse Leaderboard
            </h1>
            <p className="hero-subtitle">
              Spot scams. Earn points. Claim your place as a top defender.
            </p>
            <div className="info-tooltip">
              <Info size={16} />
              <span className="tooltip-text">
                You earn points for submitting suspicious content, correctly identifying scams, and reporting to the community.
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="leaderboard-main">
          {/* Podium Section */}
          <section className="podium-section">
            <h2 className="section-title">Top Defenders</h2>
            {isLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                <span>Loading leaderboard...</span>
              </div>
            ) : (
              <div className="podium-placeholder">
                <p>Podium content will be displayed here</p>
              </div>
            )}
          </section>

          {/* Leaderboard Table */}
          <section className="leaderboard-section">
            {!isLoading && (
              <LeaderboardTable 
                users={allUsers} 
                currentUserId={currentUserId} 
              />
            )}
          </section>

          {/* Badges Section */}
          <BadgesSection badges={badges} userBadges={userBadges} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
