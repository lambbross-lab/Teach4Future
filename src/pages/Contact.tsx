
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Globe, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div>
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
              {t('contact.badge')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              {t('contact.title')} <br />
              <span className="text-blue-600">{t('contact.titleAccent')}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              {t('contact.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {[
                { icon: Mail, title: t('contact.info.email.title'), value: 'info@teach4future.eu', desc: t('contact.info.email.desc') },
                { icon: Phone, title: t('contact.info.phone.title'), value: '+34 950 000 000', desc: t('contact.info.phone.desc') },
                { icon: MapPin, title: t('contact.info.office.title'), value: 'Almería, Spain', desc: t('contact.info.office.desc') },
                { icon: Clock, title: t('contact.info.response.title'), value: t('contact.info.response.value'), desc: t('contact.info.response.desc') }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-start p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-4">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-blue-600 font-bold text-sm mb-1">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Location Blocks Preview */}
            <div className="space-y-4 pt-8 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">{t('contact.hubs')}</h3>
              <div className="flex flex-wrap gap-3">
                {['Almería', 'Granada', 'Málaga'].map((city) => (
                  <div key={city} className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium text-slate-700">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-2 opacity-5" />
            <div className="relative bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('contact.form.title')}</h2>
                    <p className="text-slate-500 text-sm mb-8">{t('contact.form.subtitle')}</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.form.name')}</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="John Doe" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.form.email')}</label>
                        <input 
                          required 
                          type="email" 
                          placeholder="john@example.com" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.form.subject')}</label>
                        <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">{t('contact.form.subjectPlaceholder')}</option>
                          <option value="general">{t('contact.form.subjects.general')}</option>
                          <option value="enrolment">{t('contact.form.subjects.enrolment')}</option>
                          <option value="funding">{t('contact.form.subjects.funding')}</option>
                          <option value="custom">{t('contact.form.subjects.custom')}</option>
                          <option value="partnership">{t('contact.form.subjects.partnership')}</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.form.message')}</label>
                        <textarea 
                          required 
                          rows={4} 
                          placeholder={t('contact.form.messagePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        {t('contact.form.submit')}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('contact.form.successTitle')}</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      {t('contact.form.successDesc')}
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      {t('contact.form.another')}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
