import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Check, Database, GraduationCap, LogOut, Plus, Save, Trash2, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAcademyData } from '../contexts/AcademyDataContext';
import { COURSES, CITIES } from '../mockData';
import { getText, isCurrentOrUpcoming } from '../lib/utils';
import { supabase } from '../lib/supabase';
import type { CourseSession } from '../types';

type SessionCreatorDraft = Omit<CourseSession, 'id' | 'cityId'> & { cityIds: string[] };

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
    schedule: 'morning',
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
  const [authChecked, setAuthChecked] = useState(!supabase);
  const navigate = useNavigate();
  const today = useMemo(() => toLocalDate(new Date()), []);

  useEffect(() => setDrafts(sessions), [sessions]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/login', { replace: true });
      setAuthChecked(true);
    });
  }, [navigate]);

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
          {supabase && <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4 mr-2" />{t('admin.nav.logout')}</Button>}
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
