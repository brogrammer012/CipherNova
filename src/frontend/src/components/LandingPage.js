import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Gamification from './Gamification';
import CTA from './CTA';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <Gamification />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
