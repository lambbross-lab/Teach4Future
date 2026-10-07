import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink, FileText, KeyRound, Plus, Trash2, Upload, UserPlus, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { COURSES, CITIES } from '../mockData';
import { formatDate, getText } from '../lib/utils';
import {
  CAMPUS_BUCKET,
  CampusEnrollment,
  CampusMaterial,
  CampusSessionInfo,
  ENROLLMENT_COLUMNS,
  MATERIAL_COLUMNS,
  callCampusAdmin,
  isCurrentUserAdmin,
  openMaterial,
  safeFileName,
} from '../services/campus';

const CAMPUS_LOGIN_URL = 'https://www.teach4future.eu/login';
const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white';

type Credential = { name: string; email: string; password: string | null; existing: boolean };

const AdminCampus = () => {
  const { language } = useLanguage();
  const L = (es: string, en: string) => (language === 'es' ? es : en);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [sessions, setSessions] = useState<CampusSessionInfo[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [enrollments, setEnrollments] = useState<CampusEnrollment[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [credential, setCredential] = useState<Credential | null>(null);
  const [copied, setCopied] = useState(false);
  const [participantError, setParticipantError] = useState('');

  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [materials, setMaterials] = useState<CampusMaterial[]>([]);
  const [day, setDay] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState<'file' | 'link'>('file');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [savingMaterial, setSavingMaterial] = useState(false);
  const [materialError, setMaterialError] = useState('');

  const courseName = (id: string) => {
    const course = COURSES.find((item) => item.id === id);
    return course ? getText(course.title, language) : id;
  };
  const cityName = (id: string) => CITIES.find((item) => item.id === id)?.name ?? id;
  const sessionLabel = (session: CampusSessionInfo) => `${courseName(session.course_id)} · ${cityName(session.city_id)} · ${formatDate(session.start_date, language)}`;

  useEffect(() => {
    if (!supabase) {
      navigate('/login', { replace: true });
      return;
    }
    const init = async () => {
      const { data } = await supabase!.auth.getUser();
      if (!data.user || !(await isCurrentUserAdmin(data.user.id))) {
        navigate('/login', { replace: true });
        return;
      }
      const { data: rows } = await supabase!
        .from('course_sessions')
        .select('id, course_id, city_id, start_date, end_date')
        .order('start_date', { ascending: false });
      const list = (rows ?? []) as CampusSessionInfo[];
      setSessions(list);
      setSessionId(list[0]?.id ?? '');
      setReady(true);
    };
    init();
  }, [navigate]);

  const loadEnrollments = async (id: string) => {
    if (!supabase || !id) {
      setEnrollments([]);
      return;
    }
    const { data } = await supabase.from('campus_enrollments').select(ENROLLMENT_COLUMNS).eq('session_id', id).order('full_name');
    setEnrollments((data ?? []) as CampusEnrollment[]);
  };

  const loadMaterials = async (id: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('campus_materials').select(MATERIAL_COLUMNS).eq('course_id', id).order('day').order('sort_order').order('created_at');
    setMaterials((data ?? []) as CampusMaterial[]);
  };

  useEffect(() => { if (ready) loadEnrollments(sessionId); }, [ready, sessionId]);
  useEffect(() => { if (ready) loadMaterials(courseId); }, [ready, courseId]);

  const errorText = (code: string) => {
    const map: Record<string, [string, string]> = {
      invalid_input: ['Revisa el nombre y el correo.', 'Check the name and e-mail.'],
      create_failed: ['No se pudo crear la cuenta.', 'The account could not be created.'],
      forbidden: ['No tienes permiso para esta acción.', 'You are not allowed to do this.'],
      unauthorized: ['Tu sesión ha caducado. Vuelve a entrar.', 'Your session has expired. Please sign in again.'],
    };
    const pair = map[code] ?? ['Algo ha fallado. Inténtalo de nuevo.', 'Something went wrong. Please try again.'];
    return L(pair[0], pair[1]);
  };

  const enroll = async (event: React.FormEvent) => {
    event.preventDefault();
    setParticipantError('');
    setCredential(null);
    setCopied(false);
    setEnrolling(true);
    try {
      const result = await callCampusAdmin<{ enrollment: CampusEnrollment; tempPassword: string | null; existingAccount: boolean }>({
        action: 'enroll', sessionId, fullName, email,
      });
      setCredential({ name: result.enrollment.full_name, email: result.enrollment.email, password: result.tempPassword, existing: result.existingAccount });
      setFullName('');
      setEmail('');
      await loadEnrollments(sessionId);
    } catch (error) {
      setParticipantError(errorText((error as Error).message));
    } finally {
      setEnrolling(false);
    }
  };

  const resetPassword = async (enrollment: CampusEnrollment) => {
    if (!window.confirm(L(`¿Generar una nueva contraseña temporal para ${enrollment.full_name}?`, `Generate a new temporary password for ${enrollment.full_name}?`))) return;
    setParticipantError('');
    setCopied(false);
    try {
      const result = await callCampusAdmin<{ tempPassword: string }>({ action: 'reset_password', userId: enrollment.user_id });
      setCredential({ name: enrollment.full_name, email: enrollment.email, password: result.tempPassword, existing: false });
    } catch (error) {
      setParticipantError(errorText((error as Error).message));
    }
  };

  const removeEnrollment = async (enrollment: CampusEnrollment) => {
    if (!supabase || !window.confirm(L(`¿Quitar el acceso de ${enrollment.full_name} a este curso?`, `Remove ${enrollment.full_name}'s access to this course?`))) return;
    const { error } = await supabase.from('campus_enrollments').delete().eq('id', enrollment.id);
    if (error) setParticipantError(errorText('request_failed'));
    else setEnrollments((list) => list.filter((item) => item.id !== enrollment.id));
  };

  const credentialText = credential ? [
    'Campus Teach4Future',
    `${L('Acceso', 'Sign in')}: ${CAMPUS_LOGIN_URL}`,
    `${L('Usuario', 'User')}: ${credential.email}`,
    credential.password ? `${L('Contraseña temporal', 'Temporary password')}: ${credential.password}` : L('Contraseña: la misma que ya usabas', 'Password: the one you already use'),
  ].join('\n') : '';

  const copyCredential = async () => {
    try {
      await navigator.clipboard.writeText(credentialText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const addMaterial = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setMaterialError('');
    if (title.trim().length < 2) {
      setMaterialError(L('Escribe un título.', 'Enter a title.'));
      return;
    }
    if (kind === 'link' && !/^https:\/\//i.test(url.trim())) {
      setMaterialError(L('El enlace debe empezar por https://', 'The link must start with https://'));
      return;
    }
    if (kind === 'file' && !file) {
      setMaterialError(L('Elige un archivo.', 'Choose a file.'));
      return;
    }
    if (file && file.size > 50 * 1024 * 1024) {
      setMaterialError(L('El archivo supera 50 MB. Para vídeos, súbelos a YouTube o Drive y añade el enlace.', 'The file is larger than 50 MB. For videos, upload them to YouTube or Drive and add the link.'));
      return;
    }
    setSavingMaterial(true);
    let storagePath: string | null = null;
    if (kind === 'file' && file) {
      storagePath = `${courseId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage.from(CAMPUS_BUCKET).upload(storagePath, file, { contentType: file.type || undefined, upsert: false });
      if (uploadError) {
        setSavingMaterial(false);
        setMaterialError(L('No se pudo subir el archivo.', 'The file could not be uploaded.'));
        return;
      }
    }
    const sortOrder = materials.filter((item) => item.day === day).length;
    const { error } = await supabase.from('campus_materials').insert({
      course_id: courseId,
      day,
      title: title.trim(),
      description: description.trim() || null,
      kind,
      url: kind === 'link' ? url.trim() : null,
      storage_path: storagePath,
      sort_order: sortOrder,
    });
    setSavingMaterial(false);
    if (error) {
      if (storagePath) await supabase.storage.from(CAMPUS_BUCKET).remove([storagePath]);
      setMaterialError(L('No se pudo guardar el material.', 'The material could not be saved.'));
      return;
    }
    setTitle('');
    setDescription('');
    setUrl('');
    setFile(null);
    setFileInputKey((value) => value + 1);
    await loadMaterials(courseId);
  };

  const removeMaterial = async (material: CampusMaterial) => {
    if (!supabase || !window.confirm(L(`¿Borrar "${material.title}"?`, `Delete "${material.title}"?`))) return;
    const { error } = await supabase.from('campus_materials').delete().eq('id', material.id);
    if (error) {
      setMaterialError(L('No se pudo borrar.', 'Could not delete it.'));
      return;
    }
    if (material.storage_path) await supabase.storage.from(CAMPUS_BUCKET).remove([material.storage_path]);
    setMaterials((list) => list.filter((item) => item.id !== material.id));
  };

  const materialsByDay = useMemo(() => [0, 1, 2, 3, 4, 5]
    .map((value) => ({ day: value, items: materials.filter((item) => item.day === value) }))
    .filter((group) => group.items.length > 0), [materials]);

  const dayLabel = (value: number) => (value === 0 ? L('General (todo el curso)', 'General (whole course)') : L(`Día ${value}`, `Day ${value}`));

  if (!ready) return <div className="min-h-screen grid place-items-center text-slate-500">{L('Cargando…', 'Loading…')}</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-2"><ArrowLeft className="h-4 w-4 mr-1" />{L('Volver al panel', 'Back to dashboard')}</Link>
            <h1 className="text-3xl font-extrabold text-slate-900">{L('Gestión del Campus', 'Campus management')}</h1>
            <p className="text-slate-500">{L('Da acceso a los participantes y sube los materiales de cada curso.', 'Give participants access and upload the materials for each course.')}</p>
          </div>
          <Link to="/campus"><Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-1.5" />{L('Ver el campus', 'View campus')}</Button></Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Participants */}
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" />{L('Participantes', 'Participants')}</h2>
            <p className="text-sm text-slate-500 mb-5">{L('Cada participante ve los materiales de su curso durante 12 meses desde el final de la edición.', 'Each participant sees their course materials for 12 months after the edition ends.')}</p>

            {sessions.length === 0 ? (
              <p className="text-slate-500">{L('Primero crea una edición en el panel principal.', 'First create an edition in the main dashboard.')}</p>
            ) : (
              <>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{L('Edición', 'Edition')}</label>
                <select value={sessionId} onChange={(event) => { setSessionId(event.target.value); setCredential(null); }} className={`${inputClass} mt-2 mb-5`}>
                  {sessions.map((session) => <option key={session.id} value={session.id}>{sessionLabel(session)}</option>)}
                </select>

                <form onSubmit={enroll} className="grid gap-3 sm:grid-cols-2 mb-4">
                  <input required minLength={2} placeholder={L('Nombre y apellidos', 'Full name')} value={fullName} onChange={(event) => setFullName(event.target.value)} className={inputClass} />
                  <input required type="email" placeholder={L('Correo electrónico', 'E-mail')} value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
                  <Button type="submit" size="sm" isLoading={enrolling} className="sm:col-span-2 justify-self-start"><UserPlus className="h-4 w-4 mr-1.5" />{L('Dar acceso', 'Give access')}</Button>
                </form>

                {participantError && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-4">{participantError}</p>}

                {credential && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-4 mb-5">
                    <p className="font-semibold text-green-900 mb-2">{credential.existing ? L(`${credential.name} ya tenía cuenta: se le ha añadido este curso.`, `${credential.name} already had an account: this course has been added.`) : L(`Datos de acceso de ${credential.name}`, `Sign-in details for ${credential.name}`)}</p>
                    <pre className="whitespace-pre-wrap break-all text-sm text-green-900 bg-white/70 rounded-xl p-3 mb-3">{credentialText}</pre>
                    {credential.password && <p className="text-xs text-green-800 mb-3">{L('La contraseña solo se muestra ahora. Cópiala y dásela en mano o por correo; podrá cambiarla dentro del campus.', 'The password is only shown now. Copy it and hand it over or e-mail it; they can change it inside the campus.')}</p>}
                    <Button size="sm" variant="outline" onClick={copyCredential}><Copy className="h-4 w-4 mr-1.5" />{copied ? L('Copiado', 'Copied') : L('Copiar', 'Copy')}</Button>
                  </div>
                )}

                {enrollments.length === 0 ? (
                  <p className="text-sm text-slate-500">{L('Aún no hay participantes en esta edición.', 'No participants in this edition yet.')}</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {enrollments.map((enrollment) => (
                      <li key={enrollment.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 break-words">{enrollment.full_name}</p>
                          <p className="text-sm text-slate-500 break-all">{enrollment.email} · {L('hasta', 'until')} {formatDate(enrollment.access_until, language)}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => resetPassword(enrollment)} title={L('Nueva contraseña', 'New password')}><KeyRound className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => removeEnrollment(enrollment)} title={L('Quitar acceso', 'Remove access')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          {/* Materials */}
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" />{L('Materiales', 'Materials')}</h2>
            <p className="text-sm text-slate-500 mb-5">{L('Los materiales son de cada curso y los ven todas sus ediciones.', 'Materials belong to each course and are shared by all its editions.')}</p>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{L('Curso', 'Course')}</label>
            <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className={`${inputClass} mt-2 mb-5`}>
              {COURSES.map((course) => <option key={course.id} value={course.id}>{getText(course.title, language)}</option>)}
            </select>

            <form onSubmit={addMaterial} className="grid gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={day} onChange={(event) => setDay(Number(event.target.value))} className={inputClass}>
                  {[0, 1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{dayLabel(value)}</option>)}
                </select>
                <select value={kind} onChange={(event) => setKind(event.target.value as 'file' | 'link')} className={inputClass}>
                  <option value="file">{L('Archivo (PDF, presentación…)', 'File (PDF, slides…)')}</option>
                  <option value="link">{L('Enlace (vídeo, web…)', 'Link (video, website…)')}</option>
                </select>
              </div>
              <input required minLength={2} maxLength={200} placeholder={L('Título', 'Title')} value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} />
              <input maxLength={1000} placeholder={L('Descripción breve (opcional)', 'Short description (optional)')} value={description} onChange={(event) => setDescription(event.target.value)} className={inputClass} />
              {kind === 'link' ? (
                <input type="url" placeholder="https://" value={url} onChange={(event) => setUrl(event.target.value)} className={inputClass} />
              ) : (
                <input key={fileInputKey} type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 file:font-semibold" />
              )}
              <Button type="submit" size="sm" isLoading={savingMaterial} className="justify-self-start">{kind === 'file' ? <Upload className="h-4 w-4 mr-1.5" /> : <Plus className="h-4 w-4 mr-1.5" />}{L('Añadir material', 'Add material')}</Button>
              {materialError && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{materialError}</p>}
            </form>

            {materialsByDay.length === 0 ? (
              <p className="text-sm text-slate-500">{L('Este curso aún no tiene materiales.', 'This course has no materials yet.')}</p>
            ) : materialsByDay.map((group) => (
              <div key={group.day} className="mb-5">
                <h3 className="text-sm font-bold text-slate-700 mb-2">{dayLabel(group.day)}</h3>
                <ul className="space-y-2">
                  {group.items.map((material) => (
                    <li key={material.id} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-100">
                      <button type="button" onClick={() => openMaterial(material).catch(() => setMaterialError(L('No se pudo abrir.', 'Could not open it.')))} className="text-left min-w-0 hover:text-blue-600">
                        <span className="font-medium break-words">{material.title}</span>
                        <span className="block text-xs text-slate-400">{material.kind === 'file' ? L('Archivo', 'File') : L('Enlace', 'Link')}</span>
                      </button>
                      <Button size="sm" variant="ghost" onClick={() => removeMaterial(material)} title={L('Borrar', 'Delete')}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminCampus;
