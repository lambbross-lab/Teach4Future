
import React from 'react';
import { Link } from 'react-router-dom';
import { cn, getText } from '../lib/utils';
import { MapPin, Sun, Waves, History, Utensils, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CITIES, COURSES, SESSIONS } from '../mockData';
import CourseCard from '../components/CourseCard';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

const Cities = () => {
  const { language, t } = useLanguage();

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{t('cities.title')}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('cities.subtitle')}
          </p>
        </div>

        <div className="space-y-32">
          {CITIES.map((city, idx) => {
            const cityCourses = SESSIONS.filter(s => s.cityId === city.id);
            const isEven = idx % 2 === 0;

            return (
              <section key={city.id} id={city.id} className="scroll-mt-32">
                <div className={cn(
                  "flex flex-col lg:flex-row gap-16 items-center",
                  !isEven && "lg:flex-row-reverse"
                )}>
                  {/* Image & Highlights */}
                  <div className="lg:w-1/2 w-full">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] -rotate-2" />
                      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] bg-slate-700">
                        <img 
                          src={city.image} 
                          alt={city.imageAlt} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Floating Highlights */}
                      <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block max-w-xs">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                          <Sun className="h-5 w-5 mr-2 text-orange-400" />
                          {t('cities.highlights')}
                        </h4>
                        <ul className="space-y-2">
                          {city.highlights.map((h, i) => (
                            <li key={i} className="flex items-center text-xs text-slate-600">
                              <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500" />
                              {getText(h, language)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2 w-full">
                    <div className="flex items-center space-x-2 text-blue-600 font-bold tracking-widest uppercase text-xs mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{t('cities.badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{city.name}</h2>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      {getText(city.description, language)}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <History className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{t('cities.history')}</h4>
                          <p className="text-xs text-slate-500">{t('cities.historyDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <Utensils className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{t('cities.gastronomy')}</h4>
                          <p className="text-xs text-slate-500">{t('cities.gastronomyDesc')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-6">{t('cities.availableCourses')} {city.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(cityCourses.map(s => s.courseId))).map(courseId => {
                          const course = COURSES.find(c => c.id === courseId);
                          return (
                            <Link 
                              key={courseId} 
                              to={`/course/${courseId}`}
                              className="bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 px-4 py-2 rounded-full text-sm font-medium transition-all"
                            >
                              {getText(course?.title || '', language).split(':')[0]}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cities;
