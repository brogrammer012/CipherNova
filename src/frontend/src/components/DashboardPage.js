import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Settings, LogOut, Menu, X } from 'lucide-react';
import WelcomeSection from './dashboard/WelcomeSection';
import DetectionTool from './dashboard/DetectionTool';
import GameAccess from './dashboard/GameAccess';
import GamificationStats from './dashboard/GamificationStats';
import Notifications from './dashboard/Notifications';
import QuickLinks from './dashboard/QuickLinks';
import './DashboardPage.css';

const DashboardPage = ({ user = { firstName: 'Alex', level: 3, xp: 1200, maxXp: 1500 } }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens
    console.log('Logging out...');
    alert('Logged out successfully!');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="cyber-grid"></div>
        <div className="floating-particles">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <div className="brand-icon">
                <div className="shield-icon"></div>
              </div>
              <span className="brand-text">PhishBuster+</span>
            </Link>
          </div>

          <div className="nav-links desktop-only">
            <Link to="/" className="nav-link">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="nav-link active">
              <Settings size={18} />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="nav-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span className="desktop-only">Logout</span>
            </button>
            <button 
              className="mobile-menu-btn mobile-only"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <Link to="/" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/dashboard" className="sidebar-link active" onClick={() => setIsSidebarOpen(false)}>
            <Settings size={18} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <WelcomeSection user={user} />

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Left Column */}
            <div className="dashboard-left">
              <DetectionTool />
              <GameAccess user={user} />
            </div>

            {/* Right Column */}
            <div className="dashboard-right">
              <GamificationStats user={user} />
              <Notifications />
              <QuickLinks />
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardPage;
