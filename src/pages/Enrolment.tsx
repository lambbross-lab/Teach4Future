
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, FileText, Mail, Info, ChevronRight, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { COURSES, SESSIONS, CITIES } from '../mockData';
import { formatDate, cn, getText } from '../lib/utils';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const Enrolment = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  
  const courseId = searchParams.get('course');
  const sessionId = searchParams.get('session');
  
  const course = COURSES.find(c => c.id === courseId);
  const session = SESSIONS.find(s => s.id === sessionId);
  const city = session ? CITIES.find(c => c.id === session.cityId) : null;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    institution: '',
    role: '',
    participantsCount: 1,
    notes: '',
    needInvoice: false,
    needAcceptanceLetter: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (!course) return <Navigate to="/courses-spain" replace />;

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Course Enrolment</h1>
                  <p className="text-slate-500 mb-10">Please fill out the form below to reserve your spot. No immediate payment is required.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Info */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                          <input 
                            required 
                            type="email" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role / Position</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="e.g. Primary Teacher"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* School Info */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                        Institution Information
                      </h3>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">School / Institution Name</label>
                        <input 
                          required 
                          type="text" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={formData.institution}
                          onChange={(e) => setFormData({...formData, institution: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Participants</label>
                          <input 
                            required 
                            type="number" 
                            min="1"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.participantsCount}
                            onChange={(e) => setFormData({...formData, participantsCount: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                        Preferences & Support
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.needInvoice}
                            onChange={(e) => setFormData({...formData, needInvoice: e.target.checked})}
                          />
                          <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">I need an official invoice for my school</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.needAcceptanceLetter}
                            onChange={(e) => setFormData({...formData, needAcceptanceLetter: e.target.checked})}
                          />
                          <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">I need an official acceptance letter for Erasmus+ funding</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Notes</label>
                        <textarea 
                          rows={3} 
                          placeholder="Any special requirements, dietary needs, etc."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        Confirm Enrolment
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center">
                        <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />
                        Your data is protected and will only be used for course organization.
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Summary Section */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-32">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Enrolment Summary</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course</h4>
                        <p className="text-sm font-bold text-slate-900">{getText(course.title, language).split(':')[0]}</p>
                      </div>
                    </div>

                    {session && (
                      <>
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</h4>
                            <p className="text-sm font-bold text-slate-900 capitalize">{city?.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dates</h4>
                            <p className="text-sm font-bold text-slate-900">{formatDate(session.startDate, language)}</p>
                            <p className="text-xs text-slate-500">to {formatDate(session.endDate, language)}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-500">Course Fee</span>
                        <span className="text-sm font-bold text-slate-900">{course.price}€</span>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-sm text-slate-500">Participants</span>
                        <span className="text-sm font-bold text-slate-900">x {formData.participantsCount}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-black text-blue-600">{course.price * formData.participantsCount}€</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Erasmus+ funding usually covers 100% of the course fee. Certificate included.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-20 bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Enrolment Confirmed!</h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Thank you, <span className="font-bold text-slate-900">{formData.fullName}</span>! We have received your enrolment for 
                <span className="font-bold text-slate-900"> {getText(course.title, language).split(':')[0]}</span>.
              </p>
              
              <div className="bg-slate-50 p-8 rounded-3xl text-left mb-10 space-y-4">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  What happens next?
                </h3>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm flex-shrink-0">1</div>
                  <p className="text-sm text-slate-600">Check your inbox for a confirmation email with all details.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm flex-shrink-0">2</div>
                  <p className="text-sm text-slate-600">Our team will send you the official acceptance letter within 24 hours.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm flex-shrink-0">3</div>
                  <p className="text-sm text-slate-600">We will provide a guide for accommodation and travel in {city?.name || 'Spain'}.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    Back to Home
                  </Button>
                </Link>
                <Link to="/faq" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    View FAQ
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Enrolment;
