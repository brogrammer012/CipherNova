import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import DetectionToolPage from './pages/DetectionToolPage';
import './styles/App.css';

const App = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignUp = (formData) => {
    setUserEmail(formData.email);
    // In a real app, this would make an API call to create the account
    console.log('Sign up data:', formData);
    // Navigate to email verification
    window.location.href = '/verify-email';
  };

  const handleLogin = (formData) => {
    setIsAuthenticated(true);
    // In a real app, this would set authentication tokens
    console.log('Login successful:', formData.email);
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const handleEmailVerified = () => {
    setIsAuthenticated(true);
    // In a real app, this would set authentication tokens
    console.log('Email verified successfully');
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const handleResendCode = () => {
    // In a real app, this would make an API call to resend verification code
    console.log('Resending verification code to:', userEmail);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              <LoginPage 
                onBack={() => window.history.back()}
                onLogin={handleLogin}
              />
            } 
          />
          <Route 
            path="/signup" 
            element={
              <SignUpPage 
                onBack={() => window.history.back()}
                onSignUp={handleSignUp}
              />
            } 
          />
          <Route 
            path="/verify-email" 
            element={
              userEmail ? (
                <EmailVerificationPage 
                  email={userEmail}
                  onBack={() => window.history.back()}
                  onVerified={handleEmailVerified}
                  onResend={handleResendCode}
                />
              ) : (
                <Navigate to="/signup" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={<DashboardPage />} 
          />
          <Route 
            path="/detection-tool" 
            element={<DetectionToolPage />} 
          />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
