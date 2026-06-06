
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Globe, Users, BookOpen, Star, ChevronRight, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import CourseCard from '../components/CourseCard';
import { COURSES, SESSIONS, CITIES, TESTIMONIALS, FAQS } from '../mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../lib/utils';

const Home = () => {
  const { language, t } = useLanguage();
  const featuredCourses = COURSES.filter(c => c.featured);

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-[90vh] flex items-center bg-white pt-20">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 skew-x-[-12deg] translate-x-1/4" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 mb-8 bg-blue-50 rounded-full border border-blue-100">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                  {t('hero.badge')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.05]">
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

              <div className="mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                <div>
                  <div className="text-3xl font-bold text-slate-900">5,000+</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('hero.stats.teachers')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">98%</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('hero.stats.satisfaction')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">25+</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('hero.stats.countries')}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-200 aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80" 
                  alt="Teacher Training" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl shadow-xl z-20 animate-bounce-slow">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Erasmus+ Funded</div>
                    <div className="text-[10px] text-slate-500">KA1 Mobility Projects</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl z-20">
                <div className="flex -space-x-3 mb-3">
                  {[1, 2, 3, 4].map(i => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/150?u=${i}`} 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                      alt="User"
                    />
                  ))}
                </div>
                <div className="text-sm font-bold text-slate-900">Join our community</div>
                <div className="text-[10px] text-slate-500">Connect with expert trainers</div>
              </div>
            </motion.div>
          </div>
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
              const session = SESSIONS.find(s => s.courseId === course.id);
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

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t_item) => (
              <div key={t_item.id} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-100 transition-colors">
                <div className="flex items-center space-x-1 text-orange-400 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-slate-700 italic mb-10 text-lg leading-relaxed">"{getText(t_item.content, language)}"</p>
                <div className="flex items-center space-x-4">
                  <img src={t_item.avatar} alt={t_item.name} className="w-14 h-14 rounded-full border-2 border-white shadow-md" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-slate-900">{t_item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mb-1">{getText(t_item.role, language)}</p>
                    <p className="text-xs text-blue-600 font-bold">{t_item.institution}</p>
                  </div>
                </div>
              </div>
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
