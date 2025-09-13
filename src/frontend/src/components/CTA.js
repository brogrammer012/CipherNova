import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Shield, Sparkles } from 'lucide-react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import '../styles/components/CTA.css';

const CTA = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <section className="cta-section">
      <div className="cta-container">
        {/* Floating particles for visual effect */}
        <div className="cta-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="cta-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="cta-content">
          <div className="cta-header">
            <Shield className="cta-icon animate-float" size={48} />
            <h2 className="cta-title neon-text">
              Ready to Become a
              <br />
              <span className="gradient-text">Cyber Security Expert?</span>
            </h2>
            <p className="cta-subtitle">
              Join thousands of South African students who are already protecting 
              themselves from scams. Track your progress, earn XP, and access our 
              powerful detection tools.
            </p>
          </div>

          <div className="cta-buttons">
            <div 
              className="button-wrapper"
              onMouseEnter={() => setHoveredButton('login')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <PrimaryButton 
                  text="Login" 
                  onClick={() => console.log('Login clicked')}
                />
              </Link>
              {hoveredButton === 'login' && (
                <div className="button-particles">
                  {[...Array(8)].map((_, i) => (
                    <Sparkles 
                      key={i}
                      className="particle-icon"
                      size={12}
                      style={{
                        position: 'absolute',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        color: '#00FF7F',
                        animation: `sparkle 0.8s ease-out ${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div 
              className="button-wrapper"
              onMouseEnter={() => setHoveredButton('signup')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <SecondaryButton 
                  text="Sign Up" 
                  onClick={() => console.log('Sign up clicked')}
                />
              </Link>
              {hoveredButton === 'signup' && (
                <div className="button-particles">
                  {[...Array(8)].map((_, i) => (
                    <Sparkles 
                      key={i}
                      className="particle-icon"
                      size={12}
                      style={{
                        position: 'absolute',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        color: '#00CED1',
                        animation: `sparkle 0.8s ease-out ${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="cta-features">
            <div className="feature-item">
              <LogIn size={20} />
              <span>Track Your Progress</span>
            </div>
            <div className="feature-item">
              <UserPlus size={20} />
              <span>Compete with Peers</span>
            </div>
            <div className="feature-item">
              <Shield size={20} />
              <span>Access Detection Tools</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
