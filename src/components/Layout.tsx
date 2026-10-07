
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GuidedHelp from './GuidedHelp';
import { useLanguage } from '../contexts/LanguageContext';

const PAGE_TITLES: Record<string, string> = {
  '/courses-spain': 'nav.coursesSpain', '/courses-europe': 'nav.coursesEurope', '/cities': 'nav.cities',
  '/dates': 'nav.dates', '/for-schools': 'nav.forSchools', '/about': 'nav.about', '/contact': 'nav.contact',
  '/faq': 'faq.title', '/legal-notice': 'legal.notice.title', '/privacy': 'legal.privacy.title',
  '/cookies': 'legal.cookies.title', '/terms': 'legal.terms.title',
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    const key = PAGE_TITLES[pathname];
    const base = language === 'es' ? 'Teach4Future Academy · Cursos para docentes' : 'Teach4Future Academy · Teacher training courses';
    const label = key ? t(key) : '';
    document.title = label && label !== key ? `${label} · Teach4Future Academy` : base;
  }, [pathname, language, t]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <GuidedHelp />
    </div>
  );
};

export default Layout;
