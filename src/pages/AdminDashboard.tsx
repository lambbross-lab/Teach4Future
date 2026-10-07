import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Check, Database, GraduationCap, LogOut, Mail, MessageCircle, Plus, Save, Send, Trash2, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAcademyData } from '../contexts/AcademyDataContext';
import { COURSES, CITIES } from '../mockData';
import { getText, isCurrentOrUpcoming } from '../lib/utils';
import { supabase } from '../lib/supabase';
import type { CourseSession } from '../types';

type SessionCreatorDraft = Omit<CourseSession, 'id' | 'cityId'> & { cityIds: string[] };
type EnquiryRecord = {
  id: string;
  kind: 'course' | 'europe' | 'contact';
  full_name: string;
  email: string;
  institution: string | null;
  course_id: string | null;
  city: string | null;
  topic: string | null;
  preferred_dates: string | null;
  group_size: number | null;
  subject: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};
type ChatConversation = {
  id: string;
  status: 'open' | 'closed';
  language: 'en' | 'es';
  last_message_at: string;
  last_message_from: 'visitor' | 'team';
  created_at: string;
};
type ChatMessageRecord = {
  id: string;
  sender: 'visitor' | 'team';
  content: string;
  created_at: string;
};

const toLocalDate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - (offset * 60_000)).toISOString().slice(0, 10);
};

const addDays = (dateValue: string, days: number) => {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const createSessionDraft = (): SessionCreatorDraft => {
  const startDate = toLocalDate(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)));
  return {
    courseId: COURSES[0].id,
    cityIds: [],
    startDate,
    endDate: addDays(startDate, 4),
    seatsTotal: 20,
    seatsLeft: 20,
    status: 'Open',
    schedule: 'tbc',
  };
};

const AdminDashboard = () => {
  const { language, t } = useLanguage();
  const { sessions, mode, updateSession, upsertSessions, deleteSession } = useAcademyData();
  const [drafts, setDrafts] = useState<CourseSession[]>(sessions);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [creatorDraft, setCreatorDraft] = useState<SessionCreatorDraft>(createSessionDraft);
  const [isCreating, setIsCreating] = useState(false);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [enquiriesError, setEnquiriesError] = useState(false);
  const [deletingEnquiryId, setDeletingEnquiryId] = useState<string | null>(null);
  const [chatAvailable, setChatAvailable] = useState(false);
  const [chatSaving, setChatSaving] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageRecord[]>([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatError, setChatError] = useState(false);
  const [authChecked, setAuthChecked] = useState(!supabase);
  const navigate = useNavigate();
  const today = useMemo(() => toLocalDate(new Date()), []);

  useEffect(() => setDrafts(sessions), [sessions]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        navigate('/login', { replace: true });
        return;
      }
      const { data: adminRow } = await supabase!.from('admin_users').select('id').eq('id', data.user.id).maybeSingle();
      if (!adminRow) {
        navigate('/campus', { replace: true });
        return;
      }
      setAuthChecked(true);
    });
  }, [navigate]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('enquiries')
      .select('id, kind, full_name, email, institution, course_id, city, topic, preferred_dates, group_size, subject, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (error) {
          setEnquiriesError(true);
          return;
        }
        setEnquiries((data ?? []) as EnquiryRecord[]);
      });
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const refresh = async () => {
      const [{ data: settings, error: settingsError }, { data: chats, error: chatsError }] = await Promise.all([
        supabase.from('chat_settings').select('is_available').eq('id', true).maybeSingle(),
        supabase.from('chat_conversations').select('id, status, language, last_message_at, last_message_from, created_at').order('last_message_at', { ascending: false }).limit(30),
      ]);
      if (settingsError || chatsError) {
        setChatError(true);
        return;
      }
      setChatAvailable(Boolean(settings?.is_available));
      const next = (chats ?? []) as ChatConversation[];
      setConversations(next);
      setSelectedConversationId((current) => current ?? next[0]?.id ?? null);
    };
    refresh();
    const interval = window.setInterval(refresh, 5000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!supabase || !selectedConversationId) {
      setChatMessages([]);
      return;
    }
    const refresh = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, sender, content, created_at')
        .eq('conversation_id', selectedConversationId)
        .order('created_at', { ascending: true });
      if (error) {
        setChatError(true);
        return;
      }
      setChatMessages((data ?? []) as ChatMessageRecord[]);
    };
    refresh();
    const interval = window.setInterval(refresh, 3000);
    return () => window.clearInterval(interval);
  }, [selectedConversationId]);

  const stats = useMemo(() => {
    const upcoming = sessions.filter((session) => isCurrentOrUpcoming(session.endDate));
    return {
      courses: new Set(upcoming.map((session) => session.courseId)).size,
      sessions: upcoming.length,
      seats: upcoming.reduce((total, session) => total + session.seatsLeft, 0),
    };
  }, [sessions]);

  const patchDraft = (id: string, patch: Partial<CourseSession>) => {
    setDrafts((current) => current.map((session) => session.id === id ? { ...session, ...patch } : session));
  };

  const saveSession = async (session: CourseSession) => {
    if (session.endDate < session.startDate) {
      setSaveError(t('admin.invalidDate'));
      return;
    }
    setSavingId(session.id);
    setSavedId(null);
    setSaveError('');
    try {
      await updateSession(session);
      setSavedId(session.id);
    } catch {
      setSaveError(t('admin.saveFailed'));
    } finally {
      setSavingId(null);
    }
  };

  const toggleCreatorCity = (cityId: string) => {
    setCreatorDraft((current) => ({
      ...current,
      cityIds: current.cityIds.includes(cityId)
        ? current.cityIds.filter((id) => id !== cityId)
        : [...current.cityIds, cityId],
    }));
  };

  const createSessions = async () => {
    if (creatorDraft.cityIds.length === 0) {
      setSaveError(t('admin.creator.chooseCity'));
      return;
    }
    if (creatorDraft.startDate < today) {
      setSaveError(t('admin.creator.futureDate'));
      return;
    }
    if (creatorDraft.endDate < creatorDraft.startDate) {
      setSaveError(t('admin.invalidDate'));
      return;
    }
    if (creatorDraft.seatsLeft > creatorDraft.seatsTotal || creatorDraft.seatsTotal < 1) {
      setSaveError(t('admin.creator.invalidSeats'));
      return;
    }

    const newSessions: CourseSession[] = creatorDraft.cityIds.map((cityId) => ({
      id: crypto.randomUUID(),
      cityId,
      courseId: creatorDraft.courseId,
      startDate: creatorDraft.startDate,
      endDate: creatorDraft.endDate,
      seatsTotal: creatorDraft.seatsTotal,
      seatsLeft: creatorDraft.seatsLeft,
      status: creatorDraft.status,
      schedule: creatorDraft.schedule,
    }));

    setIsCreating(true);
    setSaveError('');
    try {
      await upsertSessions(newSessions);
      setDrafts((current) => [...current, ...newSessions].sort((a, b) => a.startDate.localeCompare(b.startDate)));
      setCreatorDraft(createSessionDraft());
      setIsCreatorOpen(false);
    } catch {
      setSaveError(t('admin.saveFailed'));
    } finally {
      setIsCreating(false);
    }
  };

  const removeSession = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    setSaveError('');
    try {
      if (sessions.some((session) => session.id === id)) await deleteSession(id);
      setDrafts((current) => current.filter((session) => session.id !== id));
    } catch {
      setSaveError(t('admin.deleteFailed'));
    }
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    navigate('/login');
  };

  const setEnquiryStatus = async (id: string, status: EnquiryRecord['status']) => {
    if (!supabase) return;
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (!error) setEnquiries((current) => current.map((enquiry) => enquiry.id === id ? { ...enquiry, status } : enquiry));
  };

  const deleteEnquiry = async (enquiry: EnquiryRecord) => {
    if (!supabase || !window.confirm(t('admin.enquiries.deleteConfirm'))) return;
    setDeletingEnquiryId(enquiry.id);
    const { error } = await supabase.from('enquiries').delete().eq('id', enquiry.id);
    if (!error) setEnquiries((current) => current.filter((item) => item.id !== enquiry.id));
    else setEnquiriesError(true);
    setDeletingEnquiryId(null);
  };

  const setAvailability = async (isAvailable: boolean) => {
    if (!supabase) return;
    setChatSaving(true);
    const { error } = await supabase.from('chat_settings').update({ is_available: isAvailable, updated_at: new Date().toISOString() }).eq('id', true);
    if (!error) setChatAvailable(isAvailable);
    else setChatError(true);
    setChatSaving(false);
  };

  const sendTeamMessage = async () => {
    const content = chatDraft.trim();
    if (!supabase || !selectedConversationId || !content) return;
    setChatDraft('');
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ conversation_id: selectedConversationId, sender: 'team', content })
      .select('id, sender, content, created_at')
      .single();
    if (error || !data) {
      setChatError(true);
      setChatDraft(content);
      return;
    }
    await supabase.from('chat_conversations').update({ last_message_at: new Date().toISOString(), last_message_from: 'team' }).eq('id', selectedConversationId);
    setChatMessages((current) => [...current, data as ChatMessageRecord]);
  };

  if (!authChecked) return <div className="min-h-screen grid place-items-center text-slate-500">{t('common.loading')}</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 mb-3">
              <GraduationCap className="h-5 w-5" /> Teach4Future Academy
            </Link>
            <h1 className="text-3xl font-black text-slate-900">{t('admin.nav.dashboard')}</h1>
            <p className="text-slate-500 mt-2">{t('admin.sessionsHelp')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/campus"><Button variant="primary"><BookOpen className="h-4 w-4 mr-2" />{language === 'es' ? 'Campus: alumnos y materiales' : 'Campus: participants and materials'}</Button></Link>
            {supabase && <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4 mr-2" />{t('admin.nav.logout')}</Button>}
          </div>
        </div>

        <div className={`mb-8 rounded-2xl border p-4 flex items-center gap-3 ${mode === 'live' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          <Database className="h-5 w-5 flex-none" />
          <div>
            <p className="font-bold">{mode === 'live' ? t('admin.live') : t('admin.preview')}</p>
            {mode === 'preview' && <p className="text-sm mt-0.5">{t('login.notConfigured')}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: t('admin.stats.activeCourses'), value: stats.courses, icon: GraduationCap },
            { label: t('admin.stats.upcomingSessions'), value: stats.sessions, icon: Calendar },
            { label: t('admin.seats'), value: stats.seats, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <Icon className="h-6 w-6 text-blue-600 mb-4" />
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
            </div>
          ))}
        </div>

        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><MessageCircle className="h-5 w-5 text-blue-600" />{t('admin.chat.title')}</h2>
              <p className="mt-1 text-sm text-slate-500">{t('admin.chat.help')}</p>
            </div>
            <button type="button" disabled={chatSaving || mode !== 'live'} onClick={() => setAvailability(!chatAvailable)} className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${chatAvailable ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              <span className={`mr-2 h-2.5 w-2.5 rounded-full ${chatAvailable ? 'bg-white' : 'bg-slate-400'}`} />
              {chatAvailable ? t('admin.chat.available') : t('admin.chat.unavailable')}
            </button>
          </div>
          {chatError ? <p className="p-6 text-sm font-semibold text-red-700">{t('admin.chat.error')}</p> : (
            <div className="grid min-h-[360px] lg:grid-cols-[300px_1fr]">
              <div className="border-b border-slate-100 lg:border-b-0 lg:border-r">
                {conversations.length === 0 ? <p className="p-6 text-sm text-slate-500">{t('admin.chat.empty')}</p> : conversations.map((conversation) => (
                  <button type="button" key={conversation.id} onClick={() => setSelectedConversationId(conversation.id)} className={`block w-full border-b border-slate-100 px-5 py-4 text-left transition-colors ${selectedConversationId === conversation.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center justify-between gap-3"><span className="font-bold text-slate-800">{t('admin.chat.visitor')}</span><span className="text-xs text-slate-400">{new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(conversation.last_message_at))}</span></div>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{conversation.last_message_from === 'visitor' ? t('admin.chat.newMessage') : t('admin.chat.teamReply')} · {conversation.language.toUpperCase()}</p>
                  </button>
                ))}
              </div>
              <div className="flex min-h-[360px] flex-col p-5 md:p-6">
                {selectedConversationId ? <>
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {chatMessages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.sender === 'team' ? 'ml-auto rounded-tr-md bg-blue-600 text-white' : 'rounded-tl-md bg-slate-100 text-slate-700'}`}>{message.content}</div>)}
                  </div>
                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
                    <input value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); sendTeamMessage(); } }} maxLength={1000} placeholder={t('admin.chat.placeholder')} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
                    <button type="button" onClick={sendTeamMessage} disabled={!chatDraft.trim()} className="rounded-xl bg-blue-600 px-4 text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label={t('admin.chat.send')}><Send className="h-4 w-4" /></button>
                  </div>
                </> : <p className="m-auto text-center text-sm text-slate-500">{t('admin.chat.select')}</p>}
              </div>
            </div>
          )}
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6 md:p-8">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><Mail className="h-5 w-5 text-blue-600" />{t('admin.enquiries.title')}</h2>
              <p className="mt-1 text-sm text-slate-500">{t('admin.enquiries.help')}</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{enquiries.filter((enquiry) => enquiry.status === 'new').length} {t('admin.enquiries.new')}</span>
          </div>
          {enquiriesError ? (
            <p className="p-6 text-sm font-semibold text-red-700">{t('admin.enquiries.loadError')}</p>
          ) : enquiries.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">{t('admin.enquiries.empty')}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {enquiries.map((enquiry) => (
                <article key={enquiry.id} className="p-6 md:px-8">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">{enquiry.full_name}</h3>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{t(`admin.enquiries.kinds.${enquiry.kind}`)}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${enquiry.status === 'new' ? 'bg-blue-50 text-blue-700' : enquiry.status === 'contacted' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{t(`admin.enquiries.status.${enquiry.status}`)}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <a className="text-sm font-semibold text-blue-600 hover:underline" href={`mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(`${t('admin.enquiries.replySubject')} ${enquiry.full_name}`)}`}>{enquiry.email}</a>
                        <a className="text-xs font-bold text-slate-500 hover:text-blue-600 hover:underline" href={`mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(`${t('admin.enquiries.replySubject')} ${enquiry.full_name}`)}`}>{t('admin.enquiries.reply')}</a>
                        <button type="button" onClick={() => navigator.clipboard?.writeText(enquiry.email)} className="text-xs font-bold text-slate-500 hover:text-blue-600 hover:underline">{t('admin.enquiries.copyEmail')}</button>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{[enquiry.institution, enquiry.course_id, enquiry.city, enquiry.topic, enquiry.preferred_dates, enquiry.group_size ? `${enquiry.group_size} ${t('admin.enquiries.people')}` : null].filter(Boolean).join(' · ')}</p>
                      {(enquiry.subject || enquiry.message) && <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{enquiry.subject && <strong>{enquiry.subject}{enquiry.message ? ': ' : ''}</strong>}{enquiry.message}</p>}
                      <p className="mt-3 text-xs text-slate-400">{new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(enquiry.created_at))}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <select aria-label={t('admin.enquiries.statusLabel')} value={enquiry.status} onChange={(event) => setEnquiryStatus(enquiry.id, event.target.value as EnquiryRecord['status'])} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                        <option value="new">{t('admin.enquiries.status.new')}</option>
                        <option value="contacted">{t('admin.enquiries.status.contacted')}</option>
                        <option value="closed">{t('admin.enquiries.status.closed')}</option>
                      </select>
                      <button type="button" onClick={() => deleteEnquiry(enquiry)} disabled={deletingEnquiryId === enquiry.id} aria-label={t('admin.enquiries.delete')} title={t('admin.enquiries.delete')} className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">{t('admin.sessionsTitle')}</h2>
            <Button size="sm" disabled={mode !== 'live'} onClick={() => setIsCreatorOpen((open) => !open)}><Plus className="h-4 w-4 mr-2" />{t('admin.addSession')}</Button>
          </div>
          {isCreatorOpen && <div className="border-b border-blue-100 bg-blue-50/60 p-6 md:p-8">
            <div className="mb-5">
              <h3 className="font-bold text-slate-900">{t('admin.creator.title')}</h3>
              <p className="mt-1 text-sm text-slate-600">{t('admin.creator.help')}</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-4">
              <label className="text-sm font-semibold text-slate-700">{t('admin.table.course')}
                <select value={creatorDraft.courseId} onChange={(event) => setCreatorDraft((current) => ({ ...current, courseId: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal">
                  {COURSES.map((item) => <option key={item.id} value={item.id}>{getText(item.title, language)}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">{t('admin.table.startDate')}
                <input type="date" min={today} value={creatorDraft.startDate} onChange={(event) => setCreatorDraft((current) => ({ ...current, startDate: event.target.value, endDate: current.endDate < event.target.value ? addDays(event.target.value, 4) : current.endDate }))} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" />
              </label>
              <label className="text-sm font-semibold text-slate-700">{t('admin.table.endDate')}
                <input type="date" min={creatorDraft.startDate} value={creatorDraft.endDate} onChange={(event) => setCreatorDraft((current) => ({ ...current, endDate: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" />
              </label>
              <div className="text-sm font-semibold text-slate-700">{t('admin.totalSeats')}
                <div className="mt-2 flex gap-2">
                  <input aria-label={t('admin.totalSeats')} type="number" min="1" value={creatorDraft.seatsTotal} onChange={(event) => setCreatorDraft((current) => ({ ...current, seatsTotal: Number(event.target.value) }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" />
                  <input aria-label={t('admin.seats')} type="number" min="0" max={creatorDraft.seatsTotal} value={creatorDraft.seatsLeft} onChange={(event) => setCreatorDraft((current) => ({ ...current, seatsLeft: Number(event.target.value) }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" />
                </div>
              </div>
            </div>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-slate-700">{t('admin.creator.cities')}</legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {CITIES.map((city) => <label key={city.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${creatorDraft.cityIds.includes(city.id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'}`}>
                  <input className="sr-only" type="checkbox" checked={creatorDraft.cityIds.includes(city.id)} onChange={() => toggleCreatorCity(city.id)} />
                  {city.name}
                </label>)}
              </div>
            </fieldset>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="sm" disabled={mode !== 'live' || isCreating} onClick={createSessions}><Plus className="mr-2 h-4 w-4" />{t('admin.creator.create')} ({creatorDraft.cityIds.length})</Button>
              <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-700" onClick={() => setIsCreatorOpen(false)}>{t('common.cancel')}</button>
            </div>
          </div>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>
                <th className="px-6 py-4">{t('admin.table.course')}</th><th className="px-6 py-4">{t('coursesSpain.city')}</th><th className="px-6 py-4">{t('admin.table.startDate')}</th><th className="px-6 py-4">{t('admin.table.endDate')}</th><th className="px-6 py-4">{t('admin.seats')}</th><th className="px-6 py-4">{t('admin.table.status')}</th><th className="px-6 py-4 text-right">{t('admin.table.actions')}</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {drafts.map((session) => {
                  return <tr key={session.id}>
                    <td className="px-6 py-5 font-semibold text-slate-900"><select value={session.courseId} onChange={(event) => patchDraft(session.id, { courseId: event.target.value })} className="max-w-64 rounded-lg border border-slate-200 px-3 py-2 bg-white">{COURSES.map((item) => <option key={item.id} value={item.id}>{getText(item.title, language)}</option>)}</select></td>
                    <td className="px-6 py-5 text-slate-600"><select value={session.cityId} onChange={(event) => patchDraft(session.id, { cityId: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 bg-white">{CITIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></td>
                    <td className="px-6 py-5"><input aria-label={t('admin.table.startDate')} type="date" min={today} value={session.startDate} onChange={(event) => patchDraft(session.id, { startDate: event.target.value, endDate: session.endDate < event.target.value ? addDays(event.target.value, 4) : session.endDate })} className="rounded-lg border border-slate-200 px-3 py-2" /></td>
                    <td className="px-6 py-5"><input aria-label={t('admin.table.endDate')} type="date" min={session.startDate > today ? session.startDate : today} value={session.endDate} onChange={(event) => patchDraft(session.id, { endDate: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2" /></td>
                    <td className="px-6 py-5"><div className="flex gap-2"><input aria-label={t('admin.totalSeats')} type="number" min="1" value={session.seatsTotal} onChange={(event) => patchDraft(session.id, { seatsTotal: Number(event.target.value) })} className="w-20 rounded-lg border border-slate-200 px-3 py-2" /><input aria-label={t('admin.seats')} type="number" min="0" max={session.seatsTotal} value={session.seatsLeft} onChange={(event) => patchDraft(session.id, { seatsLeft: Number(event.target.value) })} className="w-20 rounded-lg border border-slate-200 px-3 py-2" /></div></td>
                    <td className="px-6 py-5"><select value={session.status} onChange={(event) => patchDraft(session.id, { status: event.target.value as CourseSession['status'] })} className="rounded-lg border border-slate-200 px-3 py-2 bg-white"><option value="Open">{t('admin.status.open')}</option><option value="Almost Full">{t('admin.status.almostFull')}</option><option value="Waiting List">{t('admin.status.waitingList')}</option><option value="Closed">{t('admin.status.closed')}</option></select></td>
                    <td className="px-6 py-5 text-right"><div className="flex justify-end gap-2"><Button size="sm" disabled={mode !== 'live' || savingId === session.id} onClick={() => saveSession(session)}>{savedId === session.id ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}{savedId === session.id ? t('admin.saved') : t('admin.save')}</Button><Button variant="outline" size="sm" disabled={mode !== 'live'} onClick={() => removeSession(session.id)} aria-label={t('admin.deleteSession')}><Trash2 className="h-4 w-4" /></Button></div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
          {saveError && <p role="alert" className="border-t border-red-100 bg-red-50 px-6 py-4 text-sm font-semibold text-red-700">{saveError}</p>}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
