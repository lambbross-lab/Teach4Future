import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://www.teach4future.eu';
const DIST = new URL('../dist/', import.meta.url);

const courses = [
  { id: 'ai-education', category: 'Responsible AI', title: 'Practical and Responsible AI for Teachers', subtitle: 'Save time and design better learning without giving up professional judgement.', description: 'A hands-on course on using AI to plan, adapt resources and assess learning with attention to privacy, ethics and inclusive practice.', audience: 'Primary and secondary teachers, school leaders and ICT coordinators.', outcomes: ['Use generative AI for realistic teaching tasks', 'Create and adapt classroom resources', 'Review AI outputs with professional judgement', 'Apply basic privacy and responsible-use criteria'] },
  { id: 'inclusion-sen', category: 'Inclusion', title: 'Inclusion by Design', subtitle: 'Accessible learning environments that anticipate learner diversity.', description: 'Practical approaches to Universal Design for Learning, accessibility and classroom support for different ways of learning and participating.', audience: 'Teachers, inclusion coordinators and school leaders.', outcomes: ['Apply Universal Design for Learning principles', 'Identify barriers to participation', 'Adapt activities without lowering expectations', 'Strengthen belonging and classroom participation'] },
  { id: 'digital-citizenship', category: 'Digital citizenship', title: 'Digital Citizenship and Critical Thinking', subtitle: 'Teach students to navigate AI, information and digital life with confidence.', description: 'Classroom strategies for media literacy, misinformation, privacy, online safety and responsible participation in the digital world.', audience: 'Teachers, digital coordinators and school leadership teams.', outcomes: ['Recognise common forms of misinformation', 'Design media-literacy activities', 'Address privacy and online safety', 'Promote responsible digital participation'] },
  { id: 'europe-classroom', category: 'European cooperation', title: 'Europe in the Classroom', subtitle: 'Turn European cooperation into meaningful classroom learning.', description: 'A practical course on collaborative projects, active learning, intercultural dialogue, European values and the exchange of teaching practices.', audience: 'Teachers and internationalisation teams.', outcomes: ['Design collaborative European learning experiences', 'Use project-based and cooperative methodologies', 'Integrate intercultural dialogue and common values', 'Plan the transfer of learning back to school'] },
  { id: 'green-classroom', category: 'Sustainability', title: 'The Green Classroom', subtitle: 'Turn sustainability into projects that matter to learners and communities.', description: 'Sustainability education, outdoor learning and classroom projects connected to local environmental challenges and European cooperation.', audience: 'Primary, secondary and adult-education teachers.', outcomes: ['Connect sustainability with curriculum goals', 'Design outdoor and place-based learning', 'Create learner-led environmental projects', 'Share green practices across European schools'] },
  { id: 'wellbeing-teachers', category: 'Teacher wellbeing', title: 'Teacher Wellbeing and Positive School Climate', subtitle: 'Build sustainable ways of working and healthier learning environments.', description: 'Educational and preventive strategies for workload organisation, communication, emotional regulation, coexistence and a positive school climate.', audience: 'Teachers, tutors and school leadership teams.', outcomes: ['Identify factors that affect teacher wellbeing', 'Use sustainable organisation strategies', 'Improve communication and classroom climate', 'Create a realistic personal and school action plan'] },
];

const pages = [
  { path: 'courses-spain', title: 'Teacher training courses in Almería, Spain', description: 'Browse practical English-language teacher training courses in Almería, Spain, with real dates, places and transparent course information.', body: () => `<h1>Teacher training courses in Almería, Spain</h1><p>Practical five-day professional development courses in English for teachers from across Europe.</p><h2>Explore our courses</h2><ul>${courses.map((course) => `<li><a href="/course/${course.id}">${course.title}</a>: ${course.subtitle}</li>`).join('')}</ul>` },
  { path: 'dates', title: 'Course dates and availability', description: 'See upcoming Teach4Future teacher-training dates, locations, schedules and available places.', body: () => '<h1>Course dates and availability</h1><p>Find upcoming teacher-training sessions, locations, schedules and available places. Each confirmed session is updated as enrolments are confirmed.</p><p><a href="/courses-spain">Browse all teacher-training courses</a></p>' },
  { path: 'for-schools', title: 'Teacher training for schools', description: 'Plan practical professional development for your teaching team: open courses, tailored training and internationalisation support.', body: () => '<h1>Teacher training for schools</h1><p>Teach4Future helps schools plan practical professional development, open-course participation and tailored training for teaching teams.</p><p>Courses are contracted directly with Teach4Future. Final dates, venue and conditions are confirmed in writing.</p><p><a href="/contact">Contact Teach4Future about your school</a></p>' },
  { path: 'cities', title: 'Teacher training destination: Almería, Spain', description: 'Discover Almería, Spain, the current destination for Teach4Future teacher-training courses in English.', body: () => '<h1>Teacher training in Almería, Spain</h1><p>Teach4Future courses currently take place in Almería, a Mediterranean destination for practical teacher professional development.</p><p><a href="/courses-spain">Explore courses in Almería</a></p>' },
  { path: 'courses-europe', title: 'Teacher training courses across Europe', description: 'Tell us which European city and theme would work for your school. Teach4Future studies open editions based on interest and confirmed groups.', body: () => '<h1>Teacher training courses across Europe</h1><p>Tell us which European city and training theme would work for your school. Teach4Future studies open editions with local organisations, based on interest and confirmed groups.</p><p><a href="/contact">Register your interest</a></p>' },
  { path: 'about', title: 'About Teach4Future Academy', description: 'Meet Teach4Future Academy, an independent provider of practical professional development for educators.', body: () => '<h1>About Teach4Future Academy</h1><p>Teach4Future Academy is an independent provider of practical professional development for educators.</p><p><a href="/courses-spain">Explore our teacher-training courses</a></p>' },
  { path: 'faq', title: 'Teacher training FAQs', description: 'Answers to common questions about Teach4Future courses, sessions, places, direct contracting and practical arrangements.', body: () => '<h1>Teacher training FAQs</h1><p>Find answers about Teach4Future courses, available sessions, places, direct contracting and practical arrangements.</p><p><a href="/contact">Ask Teach4Future a question</a></p>' },
  { path: 'contact', title: 'Contact Teach4Future Academy', description: 'Ask Teach4Future about an open course, a tailored programme or teacher training for your school.', body: () => '<h1>Contact Teach4Future Academy</h1><p>Ask about an open teacher-training course, a tailored programme or professional development for your school.</p><p>Email <a href="mailto:teach4futureacademy@gmail.com">teach4futureacademy@gmail.com</a>.</p>' },
];

const spanishCourses = {
  'ai-education': { category: 'IA responsable', title: 'IA práctica y responsable para docentes', subtitle: 'Ahorra tiempo y diseña mejores aprendizajes sin renunciar al criterio profesional.', description: 'Un curso práctico para utilizar la IA en la planificación, la adaptación de materiales y la evaluación, atendiendo a la privacidad, la ética y la inclusión.', audience: 'Docentes de primaria y secundaria, equipos directivos y coordinación TIC.' },
  'inclusion-sen': { category: 'Inclusión', title: 'Inclusión por diseño', subtitle: 'Entornos de aprendizaje accesibles que anticipan la diversidad del alumnado.', description: 'Estrategias prácticas de Diseño Universal para el Aprendizaje, accesibilidad y apoyo en el aula para distintas formas de aprender y participar.', audience: 'Docentes, responsables de inclusión y equipos directivos.' },
  'digital-citizenship': { category: 'Ciudadanía digital', title: 'Ciudadanía digital y pensamiento crítico', subtitle: 'Ayuda a tu alumnado a desenvolverse ante la IA, la información y la vida digital.', description: 'Estrategias de aula sobre alfabetización mediática, desinformación, privacidad, seguridad y participación responsable en el entorno digital.', audience: 'Docentes, coordinación digital y equipos directivos.' },
  'europe-classroom': { category: 'Cooperación europea', title: 'Europa en el aula', subtitle: 'Convierte la cooperación europea en aprendizaje significativo para el aula.', description: 'Un curso práctico sobre proyectos colaborativos, aprendizaje activo, diálogo intercultural, valores europeos e intercambio de prácticas docentes.', audience: 'Docentes y equipos de internacionalización.' },
  'green-classroom': { category: 'Sostenibilidad', title: 'Aula verde', subtitle: 'Convierte la sostenibilidad en proyectos relevantes para el alumnado y la comunidad.', description: 'Educación para la sostenibilidad, aprendizaje al aire libre y proyectos conectados con retos ambientales locales y la cooperación europea.', audience: 'Docentes de primaria, secundaria y educación de personas adultas.' },
  'wellbeing-teachers': { category: 'Bienestar docente', title: 'Bienestar docente y clima escolar positivo', subtitle: 'Construye formas sostenibles de trabajar y entornos de aprendizaje más saludables.', description: 'Estrategias educativas y preventivas para la organización del trabajo, la comunicación, la regulación emocional, la convivencia y un clima escolar positivo.', audience: 'Docentes, tutorías y equipos directivos.' },
};

const spanishPages = [
  { path: 'cursos-espana', title: 'Cursos para docentes en Almería', description: 'Consulta cursos prácticos para docentes, impartidos en inglés en Almería, con fechas, plazas e información clara.', body: () => `<h1>Cursos para docentes en Almería</h1><p>Cursos prácticos de cinco días, impartidos en inglés para docentes de toda Europa.</p><h2>Explora los cursos</h2><ul>${courses.map((course) => `<li><a href="/es/curso/${course.id}">${spanishCourses[course.id].title}</a>: ${spanishCourses[course.id].subtitle}</li>`).join('')}</ul>` },
  { path: 'fechas', title: 'Fechas y disponibilidad', description: 'Consulta próximas fechas, ciudades, horarios y plazas disponibles de los cursos de Teach4Future.', body: () => '<h1>Fechas y disponibilidad</h1><p>Consulta próximas sesiones, ciudades, horarios y plazas disponibles. Las plazas se actualizan al confirmar matrículas.</p><p><a href="/es/cursos-espana">Ver todos los cursos</a></p>' },
  { path: 'para-colegios', title: 'Formación para centros educativos', description: 'Planifica formación práctica para tu equipo docente: cursos abiertos, formación a medida y apoyo a la internacionalización.', body: () => '<h1>Formación para centros educativos</h1><p>Teach4Future ayuda a los centros a planificar formación práctica, participación en cursos abiertos y propuestas para equipos docentes.</p><p><a href="/es/contacto">Contactar con Teach4Future</a></p>' },
  { path: 'ciudades', title: 'Formación docente en Almería', description: 'Descubre Almería, destino actual de los cursos de formación docente en inglés de Teach4Future.', body: () => '<h1>Formación docente en Almería</h1><p>Los cursos de Teach4Future se realizan actualmente en Almería, un destino mediterráneo para el desarrollo profesional docente.</p><p><a href="/es/cursos-espana">Explorar cursos en Almería</a></p>' },
  { path: 'cursos-europa', title: 'Cursos para docentes en Europa', description: 'Propón una ciudad europea y un tema para tu centro. Teach4Future estudia ediciones abiertas según el interés y los grupos confirmados.', body: () => '<h1>Cursos para docentes en Europa</h1><p>Propón una ciudad europea y un tema formativo para tu centro. Teach4Future estudia ediciones abiertas con entidades locales, según el interés y los grupos confirmados.</p><p><a href="/es/contacto">Registrar interés</a></p>' },
  { path: 'sobre-nosotros', title: 'Sobre Teach4Future Academy', description: 'Conoce Teach4Future Academy, proveedor independiente de formación práctica para docentes.', body: () => '<h1>Sobre Teach4Future Academy</h1><p>Teach4Future Academy es un proveedor independiente de formación práctica para docentes.</p><p><a href="/es/cursos-espana">Explorar cursos</a></p>' },
  { path: 'preguntas-frecuentes', title: 'Preguntas frecuentes sobre formación docente', description: 'Respuestas a preguntas frecuentes sobre cursos, sesiones, plazas, contratación directa y aspectos prácticos.', body: () => '<h1>Preguntas frecuentes sobre formación docente</h1><p>Respuestas a dudas sobre cursos, sesiones, plazas, contratación directa y aspectos prácticos.</p><p><a href="/es/contacto">Hacer una consulta</a></p>' },
  { path: 'contacto', title: 'Contacto con Teach4Future Academy', description: 'Consulta a Teach4Future sobre un curso abierto, una formación a medida o formación para tu centro.', body: () => '<h1>Contacto con Teach4Future Academy</h1><p>Consulta un curso abierto, una formación a medida o formación para tu centro.</p><p>Email: <a href="mailto:teach4futureacademy@gmail.com">teach4futureacademy@gmail.com</a>.</p>' },
];

const regionalCopy = {
  fr: {
    languageName: 'français', courseSuffix: 'Formation pour enseignants à Almería', courseIntro: 'Formation pratique de cinq jours dispensée en anglais à Almería, en Espagne.', catalogue: 'Formations en Espagne',
    courseTitles: { 'ai-education': 'IA pratique et responsable pour les enseignants', 'inclusion-sen': 'L’inclusion dès la conception', 'digital-citizenship': 'Citoyenneté numérique et pensée critique', 'europe-classroom': 'L’Europe en classe', 'green-classroom': 'La classe verte', 'wellbeing-teachers': 'Bien-être des enseignants et climat scolaire positif' },
    pages: [
      ['courses-spain', 'Formations pour enseignants à Almería', 'Découvrez des formations pratiques de cinq jours, en anglais, pour enseignants de toute l’Europe.', 'Explorer les formations'],
      ['dates', 'Dates et disponibilités', 'Consultez les prochaines sessions, les lieux, les horaires et les places disponibles.', 'Voir toutes les formations'],
      ['for-schools', 'Formation pour les établissements', 'Planifiez une formation pratique pour votre équipe pédagogique avec Teach4Future.', 'Contacter Teach4Future'],
      ['cities', 'Formation des enseignants à Almería', 'Les formations Teach4Future ont actuellement lieu à Almería, une destination méditerranéenne.', 'Découvrir les formations à Almería'],
      ['courses-europe', 'Formations pour enseignants en Europe', 'Proposez une ville européenne et un thème: nous étudions les éditions ouvertes avec des partenaires locaux.', 'Faire part de votre intérêt'],
      ['about', 'À propos de Teach4Future Academy', 'Teach4Future Academy est un prestataire indépendant de formation pratique pour les enseignants.', 'Découvrir les formations'],
      ['faq', 'Questions fréquentes sur les formations', 'Réponses aux questions sur les cours, les sessions, les places et la contractualisation directe.', 'Poser une question'],
      ['contact', 'Contacter Teach4Future Academy', 'Renseignez-vous sur un cours ouvert, une formation sur mesure ou une proposition pour votre établissement.', 'Écrire à Teach4Future'],
    ],
  },
  de: {
    languageName: 'Deutsch', courseSuffix: 'Fortbildung für Lehrkräfte in Almería', courseIntro: 'Praxisorientierter fünftägiger Kurs auf Englisch in Almería, Spanien.', catalogue: 'Kurse in Spanien',
    courseTitles: { 'ai-education': 'Praxisnahe und verantwortungsvolle KI für Lehrkräfte', 'inclusion-sen': 'Inklusion von Anfang an', 'digital-citizenship': 'Digitale Bürgerschaft und kritisches Denken', 'europe-classroom': 'Europa im Klassenzimmer', 'green-classroom': 'Das grüne Klassenzimmer', 'wellbeing-teachers': 'Wohlbefinden von Lehrkräften und positives Schulklima' },
    pages: [
      ['courses-spain', 'Fortbildungen für Lehrkräfte in Almería', 'Entdecken Sie praxisorientierte fünftägige Fortbildungen auf Englisch für Lehrkräfte aus ganz Europa.', 'Kurse entdecken'],
      ['dates', 'Termine und Verfügbarkeit', 'Informieren Sie sich über kommende Termine, Orte, Zeiten und freie Plätze.', 'Alle Kurse ansehen'],
      ['for-schools', 'Fortbildung für Schulen', 'Planen Sie mit Teach4Future praxisnahe Fortbildung für Ihr Kollegium.', 'Teach4Future kontaktieren'],
      ['cities', 'Fortbildung für Lehrkräfte in Almería', 'Teach4Future-Kurse finden derzeit in Almería, einer mediterranen Destination, statt.', 'Kurse in Almería entdecken'],
      ['courses-europe', 'Fortbildungen für Lehrkräfte in Europa', 'Nennen Sie uns eine europäische Stadt und ein Thema: Wir prüfen offene Ausgaben mit lokalen Partnern.', 'Interesse anmelden'],
      ['about', 'Über Teach4Future Academy', 'Teach4Future Academy ist ein unabhängiger Anbieter praxisorientierter Fortbildung für Lehrkräfte.', 'Kurse entdecken'],
      ['faq', 'Häufige Fragen zu Fortbildungen', 'Antworten zu Kursen, Terminen, Plätzen und direkter Beauftragung.', 'Eine Frage stellen'],
      ['contact', 'Teach4Future Academy kontaktieren', 'Fragen Sie nach einem offenen Kurs, einer maßgeschneiderten Fortbildung oder einem Angebot für Ihre Schule.', 'Teach4Future schreiben'],
    ],
  },
  it: {
    languageName: 'italiano', courseSuffix: 'Corso per docenti ad Almería', courseIntro: 'Corso pratico di cinque giorni in inglese ad Almería, in Spagna.', catalogue: 'Corsi in Spagna',
    courseTitles: { 'ai-education': 'IA pratica e responsabile per docenti', 'inclusion-sen': 'Inclusione progettata', 'digital-citizenship': 'Cittadinanza digitale e pensiero critico', 'europe-classroom': 'L’Europa in classe', 'green-classroom': 'L’aula verde', 'wellbeing-teachers': 'Benessere dei docenti e clima scolastico positivo' },
    pages: [
      ['courses-spain', 'Corsi per docenti ad Almería', 'Scopri corsi pratici di cinque giorni in inglese per docenti provenienti da tutta Europa.', 'Esplora i corsi'],
      ['dates', 'Date e disponibilità', 'Consulta le prossime sessioni, sedi, orari e posti disponibili.', 'Vedi tutti i corsi'],
      ['for-schools', 'Formazione per le scuole', 'Pianifica con Teach4Future una formazione pratica per il tuo team docente.', 'Contatta Teach4Future'],
      ['cities', 'Formazione docenti ad Almería', 'I corsi Teach4Future si svolgono attualmente ad Almería, una destinazione mediterranea.', 'Scopri i corsi ad Almería'],
      ['courses-europe', 'Corsi per docenti in Europa', 'Proponi una città europea e un tema: valutiamo edizioni aperte con enti locali.', 'Manifesta il tuo interesse'],
      ['about', 'Chi è Teach4Future Academy', 'Teach4Future Academy è un fornitore indipendente di formazione pratica per docenti.', 'Esplora i corsi'],
      ['faq', 'Domande frequenti sui corsi', 'Risposte su corsi, sessioni, posti e contrattazione diretta.', 'Fai una domanda'],
      ['contact', 'Contatta Teach4Future Academy', 'Chiedi informazioni su un corso aperto, una formazione su misura o una proposta per la tua scuola.', 'Scrivi a Teach4Future'],
    ],
  },
};

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function jsonLdForPage({ title, description, canonical, course, language }) {
  const breadcrumb = [{ '@type': 'ListItem', position: 1, name: 'Teach4Future Academy', item: SITE_URL }];
  const catalogue = language === 'es' ? 'Cursos en España' : regionalCopy[language]?.catalogue ?? 'Courses in Spain';
  const cataloguePath = language === 'es' ? 'es/cursos-espana' : `${language}/courses-spain`;
  if (course) breadcrumb.push({ '@type': 'ListItem', position: 2, name: catalogue, item: `${SITE_URL}/${cataloguePath}` }, { '@type': 'ListItem', position: 3, name: course.title, item: canonical });
  else breadcrumb.push({ '@type': 'ListItem', position: 2, name: title, item: canonical });
  return JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumb },
    ...(course ? [{ '@context': 'https://schema.org', '@type': 'Course', name: course.title, description: course.description, url: canonical, inLanguage: language === 'es' ? 'es' : 'en', courseMode: 'onsite', timeRequired: 'P5D', provider: { '@type': 'Organization', name: 'Teach4Future Academy', url: SITE_URL }, offers: { '@type': 'Offer', price: '480', priceCurrency: 'EUR', url: canonical } }] : []),
  ]).replaceAll('<', '\\u003c');
}

function renderSnapshot({ title, description, canonical, body, course, language, alternate, alternates }) {
  const structuredData = jsonLdForPage({ title, description, canonical, course, language });
  const navigation = language === 'es' ? '<a href="/es/cursos-espana">Cursos para docentes</a> · <a href="/es/fechas">Fechas y disponibilidad</a> · <a href="/es/contacto">Contacto</a>' : language === 'fr' ? '<a href="/fr/courses-spain">Formations pour enseignants</a> · <a href="/fr/dates">Dates et disponibilités</a> · <a href="/fr/contact">Contact</a>' : language === 'de' ? '<a href="/de/courses-spain">Fortbildungen für Lehrkräfte</a> · <a href="/de/dates">Termine und Verfügbarkeit</a> · <a href="/de/contact">Kontakt</a>' : language === 'it' ? '<a href="/it/courses-spain">Corsi per docenti</a> · <a href="/it/dates">Date e disponibilità</a> · <a href="/it/contact">Contatti</a>' : '<a href="/en/courses-spain">Teacher training courses</a> · <a href="/en/dates">Dates and availability</a> · <a href="/en/contact">Contact</a>';
  const staticContent = `<main data-seo-snapshot="true"><article><p>Teach4Future Academy</p>${body}<p>${navigation}</p></article></main>`;
  const languageLinks = (alternates?.length ? alternates : [{ language, url: canonical }, alternate])
    .map((item) => `<link rel="alternate" hreflang="${item.language}" href="${item.url}" />`)
    .join('');
  return baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)} | Teach4Future Academy</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace('<html lang="en">', `<html lang="${language}">`)
    .replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>/g, '')
    .replace('</head>', `${languageLinks}<link rel="alternate" hreflang="x-default" href="${SITE_URL}/en" /><script type="application/ld+json" data-page-structured-data="true">${structuredData}</script></head>`)
    .replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);
}

const baseHtml = await readFile(new URL('index.html', DIST), 'utf8');
const englishCoursePage = (course) => ({
  path: `en/course/${course.id}`,
  title: `${course.title} | Teacher training in Almería`,
  description: `${course.subtitle} A practical 5-day course taught in English in Almería, Spain.`,
  course,
  language: 'en',
  alternate: { language: 'es', url: `${SITE_URL}/es/curso/${course.id}` },
  body: `<h1>${escapeHtml(course.title)}</h1><p>${escapeHtml(course.subtitle)}</p><h2>About this course</h2><p>${escapeHtml(course.description)}</p><h2>Course information</h2><ul><li>Language: English</li><li>Duration: 5 days (25 guided hours)</li><li>Location: Almería, Spain</li><li>Price: 480 EUR, final price, VAT included if applicable</li><li>For: ${escapeHtml(course.audience)}</li></ul><h2>Learning outcomes</h2><ul>${course.outcomes.map((outcome) => `<li>${escapeHtml(outcome)}</li>`).join('')}</ul><p><a href="/en/dates">See available sessions and places</a></p>`,
});

const spanishCoursePage = (course) => {
  const copy = spanishCourses[course.id];
  return {
    path: `es/curso/${course.id}`,
    title: `${copy.title} | Curso para docentes en Almería`,
    description: `${copy.subtitle} Curso práctico de 5 días impartido en inglés en Almería, España.`,
    course: { ...course, ...copy, outcomes: [] },
    language: 'es',
    alternate: { language: 'en', url: `${SITE_URL}/en/course/${course.id}` },
    body: `<h1>${escapeHtml(copy.title)}</h1><p>${escapeHtml(copy.subtitle)}</p><h2>Sobre el curso</h2><p>${escapeHtml(copy.description)}</p><h2>Información del curso</h2><ul><li>Idioma: inglés</li><li>Duración: 5 días (25 horas lectivas guiadas)</li><li>Lugar: Almería, España</li><li>Precio: 480 EUR, precio final, IVA incluido si procede</li><li>Dirigido a: ${escapeHtml(copy.audience)}</li></ul><p>Consulta objetivos, programa de cinco días, metodología y sesiones disponibles en la ficha completa del curso.</p><p><a href="/es/fechas">Ver sesiones y plazas disponibles</a></p>`,
  };
};

const englishPage = (page) => ({
  ...page,
  path: `en/${page.path}`,
  language: 'en',
  canonical: `${SITE_URL}/en/${page.path}`,
  alternate: { language: 'es', url: `${SITE_URL}/es/${({ 'courses-spain': 'cursos-espana', 'courses-europe': 'cursos-europa', cities: 'ciudades', dates: 'fechas', 'for-schools': 'para-colegios', about: 'sobre-nosotros', faq: 'preguntas-frecuentes', contact: 'contacto' })[page.path]}` },
});

const spanishPage = (page) => ({
  ...page,
  path: `es/${page.path}`,
  language: 'es',
  canonical: `${SITE_URL}/es/${page.path}`,
  alternate: { language: 'en', url: `${SITE_URL}/en/${({ 'cursos-espana': 'courses-spain', 'cursos-europa': 'courses-europe', ciudades: 'cities', fechas: 'dates', 'para-colegios': 'for-schools', 'sobre-nosotros': 'about', 'preguntas-frecuentes': 'faq', contacto: 'contact' })[page.path]}` },
});

const regionalCoursePage = (course, language) => {
  const copy = regionalCopy[language];
  const title = copy.courseTitles[course.id];
  return {
    path: `${language}/course/${course.id}`,
    title: `${title} | ${copy.courseSuffix}`,
    description: `${course.subtitle} ${copy.courseIntro}`,
    course: { ...course, title },
    language,
    alternate: { language: 'en', url: `${SITE_URL}/en/course/${course.id}` },
    body: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(copy.courseIntro)}</p><h2>${language === 'fr' ? 'À propos de cette formation' : language === 'de' ? 'Über diesen Kurs' : 'Informazioni sul corso'}</h2><p>${escapeHtml(course.description)}</p><h2>${language === 'fr' ? 'Informations pratiques' : language === 'de' ? 'Kursinformationen' : 'Informazioni pratiche'}</h2><ul><li>${language === 'fr' ? 'Langue' : language === 'de' ? 'Sprache' : 'Lingua'}: English</li><li>${language === 'fr' ? 'Durée' : language === 'de' ? 'Dauer' : 'Durata'}: 5 ${language === 'de' ? 'Tage' : 'days'} (25 guided hours)</li><li>${language === 'fr' ? 'Lieu' : language === 'de' ? 'Ort' : 'Sede'}: Almería, Spain</li><li>${language === 'fr' ? 'Prix' : language === 'de' ? 'Preis' : 'Prezzo'}: 480 EUR, ${language === 'fr' ? 'prix final, TVA incluse si applicable' : language === 'de' ? 'Endpreis, inkl. MwSt. falls zutreffend' : 'prezzo finale, IVA inclusa se applicabile'}</li></ul><p><a href="/${language}/dates">${language === 'fr' ? 'Voir les sessions et places disponibles' : language === 'de' ? 'Verfügbare Termine und Plätze ansehen' : 'Vedi sessioni e posti disponibili'}</a></p>`,
  };
};

const regionalPage = (language, [path, title, description, cta]) => ({
  path: `${language}/${path}`,
  language,
  canonical: `${SITE_URL}/${language}/${path}`,
  title,
  description,
  alternate: { language: 'en', url: `${SITE_URL}/en/${path}` },
  body: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><p><a href="/${language}/contact">${escapeHtml(cta)}</a></p>`,
});

const outputs = [
  { path: 'en', title: 'Teacher training courses in Almería, Spain', description: 'Practical 5-day teacher training courses in English in Almería, Spain.', language: 'en', alternate: { language: 'es', url: `${SITE_URL}/es` }, body: '<h1>Teacher training courses in Almería, Spain</h1><p>Practical professional development in English for teachers from across Europe.</p>', canonical: `${SITE_URL}/en` },
  { path: 'es', title: 'Cursos para docentes en Almería', description: 'Cursos prácticos de 5 días en inglés para docentes en Almería.', language: 'es', alternate: { language: 'en', url: `${SITE_URL}/en` }, body: '<h1>Cursos para docentes en Almería</h1><p>Formación práctica en inglés para docentes de toda Europa.</p>', canonical: `${SITE_URL}/es` },
  ...courses.flatMap((course) => [englishCoursePage(course), spanishCoursePage(course)]),
  ...pages.map(englishPage),
  ...spanishPages.map(spanishPage),
  ...Object.keys(regionalCopy).flatMap((language) => [
    { path: language, title: regionalCopy[language].pages[0][1], description: regionalCopy[language].pages[0][2], language, canonical: `${SITE_URL}/${language}`, alternate: { language: 'en', url: `${SITE_URL}/en` }, body: `<h1>${escapeHtml(regionalCopy[language].pages[0][1])}</h1><p>${escapeHtml(regionalCopy[language].pages[0][2])}</p>` },
    ...courses.map((course) => regionalCoursePage(course, language)),
    ...regionalCopy[language].pages.map((page) => regionalPage(language, page)),
  ]),
];

const spanishRouteKeys = { 'cursos-espana': 'courses-spain', 'cursos-europa': 'courses-europe', ciudades: 'cities', fechas: 'dates', 'para-colegios': 'for-schools', 'sobre-nosotros': 'about', 'preguntas-frecuentes': 'faq', contacto: 'contact' };
const contentKey = (page) => {
  const [language, ...rest] = page.path.split('/');
  if (rest.length === 0) return 'home';
  const route = rest.join('/');
  if (language === 'es') return route.startsWith('curso/') ? `course/${route.slice('curso/'.length)}` : spanishRouteKeys[route] ?? route;
  return route;
};
const alternatesFor = (page) => outputs.filter((candidate) => contentKey(candidate) === contentKey(page)).map((candidate) => ({ language: candidate.language, url: candidate.canonical ?? `${SITE_URL}/${candidate.path}` }));

await Promise.all(outputs.map(async (page) => {
  const canonical = page.canonical ?? `${SITE_URL}/${page.path}`;
  const filePath = new URL(`${page.path}/index.html`, DIST);
  await mkdir(dirname(fileURLToPath(filePath)), { recursive: true });
  await writeFile(filePath, renderSnapshot({ ...page, canonical, alternates: alternatesFor(page), body: typeof page.body === 'function' ? page.body() : page.body }), 'utf8');
}));

const sitemapEntries = outputs.map((page) => {
  const canonical = page.canonical ?? `${SITE_URL}/${page.path}`;
  const alternateLinks = alternatesFor(page).map((item) => `<xhtml:link rel="alternate" hreflang="${item.language}" href="${item.url}"/>`).join('');
  return `  <url><loc>${canonical}</loc><lastmod>2026-10-08</lastmod><priority>${page.course ? '0.8' : page.path === 'en' || page.path === 'es' ? '1.0' : '0.7'}</priority>${alternateLinks}</url>`;
}).join('\n');
await writeFile(new URL('sitemap.xml', DIST), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`, 'utf8');

console.log(`Prerendered ${outputs.length} public SEO routes.`);
