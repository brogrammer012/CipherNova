import React from 'react';
import { User, Settings, Star } from 'lucide-react';
import './WelcomeSection.css';

const WelcomeSection = ({ user }) => {
  const progressPercentage = (user.xp / user.maxXp) * 100;

  return (
    <div className="welcome-section">
      <div className="welcome-card">
        <div className="welcome-content">
          <div className="user-info">
            <div className="avatar">
              <User size={32} />
            </div>
            <div className="user-details">
              <h1 className="welcome-title">
                Welcome, <span className="user-name">{user.firstName}!</span>
              </h1>
              <p className="user-subtitle">Ready to defend against cyber threats?</p>
            </div>
          </div>

          <div className="level-info">
            <div className="level-badge">
              <Star size={20} />
              <span className="level-text">Level {user.level}</span>
            </div>
            <button className="settings-btn">
              <Settings size={18} />
              <span>Profile</span>
            </button>
          </div>
        </div>

        <div className="xp-section">
          <div className="xp-info">
            <span className="xp-current">{user.xp} XP</span>
            <span className="xp-separator">/</span>
            <span className="xp-max">{user.maxXp} XP</span>
          </div>
          <div className="xp-bar">
            <div className="xp-progress" style={{ width: `${progressPercentage}%` }}>
              <div className="xp-glow"></div>
            </div>
          </div>
          <div className="xp-remaining">
            {user.maxXp - user.xp} XP to Level {user.level + 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
