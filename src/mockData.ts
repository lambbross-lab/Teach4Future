
import { Course, City, FAQItem } from './types';

// City Images: We use local static assets for maximum reliability.
export const CITIES: City[] = [
  {
    id: 'almeria',
    name: 'Almería',
    description: {
      en: 'A hidden gem on the Mediterranean coast with the only desert in Europe and stunning beaches.',
      es: 'Una joya escondida en la costa mediterránea con el único desierto de Europa y playas impresionantes.'
    },
    highlights: [
      { en: 'Alcazaba Fortress', es: 'Fortaleza de la Alcazaba' },
      { en: 'Cabo de Gata Natural Park', es: 'Parque Natural de Cabo de Gata' },
      { en: 'Mediterranean Gastronomy', es: 'Gastronomía Mediterránea' },
      { en: '3000 hours of sun', es: '3000 horas de sol' }
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Playa_de_M%C3%B3nsul%2C_San_Jos%C3%A9%2C_Almer%C3%ADa.jpg',
    imageAlt: 'Playa de Mónsul en Almería'
  },
  {
    id: 'granada',
    name: 'Granada',
    description: {
      en: 'The city of the Alhambra, where history meets vibrant student life at the foot of Sierra Nevada.',
      es: 'La ciudad de la Alhambra, donde la historia se encuentra con una vibrante vida estudiantil al pie de Sierra Nevada.'
    },
    highlights: [
      { en: 'Alhambra & Generalife', es: 'Alhambra y Generalife' },
      { en: 'Albaicín Quarter', es: 'Barrio del Albaicín' },
      { en: 'Free Tapas Culture', es: 'Cultura de Tapas Gratis' },
      { en: 'Sierra Nevada Mountains', es: 'Montañas de Sierra Nevada' }
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Alhambra_-_Granada.jpg',
    imageAlt: 'La Alhambra de Granada'
  },
  {
    id: 'malaga',
    name: 'Málaga',
    description: {
      en: 'The capital of the Costa del Sol, a cosmopolitan hub of art, culture, and innovation.',
      es: 'La capital de la Costa del Sol, un centro cosmopolita de arte, cultura e innovación.'
    },
    highlights: [
      { en: 'Picasso Museum', es: 'Museo Picasso' },
      { en: 'Calle Larios', es: 'Calle Larios' },
      { en: 'Malagueta Beach', es: 'Playa de la Malagueta' },
      { en: 'Technological Park of Andalusia', es: 'Parque Tecnológico de Andalucía' }
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Malaga_skyline_from_Gibralfaro_-_panoramio.jpg',
    imageAlt: 'Vista panorámica de Málaga desde Gibralfaro'
  }
];

export const COURSES: Course[] = [
  {
    id: 'ai-education',
    title: { en: 'Practical and Responsible AI for Teachers', es: 'IA práctica y responsable para docentes' },
    subtitle: { en: 'Save time and design better learning without giving up professional judgement.', es: 'Ahorra tiempo y diseña mejores aprendizajes sin renunciar al criterio profesional.' },
    category: 'AI',
    description: {
      en: 'A hands-on course on using AI to plan, adapt resources and assess learning with attention to privacy, ethics and inclusive practice.',
      es: 'Un curso práctico para utilizar la IA en la planificación, la adaptación de materiales y la evaluación, atendiendo a la privacidad, la ética y la inclusión.'
    },
    learningOutcomes: [
      { en: 'Use generative AI for realistic teaching tasks', es: 'Utilizar la IA generativa en tareas docentes reales' },
      { en: 'Create and adapt classroom resources', es: 'Crear y adaptar materiales para el aula' },
      { en: 'Review AI outputs with professional judgement', es: 'Revisar los resultados de la IA con criterio profesional' },
      { en: 'Apply basic privacy and responsible-use criteria', es: 'Aplicar criterios básicos de privacidad y uso responsable' }
    ],
    programmeOverview: [
      { en: 'AI foundations for educators', es: 'Fundamentos de IA para docentes' },
      { en: 'Planning and resource creation', es: 'Planificación y creación de recursos' },
      { en: 'Adaptation and inclusive learning', es: 'Adaptación y aprendizaje inclusivo' },
      { en: 'Assessment and feedback', es: 'Evaluación y retroalimentación' },
      { en: 'Privacy, ethics and classroom action plan', es: 'Privacidad, ética y plan de aplicación al aula' }
    ],
    targetAudience: { en: 'Primary and Secondary Teachers, School Leaders, ICT Coordinators', es: 'Profesores de Primaria y Secundaria, Directivos, Coordinadores TIC' },
    duration: { en: '5 Days (25 hours)', es: '5 días (25 horas)' },
    price: 480,
    language: 'Spanish',
    includes: [
      { en: '25 guided learning hours', es: '25 horas lectivas guiadas' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Digital course materials', es: 'Materiales digitales del curso' },
    ],
    erasmusRelevance: { en: 'Supports digital transformation, critical use of technology and the exchange of classroom practices across Europe.', es: 'Apoya la transformación digital, el uso crítico de la tecnología y el intercambio de prácticas docentes en Europa.' },
    courseImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'inclusion-sen',
    title: { en: 'Inclusion by Design', es: 'Inclusión por diseño' },
    subtitle: { en: 'Accessible learning environments that anticipate learner diversity.', es: 'Entornos de aprendizaje accesibles que anticipan la diversidad del alumnado.' },
    category: 'Inclusion',
    description: {
      en: 'Practical approaches to Universal Design for Learning, accessibility and classroom support for different ways of learning and participating.',
      es: 'Estrategias prácticas de Diseño Universal para el Aprendizaje, accesibilidad y apoyo en el aula para distintas formas de aprender y participar.'
    },
    learningOutcomes: [
      { en: 'Apply Universal Design for Learning principles', es: 'Aplicar los principios del Diseño Universal para el Aprendizaje' },
      { en: 'Identify barriers to participation', es: 'Identificar barreras para la participación' },
      { en: 'Adapt activities without lowering expectations', es: 'Adaptar actividades sin reducir las expectativas' },
      { en: 'Strengthen belonging and classroom participation', es: 'Fortalecer la pertenencia y la participación en el aula' }
    ],
    programmeOverview: [
      { en: 'Inclusion and barriers to learning', es: 'Inclusión y barreras para el aprendizaje' },
      { en: 'Neurodiversity and learner variability', es: 'Neurodiversidad y variabilidad del alumnado' },
      { en: 'Universal Design for Learning', es: 'Diseño Universal para el Aprendizaje' },
      { en: 'Accessible activities and assessment', es: 'Actividades y evaluación accesibles' },
      { en: 'Classroom casework and action plan', es: 'Casos de aula y plan de aplicación' }
    ],
    targetAudience: { en: 'Teachers, inclusion coordinators and school leaders', es: 'Docentes, coordinadores de inclusión y equipos directivos' },
    duration: { en: '5 Days (25 hours)', es: '5 días (25 horas)' },
    price: 480,
    language: 'Spanish',
    includes: [
      { en: '25 guided learning hours', es: '25 horas lectivas guiadas' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Digital course materials', es: 'Materiales digitales del curso' },
    ],
    erasmusRelevance: { en: 'Directly supports the Erasmus+ priority of inclusion and diversity.', es: 'Contribuye directamente a la prioridad Erasmus+ de inclusión y diversidad.' },
    courseImage: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'digital-citizenship',
    title: { en: 'Digital Citizenship and Critical Thinking', es: 'Ciudadanía digital y pensamiento crítico' },
    subtitle: { en: 'Teach students to navigate AI, information and digital life with confidence.', es: 'Ayuda a tu alumnado a desenvolverse ante la IA, la información y la vida digital.' },
    category: 'Digital',
    description: {
      en: 'Classroom strategies for media literacy, misinformation, privacy, online safety and responsible participation in the digital world.',
      es: 'Estrategias de aula sobre alfabetización mediática, desinformación, privacidad, seguridad y participación responsable en el entorno digital.'
    },
    learningOutcomes: [
      { en: 'Recognise common forms of misinformation', es: 'Reconocer formas habituales de desinformación' },
      { en: 'Design media-literacy activities', es: 'Diseñar actividades de alfabetización mediática' },
      { en: 'Address privacy and online safety', es: 'Abordar la privacidad y la seguridad en línea' },
      { en: 'Promote responsible digital participation', es: 'Promover una participación digital responsable' }
    ],
    programmeOverview: [
      { en: 'Digital citizenship today', es: 'La ciudadanía digital actual' },
      { en: 'Information, sources and verification', es: 'Información, fuentes y verificación' },
      { en: 'AI-generated content and critical thinking', es: 'Contenido generado por IA y pensamiento crítico' },
      { en: 'Privacy, safety and digital wellbeing', es: 'Privacidad, seguridad y bienestar digital' },
      { en: 'Classroom project and shared European practices', es: 'Proyecto de aula e intercambio de prácticas europeas' }
    ],
    targetAudience: { en: 'Teachers, digital coordinators and school leadership teams', es: 'Docentes, coordinadores digitales y equipos directivos' },
    duration: { en: '5 Days (25 hours)', es: '5 días (25 horas)' },
    price: 480,
    language: 'Spanish',
    includes: [
      { en: '25 guided learning hours', es: '25 horas lectivas guiadas' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Digital course materials', es: 'Materiales digitales del curso' },
    ],
    erasmusRelevance: { en: 'Connects digital transformation with participation in democratic life, media literacy and critical thinking.', es: 'Conecta la transformación digital con la participación democrática, la alfabetización mediática y el pensamiento crítico.' },
    courseImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'europe-classroom',
    title: { en: 'Europe in the Classroom', es: 'Europa en el aula' },
    subtitle: { en: 'Turn European cooperation into meaningful classroom learning.', es: 'Convierte la cooperación europea en aprendizaje significativo para el aula.' },
    category: 'Europe',
    description: {
      en: 'A practical course on collaborative projects, active learning, intercultural dialogue, European values and the exchange of teaching practices.',
      es: 'Un curso práctico sobre proyectos colaborativos, aprendizaje activo, diálogo intercultural, valores europeos e intercambio de prácticas docentes.'
    },
    learningOutcomes: [
      { en: 'Design collaborative European learning experiences', es: 'Diseñar experiencias europeas de aprendizaje colaborativo' },
      { en: 'Use project-based and cooperative methodologies', es: 'Utilizar metodologías basadas en proyectos y cooperación' },
      { en: 'Integrate intercultural dialogue and common values', es: 'Integrar el diálogo intercultural y los valores comunes' },
      { en: 'Plan the transfer of learning back to school', es: 'Planificar la transferencia del aprendizaje al centro' }
    ],
    programmeOverview: [
      { en: 'European dimension and shared challenges', es: 'Dimensión europea y retos compartidos' },
      { en: 'Collaborative and project-based learning', es: 'Aprendizaje colaborativo y basado en proyectos' },
      { en: 'Intercultural dialogue and participation', es: 'Diálogo intercultural y participación' },
      { en: 'Exchange of practices between schools', es: 'Intercambio de prácticas entre centros' },
      { en: 'European classroom project', es: 'Proyecto europeo para el aula' }
    ],
    targetAudience: { en: 'Teachers, Erasmus+ coordinators and internationalisation teams', es: 'Docentes, coordinadores Erasmus+ y equipos de internacionalización' },
    duration: { en: '5 Days (25 hours)', es: '5 días (25 horas)' },
    price: 480,
    language: 'Spanish',
    includes: [
      { en: '25 guided learning hours', es: '25 horas lectivas guiadas' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Digital course materials', es: 'Materiales digitales del curso' },
    ],
    erasmusRelevance: { en: 'Strengthens the European dimension, transnational exchange and participation in common European values.', es: 'Refuerza la dimensión europea, el intercambio transnacional y la participación en valores europeos comunes.' },
    courseImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'green-classroom',
    title: { en: 'The Green Classroom', es: 'Aula verde' },
    subtitle: { en: 'Turn sustainability into projects that matter to learners and communities.', es: 'Convierte la sostenibilidad en proyectos relevantes para el alumnado y la comunidad.' },
    category: 'Sustainability',
    description: {
      en: 'Sustainability education, outdoor learning and classroom projects connected to local environmental challenges and European cooperation.',
      es: 'Educación para la sostenibilidad, aprendizaje al aire libre y proyectos conectados con retos ambientales locales y la cooperación europea.'
    },
    learningOutcomes: [
      { en: 'Connect sustainability with curriculum goals', es: 'Conectar la sostenibilidad con los objetivos curriculares' },
      { en: 'Design outdoor and place-based learning', es: 'Diseñar aprendizaje al aire libre y vinculado al entorno' },
      { en: 'Create learner-led environmental projects', es: 'Crear proyectos ambientales liderados por el alumnado' },
      { en: 'Share green practices across European schools', es: 'Compartir prácticas sostenibles entre centros europeos' }
    ],
    programmeOverview: [
      { en: 'Sustainability and education', es: 'Sostenibilidad y educación' },
      { en: 'Learning from the local environment', es: 'Aprender del entorno local' },
      { en: 'Outdoor and experiential methodologies', es: 'Metodologías al aire libre y experienciales' },
      { en: 'School projects with community impact', es: 'Proyectos escolares con impacto comunitario' },
      { en: 'Green action plan for the classroom', es: 'Plan de acción verde para el aula' }
    ],
    targetAudience: { en: 'Primary, secondary and adult-education teachers', es: 'Docentes de primaria, secundaria y educación de personas adultas' },
    duration: { en: '5 Days (25 hours)', es: '5 días (25 horas)' },
    price: 480,
    language: 'Spanish',
    includes: [
      { en: '25 guided learning hours', es: '25 horas lectivas guiadas' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Digital course materials', es: 'Materiales digitales del curso' },
    ],
    erasmusRelevance: { en: 'Addresses the Erasmus+ priority on environment and the fight against climate change.', es: 'Aborda la prioridad Erasmus+ de medio ambiente y lucha contra el cambio climático.' },
    courseImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Playa_de_M%C3%B3nsul%2C_San_Jos%C3%A9%2C_Almer%C3%ADa.jpg',
    featured: false
  },
  {
    id: 'wellbeing-teachers',
    title: { en: 'Teacher Wellbeing and Positive School Climate', es: 'Bienestar docente y clima escolar positivo' },
    subtitle: { en: 'Build sustainable ways of working and healthier learning environments.', es: 'Construye formas sostenibles de trabajar y entornos de aprendizaje más saludables.' },
    category: 'Wellbeing',
    description: {
      en: 'Educational and preventive strategies for workload organisation, communication, emotional regulation, coexistence and a positive school climate.',
      es: 'Estrategias educativas y preventivas para la organización del trabajo, la comunicación, la regulación emocional, la convivencia y un clima escolar positivo.'
    },
    learningOutcomes: [
      { en: 'Identify factors that affect teacher wellbeing', es: 'Identificar factores que influyen en el bienestar docente' },
      { en: 'Use sustainable organisation strategies', es: 'Utilizar estrategias de organización sostenibles' },
      { en: 'Improve communication and classroom climate', es: 'Mejorar la comunicación y el clima del aula' },
      { en: 'Create a realistic personal and school action plan', es: 'Crear un plan de acción personal y de centro realista' }
    ],
    programmeOverview: [
      { en: 'Teacher wellbeing and school conditions', es: 'Bienestar docente y condiciones escolares' },
      { en: 'Workload, boundaries and organisation', es: 'Carga de trabajo, límites y organización' },
      { en: 'Communication and emotional regulation', es: 'Comunicación y regulación emocional' },
      { en: 'Coexistence and positive school climate', es: 'Convivencia y clima escolar positivo' },
      { en: 'Sustainable action plan', es: 'Plan de acción sostenible' }
    ],
    targetAudience: { en: 'Teachers, tutors and school leadership teams', es: 'Docentes, tutores y equipos directivos' },
    duration: { en: '5 Days (25 hours)', es: '5 días (25 horas)' },
    price: 480,
    language: 'Spanish',
    includes: [
      { en: '25 guided learning hours', es: '25 horas lectivas guiadas' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Digital course materials', es: 'Materiales digitales del curso' },
    ],
    erasmusRelevance: { en: 'Supports teacher development, collaboration and more inclusive and sustainable learning environments.', es: 'Apoya el desarrollo profesional docente, la colaboración y unos entornos de aprendizaje más inclusivos y sostenibles.' },
    courseImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: { en: 'How do I pay for the course with Erasmus+ funds?', es: '¿Cómo pago el curso con fondos Erasmus+?' },
    answer: {
      en: 'After the course is confirmed in writing, the proposal will state the invoicing details and agreed documents. Your school must check whether and how the fee can be charged to its own Erasmus+ grant.',
      es: 'Cuando el curso esté confirmado por escrito, la propuesta indicará los datos de facturación y los documentos acordados. Tu centro debe comprobar si la cuota puede imputarse a su propia subvención Erasmus+ y de qué forma.'
    },
    category: { en: 'Payment', es: 'Pago' }
  },
  {
    id: 'f2',
    question: { en: 'What is included in the course fee?', es: '¿Qué incluye la cuota del curso?' },
    answer: {
      en: 'The exact services are listed in the written proposal. A standard five-day programme includes at least 25 guided learning hours, digital course materials and, when the participation requirements are met, an attendance and learning-outcomes certificate.',
      es: 'Los servicios exactos figuran en la propuesta escrita. Un programa estándar de cinco días incluye al menos 25 horas lectivas guiadas, materiales digitales y, cuando se cumplan los requisitos de participación, un certificado de asistencia y resultados de aprendizaje.'
    },
    category: { en: 'General', es: 'General' }
  },
  {
    id: 'f3',
    question: { en: 'Can you help with accommodation?', es: '¿Podéis ayudar con el alojamiento?' },
    answer: {
      en: 'We can provide general orientation once the venue is confirmed. Unless the written proposal says otherwise, participants or their organisation book and pay for accommodation and travel.',
      es: 'Podemos facilitar orientación general cuando se confirme la sede. Salvo que la propuesta escrita diga otra cosa, las personas participantes o su organización reservan y pagan el alojamiento y el viaje.'
    },
    category: { en: 'Logistics', es: 'Logística' }
  },
  {
    id: 'f4',
    question: { en: 'How can I request a custom course in Europe?', es: '¿Cómo puedo solicitar un curso a medida en Europa?' },
    answer: {
      en: 'Tell us the preferred European city, topic, dates and approximate group size. Every course has the same €480 fee per participant. Editions outside Spain are normally confirmed from 15 participants in total, who may come from several organisations; smaller groups can register their interest. The written proposal will confirm the local host or venue and any exceptional destination costs before booking.',
      es: 'Indícanos la ciudad europea preferida, el tema, las fechas y el tamaño aproximado del grupo. Todos los cursos tienen el mismo precio de 480 € por participante. Las ediciones fuera de España se confirman normalmente desde 15 participantes en total, que pueden proceder de varios centros; los grupos más pequeños pueden registrar su interés. La propuesta escrita confirmará la organización anfitriona o sede y cualquier coste extraordinario del destino antes de reservar.'
    },
    category: { en: 'Custom Courses', es: 'Cursos a Medida' }
  }
];
