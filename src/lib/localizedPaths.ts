export type SiteLanguage = 'en' | 'es' | 'fr' | 'de' | 'it';

export const SUPPORTED_LANGUAGES: SiteLanguage[] = ['en', 'es', 'fr', 'de', 'it'];

const SPANISH_PATHS: Record<string, string> = {
  '/courses-spain': '/cursos-espana',
  '/courses-europe': '/cursos-europa',
  '/cities': '/ciudades',
  '/dates': '/fechas',
  '/for-schools': '/para-colegios',
  '/about': '/sobre-nosotros',
  '/faq': '/preguntas-frecuentes',
  '/contact': '/contacto',
  '/legal-notice': '/aviso-legal',
  '/privacy': '/privacidad',
  '/cookies': '/cookies',
  '/terms': '/condiciones',
};

export function getRouteLanguage(pathname: string): SiteLanguage | undefined {
  const match = pathname.match(/^\/(en|es|fr|de|it)(?:\/|$)/);
  return match?.[1] as SiteLanguage | undefined;
}

export function normalizeLocalizedPath(pathname: string): string {
  const english = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (!pathname.startsWith('/es')) return english;

  const spanishPath = pathname.replace(/^\/es(?=\/|$)/, '') || '/';
  if (spanishPath.startsWith('/curso/')) return `/course/${spanishPath.slice('/curso/'.length)}`;
  const match = Object.entries(SPANISH_PATHS).find(([, value]) => value === spanishPath);
  return match?.[0] ?? spanishPath;
}

export function localizePath(path: string, language: SiteLanguage): string {
  if (!path.startsWith('/') || path.startsWith('/admin') || path.startsWith('/campus') || path.startsWith('/login') || path.startsWith('/reset-password') || path.startsWith('/enrol')) return path;

  const [pathname, suffix = ''] = path.split(/(?=[?#])/);
  const normalPath = normalizeLocalizedPath(pathname);
  const translatedPath = language === 'es'
    ? (normalPath.startsWith('/course/') ? `/curso/${normalPath.slice('/course/'.length)}` : SPANISH_PATHS[normalPath] ?? normalPath)
    : normalPath;
  return `/${language}${translatedPath === '/' ? '' : translatedPath}${suffix}`;
}
