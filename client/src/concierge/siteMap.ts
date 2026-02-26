export interface WhisperAction {
  label: string;
  type: 'scroll' | 'navigate' | 'flyover' | 'dismiss';
  target?: string;
}

export interface Whisper {
  text: string;
  actions: WhisperAction[];
  ttlMs: number;
  anchor?: string;
  priority: number;
}

export interface SectionInfo {
  id: string;
  whisperAttr: string;
  label: string;
  contextWhisper: Whisper;
}

export interface RouteInfo {
  path: string;
  summonWhisper: Whisper;
}

export const sections: SectionInfo[] = [
  {
    id: 'home',
    whisperAttr: 'hero',
    label: 'Hero',
    contextWhisper: {
      text: 'Full-stack development focused on performance and results. Want to see what that looks like?',
      actions: [
        { label: 'View Projects', type: 'scroll', target: 'projects' },
        { label: 'Start a Project', type: 'scroll', target: 'contact' },
      ],
      ttlMs: 8000,
      anchor: '[data-whisper="hero"]',
      priority: 1,
    },
  },
  {
    id: 'projects',
    whisperAttr: 'projects',
    label: 'Projects',
    contextWhisper: {
      text: 'Each card is a real project. Click one for the full case study.',
      actions: [
        { label: 'Read Testimonials', type: 'scroll', target: 'testimonials' },
        { label: 'Start a Project', type: 'scroll', target: 'contact' },
      ],
      ttlMs: 7000,
      anchor: '[data-whisper="projects"]',
      priority: 2,
    },
  },
  {
    id: 'testimonials',
    whisperAttr: 'testimonials',
    label: 'Testimonials',
    contextWhisper: {
      text: 'Real feedback from real clients. You can leave your own too.',
      actions: [
        { label: 'Check Project Status', type: 'scroll', target: 'project-status' },
        { label: 'Start a Project', type: 'scroll', target: 'contact' },
      ],
      ttlMs: 7000,
      anchor: '[data-whisper="testimonials"]',
      priority: 2,
    },
  },
  {
    id: 'blog',
    whisperAttr: 'blog',
    label: 'Blog',
    contextWhisper: {
      text: 'Articles on web development trends and insights.',
      actions: [
        { label: 'See Projects', type: 'scroll', target: 'projects' },
        { label: 'Get in Touch', type: 'scroll', target: 'contact' },
      ],
      ttlMs: 7000,
      anchor: '[data-whisper="blog"]',
      priority: 3,
    },
  },
  {
    id: 'project-status',
    whisperAttr: 'project-status',
    label: 'Status',
    contextWhisper: {
      text: 'Have a ticket number? Look up your project status here.',
      actions: [
        { label: 'Start a New Project', type: 'scroll', target: 'contact' },
        { label: 'Back to Top', type: 'scroll', target: 'home' },
      ],
      ttlMs: 7000,
      anchor: '[data-whisper="project-status"]',
      priority: 2,
    },
  },
  {
    id: 'contact',
    whisperAttr: 'contact',
    label: 'Contact',
    contextWhisper: {
      text: 'Ready to start? Fill out the form and get a ticket number to track progress.',
      actions: [
        { label: 'View Projects First', type: 'scroll', target: 'projects' },
        { label: 'Back to Top', type: 'scroll', target: 'home' },
      ],
      ttlMs: 8000,
      anchor: '[data-whisper="contact"]',
      priority: 1,
    },
  },
];

export const routes: RouteInfo[] = [
  {
    path: '/',
    summonWhisper: {
      text: 'Welcome. I can guide you to projects, testimonials, or help you start something new.',
      actions: [
        { label: 'See Projects', type: 'scroll', target: 'projects' },
        { label: 'Start a Project', type: 'scroll', target: 'contact' },
        { label: '60s Flyover', type: 'flyover' },
      ],
      ttlMs: 10000,
      priority: 1,
    },
  },
  {
    path: '/privacy-policy',
    summonWhisper: {
      text: 'You\'re viewing the privacy policy. Need anything else?',
      actions: [
        { label: 'Back to Home', type: 'navigate', target: '/' },
      ],
      ttlMs: 8000,
      priority: 1,
    },
  },
  {
    path: '/terms-of-service',
    summonWhisper: {
      text: 'You\'re viewing the terms of service.',
      actions: [
        { label: 'Back to Home', type: 'navigate', target: '/' },
      ],
      ttlMs: 8000,
      priority: 1,
    },
  },
  {
    path: '/login',
    summonWhisper: {
      text: 'Admin area. Looking for the portfolio?',
      actions: [
        { label: 'Go Home', type: 'navigate', target: '/' },
      ],
      ttlMs: 8000,
      priority: 1,
    },
  },
];

export const firstVisitWhisper: Whisper = {
  text: 'First time here? Take a 60-second flyover of the site.',
  actions: [
    { label: 'Start Flyover', type: 'flyover' },
    { label: 'Skip', type: 'dismiss' },
  ],
  ttlMs: 10000,
  priority: 10,
};

export interface FlyoverStep {
  target: string;
  sectionId: string;
  title: string;
  text: string;
}

export const flyoverSteps: FlyoverStep[] = [
  {
    target: '[data-whisper="hero"]',
    sectionId: 'home',
    title: 'Welcome',
    text: 'Gavin builds custom web apps — e-commerce, SaaS, and more. Let me show you the highlights.',
  },
  {
    target: '[data-whisper="projects"]',
    sectionId: 'projects',
    title: 'Portfolio',
    text: 'Real projects with real results. Click any card for the full case study.',
  },
  {
    target: '[data-whisper="contact"]',
    sectionId: 'contact',
    title: 'Get Started',
    text: 'Submit your project details here. You\'ll get a ticket number to track progress.',
  },
];

export const ctaHoverWhispers: Record<string, Whisper> = {
  'button-view-projects': {
    text: 'See real-world projects with detailed case studies.',
    actions: [],
    ttlMs: 4000,
    priority: 0,
  },
  'button-start-project': {
    text: 'Custom quotes based on your needs — no commitment.',
    actions: [],
    ttlMs: 4000,
    priority: 0,
  },
  'button-check-status': {
    text: 'Already submitted a project? Track it with your ticket number.',
    actions: [],
    ttlMs: 4000,
    priority: 0,
  },
};
