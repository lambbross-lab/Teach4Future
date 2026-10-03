import React, { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, RotateCcw, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

type HelpTopic = 'courses' | 'dates' | 'schools' | 'enrolment';

const GuidedHelp: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);

  const isPrivateArea = location.pathname === '/login' || location.pathname === '/reset-password' || location.pathname.startsWith('/admin');

  useEffect(() => {
    setSelectedTopic(null);
  }, [language]);

  if (isPrivateArea) return null;

  const topics: Array<{ id: HelpTopic; label: string; answer: string; action: string; route: string }> = [
    { id: 'courses', label: t('guidedHelp.options.courses'), answer: t('guidedHelp.answers.courses'), action: t('guidedHelp.actions.courses'), route: '/courses-spain' },
    { id: 'dates', label: t('guidedHelp.options.dates'), answer: t('guidedHelp.answers.dates'), action: t('guidedHelp.actions.dates'), route: '/dates' },
    { id: 'schools', label: t('guidedHelp.options.schools'), answer: t('guidedHelp.answers.schools'), action: t('guidedHelp.actions.schools'), route: '/for-schools' },
    { id: 'enrolment', label: t('guidedHelp.options.enrolment'), answer: t('guidedHelp.answers.enrolment'), action: t('guidedHelp.actions.enrolment'), route: '/enrol' },
  ];

  const selected = topics.find((topic) => topic.id === selectedTopic);

  const openRoute = (route: string) => {
    setIsOpen(false);
    setSelectedTopic(null);
    navigate(route);
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label={t('guidedHelp.title')}
          className="mb-3 w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:w-[365px]"
        >
          <header className="flex items-center justify-between bg-blue-600 px-5 py-4 text-white">
            <div>
              <p className="text-sm font-bold">{t('guidedHelp.title')}</p>
              <p className="mt-0.5 text-xs text-blue-100">{t('guidedHelp.subtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={t('guidedHelp.close')}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <div className="max-h-[min(520px,calc(100vh-11rem))] overflow-y-auto p-5">
            <div className="max-w-[290px] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-700">
              {selected ? selected.answer : t('guidedHelp.welcome')}
            </div>

            {selected ? (
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => openRoute(selected.route)}
                  className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-left text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {selected.action}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {t('guidedHelp.anotherQuestion')}
                </button>
              </div>
            ) : (
              <div className="mt-5 grid gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic.id)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {topic.label}
                    <ArrowRight className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">{t('guidedHelp.note')}</p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-14 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-label={isOpen ? t('guidedHelp.close') : t('guidedHelp.open')}
      >
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
        <span className="hidden sm:inline">{t('guidedHelp.open')}</span>
      </button>
    </div>
  );
};

export default GuidedHelp;
