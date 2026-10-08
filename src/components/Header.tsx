
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe2, GraduationCap, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import LocalizedLink from './LocalizedLink';
import { localizePath, normalizeLocalizedPath, type SiteLanguage } from '../lib/localizedPaths';

const Flag = ({ language }: { language: SiteLanguage }) => language === 'es' ? (
  <svg aria-hidden="true" viewBox="0 0 30 20" className="h-4 w-6 rounded-[2px] shadow-sm">
    <rect width="30" height="20" fill="#AA151B" />
    <rect y="5" width="30" height="10" fill="#F1BF00" />
  </svg>
) : language === 'fr' ? (
  <svg aria-hidden="true" viewBox="0 0 30 20" className="h-4 w-6 rounded-[2px] shadow-sm"><rect width="10" height="20" fill="#002395" /><rect x="10" width="10" height="20" fill="#fff" /><rect x="20" width="10" height="20" fill="#ED2939" /></svg>
) : language === 'de' ? (
  <svg aria-hidden="true" viewBox="0 0 30 20" className="h-4 w-6 rounded-[2px] shadow-sm"><rect width="30" height="6.67" fill="#000" /><rect y="6.67" width="30" height="6.67" fill="#DD0000" /><rect y="13.33" width="30" height="6.67" fill="#FFCE00" /></svg>
) : language === 'it' ? (
  <svg aria-hidden="true" viewBox="0 0 30 20" className="h-4 w-6 rounded-[2px] shadow-sm"><rect width="10" height="20" fill="#009246" /><rect x="10" width="10" height="20" fill="#fff" /><rect x="20" width="10" height="20" fill="#CE2B37" /></svg>
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
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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

  const chooseLanguage = (nextLanguage: SiteLanguage) => {
    setLanguage(nextLanguage);
    setIsLanguageMenuOpen(false);
    navigate(localizePath(`${location.pathname}${location.search}${location.hash}`, nextLanguage));
  };

  const extraLanguages: Array<{ code: SiteLanguage; name: string }> = [
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
  ];

  const moreLanguageMenu = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsLanguageMenuOpen((open) => !open)}
        aria-label="Choose another language"
        aria-expanded={isLanguageMenuOpen}
        className={cn('inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all', extraLanguages.some(({ code }) => code === language) ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600')}
      >
        <Globe2 className="h-4 w-4" aria-hidden="true" />
      </button>
      {isLanguageMenuOpen && (
        <div className="absolute right-0 top-10 z-50 w-36 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
          {extraLanguages.map(({ code, name }) => (
            <button key={code} type="button" onClick={() => chooseLanguage(code)} className={cn('flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors hover:bg-blue-50', language === code ? 'bg-blue-50 text-blue-700' : 'text-slate-700')}>
              <Flag language={code} />{name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <LocalizedLink to="/" className="flex items-center space-x-2">
            <img
              src="/brand/teach4future-book.png"
              alt=""
              aria-hidden="true"
              className="h-11 w-11 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Teach4Future <span className="text-blue-600">Academy</span>
            </span>
          </LocalizedLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <LocalizedLink
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  normalizeLocalizedPath(location.pathname) === link.path ? "text-blue-600" : "text-slate-600"
                )}
              >
                {link.name}
              </LocalizedLink>
            ))}
            <Link
              to="/campus"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-blue-600",
                location.pathname === '/campus' ? "text-blue-600" : "text-slate-600"
              )}
            >
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              {t('nav.campus')}
            </Link>
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-6 ml-2">
              <button
                onClick={() => chooseLanguage('en')}
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
                onClick={() => chooseLanguage('es')}
                aria-label="Ver la web en español"
                title="Español"
                className={cn(
                  "leading-none transition-all px-2 py-2 rounded-lg",
                  language === 'es' ? "bg-blue-50 ring-2 ring-blue-600" : "opacity-60 hover:opacity-100"
                )}
              >
                <Flag language="es" />
              </button>
              {moreLanguageMenu}
            </div>

            <Link
              to="/enrol"
              className="shrink-0 whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-[13px] font-bold leading-none text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-blue-200"
            >
              {t('common.enrol')}
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 lg:hidden">
            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => chooseLanguage('en')}
                aria-label="View website in English"
                className={cn(
                  "leading-none px-2 py-2 rounded",
                  language === 'en' ? "bg-white shadow-sm ring-1 ring-blue-500" : "opacity-60"
                )}
              >
                <Flag language="en" />
              </button>
              <button 
                onClick={() => chooseLanguage('es')}
                aria-label="Ver la web en español"
                className={cn(
                  "leading-none px-2 py-2 rounded",
                  language === 'es' ? "bg-white shadow-sm ring-1 ring-blue-500" : "opacity-60"
                )}
              >
                <Flag language="es" />
              </button>
              {moreLanguageMenu}
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
              <LocalizedLink
                key={link.path}
                to={link.path}
                className="block px-3 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </LocalizedLink>
            ))}
            <Link
              to="/campus"
              className="flex items-center gap-2 px-3 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <GraduationCap className="h-5 w-5 text-blue-600" aria-hidden="true" />
              {t('nav.campus')}
            </Link>
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
