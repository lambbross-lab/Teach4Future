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

const AdminDashboard = () => {
  const { language, t } = useLanguage();
  const { sessions, mode, updateSession, deleteSession } = useAcademyData();
  const [drafts, setDrafts] = useState<CourseSession[]>(sessions);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');
  const [authChecked, setAuthChecked] = useState(!supabase);
  const navigate = useNavigate();

  useEffect(() => setDrafts(sessions), [sessions]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/login', { replace: true });
      setAuthChecked(true);
    });
  }, [navigate]);

  const stats = useMemo(() => ({
    courses: new Set(sessions.map((session) => session.courseId)).size,
    sessions: sessions.filter((session) => isCurrentOrUpcoming(session.endDate)).length,
    seats: sessions.reduce((total, session) => total + session.seatsLeft, 0),
  }), [sessions]);

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

  const addSession = () => {
    const start = new Date();
    start.setDate(start.getDate() + 30);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    setDrafts((current) => [...current, {
      id: crypto.randomUUID(),
      courseId: COURSES[0].id,
      cityId: CITIES[0].id,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      seatsTotal: 20,
      seatsLeft: 20,
      status: 'Open',
      schedule: 'morning',
    }]);
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
            <Button size="sm" disabled={mode !== 'live'} onClick={addSession}><Plus className="h-4 w-4 mr-2" />{t('admin.addSession')}</Button>
          </div>
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
                    <td className="px-6 py-5"><input aria-label={t('admin.table.startDate')} type="date" max={session.endDate} value={session.startDate} onChange={(event) => patchDraft(session.id, { startDate: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2" /></td>
                    <td className="px-6 py-5"><input aria-label={t('admin.table.endDate')} type="date" min={session.startDate} value={session.endDate} onChange={(event) => patchDraft(session.id, { endDate: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2" /></td>
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
