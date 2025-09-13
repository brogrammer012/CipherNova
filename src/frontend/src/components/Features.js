import React, { useState } from 'react';
import { Gamepad2, Shield, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import '../styles/components/Features.css';

const Features = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      title: "Detection Tool",
      description: "Paste a suspicious email, DM, or SMS and get an instant risk score. Highlights red flags and explains why it's risky.",
      icon: Shield,
      color: "#00CED1",
      interactive: (
        <div className="detection-demo">
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Paste suspicious message here..."
              className="neon-input"
            />
            <button className="scan-btn">
              <Zap size={16} />
              Scan
            </button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Educational Game",
      description: "Play mini-games to recognize phishing patterns. Levels increase in difficulty: Obvious scams → Job/bursary scams → Subtle spear-phishing.",
      icon: Gamepad2,
      color: "#00FF7F",
      interactive: (
        <div className="game-demo">
          <div className="choice-buttons">
            <button className="accept-btn">
              <CheckCircle size={16} />
              Accept
            </button>
            <button className="reject-btn">
              <XCircle size={16} />
              Reject
            </button>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Real-Time Alerts",
      description: "Get instant notifications about new phishing trends targeting South African students. Stay ahead of scammers.",
      icon: AlertTriangle,
      color: "#FF6B6B",
      interactive: (
        <div className="alert-demo">
          <div className="alert-notification">
            <AlertTriangle size={16} />
            <span>New bursary scam detected!</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title neon-text">How It Works</h2>
          <p className="section-subtitle">
            Advanced cybersecurity training designed for the modern student
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`feature-card ${hoveredCard === feature.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ '--accent-color': feature.color }}
              >
                <div className="card-header">
                  <div className="icon-container">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="card-title">{feature.title}</h3>
                </div>
                
                <p className="card-description">{feature.description}</p>
                
                <div className="card-interactive">
                  {feature.interactive}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default Features;
