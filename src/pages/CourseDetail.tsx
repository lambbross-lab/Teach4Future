
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, CheckCircle2, 
  Globe, Award, Lightbulb, FileText, ChevronRight,
  MessageCircle, Info, Sun
} from 'lucide-react';
import { COURSES, SESSIONS, CITIES } from '../mockData';
import { formatDate, cn, getText } from '../lib/utils';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const course = COURSES.find(c => c.id === id);
  
  if (!course) return <Navigate to="/courses-spain" replace />;

  const courseSessions = SESSIONS.filter(s => s.courseId === course.id);

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Hero Header */}
      <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-2/3">
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-slate-500 text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {getText(course.duration, language)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                {getText(course.title, language)}
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {getText(course.subtitle, language)}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#sessions">
                  <Button size="lg">{t('hero.ctaPrimary')}</Button>
                </a>
                <Link to="/contact">
                  <Button variant="outline" size="lg">Ask a Question</Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/3 w-full">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Course Quick Facts
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: 'Language', value: course.language, icon: Globe },
                    { label: 'Price', value: `${course.price}€ / 5-day course`, icon: Award },
                    { label: 'Certificate', value: 'Europass Mobility', icon: FileText },
                    { label: 'Erasmus+ Code', value: 'KA121 / KA122', icon: CheckCircle2 }
                  ].map((fact, idx) => (
                    <li key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-500">
                        <fact.icon className="h-4 w-4 mr-2 text-blue-500" />
                        {fact.label}
                      </div>
                      <span className="font-bold text-slate-900">{fact.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-slate-50">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    * Course fee is fully eligible for Erasmus+ funding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-16">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Course</h2>
                <div className="relative rounded-3xl overflow-hidden mb-8 aspect-video">
                  <img 
                    src={course.courseImage} 
                    alt={getText(course.title, language)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {getText(course.description, language)}
                </p>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Erasmus+ Relevance
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {getText(course.erasmusRelevance, language)}
                  </p>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Learning Outcomes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 text-sm leading-relaxed">{getText(outcome, language)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Programme Overview */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Programme Overview</h2>
                <div className="space-y-4">
                  {course.programmeOverview.map((day, idx) => (
                    <div key={idx} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600 shadow-sm mr-4 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 font-medium">{getText(day, language)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Schedule */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Schedule</h2>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    The course runs from Monday to Friday with a total of 25 hours. Two timetable options are available depending on the selected session:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-orange-50 p-2 rounded-lg">
                          <Sun className="h-5 w-5 text-orange-600" />
                        </div>
                        <h4 className="font-bold text-slate-900">{t('common.morning')}</h4>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 mb-1">09:00 – 14:30</p>
                      <p className="text-xs text-slate-500">(including a short coffee break)</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                          <Clock className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="font-bold text-slate-900">{t('common.afternoon')}</h4>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 mb-1">15:30 – 21:00</p>
                      <p className="text-xs text-slate-500">(including a short break)</p>
                    </div>
                  </div>
                  
                  <p className="mt-8 text-sm text-slate-500 italic flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    All sessions are practical, interactive, and focused on real classroom application.
                  </p>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
                <div className="flex flex-wrap gap-3">
                  {course.includes.map((item, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                      {getText(item, language)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sessions & Enrol */}
            <div id="sessions" className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Sessions</h2>
              {courseSessions.length > 0 ? (
                <div className="space-y-4">
                  {courseSessions.map((session) => {
                    const city = CITIES.find(c => c.id === session.cityId);
                    return (
                      <div key={session.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-slate-900 capitalize">{city?.name}</h4>
                            <p className="text-xs text-slate-500">{formatDate(session.startDate, language)} - {formatDate(session.endDate, language)}</p>
                            <div className="flex items-center mt-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                              {session.schedule === 'morning' ? (
                                <><Sun className="h-3 w-3 mr-1 text-orange-400" /> {t('common.morning')}</>
                              ) : (
                                <><Clock className="h-3 w-3 mr-1 text-indigo-400" /> {t('common.afternoon')}</>
                              )}
                            </div>
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                            session.status === 'Open' ? "bg-green-100 text-green-700" : 
                            session.status === 'Almost Full' ? "bg-orange-100 text-orange-700" : 
                            "bg-red-100 text-red-700"
                          )}>
                            {session.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex flex-col">
                            <div className="flex items-center text-xs text-slate-600 mb-1">
                              <Users className="h-4 w-4 mr-2 text-blue-500" />
                              <span>{session.seatsLeft} {t('common.seatsLeft')}</span>
                            </div>
                            <div className="flex items-center text-[10px] text-green-600 font-bold">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Erasmus+ eligible
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-slate-900">{course.price}€</span>
                            <p className="text-[10px] text-slate-400 font-medium">5-day intensive</p>
                          </div>
                        </div>
                        <Link to={`/enrol?course=${course.id}&session=${session.id}`}>
                          <Button className="w-full" disabled={session.status === 'Closed'}>
                            {t('common.enrol')}
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-2xl text-center border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm mb-4">No sessions currently scheduled for this course.</p>
                  <Link to="/contact">
                    <Button variant="outline" size="sm">Request a Date</Button>
                  </Link>
                </div>
              )}

              {/* Help Box */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20" />
                <h3 className="text-xl font-bold mb-4 relative z-10">Need a custom group training?</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">
                  If you are a group of 5+ teachers, we can organize a private session on your preferred dates.
                </p>
                <Link to="/contact">
                  <Button variant="primary" className="w-full bg-white text-slate-900 hover:bg-slate-100">
                    Contact Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
