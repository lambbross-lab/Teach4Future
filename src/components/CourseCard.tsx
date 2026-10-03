
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Course, CourseSession } from '../types';
import { cn, formatDate, getText } from '../lib/utils';
import Button from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface CourseCardProps {
  course: Course;
  session?: CourseSession;
  demandCityName?: string;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, session, demandCityName, className }) => {
  const { language, t } = useLanguage();

  return (
    <div className={cn(
      "group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full",
      className
    )}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.courseImage} 
          alt={getText(course.title, language)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {t(`categories.${course.category.toLowerCase()}`)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={cn(
            "backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm",
            course.featured ? "bg-blue-600/95 text-white" : "bg-slate-900/80 text-white"
          )}>
            {course.featured ? t('common.priorityCourse') : t('common.groupsCourse')}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {getText(course.title, language)}
        </h3>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
          {getText(course.description, language)}
        </p>
        
        <div className="space-y-3 mb-8 mt-auto">
          <div className="flex items-center text-xs text-slate-600">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span>{getText(course.duration, language)}</span>
          </div>
          {session && (
            <>
              <div className="flex items-center text-xs text-slate-600">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                <span className="capitalize">{session.cityId}</span>
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>{formatDate(session.startDate, language)} – {formatDate(session.endDate, language)}</span>
              </div>
              <div className="flex items-center text-xs text-slate-600 font-medium">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span className={cn(
                  session.seatsLeft <= 5 ? "text-orange-600" : "text-slate-600"
                )}>
                  {session.seatsLeft} {t('common.seatsLeft')}
                </span>
              </div>
            </>
          )}
          {!session && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-xs leading-relaxed text-blue-900">
              <div className="flex items-center font-bold">
                <MapPin className="mr-2 h-4 w-4 flex-none text-blue-600" />
                {demandCityName ? `${t('coursesSpain.onDemandLabel')} · ${demandCityName}` : t('coursesSpain.onDemandLabel')}
              </div>
              <p className="mt-1 text-blue-700">{t('coursesSpain.onDemandCard')}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{course.price}€</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{t('common.fundingSubject')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link to={`/course/${course.id}`}>
              <Button variant="outline" size="sm">
                {t('common.details')}
              </Button>
            </Link>
            <Link to={`/enrol?course=${course.id}${session ? `&session=${session.id}` : ''}`}>
              <Button variant="primary" size="sm">
                {session ? t('common.enrol') : t('coursesSpain.requestOpening')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
