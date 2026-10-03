
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Instagram, LockKeyhole } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/brand/teach4future-book.png"
                alt=""
                aria-hidden="true"
                className="h-11 w-11 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Teach4Future <span className="text-blue-600">Academy</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/teach4future_academy/" target="_blank" rel="noreferrer" aria-label="Instagram: teach4future_academy" className="hover:text-blue-500 transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">{t('footer.explore')}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/courses-spain" className="hover:text-blue-500 transition-colors">{t('nav.coursesSpain')}</Link></li>
              <li><Link to="/courses-europe" className="hover:text-blue-500 transition-colors">{t('nav.coursesEurope')}</Link></li>
              <li><Link to="/cities" className="hover:text-blue-500 transition-colors">{t('footer.cities')}</Link></li>
              <li><Link to="/dates" className="hover:text-blue-500 transition-colors">{t('nav.dates')}</Link></li>
              <li><Link to="/for-schools" className="hover:text-blue-500 transition-colors">{t('nav.forSchools')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">{t('footer.support')}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/legal-notice" className="hover:text-blue-500 transition-colors">{t('footer.legalNotice')}</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 transition-colors">{t('footer.terms')}</Link></li>
              <li>
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
                  <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('footer.dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold mb-6">{t('footer.contact')}</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                <a href="mailto:teach4futureacademy@gmail.com" className="break-all hover:text-blue-500 transition-colors">teach4futureacademy@gmail.com</a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>{t('footer.location')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-slate-500">
          <div>
            <p>© {currentYear} Teach4Future Academy. {t('footer.rights')}</p>
            <p className="mt-2 max-w-2xl">{t('footer.legalEntity')}</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/cookies" className="hover:text-slate-300">{t('footer.cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
