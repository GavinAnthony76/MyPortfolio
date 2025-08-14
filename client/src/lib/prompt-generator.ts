import { type InsertProjectRequest } from "@shared/schema";

export function generateProjectPrompt(data: InsertProjectRequest): string {
  const {
    firstName,
    lastName,
    email,
    company,
    projectType,

    timeline,
    description,
    targetAudience,
    keyFeatures,
    techPreferences,
    designReferences,
    additionalInfo,
  } = data;

  const companyName = company || `${firstName} ${lastName}`;
  
  let prompt = `# Development Brief - ${getProjectTypeLabel(projectType)}

## Client Information
- **Client:** ${firstName} ${lastName}
- **Email:** ${email}
- **Company:** ${companyName}

## Project Overview
**Description:** ${description}

## Project Specifications
- **Project Type:** ${getProjectTypeLabel(projectType)}

- **Timeline:** ${getTimelineLabel(timeline)}`;

  if (targetAudience) {
    prompt += `\n- **Target Audience:** ${targetAudience}`;
  }

  if (keyFeatures) {
    prompt += `\n\n## Core Features Required
${keyFeatures.split('\n').map(feature => `- ${feature.trim()}`).join('\n')}`;
  }

  if (techPreferences) {
    prompt += `\n\n## Technical Requirements & Preferences
${techPreferences}`;
  }

  if (designReferences) {
    prompt += `\n\n## Design References & Inspiration
${designReferences}`;
  }

  // Add recommended technical stack based on project type
  const techStack = getRecommendedTechStack(projectType);
  if (techStack) {
    prompt += `\n\n## Recommended Technical Stack
${techStack}`;
  }

  // Add project phases and deliverables
  const phases = getProjectPhases(projectType, timeline);
  if (phases) {
    prompt += `\n\n## Development Phases & Deliverables
${phases}`;
  }



  if (additionalInfo) {
    prompt += `\n\n## Additional Notes
${additionalInfo}`;
  }

  prompt += `\n\n## Next Steps
1. Review project requirements and technical approach
2. Prepare detailed proposal with timeline and milestones
3. Schedule discovery call to discuss specifics
4. Provide accurate project estimate and contract

---
*Generated on ${new Date().toLocaleDateString()} for ${companyName}*`;

  return prompt;
}

function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'fullstack': 'Full-Stack Development',
    'prototype': 'Rapid Prototype/POC',
    'pwa': 'Progressive Web Applications',
    'landing': 'Landing Pages',
    'static': 'Static Web Page Development',
    'integration': 'API Integration',
    'other': 'Custom Solution',
  };
  return labels[type] || type;
}



function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    'asap': 'ASAP (Rush project)',
    '1-month': 'Within 1 month',
    '2-3-months': '2-3 months',
    '3-6-months': '3-6 months',
    '6-plus-months': '6+ months',
    'flexible': 'Flexible timeline',
  };
  return labels[timeline] || timeline;
}

function getRecommendedTechStack(projectType: string): string | null {
  const stacks: Record<string, string> = {
    'fullstack': '- **Frontend:** React with TypeScript, Tailwind CSS, Shadcn/ui\n- **Backend:** Node.js with Express.js, RESTful APIs\n- **Database:** PostgreSQL with Drizzle ORM\n- **Authentication:** JWT, OAuth, or NextAuth.js\n- **Deployment:** Vercel, Railway, or AWS\n- **Testing:** Jest, Vitest, Playwright for E2E',
    'prototype': '- **Frontend:** React with TypeScript, Tailwind CSS\n- **Backend:** Node.js with Express\n- **Database:** In-memory or SQLite for speed\n- **Development:** Vite for fast iteration\n- **Hosting:** Replit, Vercel, or Netlify',
    'pwa': '- **Frontend:** React/Vue with PWA capabilities\n- **Service Workers:** Offline functionality and caching\n- **Push Notifications:** Real-time user engagement\n- **Manifest:** App-like installation experience\n- **Performance:** Optimized loading and responsiveness',
    'landing': '- **Frontend:** React with TypeScript, Tailwind CSS\n- **Optimization:** Conversion rate optimization techniques\n- **SEO:** Meta tags, structured data, performance optimization\n- **Analytics:** Google Analytics, conversion tracking\n- **Hosting:** Fast CDN deployment with global reach',
    'static': '- **Frontend:** Modern HTML5, CSS3, vanilla JavaScript\n- **Styling:** Tailwind CSS or custom CSS with modern techniques\n- **Performance:** Optimized images, minified assets, fast loading\n- **SEO:** Meta tags, structured data, semantic HTML\n- **Hosting:** Static site hosting with CDN deployment',
    'integration': '- **APIs:** RESTful and GraphQL integration\n- **Authentication:** OAuth, JWT, API keys\n- **Data:** JSON processing and validation\n- **Testing:** API testing and mocking\n- **Security:** Rate limiting and validation',
  };
  return stacks[projectType] || null;
}

function getProjectPhases(projectType: string, timeline: string): string | null {
  const isRush = timeline === 'asap';
  
  const phases: Record<string, string> = {
    'fullstack': `**Phase 1: Planning & Architecture (${isRush ? '3-5 days' : '1-2 weeks'})**
- Requirements analysis and user story mapping
- Database schema and API design
- UI/UX wireframes and component planning
- Technology stack finalization

**Phase 2: Backend Development (${isRush ? '1-2 weeks' : '3-4 weeks'})**
- Database setup and migration scripts
- RESTful API development and testing
- Authentication and authorization implementation
- Core business logic development

**Phase 3: Frontend Development (${isRush ? '1-2 weeks' : '3-4 weeks'})**
- Component library setup and styling
- User interface implementation
- API integration and state management
- Responsive design and accessibility

**Phase 4: Integration & Deployment (${isRush ? '3-5 days' : '1 week'})**
- End-to-end testing and bug fixes
- Performance optimization
- Production deployment and monitoring
- Documentation and handover`,

    'prototype': `**Phase 1: Discovery & Planning (${isRush ? '1-2 days' : '3-5 days'})**
- Requirements analysis and scope definition
- Technology stack selection
- Architecture and data flow design

**Phase 2: Rapid Development (${isRush ? '3-5 days' : '1-2 weeks'})**
- Core feature implementation
- Basic UI/UX development
- Essential functionality integration

**Phase 3: Demo & Iteration (${isRush ? '1-2 days' : '3-5 days'})**
- Testing and bug fixes
- Demo preparation and presentation
- Feedback collection and refinements`,

    'pwa': `**Phase 1: PWA Setup & Architecture (${isRush ? '2-3 days' : '1 week'})**
- Progressive enhancement strategy
- Service worker implementation
- Manifest configuration and icons

**Phase 2: Core Features & Offline Support (${isRush ? '1 week' : '2 weeks'})**
- Offline functionality development
- Push notification system
- Background sync capabilities

**Phase 3: Testing & Optimization (${isRush ? '2-3 days' : '1 week'})**
- PWA auditing and lighthouse testing
- Performance optimization
- Cross-platform compatibility testing`,

    'landing': `**Phase 1: Design & Strategy (${isRush ? '1-2 days' : '2-3 days'})**
- Content strategy and copywriting
- Visual design and layout
- Conversion optimization planning

**Phase 2: Development & Integration (${isRush ? '2-3 days' : '3-5 days'})**
- Responsive frontend development
- Analytics and tracking setup
- SEO optimization implementation

**Phase 3: Testing & Launch (${isRush ? '1 day' : '1-2 days'})**
- Cross-browser testing
- Performance optimization
- Deployment and go-live`,

    'static': `**Phase 1: Design & Content Planning (${isRush ? '1-2 days' : '2-3 days'})**
- Content structure and organization
- Visual design and layout planning
- Asset preparation and optimization

**Phase 2: Development & Implementation (${isRush ? '2-3 days' : '3-5 days'})**
- HTML/CSS/JavaScript development
- Responsive design implementation
- Performance optimization

**Phase 3: Testing & Deployment (${isRush ? '1 day' : '1-2 days'})**
- Cross-browser testing
- Mobile responsiveness verification
- Static site deployment and hosting setup`,



    'integration': `**Phase 1: API Analysis (${isRush ? '1 day' : '2-3 days'})**
- API documentation review
- Integration requirements analysis
- Authentication setup planning

**Phase 2: Development & Testing (${isRush ? '3-5 days' : '1 week'})**
- API integration implementation
- Error handling and validation
- Comprehensive testing

**Phase 3: Deployment & Monitoring (${isRush ? '1-2 days' : '2-3 days'})**
- Production deployment
- Monitoring setup
- Documentation and maintenance guide`,
  };

  return phases[projectType] || null;
}


