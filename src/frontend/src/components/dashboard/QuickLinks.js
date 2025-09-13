import React from 'react';
import { Settings, User, HelpCircle, BookOpen, Shield, ExternalLink } from 'lucide-react';
import '../../styles/dashboard/QuickLinks.css';

const QuickLinks = () => {
  const links = [
    {
      icon: <User size={18} />,
      title: 'Profile Settings',
      description: 'Update your account and preferences',
      color: '#00CED1',
      action: () => console.log('Profile clicked')
    },
    {
      icon: <Settings size={18} />,
      title: 'Security Settings',
      description: 'Manage your security preferences',
      color: '#00FF7F',
      action: () => console.log('Security clicked')
    },
    {
      icon: <HelpCircle size={18} />,
      title: 'Help & FAQ',
      description: 'Get help and find answers',
      color: '#888888',
      action: () => console.log('Help clicked')
    },
    {
      icon: <BookOpen size={18} />,
      title: 'Learning Resources',
      description: 'Access guides and tutorials',
      color: '#00CED1',
      action: () => console.log('Resources clicked')
    }
  ];

  return (
    <div className="quick-links">
      <div className="quick-links-card">
        <div className="quick-links-header">
          <div className="header-icon">
            <Shield size={20} />
          </div>
          <h3 className="quick-links-title">Quick Links</h3>
        </div>

        <div className="links-grid">
          {links.map((link, index) => (
            <button
              key={index}
              className="link-item"
              onClick={link.action}
            >
              <div className="link-icon" style={{ color: link.color }}>
                {link.icon}
              </div>
              <div className="link-content">
                <span className="link-title">{link.title}</span>
                <span className="link-description">{link.description}</span>
              </div>
              <div className="link-arrow">
                <ExternalLink size={14} />
              </div>
            </button>
          ))}
        </div>

        <div className="emergency-contact">
          <div className="emergency-header">
            <Shield size={16} />
            <span>Emergency Contact</span>
          </div>
          <p className="emergency-text">
            If you suspect a security breach or need immediate help, contact our security team.
          </p>
          <button className="emergency-btn">
            Contact Security Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
