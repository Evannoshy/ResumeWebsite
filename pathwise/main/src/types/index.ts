// ─── Type Definitions ─────────────────────────────────────────────
// Pathwise — Singapore Career Companion

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'student' | 'ns' | 'working';
  interests: string[];
  onboardingComplete: boolean;
  onboardingData?: {
    status?: string;
    industry?: string;
  };
  createdAt: Date;
}

export interface TrackStep {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'certification' | 'project' | 'milestone';
  level: 'beginner' | 'intermediate' | 'advanced';
  provider?: string;
  url?: string;
  estimatedHours?: number;
  completed: boolean;
  order: number;
}

export interface Track {
  id: string;
  userId: string;
  title: string;
  industry: string;
  description: string;
  steps: TrackStep[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResumePersonal {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
  highlights: string[];
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  bullets: string[];
}

export interface ResumeSkills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface ResumeSections {
  personal: ResumePersonal;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkills;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: 'classic' | 'modern';
  sections: ResumeSections;
  completeness: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: 'tech' | 'finance' | 'public-sector' | 'global';
}

export interface Bookmark {
  id: string;
  articleId: string;
  title: string;
  source: string;
  summary: string;
  url: string;
  category: string;
  savedAt: Date;
}

export type UserStatus = 'student' | 'ns' | 'working';
export type Industry = 'tech' | 'finance' | 'public-sector' | 'consulting' | 'healthcare' | 'education';
export type NewsCategory = 'all' | 'tech' | 'finance' | 'public-sector' | 'global';
