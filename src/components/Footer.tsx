
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Teach4Future <span className="text-blue-600">Academy</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering educators across Europe through innovative Erasmus+ training. 
              Practical, inspiring, and transformative learning experiences in Spain and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/courses-spain" className="hover:text-blue-500 transition-colors">Courses in Spain</Link></li>
              <li><Link to="/courses-europe" className="hover:text-blue-500 transition-colors">Courses in Europe</Link></li>
              <li><Link to="/cities" className="hover:text-blue-500 transition-colors">Our Cities</Link></li>
              <li><Link to="/dates" className="hover:text-blue-500 transition-colors">Dates & Availability</Link></li>
              <li><Link to="/for-schools" className="hover:text-blue-500 transition-colors">For Schools</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>info@teach4future.eu</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>+34 950 000 000</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>Calle Real 123, Almería, Spain</span>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Newsletter</h4>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-slate-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-slate-500">
          <p>© {currentYear} Teach4Future Academy. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/cookies" className="hover:text-slate-300">Cookie Policy</Link>
            <Link to="/refunds" className="hover:text-slate-300">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
