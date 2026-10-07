import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ExternalLink, FileText, GraduationCap, KeyRound, LogOut, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { COURSES, CITIES } from '../mockData';
import { formatDate, getText } from '../lib/utils';
import {
  CampusEnrollment,
  CampusMaterial,
  CampusSessionInfo,
  ENROLLMENT_COLUMNS,
  MATERIAL_COLUMNS,
  isCurrentUserAdmin,
  openMaterial,
} from '../services/campus';

type CourseBlock = {
  enrollment: CampusEnrollment;
  session: CampusSessionInfo;
  materials: CampusMaterial[];
};

const Campus = () => {
  const { language } = useLanguage();
  const L = (es: string, en: string) => (language === 'es' ? es : en);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [blocks, setBlocks] = useState<CourseBlock[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [activeDay, setActiveDay] = useState<Record<string, number>>({});
  const [openError, setOpenError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!supabase) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      const { data: auth } = await supabase!.auth.getUser();
      if (!auth.user) {
        navigate('/login', { replace: true });
        return;
      }
      setUserName((auth.user.user_metadata?.full_name as string) || auth.user.email || '');
      setIsAdmin(await isCurrentUserAdmin(auth.user.id));

      const today = new Date().toISOString().slice(0, 10);
      const { data: enrollments, error: enrollmentError } = await supabase!
        .from('campus_enrollments')
        .select(ENROLLMENT_COLUMNS)
        .eq('user_id', auth.user.id)
        .gte('access_until', today);
      if (enrollmentError) {
        setLoadError(true);
        setLoading(false);
        return;
      }
      const list = (enrollments ?? []) as CampusEnrollment[];
      if (!list.length) {
        setBlocks([]);
        setLoading(false);
        return;
      }
      const sessionIds = list.map((item) => item.session_id);
      const { data: sessions } = await supabase!
        .from('course_sessions')
        .select('id, course_id, city_id, start_date, end_date')
        .in('id', sessionIds);
      const sessionMap = new Map(((sessions ?? []) as CampusSessionInfo[]).map((session) => [session.id, session]));
      const courseIds: string[] = Array.from(new Set<string>(((sessions ?? []) as CampusSessionInfo[]).map((session) => session.course_id)));
      const { data: materials, error: materialsError } = await supabase!
        .from('campus_materials')
        .select(MATERIAL_COLUMNS)
        .in('course_id', courseIds)
        .order('day')
        .order('sort_order')
        .order('created_at');
      if (materialsError) setLoadError(true);
      const allMaterials = (materials ?? []) as CampusMaterial[];
      const next = list
        .filter((enrollment) => sessionMap.has(enrollment.session_id))
        .map((enrollment) => {
          const session = sessionMap.get(enrollment.session_id)!;
          return { enrollment, session, materials: allMaterials.filter((material) => material.course_id === session.course_id) };
        })
        .sort((a, b) => b.session.start_date.localeCompare(a.session.start_date));
      setBlocks(next);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const logout = async () => {
    await supabase?.auth.signOut();
    navigate('/login');
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMsg(null);
    if (password.length < 8) {
      setPasswordMsg({ ok: false, text: L('La contraseña debe tener al menos 8 caracteres.', 'The password must be at least 8 characters long.') });
      return;
    }
    if (password !== confirm) {
      setPasswordMsg({ ok: false, text: L('Las contraseñas no coinciden.', 'Passwords do not match.') });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase!.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      setPasswordMsg({ ok: false, text: L('No se pudo cambiar. Prueba una contraseña más segura (mayúsculas, minúsculas, números y símbolos).', 'Could not change it. Try a stronger password (upper and lower case, numbers and symbols).') });
      return;
    }
    setPassword('');
    setConfirm('');
    setPasswordMsg({ ok: true, text: L('Contraseña actualizada.', 'Password updated.') });
  };

  const dayLabel = (day: number) => (day === 0 ? L('General', 'General') : L(`Día ${day}`, `Day ${day}`));

  const handleOpen = async (material: CampusMaterial) => {
    setOpenError('');
    try {
      await openMaterial(material);
    } catch {
      setOpenError(L('No se pudo abrir el archivo. Inténtalo de nuevo.', 'The file could not be opened. Please try again.'));
    }
  };

  const content = useMemo(() => blocks.map((block) => {
    const course = COURSES.find((item) => item.id === block.session.course_id);
    const city = CITIES.find((item) => item.id === block.session.city_id);
    const days: number[] = Array.from(new Set<number>(block.materials.map((material) => material.day))).sort((a, b) => a - b);
    const current = activeDay[block.enrollment.id] ?? days[0] ?? 0;
    const visible = block.materials.filter((material) => material.day === current);
    return (
      <section key={block.enrollment.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">{L('Tu curso', 'Your course')}</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">{course ? getText(course.title, language) : block.session.course_id}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(block.session.start_date, language)} – {formatDate(block.session.end_date, language)}</span>
            {city && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{city.name}</span>}
          </div>
          <p className="text-xs text-slate-400 mt-3">{L('Acceso disponible hasta el', 'Access available until')} {formatDate(block.enrollment.access_until, language)}</p>
        </div>
        {block.materials.length === 0 ? (
          <p className="p-6 md:p-8 text-slate-500">{L('Los materiales del curso aparecerán aquí muy pronto.', 'Course materials will appear here very soon.')}</p>
        ) : (
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-6" role="tablist">
              {days.map((day) => (
                <button
                  key={day}
                  role="tab"
                  aria-selected={day === current}
                  onClick={() => setActiveDay((state) => ({ ...state, [block.enrollment.id]: day }))}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${day === current ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {dayLabel(day)}
                </button>
              ))}
            </div>
            <ul className="space-y-3">
              {visible.map((material) => (
                <li key={material.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-start gap-3 min-w-0">
                    {material.kind === 'file' ? <FileText className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" /> : <ExternalLink className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 break-words">{material.title}</p>
                      {material.description && <p className="text-sm text-slate-500 break-words">{material.description}</p>}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleOpen(material)} className="shrink-0">
                    {material.kind === 'file' ? L('Abrir archivo', 'Open file') : L('Abrir enlace', 'Open link')}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }), [blocks, activeDay, language]);

  if (loading) return <div className="min-h-screen grid place-items-center text-slate-500">{L('Cargando…', 'Loading…')}</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl"><GraduationCap className="h-6 w-6 text-white" /></div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Campus Teach4Future</h1>
              {userName && <p className="text-slate-500">{L('Hola', 'Hello')}, {userName}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && <Link to="/admin/campus"><Button size="sm" variant="outline">{L('Gestionar campus', 'Manage campus')}</Button></Link>}
            <Button size="sm" variant="outline" onClick={() => setShowPassword((value) => !value)}><KeyRound className="h-4 w-4 mr-1.5" />{L('Cambiar contraseña', 'Change password')}</Button>
            <Button size="sm" variant="ghost" onClick={logout}><LogOut className="h-4 w-4 mr-1.5" />{L('Salir', 'Sign out')}</Button>
          </div>
        </div>

        {showPassword && (
          <form onSubmit={changePassword} className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 mb-8 grid gap-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-sm text-slate-500">{L('Te recomendamos cambiar la contraseña temporal que te dimos el primer día.', 'We recommend changing the temporary password you received on the first day.')}</p>
            <input type="password" autoComplete="new-password" required minLength={8} placeholder={L('Nueva contraseña', 'New password')} value={password} onChange={(event) => setPassword(event.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="password" autoComplete="new-password" required minLength={8} placeholder={L('Repite la contraseña', 'Repeat password')} value={confirm} onChange={(event) => setConfirm(event.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" size="sm" isLoading={savingPassword}>{L('Guardar contraseña', 'Save password')}</Button>
              {passwordMsg && <p role="status" className={`text-sm ${passwordMsg.ok ? 'text-green-700' : 'text-amber-700'}`}>{passwordMsg.text}</p>}
            </div>
          </form>
        )}

        {loadError && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-6">{L('No se pudieron cargar todos los contenidos. Recarga la página.', 'Some content could not be loaded. Please reload the page.')}</p>}
        {openError && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-6">{openError}</p>}

        {blocks.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-10 text-center">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">{L('Todavía no tienes cursos activos', 'You have no active courses yet')}</h2>
            <p className="text-slate-500">{L('Cuando te inscribamos en un curso, sus materiales aparecerán aquí. Si crees que es un error, escríbenos a teach4futureacademy@gmail.com.', 'Once you are enrolled in a course, its materials will appear here. If you think this is a mistake, write to teach4futureacademy@gmail.com.')}</p>
          </div>
        ) : (
          <div className="space-y-8">{content}</div>
        )}
      </div>
    </div>
  );
};

export default Campus;
