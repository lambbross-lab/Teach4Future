
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Sun, Clock } from 'lucide-react';
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
  const openSessions = filteredSessions.filter(session => session.status === 'Open' || session.status === 'Almost Full');

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{t('dates.title')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            {t('dates.subtitle')}
          </p>
          {openSessions.length > 0 && (
            <div className="mt-5 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <span className="relative mr-2 flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              {openSessions.length} {openSessions.length === 1 ? t('dates.openSession') : t('dates.openSessions')}
            </div>
          )}
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

        {/* Session pills: one compact, responsive row per edition. */}
        <div className="space-y-3">
          {filteredSessions.length === 0 && (
            <div className="bg-white p-6 rounded-2xl text-center text-sm text-slate-500 shadow-sm border border-slate-100">
              {loading ? t('common.loading') : t('common.noSessions')}
            </div>
          )}
          {filteredSessions.map((session) => {
            const course = COURSES.find(c => c.id === session.courseId);
            const city = CITIES.find(c => c.id === session.cityId);
            const isOpen = session.status === 'Open';
            const schedule = session.schedule === 'morning' ? t('common.morning') : session.schedule === 'afternoon' ? t('common.afternoon') : t('common.scheduleTbc');
            const statusLabel = session.status === 'Open' ? t('admin.status.open') : session.status === 'Almost Full' ? t('admin.status.almostFull') : session.status === 'Waiting List' ? t('admin.status.waitingList') : t('admin.status.closed');
            return <article key={session.id} className="group grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/50 md:grid-cols-[1.35fr_.8fr_1.45fr_.95fr_auto] md:items-center md:px-6">
              <div><Link to={`/course/${course?.id}`} className="font-bold text-slate-900 transition-colors group-hover:text-blue-600">{getText(course?.title || '', language).split(':')[0]}</Link><p className="mt-1 text-xs text-slate-400">{course?.category}</p></div>
              <div className="flex items-center text-sm font-medium text-slate-600"><MapPin className="mr-2 h-4 w-4 shrink-0 text-blue-500" />{city?.name}</div>
              <div className="flex items-start text-sm text-slate-600"><Calendar className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-blue-500" /><div><p>{formatDate(session.startDate, language)} – {formatDate(session.endDate, language)}</p><p className="mt-1 flex items-center text-[10px] font-bold uppercase text-slate-400">{session.schedule === 'morning' ? <Sun className="mr-1 h-3 w-3 text-orange-400" /> : <Clock className="mr-1 h-3 w-3 text-blue-400" />}{schedule}</p></div></div>
              <div><span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', isOpen ? 'bg-emerald-100 text-emerald-700' : session.status === 'Almost Full' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700')}><span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', isOpen && 'animate-pulse bg-emerald-500 motion-reduce:animate-none', session.status === 'Almost Full' && 'bg-orange-500', session.status !== 'Open' && session.status !== 'Almost Full' && 'bg-red-500')} />{statusLabel}</span><p className="mt-1.5 flex items-center text-[11px] font-medium text-slate-500"><Users className="mr-1 h-3.5 w-3.5 text-blue-500" />{session.seatsLeft} {t('common.seatsLeft')}</p></div>
              <Link className="md:justify-self-end" to={`/enrol?course=${course?.id}&session=${session.id}`}><Button className="w-full md:w-auto" size="sm" variant={session.status === 'Closed' ? 'outline' : 'primary'} disabled={session.status === 'Closed'}>{session.status === 'Closed' ? t('admin.status.closed') : t('common.enrol')}</Button></Link>
            </article>;
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
