import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowDown, CheckCircle2, Clock, Globe, Info,
  Lightbulb, MapPin, MessageCircle, Users
} from 'lucide-react';
import { COURSES, CITIES } from '../mockData';
import { COURSE_CURRICULA } from '../courseCurricula';
import { cn, formatDate, getText, isCurrentOrUpcoming } from '../lib/utils';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAcademyData } from '../contexts/AcademyDataContext';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { sessions } = useAcademyData();
  const course = COURSES.find((item) => item.id === id);

  if (!course) return <Navigate to="/courses-spain" replace />;

  const courseSessions = sessions
    .filter((session) => session.courseId === course.id && isCurrentOrUpcoming(session.endDate))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const curriculum = COURSE_CURRICULA[course.id];

  const getScheduleLabel = (schedule: string) => {
    if (schedule === 'morning') return t('common.morning');
    if (schedule === 'afternoon') return t('common.afternoon');
    return t('common.scheduleTbc');
  };

  const getStatusLabel = (status: string) => {
    if (status === 'Open') return t('admin.status.open');
    if (status === 'Almost Full') return t('admin.status.almostFull');
    if (status === 'Waiting List') return t('admin.status.waitingList');
    return t('admin.status.closed');
  };

  return (
    <div className="bg-white pt-24 pb-20">
      <section className="border-b border-slate-100 bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">{t(`categories.${course.category.toLowerCase()}`)}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center font-medium text-slate-500"><Clock className="mr-1.5 h-4 w-4" />{getText(course.duration, language)}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center font-medium text-slate-500"><Globe className="mr-1.5 h-4 w-4" />{language === 'es' ? 'Inglés' : course.language}</span>
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-5xl">{getText(course.title, language)}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{getText(course.subtitle, language)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#sessions"><Button size="lg">{t('courseDetail.chooseSession')} <ArrowDown className="ml-2 h-4 w-4" /></Button></a>
                <Link to={`/contact?course=${course.id}`}><Button size="lg" variant="outline">{t('courseDetail.askAboutCourse')}</Button></Link>
              </div>
              <nav aria-label={t('courseDetail.pageNavigation')} className="mt-10 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-500">
                <a className="transition hover:text-blue-600" href="#about">{t('courseDetail.about')}</a>
                <a className="transition hover:text-blue-600" href="#programme">{t('courseDetail.programme')}</a>
                <a className="transition hover:text-blue-600" href="#sessions">{t('courseDetail.sessions')}</a>
                <a className="transition hover:text-blue-600" href="#practical">{t('courseDetail.practicalInfo')}</a>
                <a className="transition hover:text-blue-600" href="#questions">{t('courseDetail.questions')}</a>
              </nav>
            </div>

            <aside className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50">
              <h2 className="flex items-center text-base font-bold text-slate-900"><Info className="mr-2 h-5 w-5 text-blue-600" />{t('courseDetail.heroSnapshot')}</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div><dt className="text-slate-500">{t('courseDetail.audience')}</dt><dd className="mt-1 font-bold leading-relaxed text-slate-900">{getText(course.targetAudience, language)}</dd></div>
                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4"><div><dt className="text-xs text-slate-500">{t('courseDetail.duration')}</dt><dd className="mt-1 font-bold text-slate-900">{getText(course.duration, language)}</dd></div><div><dt className="text-xs text-slate-500">{t('courseDetail.language')}</dt><dd className="mt-1 font-bold text-slate-900">{language === 'es' ? 'Inglés' : course.language}</dd></div></div>
                <div><dt className="text-slate-500">{t('courseDetail.price')}</dt><dd className="mt-1 text-lg font-extrabold text-slate-950">{course.price}€ <span className="text-xs font-medium text-slate-500">· {t('common.finalPrice')}</span></dd></div>
              </dl>
              <a href="#sessions" className="mt-6 block"><Button className="w-full">{t('courseDetail.viewAllSessions')}</Button></a>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">{t('courseDetail.contractNote')}</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="sessions" className="scroll-mt-28 border-b border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{t('courseDetail.bookingEyebrow')}</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{t('courseDetail.sessions')}</h2></div><p className="max-w-md text-sm leading-relaxed text-slate-500">{t('courseDetail.sessionsHelp')}</p></div>
          {courseSessions.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{courseSessions.map((session) => {
            const city = CITIES.find((item) => item.id === session.cityId);
            return <article key={session.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-slate-200/60">
              <div className="flex items-start justify-between gap-4"><div><p className="flex items-center text-sm font-bold text-slate-900"><MapPin className="mr-1.5 h-4 w-4 text-blue-600" />{city?.name}</p><p className="mt-2 text-sm leading-relaxed text-slate-600">{formatDate(session.startDate, language)} — {formatDate(session.endDate, language)}</p></div><span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', session.status === 'Open' ? 'bg-green-50 text-green-700' : session.status === 'Almost Full' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700')}>{getStatusLabel(session.status)}</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-sm"><div className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" /><span className="font-medium text-slate-700">{getScheduleLabel(session.schedule)}</span></div><div className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" /><span className="font-medium text-slate-700">{session.seatsLeft} {t('common.seatsLeft')}</span></div></div>
              <div className="mt-5 flex items-center justify-between gap-4"><div><p className="text-xl font-extrabold text-slate-950">{course.price}€</p><p className="text-[11px] font-medium text-slate-500">{t('common.finalPrice')}</p></div><Link to={`/enrol?course=${course.id}&session=${session.id}`}><Button size="sm" disabled={session.status === 'Closed'}>{t('common.enrol')}</Button></Link></div>
            </article>;
          })}</div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center"><p className="font-bold text-slate-900">{t('courseDetail.onDemandTitle')}</p><p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{t('courseDetail.onDemandDesc')}</p></div>}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
          <main className="space-y-16">
            <section id="about" className="scroll-mt-28"><div className="grid gap-8 md:grid-cols-[1.1fr_.9fr] md:items-start"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{t('courseDetail.aboutEyebrow')}</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{t('courseDetail.about')}</h2><p className="mt-6 leading-relaxed text-slate-600">{getText(course.description, language)}</p></div><div className="aspect-[4/3] overflow-hidden rounded-3xl"><img src={course.courseImage} alt={getText(course.title, language)} className="h-full w-full object-cover" referrerPolicy="no-referrer" /></div></div><div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5"><h3 className="flex items-center font-bold text-blue-950"><Lightbulb className="mr-2 h-5 w-5 text-blue-600" />{t('courseDetail.relevance')}</h3><p className="mt-3 text-sm leading-relaxed text-blue-900">{getText(course.erasmusRelevance, language)}</p></div></section>

            <section id="programme" className="scroll-mt-28"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{t('courseDetail.programmeEyebrow')}</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{t('courseDetail.programme')}</h2><p className="mt-3 max-w-2xl text-slate-600">{t('courseDetail.programmeIntro')}</p><ol className="mt-8 space-y-4">{curriculum.dailyProgramme.map((day, index) => <li key={index} className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6"><div className="grid gap-5 md:grid-cols-[5.25rem_minmax(0,1fr)]"><div><span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t('courseDetail.day')} {index + 1}</span></div><div><h3 className="text-xl font-bold text-slate-950">{getText(day.title, language)}</h3><p className="mt-2 leading-relaxed text-slate-600">{getText(day.focus, language)}</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{day.activities.map((activity, activityIndex) => <li key={activityIndex} className="flex gap-2 text-sm leading-relaxed text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />{getText(activity, language)}</li>)}</ul><div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm"><span className="font-bold text-slate-950">{t('courseDetail.dayTakeaway')} </span><span className="text-slate-700">{getText(day.takeaway, language)}</span></div></div></div></li>)}</ol></section>

            <section id="outcomes" className="scroll-mt-28"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{t('courseDetail.takeAwayEyebrow')}</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{t('courseDetail.outcomes')}</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{course.learningOutcomes.map((outcome, index) => <div key={index} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" /><p className="text-sm leading-relaxed text-slate-700">{getText(outcome, language)}</p></div>)}</div></section>

            <section id="methodology" className="scroll-mt-28 rounded-3xl bg-slate-950 p-6 text-white md:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{t('courseDetail.methodologyEyebrow')}</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight">{t('courseDetail.methodology')}</h2><ul className="mt-6 grid gap-4 md:grid-cols-3">{curriculum.methodology.map((item, index) => <li key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200"><span className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-300 font-extrabold text-slate-950">{index + 1}</span>{getText(item, language)}</li>)}</ul></section>
          </main>

          <aside id="practical" className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start"><div className="rounded-3xl bg-slate-950 p-6 text-white"><h2 className="text-lg font-bold">{t('courseDetail.included')}</h2><ul className="mt-4 space-y-3">{course.includes.map((item, index) => <li key={index} className="flex gap-2 text-sm leading-relaxed text-slate-200"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{getText(item, language)}</li>)}</ul><div className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-slate-300"><p className="font-bold text-white">{t('courseDetail.certificate')}</p><p className="mt-1">{t('courseDetail.certificateValue')}</p></div></div></aside>
        </div>
      </section>

      <section id="questions" className="scroll-mt-28 border-t border-slate-100 bg-slate-50 py-16"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{t('courseDetail.questionsEyebrow')}</p><h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-950">{t('courseDetail.questions')}</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{['questionOne', 'questionTwo', 'questionThree'].map((key) => <div key={key} className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">{t(`courseDetail.${key}Title`)}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{t(`courseDetail.${key}Text`)}</p></div>)}</div><div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-3xl bg-blue-600 p-6 text-white sm:flex-row"><div><h3 className="font-bold">{t('courseDetail.customGroup')}</h3><p className="mt-1 text-sm text-blue-100">{t('courseDetail.customGroupDesc')}</p></div><Link to={`/contact?course=${course.id}`}><Button className="bg-white text-slate-950 hover:bg-slate-100"><MessageCircle className="mr-2 h-4 w-4" />{t('courseDetail.contactTeam')}</Button></Link></div></div></section>
    </div>
  );
};

export default CourseDetail;
