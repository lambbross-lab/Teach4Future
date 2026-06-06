
import React, { useState } from 'react';
import { Globe, Send, CheckCircle2, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const CoursesInEurope = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
              {t('coursesEurope.badge')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              {t('coursesEurope.title')} <br />
              <span className="text-blue-600">{t('coursesEurope.titleAccent')}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              {t('coursesEurope.subtitle')}
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: MapPin, title: 'Any European City', desc: 'Berlin, Rome, Paris, Prague, Helsinki... you name it.' },
                { icon: Globe, title: 'Delivered in Spanish', desc: 'No language barriers. All training is conducted by our Spanish experts.' },
                { icon: Sparkles, title: 'Tailored Curriculum', desc: 'We adapt the course content to your school\'s specific needs and goals.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-2 opacity-5" />
            <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">{t('coursesEurope.requestTitle')}</h2>
                    <p className="text-slate-500 text-sm text-center mb-8">{t('coursesEurope.requestSubtitle')}</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formCity')}</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="e.g. Berlin" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formTopic')}</label>
                          <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            <option value="">Select a topic</option>
                            <option value="ai">AI for Education</option>
                            <option value="inclusion">Inclusion & SEN</option>
                            <option value="wellbeing">Wellbeing & Mindfulness</option>
                            <option value="digital">Digital Competence</option>
                            <option value="clil">CLIL / English</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formDates')}</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="e.g. July 2026" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formSize')}</label>
                          <input 
                            required 
                            type="number" 
                            min="8" 
                            placeholder="Min. 8 teachers" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formEmail')}</label>
                        <input 
                          required 
                          type="email" 
                          placeholder="your@email.com" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formSchool')}</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Name of your school" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formNotes')}</label>
                        <textarea 
                          rows={3} 
                          placeholder="Tell us more about your needs..." 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        {t('coursesEurope.formSubmit')}
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('coursesEurope.successTitle')}</h2>
                    <p className="text-slate-600 mb-8">
                      {t('coursesEurope.successDesc')}
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      {t('coursesEurope.formSubmit')}
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

export default CoursesInEurope;
