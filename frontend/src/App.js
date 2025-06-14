import React from 'react';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Mission from './components/Mission';
import Partners from './components/Partners';
import Team from './components/Team';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Benefits />
      <Mission />
      <Partners />
      <Team />
      <Footer />
    </div>
  );
}

export default App;
