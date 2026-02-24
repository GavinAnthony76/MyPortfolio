import { type InsertProjectRequest } from "@shared/schema";

export function generateProjectPrompt(data: InsertProjectRequest): string {
  const {
    firstName,
    lastName,
    email,
    company,
    projectType,
    budgetRange,
    timeline,
    description,
    referenceUrl,
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
${budgetRange ? `- **Budget Range:** ${getBudgetLabel(budgetRange)}` : ''}
- **Timeline:** ${getTimelineLabel(timeline)}`;

  if (referenceUrl) {
    prompt += `\n- **Reference URL:** ${referenceUrl}`;
  }

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
    'basic': 'Basic Website',
    'premium': 'Premium Package',
    'custom': 'Custom Package',
    'prototyping': 'Rapid Prototyping',
    'ecommerce': 'E-Commerce Store',
    'saas': 'SaaS Application',
    'marketing': 'Marketing Site',
    'internal': 'Internal Tool',
    'other': 'Custom Solution',
  };
  return labels[type] || type;
}

function getBudgetLabel(budget: string): string {
  const labels: Record<string, string> = {
    'under-1k': 'Under $1,000',
    '1k-5k': '$1,000 - $5,000',
    '5k-10k': '$5,000 - $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-plus': '$25,000+',
    'not-sure': 'Not determined yet',
  };
  return labels[budget] || budget;
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
    'basic': '- **Frontend:** Modern HTML5, CSS3, vanilla JavaScript\n- **Styling:** Tailwind CSS or custom CSS with modern techniques\n- **Performance:** Optimized images, minified assets, fast loading\n- **SEO:** Meta tags, structured data, semantic HTML\n- **Hosting:** Static site hosting with CDN deployment',
    'premium': '- **Frontend:** React with TypeScript, Tailwind CSS\n- **Backend:** Node.js with Express (if needed)\n- **Features:** Contact forms, booking systems, photo galleries\n- **SEO:** Advanced local SEO optimization\n- **Hosting:** 12 months hosting included\n- **Analytics:** Google Analytics, Google My Business integration',
    'custom': '- **Frontend:** React with TypeScript, Tailwind CSS, Shadcn/ui\n- **Backend:** Node.js with Express.js, RESTful APIs\n- **Database:** PostgreSQL with Drizzle ORM\n- **Features:** E-commerce, customer portals, advanced integrations\n- **Authentication:** JWT, OAuth, or custom authentication\n- **Deployment:** Production-ready deployment with 24 months support\n- **Testing:** Jest, Vitest, Playwright for E2E',
    'prototyping': '- **Frontend:** React with TypeScript, Tailwind CSS\n- **Backend:** Node.js with Express\n- **Database:** PostgreSQL or in-memory for speed\n- **Development:** Vite for fast iteration\n- **Hosting:** Replit, Vercel, or Netlify',
  };
  return stacks[projectType] || null;
}

function getProjectPhases(projectType: string, timeline: string): string | null {
  const isRush = timeline === 'asap';
  
  const phases: Record<string, string> = {
    'basic': `**Phase 1: Design & Content Planning (${isRush ? '1-2 days' : '2-3 days'})**
- Content structure and organization
- Visual design and layout planning
- Asset preparation and optimization

**Phase 2: Development & Implementation (${isRush ? '2-3 days' : '3-5 days'})**
- Single page HTML/CSS/JavaScript development
- Responsive design implementation
- Contact form integration
- Performance optimization

**Phase 3: Testing & Deployment (${isRush ? '1 day' : '1-2 days'})**
- Cross-browser testing
- Mobile responsiveness verification
- SEO optimization and deployment`,

    'premium': `**Phase 1: Planning & Design (${isRush ? '2-3 days' : '1 week'})**
- Requirements analysis and content planning
- UI/UX design and layout
- Google My Business setup planning

**Phase 2: Development (${isRush ? '1 week' : '2 weeks'})**
- Multi-page website development (3-5 pages)
- Contact forms and business info integration
- Mobile-friendly responsive design
- Photo galleries (if needed)

**Phase 3: Testing & Launch (${isRush ? '2-3 days' : '3-5 days'})**
- Cross-browser and mobile testing
- Local SEO optimization
- Deployment with 12 months hosting setup`,

    'custom': `**Phase 1: Planning & Architecture (${isRush ? '3-5 days' : '1-2 weeks'})**
- Requirements analysis and user story mapping
- Database schema and API design
- UI/UX wireframes and component planning
- Technology stack finalization

**Phase 2: Backend Development (${isRush ? '1-2 weeks' : '3-4 weeks'})**
- Database setup and migration scripts
- RESTful API development and testing
- Authentication and authorization implementation
- E-commerce or booking system integration

**Phase 3: Frontend Development (${isRush ? '1-2 weeks' : '3-4 weeks'})**
- Component library setup and styling
- User interface implementation
- API integration and state management
- Customer portal and advanced features

**Phase 4: Integration & Deployment (${isRush ? '3-5 days' : '1 week'})**
- End-to-end testing and bug fixes
- Performance optimization
- Production deployment with 24 months support
- Documentation and handover`,

    'prototyping': `**Phase 1: Discovery & Planning (${isRush ? '1-2 days' : '3-5 days'})**
- Requirements analysis and scope definition
- Technology stack selection
- Architecture and data flow design

**Phase 2: Rapid Development (${isRush ? '3-5 days' : '1-2 weeks'})**
- Core feature implementation
- Basic UI/UX development
- Database integration
- Essential functionality

**Phase 3: Demo & Iteration (${isRush ? '1-2 days' : '3-5 days'})**
- Testing and bug fixes
- Demo preparation and presentation
- Feedback collection and refinements`,
  };

  return phases[projectType] || null;
}


