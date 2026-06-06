
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Course, CourseSession } from '../types';
import { cn, formatDate, getText } from '../lib/utils';
import Button from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface CourseCardProps {
  course: Course;
  session?: CourseSession;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, session, className }) => {
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
            {course.category}
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
                <span>{formatDate(session.startDate, language)}</span>
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
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{course.price}€</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Erasmus+ Eligible</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link to={`/course/${course.id}`}>
              <Button variant="outline" size="sm">
                {t('common.details')}
              </Button>
            </Link>
            <Link to={`/enrol?course=${course.id}${session ? `&session=${session.id}` : ''}`}>
              <Button variant="primary" size="sm">
                {t('common.enrol')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
