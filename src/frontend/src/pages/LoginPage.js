import React, { useState } from 'react';
import { loginUser } from '../api';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowLeft, LogIn, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/LoginPage.css';

const LoginPage = ({ onBack, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      setIsLoggingIn(false);
      // Store token and user info in localStorage for ProtectedRoute and Dashboard
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Store user info if available (customize as needed)
        localStorage.setItem('user', JSON.stringify({
          firstName: response.data.name || formData.email.split('@')[0],
          level: 3,
          xp: 1200,
          maxXp: 1500
        }));
      }
      if (onLogin) {
        onLogin(formData);
      }
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setIsLoggingIn(false);
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-background">
        <div className="cyber-grid"></div>
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
        <div className="floating-icons">
          {[Shield, Lock, Mail].map((Icon, i) => (
            <div key={i} className="floating-icon" style={{
              left: `${20 + i * 30}%`,
              animationDelay: `${i * 2}s`
            }}>
              <Icon size={20} />
            </div>
          ))}
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="back-button">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            <div className="brand-section">
              <div className="brand-icon">
                <Shield size={32} />
              </div>
              <h1 className="brand-title">CyberPulse</h1>
              <p className="login-subtitle">Welcome back, cyber defender!</p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {loginError && (
              <div className="login-error">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className={`login-button ${isLoggingIn ? 'logging-in' : ''}`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <div className="spinner"></div>
                    Logging In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Login
                  </>
                )}
              </button>

              <div className="forgot-password">
                <a href="#" className="forgot-link">Forgot your password?</a>
              </div>
            </div>
          </form>

          <div className="login-footer">
            <p className="signup-prompt">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">Sign Up</Link>
            </p>
            
            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <p className="demo-info">Email: test@example.com</p>
              <p className="demo-info">Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
