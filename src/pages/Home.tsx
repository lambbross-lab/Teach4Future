
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Globe, Users, BookOpen, ChevronRight, MapPin, Compass } from 'lucide-react';
import Button from '../components/ui/Button';
import CourseCard from '../components/CourseCard';
import { COURSES, CITIES } from '../mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { getText, isCurrentOrUpcoming } from '../lib/utils';
import { useAcademyData } from '../contexts/AcademyDataContext';

const Home = () => {
  const { language, t } = useLanguage();
  const { sessions } = useAcademyData();
  const featuredCourses = COURSES.filter(c => c.featured);

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-[82vh] flex items-center bg-white pt-20 pb-12">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 skew-x-[-12deg] translate-x-1/4" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-[1.05]">
                {t('hero.title')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {t('hero.titleAccent')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/courses-spain" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto group px-8 py-4 text-base">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses-europe" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-base border-2">
                    {t('hero.ctaSecondary')}
                  </Button>
                </Link>
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden w-full max-w-[30rem] justify-self-center lg:block"
            >
              <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-2xl shadow-blue-200">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80" 
                  alt={language === 'es' ? 'Docentes participando en una formación práctica' : 'Teachers taking part in practical professional development'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-5 -right-5 z-20 rounded-2xl bg-white p-4 shadow-xl animate-bounce-slow">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t('common.funded')}</div>
                    <div className="text-[10px] text-slate-500">{t('common.mobility')}</div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Erasmus+ support for schools */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/for-schools"
            className="group flex flex-col gap-5 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center md:justify-between md:px-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <Compass className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">{t('home.schoolsSupport.eyebrow')}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">{t('home.schoolsSupport.title')}</h2>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">{t('home.schoolsSupport.desc')}</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 font-bold text-indigo-700">
              {t('home.schoolsSupport.cta')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('home.features.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{t('home.features.practical.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.practical.desc')}
              </p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{t('home.features.expert.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.expert.desc')}
              </p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8">
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{t('home.features.locations.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.locations.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spanish-language courses across Europe */}
      <section className="bg-blue-50/60 py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] bg-slate-950 shadow-xl lg:grid-cols-[1.35fr_.65fr]">
            <div className="p-8 md:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{t('home.europe.eyebrow')}</p>
              <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-4xl">{t('home.europe.title')}</h2>
              <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-300">{t('home.europe.desc')}</p>
              <div className="mb-7 grid gap-2 sm:grid-cols-3">
                {['point1', 'point2', 'point3'].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-white">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300 flex-none" />
                    <span>{t(`home.europe.${point}`)}</span>
                  </div>
                ))}
              </div>
              <Link to="/courses-europe">
                <Button size="sm" className="bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300">
                  {t('home.europe.cta')}
                </Button>
              </Link>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-7 md:p-8">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[18px] border-white/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur-sm">
                    <Globe className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-white/25 bg-slate-950/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    {t('home.europe.citiesLabel')}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {['Lisboa', 'Roma', 'Berlín', 'Praga'].map((city) => (
                    <div key={city} className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm text-white backdrop-blur-sm">
                      <MapPin className="h-3.5 w-3.5 flex-none" />
                      <span className="font-semibold">{city}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-white/25 bg-slate-950/20 p-3 text-white backdrop-blur-sm">
                  <p className="text-xs font-bold leading-relaxed">{t('home.europe.citiesPrompt')}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/80">{t('common.europeCaption')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('home.featured.title')}</h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                {t('home.featured.subtitle')}
              </p>
            </div>
            <Link to="/courses-spain">
              <Button variant="outline" className="group border-2 px-6">
                {t('hero.ctaPrimary')}
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCourses.map((course) => {
              const session = sessions.find(s => s.courseId === course.id && isCurrentOrUpcoming(s.endDate));
              return <CourseCard key={course.id} course={course} session={session} />;
            })}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-indigo-600/10 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('cities.title')}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              {t('cities.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {CITIES.map((city) => (
              <Link 
                key={city.id} 
                to={`/cities#${city.id}`} 
                className="group relative h-[490px] rounded-3xl overflow-hidden shadow-2xl bg-slate-700"
              >
                <img 
                  src={city.image} 
                  alt={city.imageAlt} 
                  className="absolute inset-0 w-full h-full object-cover brightness-105 contrast-105 group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-end p-8">
                  <div className="p-6 bg-black/20 backdrop-blur-sm rounded-xl">
                    <h3 className="text-white text-2xl font-bold drop-shadow-md mb-3">{city.name}</h3>
                    <p className="text-white/90 text-sm drop-shadow-sm mb-6 line-clamp-2 leading-relaxed">
                      {getText(city.description, language)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {city.highlights.slice(0, 2).map((h, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                          {getText(h, language)}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center text-white text-sm font-bold group-hover:text-blue-400 transition-colors">
                      {t('common.learnMore')} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-6xl font-black text-white mb-8 leading-tight">
            {t('home.cta.title')}
          </h2>
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/dates" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-50 w-full sm:w-auto px-10 py-5 text-lg font-bold shadow-xl">
                {t('home.cta.button')}
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto px-10 py-5 text-lg font-bold">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
