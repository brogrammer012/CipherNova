import React from 'react';
import { Gamepad2, Play, Trophy, Flame, Target, Star } from 'lucide-react';
import './GameAccess.css';

const GameAccess = ({ user }) => {
  const gameStats = {
    currentStreak: 3,
    correctAnswers: 47,
    badgesEarned: 8,
    lastPlayed: '2 hours ago',
    nextScenario: 'Fake Bursary Email'
  };

  const recentBadges = [
    { name: 'Scam Spotter', icon: '🔍', earned: 'today' },
    { name: 'Link Checker', icon: '🔗', earned: 'yesterday' },
    { name: 'Email Expert', icon: '📧', earned: '2 days ago' }
  ];

  return (
    <div className="game-access">
      <div className="game-card">
        <div className="game-header">
          <div className="header-icon">
            <Gamepad2 size={24} />
          </div>
          <div className="header-content">
            <h2 className="game-title">Security Training Game</h2>
            <p className="game-subtitle">Level up your phishing detection skills</p>
          </div>
          <div className="game-level">
            <Star size={16} />
            <span>Level {user.level}</span>
          </div>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <div className="stat-icon streak">
              <Flame size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{gameStats.currentStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon accuracy">
              <Target size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{gameStats.correctAnswers}</span>
              <span className="stat-label">Correct</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon badges">
              <Trophy size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{gameStats.badgesEarned}</span>
              <span className="stat-label">Badges</span>
            </div>
          </div>
        </div>

        <div className="next-scenario">
          <div className="scenario-info">
            <h3 className="scenario-title">Next Challenge</h3>
            <p className="scenario-name">{gameStats.nextScenario}</p>
            <p className="last-played">Last played: {gameStats.lastPlayed}</p>
          </div>
          <button className="play-btn">
            <Play size={18} />
            <span>Start Training</span>
          </button>
        </div>

        <div className="recent-badges">
          <h3 className="badges-title">Recent Achievements</h3>
          <div className="badges-list">
            {recentBadges.map((badge, index) => (
              <div key={index} className="badge-item">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-earned">{badge.earned}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameAccess;
