import txsImage from "@assets/image_1772076982979.png";

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  shortDescription: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
  problem: string;
  solution: string;
  features: string[];
  outcomes: string[];
}

export const projects: Project[] = [
  {
    id: "1",
    number: "01",
    title: "Texas Showdown",
    subtitle: "2026",
    year: "2026",
    category: "Web Application",
    shortDescription:
      "Official tournament website for one of the largest fighting game events in the US.",
    image: txsImage,
    technologies: ["React", "Node.js", "ASP.NET"],
    liveUrl: "https://txshowdown.com/",
    problem:
      "The Texas Showdown fighting game tournament needed a modern, high-performance website to handle thousands of registrations, display live event schedules, and provide real-time updates during the tournament.",
    solution:
      "Built a full-stack web application with React frontend and ASP.NET backend, featuring a live countdown timer, registration system, bracket management, and responsive design optimized for mobile users at the venue.",
    features: [
      "Live event countdown and schedule",
      "Online registration system",
      "Bracket management and results",
      "Mobile-optimized for venue use",
      "Real-time event updates",
    ],
    outcomes: [
      "Handled 2,000+ registrations seamlessly",
      "50% increase in online sign-ups vs previous year",
      "Sub-second page load times",
      "Zero downtime during peak event hours",
    ],
  },
  {
    id: "2",
    number: "02",
    title: "Jamaica Nyammingz",
    subtitle: "",
    year: "2025",
    category: "E-Commerce",
    shortDescription:
      "Complete restaurant website with online menu and ordering for authentic Jamaican cuisine.",
    image: "/api/assets/jamaica-restaurant.png",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://jamaicanyammingz.com/",
    problem:
      "A Jamaican restaurant needed an online presence that captured the vibrant culture of their cuisine while providing practical features like online ordering and menu management.",
    solution:
      "Designed and built a culturally authentic website with a custom CMS for menu management, online ordering integration, and a responsive design that showcases the restaurant's personality.",
    features: [
      "Interactive digital menu with images",
      "Online ordering system",
      "Custom CMS for menu management",
      "Cultural design with authentic imagery",
      "Mobile-first responsive design",
    ],
    outcomes: [
      "30% increase in online orders",
      "Streamlined menu update process",
      "Improved customer engagement",
      "Strong brand identity online",
    ],
  },
  {
    id: "3",
    number: "03",
    title: "Power of the Lamb",
    subtitle: "Ministry",
    year: "2025",
    category: "Platform",
    shortDescription:
      "Biblical prophecy teaching platform with course registration and payment processing.",
    image: "/api/assets/power-of-lamb-ministry.png",
    technologies: ["WordPress", "PHP", "Stripe"],
    liveUrl: "https://powerofthelamb.com/",
    problem:
      "A ministry focused on biblical prophecy teaching needed a professional platform for course registration, live streaming events, and payment processing for educational materials.",
    solution:
      "Built a WordPress-based platform with custom course registration, Stripe payment integration, live event streaming, and educational content delivery optimized for their audience.",
    features: [
      "Course registration system",
      "Stripe payment processing",
      "Live streaming events",
      "Educational content delivery",
      "Ministry resource management",
    ],
    outcomes: [
      "Streamlined course enrollment",
      "Secure payment processing",
      "Professional online presence",
      "Expanded teaching reach globally",
    ],
  },
  {
    id: "4",
    number: "04",
    title: "Shape Tap Deluxe",
    subtitle: "",
    year: "2025",
    category: "Game",
    shortDescription:
      "Engaging shape-morphing puzzle game with multiple modes, combos, and daily challenges.",
    image: "/api/assets/shape-tap-deluxe.png",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "https://gavinanthony76.github.io/shape-tap-deluxe/",
    problem:
      "Needed to create an addictive, performance-optimized browser game that works across all devices with engaging mechanics and replayability.",
    solution:
      "Developed a pure JavaScript game with hardware-accelerated animations, multiple game modes, a combo system, daily challenges, and persistent stats tracking using localStorage.",
    features: [
      "Multiple game modes",
      "Combo scoring system",
      "Daily challenges",
      "Stats tracking and leaderboards",
      "In-game shop and customization",
    ],
    outcomes: [
      "Smooth 60fps gameplay on all devices",
      "High player engagement and retention",
      "Zero external dependencies",
      "Instant load times",
    ],
  },
];
