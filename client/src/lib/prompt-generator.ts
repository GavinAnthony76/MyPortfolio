import { type InsertProjectRequest } from "@shared/schema";

export function generateProjectPrompt(data: InsertProjectRequest): string {
  const {
    firstName,
    lastName,
    email,
    company,
    projectType,
    budget,
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
- **Budget Range:** ${getBudgetLabel(budget)}
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

  // Add budget considerations
  const budgetConsiderations = getBudgetConsiderations(budget, projectType);
  if (budgetConsiderations) {
    prompt += `\n\n## Budget Considerations
${budgetConsiderations}`;
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
    'web-app': 'Web Application',

    'ecommerce': 'E-commerce Platform',
    'landing-page': 'Landing Page',
    'api': 'API Development',
    'consulting': 'Technical Consulting',
    'maintenance': 'Maintenance & Support',
    'other': 'Custom Solution',
  };
  return labels[type] || type;
}

function getBudgetLabel(budget: string): string {
  const labels: Record<string, string> = {
    'under-5k': 'Under $5,000',
    '5k-10k': '$5,000 - $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-50k': '$25,000 - $50,000',
    '50k-plus': '$50,000+',
    'discuss': 'To be discussed',
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
    'web-app': '- **Frontend:** React.js with TypeScript, Tailwind CSS\n- **Backend:** Node.js with Express.js\n- **Database:** PostgreSQL\n- **Hosting:** Vercel/AWS\n- **Authentication:** NextAuth or Auth0',
    'ecommerce': '- **Frontend:** Next.js with TypeScript\n- **Backend:** Node.js with Express.js\n- **Database:** PostgreSQL\n- **Payments:** Stripe integration\n- **CMS:** Headless CMS (Contentful/Strapi)\n- **Hosting:** AWS or Vercel',
    'landing-page': '- **Framework:** Next.js or React\n- **Styling:** Tailwind CSS\n- **Analytics:** Google Analytics\n- **Forms:** React Hook Form\n- **Hosting:** Vercel or Netlify',
    'api': '- **Framework:** Express.js with TypeScript\n- **Database:** PostgreSQL or MongoDB\n- **Documentation:** OpenAPI/Swagger\n- **Testing:** Jest and Supertest\n- **Deployment:** AWS or Railway',
  };
  return stacks[projectType] || null;
}

function getProjectPhases(projectType: string, timeline: string): string | null {
  const isRush = timeline === 'asap';
  
  const phases: Record<string, string> = {
    'web-app': `**Phase 1: Planning & Design (${isRush ? '1' : '2'} weeks)**
- Requirements analysis and technical architecture
- UI/UX design and wireframes
- Database schema design

**Phase 2: Core Development (${isRush ? '3-4' : '6-8'} weeks)**
- Backend API development
- Frontend component development
- Database integration

**Phase 3: Testing & Launch (${isRush ? '1' : '2'} weeks)**
- Quality assurance testing
- Performance optimization
- Deployment and go-live`,

    'landing-page': `**Phase 1: Planning & Design (${isRush ? '3-5 days' : '1'} week)**
- Content strategy and structure planning
- Visual design and branding
- Performance optimization planning

**Phase 2: Development (${isRush ? '1' : '2'} weeks)**
- Responsive layout development
- Content integration and optimization
- SEO implementation

**Phase 3: Testing & Launch (${isRush ? '2-3 days' : '3-5 days'} days)**
- Cross-browser testing
- Performance optimization
- Analytics setup and go-live`,

    'ecommerce': `**Phase 1: Planning & Setup (${isRush ? '1-2' : '3'} weeks)**
- E-commerce requirements analysis
- Payment gateway setup
- Database and product catalog design

**Phase 2: Core Development (${isRush ? '6-8' : '10-12'} weeks)**
- Product catalog and shopping cart
- Payment processing integration
- Admin dashboard development

**Phase 3: Testing & Launch (${isRush ? '2' : '3'} weeks)**
- Payment testing and security audit
- Performance optimization
- Go-live and monitoring setup`,
  };

  return phases[projectType] || null;
}

function getBudgetConsiderations(budget: string, projectType: string): string | null {
  if (budget === 'under-5k') {
    return `- **MVP Approach:** Focus on core functionality to stay within budget
- **Template-Based:** Utilize existing templates and components where possible
- **Simplified Features:** Prioritize essential features, plan for future enhancements
- **Standard Hosting:** Use cost-effective hosting solutions`;
  }
  
  if (budget === '5k-10k') {
    return `- **Custom Development:** Moderate customization with some unique features
- **Responsive Design:** Full mobile and desktop optimization
- **Basic Integrations:** Essential third-party service integrations
- **Professional Hosting:** Reliable hosting with good performance`;
  }

  if (budget === '10k-25k' || budget === '25k-50k') {
    return `- **Full Custom Solution:** Completely custom design and functionality
- **Advanced Features:** Complex integrations and advanced functionality
- **Premium Tools:** Access to premium services and tools
- **Scalable Architecture:** Built for growth and high performance
- **Comprehensive Testing:** Extensive QA and performance testing`;
  }

  if (budget === '50k-plus') {
    return `- **Enterprise Solution:** Full-scale enterprise application
- **Advanced Architecture:** Microservices, scalable infrastructure
- **Multiple Integrations:** Complex third-party system integrations
- **Premium Support:** Ongoing support and maintenance included
- **Performance Optimization:** High-performance, enterprise-grade solution`;
  }

  return null;
}
