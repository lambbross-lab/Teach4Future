
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, GraduationCap, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

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
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
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
                className={cn(
                  "text-xs font-bold transition-all px-2 py-1 rounded",
                  language === 'en' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('es')}
                className={cn(
                  "text-xs font-bold transition-all px-2 py-1 rounded",
                  language === 'es' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"
                )}
              >
                ES
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
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded",
                  language === 'en' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('es')}
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded",
                  language === 'es' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                )}
              >
                ES
              </button>
            </div>
            <button
              className="p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
