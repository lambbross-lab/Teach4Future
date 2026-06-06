
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[60]"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-900">We value your privacy</h3>
              <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
