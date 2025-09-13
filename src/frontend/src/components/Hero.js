import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Target } from 'lucide-react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import '../styles/components/Hero.css';

const Hero = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 6,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const floatingIcons = [
    { Icon: Shield, delay: 0 },
    { Icon: Zap, delay: 2 },
    { Icon: Target, delay: 4 },
  ];

  return (
    <section className="hero-section">
      {/* Animated Background */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>

      {/* Floating Icons */}
      <div className="floating-icons">
        {floatingIcons.map(({ Icon, delay }, index) => (
          <div
            key={index}
            className="floating-icon"
            style={{ animationDelay: `${delay}s` }}
          >
            <Icon size={24} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <div className="hero-text animate-slideInUp">
          <h1 className="hero-title neon-text">
            Protect Yourself from Scams.
            <br />
            <span className="gradient-text">Learn Fast. Act Smart.</span>
          </h1>
          
          <p className="hero-subtitle">
            South African students are frequently targeted by phishing scams promising 
            bursaries, jobs, and easy money. <strong>PhishBuster+</strong> teaches you to 
            spot scams with interactive challenges and gives you a tool to check real 
            messages instantly.
          </p>
        </div>

        <div className="hero-buttons animate-fadeIn">
          <PrimaryButton 
            text="Check a Real Message" 
            onClick={() => console.log('Check message clicked')}
          />
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <SecondaryButton 
              text="Start Training" 
              onClick={() => console.log('Start training clicked')}
            />
          </Link>
        </div>
      </div>

    </section>
  );
};

export default Hero;
