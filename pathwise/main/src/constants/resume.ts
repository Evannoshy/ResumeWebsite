// ─── Resume Constants ────────────────────────────────────────────
import { ResumeSections } from '../types';

export const EMPTY_RESUME_SECTIONS: ResumeSections = {
  personal: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
};

export const ACTION_VERBS = {
  leadership: ['Spearheaded', 'Directed', 'Orchestrated', 'Championed', 'Oversaw', 'Pioneered'],
  achievement: ['Achieved', 'Delivered', 'Exceeded', 'Surpassed', 'Attained', 'Accomplished'],
  technical: ['Architected', 'Engineered', 'Developed', 'Implemented', 'Optimised', 'Automated'],
  analytical: ['Analysed', 'Evaluated', 'Assessed', 'Researched', 'Identified', 'Investigated'],
  communication: ['Presented', 'Negotiated', 'Collaborated', 'Facilitated', 'Mentored', 'Advised'],
  improvement: ['Streamlined', 'Revamped', 'Redesigned', 'Transformed', 'Enhanced', 'Modernised'],
};

export const IMPACT_PROMPTS = [
  'What was the measurable outcome?',
  'By what percentage did you improve it?',
  'How many users/customers were affected?',
  'What was the timeframe?',
  'How much revenue/cost savings?',
];

export const BULLET_SUGGESTIONS = [
  'Start with a strong action verb',
  'Include quantified impact (%, $, #users)',
  'Mention specific tools or technologies',
  'Focus on results, not just responsibilities',
  'Keep each bullet to 1-2 lines maximum',
];

export const RESUME_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'ATS-friendly, single column. Standard for Singapore hiring.',
    preview: 'Clean, conservative layout with clear section headers.',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary two-column layout with subtle accents.',
    preview: 'Balanced layout with skills sidebar and main content area.',
  },
] as const;
