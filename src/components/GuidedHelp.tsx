import React, { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatMessage, getChatAvailability, getChatMessages, sendChatMessage, startChat } from '../services/chatSupport';

type HelpTopic = 'courses' | 'dates' | 'schools' | 'enrolment';

const GuidedHelp: React.FC = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const [available, setAvailable] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [chatError, setChatError] = useState('');
  const [sending, setSending] = useState(false);

  const isPrivateArea = location.pathname === '/login' || location.pathname === '/reset-password' || location.pathname.startsWith('/admin');

  useEffect(() => {
    setSelectedTopic(null);
  }, [language]);

  useEffect(() => {
    if (!isOpen) return;
    setCheckingAvailability(true);
    getChatAvailability()
      .then((data) => setAvailable(Boolean(data.available)))
      .catch(() => setAvailable(false))
      .finally(() => setCheckingAvailability(false));
  }, [isOpen]);

  useEffect(() => {
    if (!conversationId) return;
    const refresh = () => getChatMessages(conversationId)
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => undefined);
    refresh();
    const interval = window.setInterval(refresh, 5000);
    return () => window.clearInterval(interval);
  }, [conversationId]);

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

  const openLiveChat = async () => {
    setChatError('');
    setSending(true);
    try {
      const data = await startChat(language);
      setConversationId(data.conversationId);
      setMessages(data.messages ?? []);
    } catch {
      setChatError(t('guidedHelp.live.unavailable'));
      setAvailable(false);
    } finally {
      setSending(false);
    }
  };

  const submitMessage = async (event: FormEvent) => {
    event.preventDefault();
    const message = draft.trim();
    if (!conversationId || !message || sending) return;
    setSending(true);
    setChatError('');
    try {
      const data = await sendChatMessage(conversationId, message);
      setMessages((current) => [...current, data.message]);
      setDraft('');
    } catch {
      setChatError(t('guidedHelp.live.sendError'));
    } finally {
      setSending(false);
    }
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
            {conversationId ? (
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t('guidedHelp.live.title')}</p>
                    <p className="text-xs text-emerald-600">{t('guidedHelp.live.status')}</p>
                  </div>
                  <button type="button" onClick={() => setConversationId(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={t('guidedHelp.live.back')}>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-3">
                  {messages.length === 0 ? <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">{t('guidedHelp.live.start')}</p> : messages.map((message) => (
                    <div key={message.id} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.sender === 'team' ? 'rounded-tl-md bg-slate-100 text-slate-700' : 'ml-auto rounded-tr-md bg-blue-600 text-white'}`}>
                      {message.content}
                    </div>
                  ))}
                </div>
                <form className="mt-4" onSubmit={submitMessage}>
                  <div className="flex gap-2">
                    <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1000} placeholder={t('guidedHelp.live.placeholder')} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
                    <button type="submit" disabled={!draft.trim() || sending} className="rounded-xl bg-blue-600 px-3 text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label={t('guidedHelp.live.send')}>
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">{t('guidedHelp.live.privacy')}</p>
              </div>
            ) : (
              <>
                {available && !checkingAvailability ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-sm font-bold text-emerald-900">{t('guidedHelp.live.available')}</p>
                    <p className="mt-1 text-sm leading-relaxed text-emerald-800">{t('guidedHelp.live.availableDesc')}</p>
                    <button type="button" onClick={openLiveChat} disabled={sending} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      {t('guidedHelp.live.startCta')}
                    </button>
                  </div>
                ) : (
                  <div className="max-w-[290px] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-700">
                    {selected ? selected.answer : t('guidedHelp.welcome')}
                  </div>
                )}

                {!available && selected ? (
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
                ) : !available ? (
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
                ) : null}

                {chatError && <p className="mt-3 text-sm font-semibold text-red-700">{chatError}</p>}
              </>
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
