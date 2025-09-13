import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Shield, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/EmailVerificationPage.css';

const EmailVerificationPage = ({ email, onBack, onVerified, onResend }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      
      // Simulate successful verification (in real app, check against backend)
      if (code === '123456') {
        setIsVerified(true);
        setTimeout(() => {
          if (onVerified) onVerified();
        }, 2000);
      } else {
        setError('Invalid verification code. Please try again.');
        setVerificationCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    }, 2000);
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setTimeLeft(300); // Reset timer
      setVerificationCode(['', '', '', '', '', '']);
      if (onResend) onResend();
    }, 1500);
  };

  if (isVerified) {
    return (
      <div className="verification-page">
        <Navbar />
        <div className="verification-background">
          <div className="cyber-grid"></div>
          <div className="success-particles">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="success-particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 1}s`
              }}></div>
            ))}
          </div>
        </div>

        <div className="verification-container">
          <div className="verification-card success">
            <div className="success-animation">
              <div className="success-circle">
                <CheckCircle size={64} />
              </div>
              <div className="success-glow"></div>
            </div>
            
            <h1 className="success-title">Email Verified!</h1>
            <p className="success-message">
              Welcome to CyberPulse! Your account has been successfully created and verified.
            </p>
            
            <div className="success-features">
              <div className="feature-item">
                <Shield size={20} />
                <span>Advanced Phishing Protection</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Interactive Security Training</span>
              </div>
              <div className="feature-item">
                <Mail size={20} />
                <span>Real-time Threat Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-page">
      <Navbar />
      <div className="verification-background">
        <div className="cyber-grid"></div>
        <div className="floating-envelopes">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="floating-envelope" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}>
              <Mail size={24} />
            </div>
          ))}
        </div>
      </div>

      <div className="verification-container">
        <div className="verification-card">
          <div className="verification-header">
            <button className="back-button" onClick={onBack}>
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            
            <div className="brand-section">
              <div className="brand-icon">
                <Mail size={32} />
              </div>
              <h1 className="verification-title">Check Your Email</h1>
              <p className="verification-subtitle">
                We've sent a 6-digit verification code to
              </p>
              <p className="email-display">{email}</p>
            </div>
          </div>

          <div className="verification-form">
            <div className="code-input-section">
              <label className="code-label">Enter Verification Code</label>
              <div className="code-inputs">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`code-input ${error ? 'error' : ''}`}
                    placeholder="0"
                  />
                ))}
              </div>
              
              {error && (
                <div className="error-message">
                  <Mail size={14} />
                  {error}
                </div>
              )}
            </div>

            <div className="timer-section">
              <div className="timer">
                <Clock size={16} />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            </div>

            <button
              className={`verify-button ${isVerifying ? 'verifying' : ''}`}
              onClick={handleVerify}
              disabled={isVerifying || verificationCode.join('').length !== 6}
            >
              {isVerifying ? (
                <>
                  <div className="spinner"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Verify Email
                </>
              )}
            </button>

            <div className="resend-section">
              <p className="resend-text">Didn't receive the code?</p>
              <button
                className={`resend-button ${isResending ? 'resending' : ''}`}
                onClick={handleResend}
                disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
              >
                {isResending ? (
                  <>
                    <div className="spinner small"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Resend Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
