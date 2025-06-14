import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Mission from './components/Mission';
import Partners from './components/Partners';
import Team from './components/Team';
import Footer from './components/Footer';
import Contact from './components/Contact';
import RegisterUniversity from './components/register/RegisterUniversity';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Problem />
              <Solution />
              <HowItWorks />
              <Benefits />
              <Mission />
              <Partners />
              <Team />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <nav className="sticky top-0 z-50 bg-white shadow-sm py-4 px-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-900">DocVerify</Link>
                <div className="flex space-x-6">
                  <Link to="/contact" className="text-blue-600 font-semibold hover:underline">Contact</Link>
                </div>
              </nav>
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/register" element={<RegisterUniversity />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
