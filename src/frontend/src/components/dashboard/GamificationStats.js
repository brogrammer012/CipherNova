import React from 'react';
import { Trophy, Medal, Zap, TrendingUp, Crown, Award } from 'lucide-react';
import './GamificationStats.css';

const GamificationStats = ({ user }) => {
  const leaderboard = [
    { rank: 1, name: 'Sarah M.', xp: 2450, avatar: '👩‍💻' },
    { rank: 2, name: 'Mike K.', xp: 2380, avatar: '👨‍🎓' },
    { rank: 3, name: 'Alex T.', xp: 1200, avatar: '🛡️', isCurrentUser: true },
    { rank: 4, name: 'Lisa R.', xp: 1150, avatar: '👩‍🔬' },
    { rank: 5, name: 'John D.', xp: 1050, avatar: '👨‍💼' }
  ];

  const weeklyXP = [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 85 },
    { day: 'Wed', xp: 200 },
    { day: 'Thu', xp: 150 },
    { day: 'Fri', xp: 180 },
    { day: 'Sat', xp: 95 },
    { day: 'Sun', xp: 160 }
  ];

  const maxXP = Math.max(...weeklyXP.map(d => d.xp));

  const achievements = [
    { name: 'First Steps', description: 'Complete your first scenario', earned: true, icon: '🎯' },
    { name: 'Streak Master', description: '7 day login streak', earned: true, icon: '🔥' },
    { name: 'Phish Hunter', description: 'Detect 50 phishing attempts', earned: false, icon: '🎣' },
    { name: 'Security Expert', description: 'Reach Level 10', earned: false, icon: '🏆' }
  ];

  return (
    <div className="gamification-stats">
      {/* XP Progress Card */}
      <div className="stats-card xp-card">
        <div className="card-header">
          <div className="header-icon">
            <Zap size={20} />
          </div>
          <h3 className="card-title">Weekly Progress</h3>
        </div>
        <div className="xp-chart">
          {weeklyXP.map((day, index) => (
            <div key={index} className="xp-bar-container">
              <div 
                className="xp-bar"
                style={{ height: `${(day.xp / maxXP) * 100}%` }}
              >
                <div className="xp-value">{day.xp}</div>
              </div>
              <div className="xp-day">{day.day}</div>
            </div>
          ))}
        </div>
        <div className="total-weekly">
          <span className="total-label">This Week:</span>
          <span className="total-value">{weeklyXP.reduce((sum, day) => sum + day.xp, 0)} XP</span>
        </div>
      </div>

      {/* Leaderboard Card */}
      <div className="stats-card leaderboard-card">
        <div className="card-header">
          <div className="header-icon">
            <Trophy size={20} />
          </div>
          <h3 className="card-title">Leaderboard</h3>
        </div>
        <div className="leaderboard-list">
          {leaderboard.map((player) => (
            <div 
              key={player.rank} 
              className={`leaderboard-item ${player.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="player-rank">
                {player.rank === 1 && <Crown size={16} className="crown" />}
                {player.rank === 2 && <Medal size={16} className="silver" />}
                {player.rank === 3 && <Award size={16} className="bronze" />}
                {player.rank > 3 && <span className="rank-number">#{player.rank}</span>}
              </div>
              <div className="player-avatar">{player.avatar}</div>
              <div className="player-info">
                <span className="player-name">{player.name}</span>
                <span className="player-xp">{player.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Card */}
      <div className="stats-card achievements-card">
        <div className="card-header">
          <div className="header-icon">
            <Award size={20} />
          </div>
          <h3 className="card-title">Achievements</h3>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <span className="achievement-name">{achievement.name}</span>
                <span className="achievement-desc">{achievement.description}</span>
              </div>
              {achievement.earned && <div className="earned-indicator">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Card */}
      <div className="stats-card quick-stats-card">
        <div className="card-header">
          <div className="header-icon">
            <TrendingUp size={20} />
          </div>
          <h3 className="card-title">Quick Stats</h3>
        </div>
        <div className="quick-stats-grid">
          <div className="quick-stat">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-value">94%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <span className="stat-value">47</span>
              <span className="stat-label">Scenarios</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <span className="stat-value">3</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <span className="stat-value">8</span>
              <span className="stat-label">Badges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationStats;
