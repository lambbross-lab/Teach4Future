
import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { COURSES, SESSIONS, CITIES } from '../mockData';
import CourseCard from '../components/CourseCard';
import Button from '../components/ui/Button';
import { cn, getText } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const CoursesInSpain = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { language, t } = useLanguage();

  const filteredSessions = useMemo(() => {
    return SESSIONS.filter(session => {
      const course = COURSES.find(c => c.id === session.courseId);
      if (!course) return false;

      const title = getText(course.title, language).toLowerCase();
      const description = getText(course.description, language).toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = title.includes(query) || description.includes(query);
      const matchesCity = selectedCity === 'all' || session.cityId === selectedCity;
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [searchQuery, selectedCity, selectedCategory, language]);

  const categories = Array.from(new Set(COURSES.map(c => c.category)));

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{t('nav.coursesSpain')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            {t('coursesSpain.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm font-medium"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="all">{t('common.allCities')}</option>
                {CITIES.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>

              <select
                className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm font-medium"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">{t('common.allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-5 w-5" />
              {t('common.details')}
            </button>
          </div>

          {/* Mobile Filter Menu */}
          {isFilterOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('nav.cities')}</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      selectedCity === 'all' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                    onClick={() => setSelectedCity('all')}
                  >
                    {t('common.allCities')}
                  </button>
                  {CITIES.map(city => (
                    <button
                      key={city.id}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        selectedCity === city.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      )}
                      onClick={() => setSelectedCity(city.id)}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('common.allCategories')}</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      selectedCategory === 'all' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                    onClick={() => setSelectedCategory('all')}
                  >
                    {t('common.allCategories')}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        selectedCategory === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      )}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSessions.map((session) => {
              const course = COURSES.find(c => c.id === session.courseId)!;
              return <CourseCard key={session.id} course={course} session={session} />;
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('common.noResults')}</h3>
            <p className="text-slate-500 mb-8">{t('coursesSpain.noResultsDesc')}</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCity('all');
              setSelectedCategory('all');
            }}>
              {t('common.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesInSpain;
