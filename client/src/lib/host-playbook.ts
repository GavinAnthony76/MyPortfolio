export interface ActionChip {
  label: string;
  action: 'scroll' | 'navigate' | 'experience' | 'dismiss';
  target?: string;
}

export interface RouteContext {
  greeting: string;
  message: string;
  chips: ActionChip[];
}

export interface SectionContext {
  message: string;
  chips: ActionChip[];
}

export interface ExperienceStep {
  target: string;
  route?: string;
  title: string;
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const routePlaybook: Record<string, RouteContext> = {
  '/': {
    greeting: 'Welcome to Gavin Anthony\'s portfolio.',
    message: 'I\'m your guide. Explore projects, read testimonials, or start your own project.',
    chips: [
      { label: 'See Projects', action: 'scroll', target: 'projects' },
      { label: 'Start a Project', action: 'scroll', target: 'contact' },
      { label: 'Start 60s Experience', action: 'experience' },
    ],
  },
  '/privacy-policy': {
    greeting: 'Privacy Policy',
    message: 'You\'re viewing the privacy policy. Need anything else?',
    chips: [
      { label: 'Back to Home', action: 'navigate', target: '/' },
      { label: 'Start a Project', action: 'navigate', target: '/#contact' },
    ],
  },
  '/terms-of-service': {
    greeting: 'Terms of Service',
    message: 'You\'re viewing the terms of service. Need anything else?',
    chips: [
      { label: 'Back to Home', action: 'navigate', target: '/' },
      { label: 'Start a Project', action: 'navigate', target: '/#contact' },
    ],
  },
  '/login': {
    greeting: 'Admin Login',
    message: 'This is the admin area. Looking for something else?',
    chips: [
      { label: 'Back to Home', action: 'navigate', target: '/' },
    ],
  },
};

export const sectionPlaybook: Record<string, SectionContext> = {
  hero: {
    message: 'This is Gavin\'s portfolio — full-stack web development with a focus on quality.',
    chips: [
      { label: 'See Projects', action: 'scroll', target: 'projects' },
      { label: 'Start a Project', action: 'scroll', target: 'contact' },
    ],
  },
  projects: {
    message: 'Browse completed projects. Click any card for the full case study.',
    chips: [
      { label: 'Read Testimonials', action: 'scroll', target: 'testimonials' },
      { label: 'Start a Project', action: 'scroll', target: 'contact' },
    ],
  },
  testimonials: {
    message: 'Real feedback from real clients. You can leave your own testimonial too.',
    chips: [
      { label: 'Check Project Status', action: 'scroll', target: 'project-status' },
      { label: 'Start a Project', action: 'scroll', target: 'contact' },
    ],
  },
  blog: {
    message: 'Articles on web development trends, tips, and insights.',
    chips: [
      { label: 'See Projects', action: 'scroll', target: 'projects' },
      { label: 'Start a Project', action: 'scroll', target: 'contact' },
    ],
  },
  'project-status': {
    message: 'Have a ticket number? Look up your project status here.',
    chips: [
      { label: 'Start a New Project', action: 'scroll', target: 'contact' },
      { label: 'Back to Top', action: 'scroll', target: 'home' },
    ],
  },
  contact: {
    message: 'Ready to start? Fill out the form and you\'ll get a ticket number to track progress.',
    chips: [
      { label: 'View Projects First', action: 'scroll', target: 'projects' },
      { label: 'Back to Top', action: 'scroll', target: 'home' },
    ],
  },
};

export const experienceSteps: ExperienceStep[] = [
  {
    target: '[data-host="hero"]',
    title: 'Welcome',
    message: 'Gavin Anthony builds custom web applications — from e-commerce stores to SaaS platforms. Let me show you around.',
    position: 'bottom',
  },
  {
    target: '[data-host="projects"]',
    title: 'Project Portfolio',
    message: 'Each card is a real project. Click one to see the full case study — the problem, the solution, and the results.',
    position: 'top',
  },
  {
    target: '[data-host="contact"]',
    title: 'Start Your Project',
    message: 'Ready to build something? Submit your project details here and you\'ll receive a ticket number to track progress.',
    position: 'top',
  },
];

export const defaultContext: RouteContext = {
  greeting: 'Hello',
  message: 'I\'m here to help you navigate the site.',
  chips: [
    { label: 'Go Home', action: 'navigate', target: '/' },
  ],
};
