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

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function jsonLdForPage({ title, description, canonical, course }) {
  const breadcrumb = [{ '@type': 'ListItem', position: 1, name: 'Teach4Future Academy', item: SITE_URL }];
  if (course) breadcrumb.push({ '@type': 'ListItem', position: 2, name: 'Courses in Spain', item: `${SITE_URL}/courses-spain` }, { '@type': 'ListItem', position: 3, name: course.title, item: canonical });
  else breadcrumb.push({ '@type': 'ListItem', position: 2, name: title, item: canonical });
  return JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumb },
    ...(course ? [{ '@context': 'https://schema.org', '@type': 'Course', name: course.title, description: course.description, url: canonical, inLanguage: 'en', courseMode: 'onsite', timeRequired: 'P5D', provider: { '@type': 'Organization', name: 'Teach4Future Academy', url: SITE_URL }, offers: { '@type': 'Offer', price: '480', priceCurrency: 'EUR', url: canonical } }] : []),
  ]).replaceAll('<', '\\u003c');
}

function renderSnapshot({ title, description, canonical, body, course }) {
  const structuredData = jsonLdForPage({ title, description, canonical, course });
  const staticContent = `<main data-seo-snapshot="true"><article><p>Teach4Future Academy</p>${body}<p><a href="/courses-spain">Teacher training courses</a> · <a href="/dates">Dates and availability</a> · <a href="/contact">Contact</a></p></article></main>`;
  return baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)} | Teach4Future Academy</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace('</head>', `<script type="application/ld+json" data-page-structured-data="true">${structuredData}</script></head>`)
    .replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);
}

const baseHtml = await readFile(new URL('index.html', DIST), 'utf8');
const outputs = [
  ...courses.map((course) => ({
    path: `course/${course.id}`,
    title: `${course.title} | Teacher training in Almería`,
    description: `${course.subtitle} A practical 5-day course taught in English in Almería, Spain.`,
    course,
    body: `<h1>${escapeHtml(course.title)}</h1><p>${escapeHtml(course.subtitle)}</p><h2>About this course</h2><p>${escapeHtml(course.description)}</p><h2>Course information</h2><ul><li>Language: English</li><li>Duration: 5 days (25 guided hours)</li><li>Location: Almería, Spain</li><li>Price: 480 EUR, final price, VAT included if applicable</li><li>For: ${escapeHtml(course.audience)}</li></ul><h2>Learning outcomes</h2><ul>${course.outcomes.map((outcome) => `<li>${escapeHtml(outcome)}</li>`).join('')}</ul><p><a href="/dates">See available sessions and places</a></p>`,
  })),
  ...pages.map((page) => ({ ...page, canonical: `${SITE_URL}/${page.path}` })),
];

await Promise.all(outputs.map(async (page) => {
  const canonical = page.canonical ?? `${SITE_URL}/${page.path}`;
  const filePath = new URL(`${page.path}/index.html`, DIST);
  await mkdir(dirname(fileURLToPath(filePath)), { recursive: true });
  await writeFile(filePath, renderSnapshot({ ...page, canonical, body: typeof page.body === 'function' ? page.body() : page.body }), 'utf8');
}));

console.log(`Prerendered ${outputs.length} public SEO routes.`);
