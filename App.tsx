import React from 'react';
import DiagnosisSection from './components/DiagnosisSection';
import EpicByteExperience from './components/experience/EpicByteExperience';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import IntegrationNetwork from './components/IntegrationNetwork';
import MethodologyTimeline from './components/MethodologyTimeline';
import Navbar from './components/Navbar';
import PortfolioShowcase from './components/PortfolioShowcase';
import ProblemsTransformation from './components/ProblemsTransformation';
import ServiceShowcase from './components/ServiceShowcase';

const App: React.FC = () => (
  <div className="min-h-screen overflow-x-clip bg-night">
    <Navbar />
    <main>
      <HeroSection />
      <EpicByteExperience />
      <ProblemsTransformation />
      <ServiceShowcase />
      <IntegrationNetwork />
      <PortfolioShowcase />
      <MethodologyTimeline />
      <DiagnosisSection />
    </main>
    <Footer />
  </div>
);

export default App;
