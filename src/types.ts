
export type BilingualText = string | {
  en: string;
  es: string;
};

export interface Course {
  id: string;
  title: BilingualText;
  subtitle: BilingualText;
  category: 'AI' | 'Inclusion' | 'Wellbeing' | 'Digital' | 'Europe' | 'Sustainability';
  description: BilingualText;
  learningOutcomes: BilingualText[];
  programmeOverview: BilingualText[];
  targetAudience: BilingualText;
  duration: BilingualText;
  price: number;
  language: 'English' | 'Spanish' | 'Both';
  includes: BilingualText[];
  erasmusRelevance: BilingualText;
  courseImage: string;
  featured?: boolean;
}

export interface CourseDay {
  title: BilingualText;
  focus: BilingualText;
  activities: BilingualText[];
  takeaway: BilingualText;
}

export interface CourseCurriculum {
  methodology: BilingualText[];
  dailyProgramme: CourseDay[];
}

export interface City {
  id: string;
  name: string;
  description: BilingualText;
  highlights: BilingualText[];
  image: string;
  imageAlt: string;
}

export interface CourseSession {
  id: string;
  courseId: string;
  cityId: string;
  startDate: string;
  endDate: string;
  seatsTotal: number;
  seatsLeft: number;
  status: 'Open' | 'Almost Full' | 'Waiting List' | 'Closed';
  schedule: 'morning' | 'afternoon' | 'tbc';
}

export interface FAQItem {
  id: string;
  question: BilingualText;
  answer: BilingualText;
  category: BilingualText;
}

export interface Enrolment {
  id: string;
  sessionId: string;
  fullName: string;
  email: string;
  country: string;
  institution: string;
  role: string;
  participantsCount: number;
  notes?: string;
  needInvoice: boolean;
  needAcceptanceLetter: boolean;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface EuropeRequest {
  id: string;
  city: string;
  topic: string;
  preferredDates: string;
  groupSize: number;
  fullName: string;
  email: string;
  institution: string;
  notes?: string;
  createdAt: string;
}
