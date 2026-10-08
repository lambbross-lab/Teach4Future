
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Seo from './components/Seo';
import { LanguageProvider } from './contexts/LanguageContext';
import { AcademyDataProvider } from './contexts/AcademyDataContext';

const Home = lazy(() => import('./pages/Home'));
const CoursesInSpain = lazy(() => import('./pages/CoursesInSpain'));
const CoursesInEurope = lazy(() => import('./pages/CoursesInEurope'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Cities = lazy(() => import('./pages/Cities'));
const DatesAvailability = lazy(() => import('./pages/DatesAvailability'));
const ForSchools = lazy(() => import('./pages/ForSchools'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Enrolment = lazy(() => import('./pages/Enrolment'));
const Login = lazy(() => import('./pages/Login'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));
const TermsConditions = lazy(() => import('./pages/legal/TermsConditions'));
const LegalNotice = lazy(() => import('./pages/legal/LegalNotice'));
const Campus = lazy(() => import('./pages/Campus'));
const AdminCampus = lazy(() => import('./pages/AdminCampus'));

export default function App() {
  return (
    <LanguageProvider>
      <AcademyDataProvider>
        <Router>
          <Seo />
          <Layout>
          <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/campus" element={<AdminCampus />} />
            <Route path="/campus" element={<Campus />} />
            
            {/* Legal */}
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </Layout>
        </Router>
      </AcademyDataProvider>
    </LanguageProvider>
  );
}
