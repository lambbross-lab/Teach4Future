import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COURSES } from '../mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../lib/utils';

const SITE_URL = 'https://www.teach4future.eu';

const PAGE_SEO: Record<string, { en: { title: string; description: string }; es: { title: string; description: string } }> = {
  '/': {
    en: { title: 'Teacher training courses in Almería, Spain', description: 'Practical 5-day teacher training courses in English in Almería, Spain. Explore responsible AI, inclusion, digital citizenship, sustainability and European classroom practice.' },
    es: { title: 'Cursos para docentes en Almería', description: 'Cursos prácticos de 5 días en inglés para docentes en Almería. Explora IA responsable, inclusión, ciudadanía digital, sostenibilidad y dimensión europea.' },
  },
  '/courses-spain': {
    en: { title: 'Teacher training courses in Almería', description: 'Browse practical English-language teacher training courses in Almería, Spain, with real dates, places and transparent course information.' },
    es: { title: 'Cursos para docentes en Almería', description: 'Consulta cursos prácticos para docentes, impartidos en inglés en Almería, con fechas, plazas e información clara.' },
  },
  '/courses-europe': {
    en: { title: 'Teacher training courses across Europe', description: 'Tell us which European city and theme would work for your school. Teach4Future studies open editions based on interest and confirmed groups.' },
    es: { title: 'Cursos para docentes en Europa', description: 'Propón una ciudad europea y un tema para tu centro. Teach4Future estudia ediciones abiertas según el interés y los grupos confirmados.' },
  },
  '/dates': {
    en: { title: 'Course dates and availability', description: 'See upcoming Teach4Future teacher-training dates, locations, schedules and available places.' },
    es: { title: 'Fechas y disponibilidad', description: 'Consulta próximas fechas, ciudades, horarios y plazas disponibles de los cursos de Teach4Future.' },
  },
  '/for-schools': {
    en: { title: 'Teacher training for schools', description: 'Plan practical professional development for your teaching team: open courses, tailored training and internationalisation support.' },
    es: { title: 'Formación para centros educativos', description: 'Planifica formación práctica para tu equipo docente: cursos abiertos, formación a medida y apoyo a la internacionalización.' },
  },
  '/cities': {
    en: { title: 'Teacher training destinations', description: 'Discover the learning destinations offered by Teach4Future, starting with Almería on Spain’s Mediterranean coast.' },
    es: { title: 'Ciudades para tu formación docente', description: 'Descubre los destinos de formación de Teach4Future, comenzando por Almería, en la costa mediterránea.' },
  },
  '/about': {
    en: { title: 'About Teach4Future Academy', description: 'Meet Teach4Future Academy, an independent provider of practical professional development for educators.' },
    es: { title: 'Sobre Teach4Future Academy', description: 'Conoce Teach4Future Academy, proveedor independiente de formación práctica para docentes.' },
  },
  '/faq': {
    en: { title: 'Teacher training FAQs', description: 'Answers to common questions about Teach4Future courses, sessions, places, direct contracting and practical arrangements.' },
    es: { title: 'Preguntas frecuentes', description: 'Respuestas a preguntas frecuentes sobre cursos, sesiones, plazas, contratación directa y aspectos prácticos.' },
  },
  '/contact': {
    en: { title: 'Contact Teach4Future Academy', description: 'Ask Teach4Future about an open course, a tailored programme or teacher training for your school.' },
    es: { title: 'Contacto', description: 'Consulta a Teach4Future sobre un curso abierto, una formación a medida o formación para tu centro.' },
  },
};

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

const Seo = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const courseId = pathname.match(/^\/course\/([^/]+)$/)?.[1];
    const course = courseId ? COURSES.find((item) => item.id === courseId) : undefined;
    const page = course
      ? {
          title: `${getText(course.title, language)} | ${language === 'es' ? 'Curso para docentes en Almería' : 'Teacher training course in Almería'}`,
          description: `${getText(course.subtitle, language)} ${language === 'es' ? 'Curso de 5 días impartido en inglés en Almería, España.' : 'A 5-day course taught in English in Almería, Spain.'}`,
        }
      : PAGE_SEO[pathname]?.[language] ?? PAGE_SEO['/'][language];
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    document.title = `${page.title} | Teach4Future Academy`;
    setMeta('name', 'description', page.description);
    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:locale', language === 'es' ? 'es_ES' : 'en_GB');
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);

    const privateRoute = ['/admin', '/login', '/reset-password', '/campus', '/enrol'].some((route) => pathname === route || pathname.startsWith(`${route}/`));
    setMeta('name', 'robots', privateRoute ? 'noindex, nofollow' : 'index, follow');

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonical;

    const oldStructuredData = document.head.querySelector('script[data-page-structured-data]');
    oldStructuredData?.remove();
    const breadcrumbItems = course
      ? [
          { name: 'Teach4Future Academy', item: SITE_URL },
          { name: language === 'es' ? 'Cursos en España' : 'Courses in Spain', item: `${SITE_URL}/courses-spain` },
          { name: getText(course.title, language), item: canonical },
        ]
      : [
          { name: 'Teach4Future Academy', item: SITE_URL },
          ...(pathname === '/' ? [] : [{ name: page.title, item: canonical }]),
        ];
    const structuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.item,
        })),
      },
      ...(course ? [{
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: getText(course.title, language),
        description: getText(course.description, language),
        url: canonical,
        image: course.courseImage,
        inLanguage: 'en',
        courseMode: 'onsite',
        timeRequired: 'P5D',
        provider: {
          '@type': 'Organization',
          name: 'Teach4Future Academy',
          url: SITE_URL,
        },
        offers: {
          '@type': 'Offer',
          price: String(course.price),
          priceCurrency: 'EUR',
          url: canonical,
        },
      }] : []),
    ];
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.pageStructuredData = 'true';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [language, pathname]);

  return null;
};

export default Seo;
