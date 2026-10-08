
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Seo from './components/Seo';
import LocalePathSync from './components/LocalePathSync';
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
          <LocalePathSync />
          <Seo />
          <Layout>
          <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/en" element={<Home />} />
            <Route path="/es" element={<Home />} />
            <Route path="/fr" element={<Home />} />
            <Route path="/de" element={<Home />} />
            <Route path="/it" element={<Home />} />
            <Route path="/courses-spain" element={<CoursesInSpain />} />
            <Route path="/en/courses-spain" element={<CoursesInSpain />} />
            <Route path="/es/cursos-espana" element={<CoursesInSpain />} />
            <Route path="/fr/courses-spain" element={<CoursesInSpain />} />
            <Route path="/de/courses-spain" element={<CoursesInSpain />} />
            <Route path="/it/courses-spain" element={<CoursesInSpain />} />
            <Route path="/courses-europe" element={<CoursesInEurope />} />
            <Route path="/en/courses-europe" element={<CoursesInEurope />} />
            <Route path="/es/cursos-europa" element={<CoursesInEurope />} />
            <Route path="/fr/courses-europe" element={<CoursesInEurope />} />
            <Route path="/de/courses-europe" element={<CoursesInEurope />} />
            <Route path="/it/courses-europe" element={<CoursesInEurope />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/en/course/:id" element={<CourseDetail />} />
            <Route path="/es/curso/:id" element={<CourseDetail />} />
            <Route path="/fr/course/:id" element={<CourseDetail />} />
            <Route path="/de/course/:id" element={<CourseDetail />} />
            <Route path="/it/course/:id" element={<CourseDetail />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/en/cities" element={<Cities />} />
            <Route path="/es/ciudades" element={<Cities />} />
            <Route path="/fr/cities" element={<Cities />} />
            <Route path="/de/cities" element={<Cities />} />
            <Route path="/it/cities" element={<Cities />} />
            <Route path="/dates" element={<DatesAvailability />} />
            <Route path="/en/dates" element={<DatesAvailability />} />
            <Route path="/es/fechas" element={<DatesAvailability />} />
            <Route path="/fr/dates" element={<DatesAvailability />} />
            <Route path="/de/dates" element={<DatesAvailability />} />
            <Route path="/it/dates" element={<DatesAvailability />} />
            <Route path="/for-schools" element={<ForSchools />} />
            <Route path="/en/for-schools" element={<ForSchools />} />
            <Route path="/es/para-colegios" element={<ForSchools />} />
            <Route path="/fr/for-schools" element={<ForSchools />} />
            <Route path="/de/for-schools" element={<ForSchools />} />
            <Route path="/it/for-schools" element={<ForSchools />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/en/about" element={<AboutUs />} />
            <Route path="/es/sobre-nosotros" element={<AboutUs />} />
            <Route path="/fr/about" element={<AboutUs />} />
            <Route path="/de/about" element={<AboutUs />} />
            <Route path="/it/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/en/faq" element={<FAQ />} />
            <Route path="/es/preguntas-frecuentes" element={<FAQ />} />
            <Route path="/fr/faq" element={<FAQ />} />
            <Route path="/de/faq" element={<FAQ />} />
            <Route path="/it/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/en/contact" element={<Contact />} />
            <Route path="/es/contacto" element={<Contact />} />
            <Route path="/fr/contact" element={<Contact />} />
            <Route path="/de/contact" element={<Contact />} />
            <Route path="/it/contact" element={<Contact />} />
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
