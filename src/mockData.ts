
import { Course, City, CourseSession, Testimonial, FAQItem } from './types';

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
    title: { en: 'AI for Education: Artificial Intelligence in the Classroom', es: 'IA para la Educación: Inteligencia Artificial en el Aula' },
    subtitle: { en: 'Master the tools that are reshaping the future of learning.', es: 'Domina las herramientas que están rediseñando el futuro del aprendizaje.' },
    category: 'AI',
    description: {
      en: 'This course provides a comprehensive introduction to AI tools and their practical application in the classroom. From generative AI for lesson planning to personalized learning paths.',
      es: 'Este curso ofrece una introducción completa a las herramientas de IA y su aplicación práctica en el aula. Desde IA generativa para planificación hasta rutas de aprendizaje personalizadas.'
    },
    learningOutcomes: [
      { en: 'Understand the fundamentals of Generative AI', es: 'Comprender los fundamentos de la IA Generativa' },
      { en: 'Create high-quality educational content with AI', es: 'Crear contenido educativo de alta calidad con IA' },
      { en: 'Implement AI-driven assessment strategies', es: 'Implementar estrategias de evaluación impulsadas por IA' },
      { en: 'Discuss ethics and critical thinking in the age of AI', es: 'Debatit sobre ética y pensamiento crítico en la era de la IA' }
    ],
    programmeOverview: [
      { en: 'Day 1: Introduction to AI in Education', es: 'Día 1: Introducción a la IA en Educación' },
      { en: 'Day 2: Prompt Engineering for Teachers', es: 'Día 2: Ingeniería de Prompts para Profesores' },
      { en: 'Day 3: AI Tools for Content Creation', es: 'Día 3: Herramientas de IA para Creación de Contenido' },
      { en: 'Day 4: Personalized Learning & Assessment', es: 'Día 4: Aprendizaje Personalizado y Evaluación' },
      { en: 'Day 5: Ethics, Future Trends & Final Project', es: 'Día 5: Ética, Tendencias Futuras y Proyecto Final' }
    ],
    targetAudience: { en: 'Primary and Secondary Teachers, School Leaders, ICT Coordinators', es: 'Profesores de Primaria y Secundaria, Directivos, Coordinadores TIC' },
    duration: { en: '5 Days (30 hours)', es: '5 Días (30 horas)' },
    price: 490,
    language: 'English',
    includes: [
      { en: 'Course materials', es: 'Materiales del curso' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Cultural activities', es: 'Actividades culturales' },
      { en: 'Coffee breaks', es: 'Pausas para café' }
    ],
    erasmusRelevance: { en: 'Aligned with the Digital Education Action Plan (2021-2027)', es: 'Alineado con el Plan de Acción de Educación Digital (2021-2027)' },
    courseImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'inclusion-sen',
    title: { en: 'Inclusion and Special Educational Needs', es: 'Inclusión y Necesidades Educativas Especiales' },
    subtitle: { en: 'Creating truly inclusive learning environments for all students.', es: 'Creando entornos de aprendizaje verdaderamente inclusivos para todos.' },
    category: 'Inclusion',
    description: {
      en: 'Focus on practical strategies for supporting students with diverse needs, including ADHD, Autism, and Dyslexia, within the mainstream classroom.',
      es: 'Enfoque en estrategias prácticas para apoyar a estudiantes con necesidades diversas, incluyendo TDAH, Autismo y Dislexia, en el aula ordinaria.'
    },
    learningOutcomes: [
      { en: 'Identify different learning profiles and needs', es: 'Identificar diferentes perfiles y necesidades de aprendizaje' },
      { en: 'Apply Universal Design for Learning (UDL) principles', es: 'Aplicar los principios del Diseño Universal para el Aprendizaje (DUA)' },
      { en: 'Develop Individualized Education Programs (IEPs)', es: 'Desarrollar Programas de Educación Individualizados (PEI)' },
      { en: 'Foster a culture of empathy and belonging', es: 'Fomentar una cultura de empatía y pertenencia' }
    ],
    programmeOverview: [
      { en: 'Day 1: The Inclusive Mindset', es: 'Día 1: La Mentalidad Inclusiva' },
      { en: 'Day 2: Neurodiversity in the Classroom', es: 'Día 2: Neurodiversidad en el Aula' },
      { en: 'Day 3: UDL: Practical Implementation', es: 'Día 3: DUA: Implementación Práctica' },
      { en: 'Day 4: Collaborative Teaching & Support', es: 'Día 4: Enseñanza Colaborativa y Apoyo' },
      { en: 'Day 5: Case Studies & Action Planning', es: 'Día 5: Casos de Estudio y Plan de Acción' }
    ],
    targetAudience: { en: 'All Teachers, SENCOs, Educational Psychologists', es: 'Todos los profesores, coordinadores de NEE, psicopedagogos' },
    duration: { en: '5 Days (30 hours)', es: '5 Días (30 horas)' },
    price: 480,
    language: 'English',
    includes: [
      { en: 'Course materials', es: 'Materiales del curso' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Cultural activities', es: 'Actividades culturales' },
      { en: 'Coffee breaks', es: 'Pausas para café' }
    ],
    erasmusRelevance: { en: 'Supports the European Strategy for the Rights of Persons with Disabilities', es: 'Apoya la Estrategia Europea sobre los Derechos de las Personas con Discapacidad' },
    courseImage: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'wellbeing-teachers',
    title: { en: 'Mindfulness, Wellbeing and Burnout Prevention', es: 'Mindfulness, Bienestar y Prevención del Burnout' },
    subtitle: { en: 'Prioritize your mental health to be a better educator.', es: 'Prioriza tu salud mental para ser un mejor educador.' },
    category: 'Wellbeing',
    description: {
      en: 'A transformative course designed to help teachers manage stress, build resilience, and integrate mindfulness into their daily lives and classrooms.',
      es: 'Un curso transformador diseñado para ayudar a los profesores a gestionar el estrés, desarrollar resiliencia e integrar el mindfulness en su vida diaria y en el aula.'
    },
    learningOutcomes: [
      { en: 'Practice evidence-based mindfulness techniques', es: 'Practicar técnicas de mindfulness basadas en la evidencia' },
      { en: 'Develop emotional regulation strategies', es: 'Desarrollar estrategias de regulación emocional' },
      { en: 'Create a sustainable self-care plan', es: 'Crear un plan de autocuidado sostenible' },
      { en: 'Teach mindfulness to students', es: 'Enseñar mindfulness a los estudiantes' }
    ],
    programmeOverview: [
      { en: 'Day 1: Understanding Teacher Stress & Burnout', es: 'Día 1: Entendiendo el Estrés y Burnout Docente' },
      { en: 'Day 2: Foundations of Mindfulness', es: 'Día 2: Fundamentos del Mindfulness' },
      { en: 'Day 3: Emotional Intelligence & Resilience', es: 'Día 3: Inteligencia Emocional y Resiliencia' },
      { en: 'Day 4: Mindful Communication', es: 'Día 4: Comunicación Consciente' },
      { en: 'Day 5: Integration & Sustaining Practice', es: 'Día 5: Integración y Mantenimiento de la Práctica' }
    ],
    targetAudience: { en: 'Teachers of all levels, School Staff', es: 'Profesores de todos los niveles, personal escolar' },
    duration: { en: '5 Days (30 hours)', es: '5 Días (30 horas)' },
    price: 460,
    language: 'English',
    includes: [
      { en: 'Course materials', es: 'Materiales del curso' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Cultural activities', es: 'Actividades culturales' },
      { en: 'Coffee breaks', es: 'Pausas para café' }
    ],
    erasmusRelevance: { en: 'Aligned with the European Education Area priority on wellbeing', es: 'Alineado con la prioridad del Espacio Europeo de Educación sobre el bienestar' },
    courseImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'digital-competence',
    title: { en: 'Digital Competence and Innovative Methodologies', es: 'Competencia Digital y Metodologías Innovadoras' },
    subtitle: { en: 'Beyond the screen: Engaging students through active learning.', es: 'Más allá de la pantalla: Motivando alumnos mediante aprendizaje activo.' },
    category: 'Digital',
    description: {
      en: 'Explore Gamification, Flipped Classroom, and Project-Based Learning (PBL) supported by the latest digital tools.',
      es: 'Explora la Gamificación, Flipped Classroom y el Aprendizaje Basado en Proyectos (ABP) apoyado por las últimas herramientas digitales.'
    },
    learningOutcomes: [
      { en: 'Master innovative teaching methodologies', es: 'Dominar metodologías de enseñanza innovadoras' },
      { en: 'Select the right digital tools for specific goals', es: 'Seleccionar las herramientas digitales adecuadas para objetivos específicos' },
      { en: 'Design engaging, student-centered projects', es: 'Diseñar proyectos motivadores centrados en el alumno' },
      { en: 'Assess digital competence in students', es: 'Evaluar la competencia digital en los estudiantes' }
    ],
    programmeOverview: [
      { en: 'Day 1: Active Learning Methodologies', es: 'Día 1: Metodologías de Aprendizaje Activo' },
      { en: 'Day 2: Gamification in Education', es: 'Día 2: Gamificación en Educación' },
      { en: 'Day 3: The Flipped Classroom Model', es: 'Día 3: El Modelo de Flipped Classroom' },
      { en: 'Day 4: Project-Based Learning (PBL)', es: 'Día 4: Aprendizaje Basado en Proyectos (ABP)' },
      { en: 'Day 5: Digital Portfolio & Assessment', es: 'Día 5: Portfolio Digital y Evaluación' }
    ],
    targetAudience: { en: 'Primary and Secondary Teachers, Innovation Leaders', es: 'Profesores de Primaria y Secundaria, líderes de innovación' },
    duration: { en: '5 Days (30 hours)', es: '5 Días (30 horas)' },
    price: 490,
    language: 'English',
    includes: [
      { en: 'Course materials', es: 'Materiales del curso' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Cultural activities', es: 'Actividades culturales' },
      { en: 'Coffee breaks', es: 'Pausas para café' }
    ],
    erasmusRelevance: { en: 'Directly supports the DigCompEdu framework', es: 'Apoya directamente el marco DigCompEdu' },
    courseImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'clil-english',
    title: { en: 'CLIL / English for Teachers', es: 'AICLE / Inglés para Profesores' },
    subtitle: { en: 'Enhance your language skills and content-teaching strategies.', es: 'Mejora tus habilidades lingüísticas y estrategias de enseñanza de contenidos.' },
    category: 'CLIL',
    description: {
      en: 'Improve your English proficiency while learning the best practices for teaching non-linguistic subjects through a foreign language.',
      es: 'Mejora tu nivel de inglés mientras aprendes las mejores prácticas para enseñar asignaturas no lingüísticas a través de una lengua extranjera.'
    },
    learningOutcomes: [
      { en: 'Improve English fluency and accuracy', es: 'Mejorar la fluidez y precisión en inglés' },
      { en: 'Apply CLIL scaffolding techniques', es: 'Aplicar técnicas de andamiaje AICLE' },
      { en: 'Adapt materials for language learners', es: 'Adaptar materiales para aprendices de lengua' },
      { en: 'Assess content and language simultaneously', es: 'Evaluar contenido y lengua simultáneamente' }
    ],
    programmeOverview: [
      { en: 'Day 1: Introduction to CLIL Principles', es: 'Día 1: Introducción a los principios AICLE' },
      { en: 'Day 2: Language for the Classroom', es: 'Día 2: Lenguaje para el aula' },
      { en: 'Day 3: Scaffolding Content & Language', es: 'Día 3: Andamiaje de Contenido y Lengua' },
      { en: 'Day 4: Material Design & Adaptation', es: 'Día 4: Diseño y Adaptación de Materiales' },
      { en: 'Day 5: Assessment in CLIL & Final Presentation', es: 'Día 5: Evaluación en AICLE y Presentación Final' }
    ],
    targetAudience: { en: 'Bilingual Teachers, English Teachers', es: 'Profesores bilingües, profesores de inglés' },
    duration: { en: '5 Days (30 hours)', es: '5 Días (30 horas)' },
    price: 490,
    language: 'English',
    includes: [
      { en: 'Course materials', es: 'Materiales del curso' },
      { en: 'Certificate of attendance', es: 'Certificado de asistencia' },
      { en: 'Cultural activities', es: 'Actividades culturales' },
      { en: 'Coffee breaks', es: 'Pausas para café' }
    ],
    erasmusRelevance: { en: 'Promotes multilingualism and language learning in the EEA', es: 'Promueve el multilingüismo y el aprendizaje de lenguas en el EEE' },
    courseImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

export const SESSIONS: CourseSession[] = [
  { id: 's1', courseId: 'ai-education', cityId: 'malaga', startDate: '2026-07-06', endDate: '2026-07-10', seatsTotal: 20, seatsLeft: 5, status: 'Almost Full', schedule: 'morning' },
  { id: 's2', courseId: 'ai-education', cityId: 'granada', startDate: '2026-08-10', endDate: '2026-08-14', seatsTotal: 20, seatsLeft: 18, status: 'Open', schedule: 'afternoon' },
  { id: 's3', courseId: 'inclusion-sen', cityId: 'almeria', startDate: '2026-07-13', endDate: '2026-07-17', seatsTotal: 15, seatsLeft: 0, status: 'Closed', schedule: 'morning' },
  { id: 's4', courseId: 'wellbeing-teachers', cityId: 'malaga', startDate: '2026-09-14', endDate: '2026-09-18', seatsTotal: 20, seatsLeft: 12, status: 'Open', schedule: 'morning' },
  { id: 's5', courseId: 'digital-competence', cityId: 'granada', startDate: '2026-10-19', endDate: '2026-10-23', seatsTotal: 20, seatsLeft: 2, status: 'Almost Full', schedule: 'afternoon' },
  { id: 's6', courseId: 'clil-english', cityId: 'almeria', startDate: '2026-11-09', endDate: '2026-11-13', seatsTotal: 15, seatsLeft: 15, status: 'Open', schedule: 'morning' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Maria Rossi',
    role: { en: 'Primary Teacher', es: 'Profesora de Primaria' },
    institution: 'Scuola Elementare Dante Alighieri (Italy)',
    content: {
      en: 'The AI for Education course in Málaga was eye-opening. Teach4Future Academy provided excellent training and a wonderful cultural experience.',
      es: 'El curso de IA para la Educación en Málaga fue revelador. Teach4Future Academy ofreció una formación excelente y una experiencia cultural maravillosa.'
    },
    avatar: 'https://i.pravatar.cc/150?u=maria'
  },
  {
    id: 't2',
    name: 'Jan Kowalski',
    role: { en: 'Principal', es: 'Director' },
    institution: 'Liceum Ogólnokształcące (Poland)',
    content: {
      en: 'We sent a group of 5 teachers to Granada for the Inclusion course. The organization was flawless, and our teachers came back inspired.',
      es: 'Enviamos un grupo de 5 profesores a Granada para el curso de Inclusión. La organización fue impecable y nuestros profesores volvieron inspirados.'
    },
    avatar: 'https://i.pravatar.cc/150?u=jan'
  },
  {
    id: 't3',
    name: 'Elena Garcia',
    role: { en: 'Secondary Teacher', es: 'Profesora de Secundaria' },
    institution: 'IES Mediterráneo (Spain)',
    content: {
      en: 'I requested a custom course in Berlin for my team, and Teach4Future organized everything in Spanish. It was exactly what we needed.',
      es: 'Solicité un curso a medida en Berlín para mi equipo, y Teach4Future organizó todo en español. Fue exactamente lo que necesitábamos.'
    },
    avatar: 'https://i.pravatar.cc/150?u=elena'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: { en: 'How do I pay for the course with Erasmus+ funds?', es: '¿Cómo pago el curso con fondos Erasmus+?' },
    answer: {
      en: 'Once you are enrolled, we will send you an invoice that you can pay using your school\'s Erasmus+ grant. We also provide the necessary documentation for your final report.',
      es: 'Una vez inscrito, te enviaremos una factura que podrás pagar con la subvención Erasmus+ de tu centro. También proporcionamos la documentación necesaria para tu informe final.'
    },
    category: { en: 'Payment', es: 'Pago' }
  },
  {
    id: 'f2',
    question: { en: 'What is included in the course fee?', es: '¿Qué incluye la cuota del curso?' },
    answer: {
      en: 'The fee includes 30 hours of intensive training, all course materials, a certificate of attendance, coffee breaks, and at least two cultural activities (e.g., guided city tour). All our courses are fully Erasmus+ eligible.',
      es: 'La cuota incluye 30 horas de formación intensiva, todos los materiales del curso, certificado de asistencia, pausas para café y al menos dos actividades culturales (ej. visita guiada por la ciudad). Todos nuestros cursos son totalmente elegibles para Erasmus+.'
    },
    category: { en: 'General', es: 'General' }
  },
  {
    id: 'f3',
    question: { en: 'Can you help with accommodation?', es: '¿Podéis ayudar con el alojamiento?' },
    answer: {
      en: 'Yes, we provide a list of recommended hotels and apartments near our training centers in Almería, Granada, and Málaga.',
      es: 'Sí, proporcionamos una lista de hoteles y apartamentos recomendados cerca de nuestros centros de formación en Almería, Granada y Málaga.'
    },
    category: { en: 'Logistics', es: 'Logística' }
  },
  {
    id: 'f4',
    question: { en: 'How can I request a custom course in Europe?', es: '¿Cómo puedo solicitar un curso a medida en Europa?' },
    answer: {
      en: 'If you are a group of at least 8 teachers from Spain, you can choose any European city and topic. We will organize the training there, delivered in Spanish.',
      es: 'Si sois un grupo de al menos 8 profesores de España, podéis elegir cualquier ciudad europea y tema. Organizaremos la formación allí, impartida en español.'
    },
    category: { en: 'Custom Courses', es: 'Cursos a Medida' }
  }
];
