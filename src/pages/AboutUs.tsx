
import React from 'react';
import { Award, Heart, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              {t('about.title')} <br />
              <span className="text-blue-600">{t('about.titleAccent')}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              {t('about.p1')}
            </p>
            <p className="text-slate-600 mb-10 leading-relaxed">
              {t('about.p2')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg">{t('about.ctaTeam')}</Button>
              </Link>
              <Link to="/courses-spain">
                <Button variant="outline" size="lg">{t('about.ctaCourses')}</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] -rotate-3" />
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
              alt={t('about.imageAlt')}
              className="relative rounded-[2rem] shadow-2xl w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {[
            { 
              icon: Award, 
              title: t('about.values.excellence.title'), 
              desc: t('about.values.excellence.desc') 
            },
            { 
              icon: Heart, 
              title: t('about.values.passion.title'), 
              desc: t('about.values.passion.desc') 
            },
            { 
              icon: Globe, 
              title: t('about.values.community.title'), 
              desc: t('about.values.community.desc') 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 mx-auto">
                <item.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Team Section Placeholder */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('about.joinTitle')}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-10">
            {t('about.joinDesc')}
          </p>
          <a href="https://www.instagram.com/teach4future_academy/" target="_blank" rel="noreferrer">
            <Button variant="outline">{t('about.followInstagram')}</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
