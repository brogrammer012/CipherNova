import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target, Award, TrendingUp } from 'lucide-react';
import '../styles/components/Gamification.css';

const Gamification = () => {
  const [animatedStats, setAnimatedStats] = useState({
    xp: 0,
    streak: 0,
    badges: 0
  });

  useEffect(() => {
    // Animate stats on component mount
    const timer = setTimeout(() => {
      setAnimatedStats({
        xp: 2450,
        streak: 7,
        badges: 12
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const achievements = [
    {
      id: 1,
      name: "Phish Detector",
      description: "Identified 10 phishing attempts",
      icon: Target,
      color: "#00FF7F",
      earned: true
    },
    {
      id: 2,
      name: "Streak Master",
      description: "7-day learning streak",
      icon: Zap,
      color: "#00CED1",
      earned: true
    },
    {
      id: 3,
      name: "Cyber Guardian",
      description: "Completed advanced training",
      icon: Award,
      color: "#FFD700",
      earned: false
    }
  ];

  const leaderboardData = [
    { rank: 1, name: "Thabo M.", score: 3250, university: "UCT" },
    { rank: 2, name: "Nomsa K.", score: 3100, university: "Wits" },
    { rank: 3, name: "You", score: 2450, university: "UP", isUser: true },
    { rank: 4, name: "Sipho N.", score: 2200, university: "UJ" },
    { rank: 5, name: "Lerato P.", score: 2050, university: "Stellenbosch" }
  ];

  return (
    <section className="gamification-section">
      <div className="gamification-container">
        <div className="section-header">
          <h2 className="section-title neon-text">Level Up Your Security Skills</h2>
          <p className="section-subtitle">
            Compete with students across South Africa while mastering cybersecurity
          </p>
        </div>

        <div className="stats-grid">
          {/* XP Progress */}
          <div className="stat-card xp-card">
            <div className="stat-header">
              <Star className="stat-icon" size={32} />
              <div>
                <h3>Experience Points</h3>
                <div className="xp-counter">{animatedStats.xp.toLocaleString()}</div>
              </div>
            </div>
            <div className="xp-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '73%' }}></div>
              </div>
              <span className="progress-text">Level 8 • 550 XP to next level</span>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="stat-card streak-card">
            <div className="stat-header">
              <Zap className="stat-icon" size={32} />
              <div>
                <h3>Daily Streak</h3>
                <div className="streak-counter">{animatedStats.streak} days</div>
              </div>
            </div>
            <div className="streak-flames">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flame ${i < animatedStats.streak ? 'active' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  🔥
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="stat-card badges-card">
            <div className="stat-header">
              <Trophy className="stat-icon" size={32} />
              <div>
                <h3>Badges Earned</h3>
                <div className="badges-counter">{animatedStats.badges}/15</div>
              </div>
            </div>
            <div className="badges-grid">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div 
                    key={achievement.id}
                    className={`badge ${achievement.earned ? 'earned' : 'locked'}`}
                    style={{ '--badge-color': achievement.color }}
                    title={achievement.description}
                  >
                    <IconComponent size={20} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-section">
          <h3 className="leaderboard-title">
            <TrendingUp size={24} />
            National Leaderboard
          </h3>
          <div className="leaderboard">
            {leaderboardData.map((player) => (
              <div 
                key={player.rank}
                className={`leaderboard-row ${player.isUser ? 'user-row' : ''}`}
              >
                <div className="rank">#{player.rank}</div>
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-university">{player.university}</span>
                </div>
                <div className="player-score">{player.score.toLocaleString()} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
