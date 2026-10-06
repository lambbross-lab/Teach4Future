
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter, ArrowRight, ChevronRight, Sun, Clock } from 'lucide-react';
import { COURSES, CITIES } from '../mockData';
import { formatDate, cn, getText, isCurrentOrUpcoming } from '../lib/utils';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAcademyData } from '../contexts/AcademyDataContext';

const DatesAvailability = () => {
  const [selectedCity, setSelectedCity] = useState('all');
  const { language, t } = useLanguage();
  const { sessions, loading } = useAcademyData();

  const filteredSessions = sessions.filter(s =>
    isCurrentOrUpcoming(s.endDate) && (selectedCity === 'all' || s.cityId === selectedCity)
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{t('dates.title')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            {t('dates.subtitle')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCity('all')}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
              selectedCity === 'all' ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"
            )}
          >
            {t('common.allCities')}
          </button>
          {CITIES.map(city => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                selectedCity === city.id ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.course')}</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('coursesSpain.city')}</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.date')}</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.status')}</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-sm text-slate-500">
                    {loading ? t('common.loading') : t('common.noSessions')}
                  </td>
                </tr>
              )}
              {filteredSessions.map((session) => {
                const course = COURSES.find(c => c.id === session.courseId);
                const city = CITIES.find(c => c.id === session.cityId);
                return (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <Link to={`/course/${course?.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        {getText(course?.title || '', language).split(':')[0]}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1">{course?.category}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {city?.name}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <p>{formatDate(session.startDate, language)} – {formatDate(session.endDate, language)}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center">
                            {session.schedule === 'morning' ? (
                              <><Sun className="h-3 w-3 mr-1 text-orange-400" /> {t('common.morning')}</>
                            ) : session.schedule === 'afternoon' ? (
                              <><Clock className="h-3 w-3 mr-1 text-indigo-400" /> {t('common.afternoon')}</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1 text-blue-400" /> {t('common.scheduleTbc')}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-1">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit",
                          session.status === 'Open' ? "bg-green-100 text-green-700" : 
                          session.status === 'Almost Full' ? "bg-orange-100 text-orange-700" : 
                          "bg-red-100 text-red-700"
                        )}>
                          {session.status === 'Open' ? t('admin.status.open') : 
                           session.status === 'Almost Full' ? t('admin.status.almostFull') : 
                           session.status === 'Waiting List' ? t('admin.status.waitingList') :
                           t('admin.status.closed')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {session.seatsLeft} {t('common.seatsLeft')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link to={`/enrol?course=${course?.id}&session=${session.id}`}>
                        <Button size="sm" variant={session.status === 'Closed' ? 'outline' : 'primary'} disabled={session.status === 'Closed'}>
                          {session.status === 'Closed' ? t('admin.status.closed') : t('common.enrol')}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Card View (Mobile) */}
        <div className="md:hidden space-y-4">
          {filteredSessions.length === 0 && (
            <div className="bg-white p-6 rounded-2xl text-center text-sm text-slate-500 shadow-sm border border-slate-100">
              {loading ? t('common.loading') : t('common.noSessions')}
            </div>
          )}
          {filteredSessions.map((session) => {
            const course = COURSES.find(c => c.id === session.courseId);
            const city = CITIES.find(c => c.id === session.cityId);
            return (
              <div key={session.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-900">{getText(course?.title || '', language).split(':')[0]}</h3>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    session.status === 'Open' ? "bg-green-100 text-green-700" : 
                    session.status === 'Almost Full' ? "bg-orange-100 text-orange-700" : 
                    "bg-red-100 text-red-700"
                  )}>
                    {session.status === 'Open' ? t('admin.status.open') : 
                     session.status === 'Almost Full' ? t('admin.status.almostFull') : 
                     session.status === 'Waiting List' ? t('admin.status.waitingList') :
                     t('admin.status.closed')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    {city?.name}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{formatDate(session.startDate, language)} – {formatDate(session.endDate, language)} ({session.schedule === 'morning' ? t('common.morning') : session.schedule === 'afternoon' ? t('common.afternoon') : t('common.scheduleTbc')})</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    {session.seatsLeft} {t('common.seatsLeft')}
                  </div>
                </div>
                <Link to={`/enrol?course=${course?.id}&session=${session.id}`}>
                  <Button className="w-full" size="sm" disabled={session.status === 'Closed'}>
                    {t('common.enrol')}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Help Note */}
        <div className="mt-12 p-8 bg-blue-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold mb-2">{t('dates.help.title')}</h3>
            <p className="text-blue-100 text-sm">
              {t('dates.help.desc')}
            </p>
          </div>
          <Link to="/contact">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100 whitespace-nowrap">
              {t('dates.help.cta')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DatesAvailability;
