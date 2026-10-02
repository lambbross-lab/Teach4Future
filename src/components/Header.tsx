
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const Flag = ({ language }: { language: 'en' | 'es' }) => language === 'es' ? (
  <svg aria-hidden="true" viewBox="0 0 30 20" className="h-4 w-6 rounded-[2px] shadow-sm">
    <rect width="30" height="20" fill="#AA151B" />
    <rect y="5" width="30" height="10" fill="#F1BF00" />
  </svg>
) : (
  <svg aria-hidden="true" viewBox="0 0 60 40" className="h-4 w-6 rounded-[2px] shadow-sm">
    <rect width="60" height="40" fill="#012169" />
    <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
    <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
    <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="13" />
    <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="7" />
  </svg>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.coursesSpain'), path: '/courses-spain' },
    { name: t('nav.coursesEurope'), path: '/courses-europe' },
    { name: t('nav.cities'), path: '/cities' },
    { name: t('nav.dates'), path: '/dates' },
    { name: t('nav.forSchools'), path: '/for-schools' },
    { name: t('nav.about'), path: '/about' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/brand/teach4future-book.png"
              alt=""
              aria-hidden="true"
              className="h-11 w-11 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Teach4Future <span className="text-blue-600">Academy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  location.pathname === link.path ? "text-blue-600" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-6 ml-2">
              <button 
                onClick={() => setLanguage('en')}
                aria-label="View website in English"
                title="English"
                className={cn(
                  "leading-none transition-all px-2 py-2 rounded-lg",
                  language === 'en' ? "bg-blue-50 ring-2 ring-blue-600" : "opacity-60 hover:opacity-100"
                )}
              >
                <Flag language="en" />
              </button>
              <button 
                onClick={() => setLanguage('es')}
                aria-label="Ver la web en español"
                title="Español"
                className={cn(
                  "leading-none transition-all px-2 py-2 rounded-lg",
                  language === 'es' ? "bg-blue-50 ring-2 ring-blue-600" : "opacity-60 hover:opacity-100"
                )}
              >
                <Flag language="es" />
              </button>
            </div>

            <Link
              to="/enrol"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 hover:shadow-blue-200"
            >
              {t('common.enrol')}
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 lg:hidden">
            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setLanguage('en')}
                aria-label="View website in English"
                className={cn(
                  "leading-none px-2 py-2 rounded",
                  language === 'en' ? "bg-white shadow-sm ring-1 ring-blue-500" : "opacity-60"
                )}
              >
                <Flag language="en" />
              </button>
              <button 
                onClick={() => setLanguage('es')}
                aria-label="Ver la web en español"
                className={cn(
                  "leading-none px-2 py-2 rounded",
                  language === 'es' ? "bg-white shadow-sm ring-1 ring-blue-500" : "opacity-60"
                )}
              >
                <Flag language="es" />
              </button>
            </div>
            <button
              className="p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute top-full left-0 right-0 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <Link
                to="/enrol"
                className="bg-blue-600 text-white px-3 py-4 rounded-lg text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.enrol')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
