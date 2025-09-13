import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import DetectionTool from '../components/dashboard/DetectionTool';
import GameAccess from '../components/dashboard/GameAccess';
import GamificationStats from '../components/dashboard/GamificationStats';
import Notifications from '../components/dashboard/Notifications';
import QuickLinks from '../components/dashboard/QuickLinks';
import '../styles/pages/DashboardPage.css';

const DashboardPage = ({ user = { firstName: 'Alex', level: 3, xp: 1200, maxXp: 1500 } }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens
    console.log('Logging out...');
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

      {/* Navigation */}
      <Navbar />

      {/* Logout Button - Mobile */}
      <div className="mobile-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
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
