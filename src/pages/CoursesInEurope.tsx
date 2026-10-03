
import React, { useState } from 'react';
import { Globe, Send, CheckCircle2, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { submitEnquiry } from '../services/enquiries';
import EnquiryProtectionFields from '../components/EnquiryProtectionFields';

const CoursesInEurope = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({ city: '', topic: '', dates: '', size: 1, email: '', school: '', notes: '', privacyAccepted: false, website: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError('');
    try {
      await submitEnquiry({
        kind: 'europe',
        fullName: formData.school,
        email: formData.email,
        institution: formData.school,
        city: formData.city,
        topic: formData.topic,
        preferredDates: formData.dates,
        groupSize: formData.size,
        notes: formData.notes,
        language,
        privacyAccepted: formData.privacyAccepted,
        website: formData.website,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error && error.message === 'RATE_LIMITED'
        ? t('common.formRateLimited')
        : t('common.formUnavailable'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              {t('coursesEurope.title')} <br />
              <span className="text-blue-600">{t('coursesEurope.titleAccent')}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              {t('coursesEurope.subtitle')}
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: MapPin, title: t('coursesEurope.featureCityTitle'), desc: t('coursesEurope.featureCityDesc') },
                { icon: Globe, title: t('coursesEurope.featureLanguageTitle'), desc: t('coursesEurope.featureLanguageDesc') },
                { icon: Sparkles, title: t('coursesEurope.featureTailoredTitle'), desc: t('coursesEurope.featureTailoredDesc') }
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
                            placeholder={t('coursesEurope.cityPlaceholder')}
                            value={formData.city}
                            onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formTopic')}</label>
                          <select required value={formData.topic} onChange={(event) => setFormData({ ...formData, topic: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            <option value="">{t('coursesEurope.topicPlaceholder')}</option>
                            <option value="ai">{t('coursesEurope.topics.ai')}</option>
                            <option value="inclusion">{t('coursesEurope.topics.inclusion')}</option>
                            <option value="digital">{t('coursesEurope.topics.digital')}</option>
                            <option value="europe">{t('coursesEurope.topics.europe')}</option>
                            <option value="sustainability">{t('coursesEurope.topics.sustainability')}</option>
                            <option value="wellbeing">{t('coursesEurope.topics.wellbeing')}</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formDates')}</label>
                          <input 
                            required 
                            type="text" 
                            placeholder={t('coursesEurope.datesPlaceholder')}
                            value={formData.dates}
                            onChange={(event) => setFormData({ ...formData, dates: event.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formSize')}</label>
                          <input 
                            required 
                            type="number" 
                            min="1"
                            placeholder={t('coursesEurope.sizePlaceholder')}
                            value={formData.size}
                            onChange={(event) => setFormData({ ...formData, size: Number(event.target.value) })}
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
                          value={formData.email}
                          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formSchool')}</label>
                        <input 
                          required 
                          type="text" 
                          placeholder={t('coursesEurope.schoolPlaceholder')}
                          value={formData.school}
                          onChange={(event) => setFormData({ ...formData, school: event.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesEurope.formNotes')}</label>
                        <textarea 
                          rows={3} 
                          placeholder={t('coursesEurope.notesPlaceholder')}
                          value={formData.notes}
                          onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <EnquiryProtectionFields
                        consent={formData.privacyAccepted}
                        onConsentChange={(privacyAccepted) => setFormData({ ...formData, privacyAccepted })}
                        website={formData.website}
                        onWebsiteChange={(website) => setFormData({ ...formData, website })}
                      />

                      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        {t('coursesEurope.formSubmit')}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-xs leading-relaxed text-slate-500">{t('coursesEurope.priceNote')}</p>
                      {submitError && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{submitError}</p>}
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
