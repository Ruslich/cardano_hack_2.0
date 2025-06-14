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
import SuperAdminLogin from './components/super_admin/SuperAdminLogin';
import SuperAdminDashboard from './components/super_admin/SuperAdminDashboard';
import Login from './components/register/Login';
import DeveloperDashboard from './components/university/DeveloperDashboard';
import { Toaster } from 'react-hot-toast';
import UniversityEmulator from './pages/UniversityEmulator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster position="top-right" />
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
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/university/login" element={<Login />} />
          <Route path="/university/dashboard" element={<DeveloperDashboard />} />
          <Route path="/university-emulator" element={<UniversityEmulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
