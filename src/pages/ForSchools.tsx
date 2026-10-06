
import React from 'react';
import { Users, FileCheck, ShieldCheck, CheckCircle2, Laptop, Compass } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const ForSchools = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              {t('forSchools.title')} <br />
              <span className="text-blue-600">{t('forSchools.titleAccent')}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t('forSchools.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg">{t('forSchools.ctaInfo')}</Button>
              </Link>
              <Link to="/courses-europe">
                <Button variant="outline" size="lg">{t('forSchools.ctaCustom')}</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] rotate-3" />
            <img 
              src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1200&q=80"
              alt={t('forSchools.imageAlt')}
              className="relative rounded-[2rem] shadow-2xl w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* In-school training */}
        <section className="mb-24 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4 md:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Laptop className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  {t('forSchools.educaAndalucia.eyebrow')}
                </p>
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  {t('forSchools.educaAndalucia.title')}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                  {t('forSchools.educaAndalucia.desc')}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                {t('forSchools.educaAndalucia.trainingCta')}
              </Link>
            </div>
          </div>
        </section>

        {/* Erasmus+ advisory */}
        <section className="mb-24 overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Compass className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">
                {t('forSchools.advisory.eyebrow')}
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                {t('forSchools.advisory.title')}
              </h2>
              <p className="mt-2 max-w-4xl leading-relaxed text-slate-600">
                {t('forSchools.advisory.desc')}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {t('forSchools.advisory.note')}
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              {t('forSchools.advisory.cta')}
            </Link>
          </div>
        </section>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {[
            { 
              icon: Users, 
              title: t('forSchools.services.bookings.title'), 
              desc: t('forSchools.services.bookings.desc') 
            },
            { 
              icon: FileCheck, 
              title: t('forSchools.services.docs.title'), 
              desc: t('forSchools.services.docs.desc') 
            },
            { 
              icon: ShieldCheck, 
              title: t('forSchools.services.quality.title'), 
              desc: t('forSchools.services.quality.desc') 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <item.icon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Custom Formats */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('forSchools.tailored.title')}</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {t('forSchools.tailored.desc')}
              </p>
              <ul className="space-y-4 mb-10">
                {(t('forSchools.tailored.points') as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button variant="primary" className="bg-white text-slate-900 hover:bg-slate-100">
                  {t('forSchools.tailored.cta')}
                </Button>
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
              <h3 className="text-2xl font-bold mb-4">{t('forSchools.tailored.commitmentTitle')}</h3>
              <p className="text-slate-300 leading-relaxed">{t('forSchools.tailored.commitmentDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForSchools;
