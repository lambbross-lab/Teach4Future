
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import LocalizedLink from './LocalizedLink';
import { localizePath, normalizeLocalizedPath, type SiteLanguage } from '../lib/localizedPaths';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

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
    navigate(localizePath(`${location.pathname}${location.search}${location.hash}`, nextLanguage));
  };

  const languageOptions: Array<{ code: SiteLanguage; name: string; flag: string }> = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];

  const languageSelector = (
    <select
      value={language}
      onChange={(event) => chooseLanguage(event.target.value as SiteLanguage)}
      aria-label="Choose website language"
      className="h-9 min-w-[4.75rem] cursor-pointer rounded-full border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 shadow-sm outline-none transition-colors hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      {languageOptions.map(({ code, name, flag }) => <option key={code} value={code} title={name}>{flag} {code.toUpperCase()}</option>)}
    </select>
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
            <div className="border-l border-slate-200 pl-5 ml-1">
              {languageSelector}
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
            {languageSelector}
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
