import React, { useState } from 'react';
import { Shield, Mail, Github, Twitter, ExternalLink } from 'lucide-react';
import '../styles/components/Footer.css';

const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const footerLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact Support', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Mail, href: 'mailto:support@phishbuster.co.za', name: 'Email' },
    { icon: Github, href: '#github', name: 'GitHub' },
    { icon: Twitter, href: '#twitter', name: 'Twitter' }
  ];

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <Shield 
                className={`logo-icon ${hoveredIcon === 'logo' ? 'glow' : ''}`}
                size={32}
                onMouseEnter={() => setHoveredIcon('logo')}
                onMouseLeave={() => setHoveredIcon(null)}
              />
              <span className="brand-name">PhishBuster+</span>
            </div>
            <p className="brand-tagline">
              Protecting South African students from cyber threats, one click at a time.
            </p>
          </div>

          {/* Links Section */}
          <div className="footer-links">
            <h4 className="links-title">Quick Links</h4>
            <ul className="links-list">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                    <ExternalLink size={14} className="link-icon" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section */}
          <div className="footer-social">
            <h4 className="social-title">Connect With Us</h4>
            <div className="social-icons">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`social-icon ${hoveredIcon === social.name ? 'glow' : ''}`}
                    onMouseEnter={() => setHoveredIcon(social.name)}
                    onMouseLeave={() => setHoveredIcon(null)}
                    title={social.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; 2024 PhishBuster+. All rights reserved.</p>
            <p className="university-note">
              Built for South African universities and students
            </p>
          </div>
          <div className="security-badge">
            <Shield size={16} />
            <span>Secure & Trusted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
