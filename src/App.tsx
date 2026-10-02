
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { LanguageProvider } from './contexts/LanguageContext';
import { AcademyDataProvider } from './contexts/AcademyDataContext';

// Pages
import Home from './pages/Home';
import CoursesInSpain from './pages/CoursesInSpain';
import CoursesInEurope from './pages/CoursesInEurope';
import CourseDetail from './pages/CourseDetail';
import Cities from './pages/Cities';
import DatesAvailability from './pages/DatesAvailability';
import ForSchools from './pages/ForSchools';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Enrolment from './pages/Enrolment';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import TermsConditions from './pages/legal/TermsConditions';
import LegalNotice from './pages/legal/LegalNotice';

export default function App() {
  return (
    <LanguageProvider>
      <AcademyDataProvider>
        <Router>
          <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses-spain" element={<CoursesInSpain />} />
            <Route path="/courses-europe" element={<CoursesInEurope />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/dates" element={<DatesAvailability />} />
            <Route path="/for-schools" element={<ForSchools />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enrol" element={<Enrolment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Legal */}
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Layout>
        </Router>
      </AcademyDataProvider>
    </LanguageProvider>
  );
}
