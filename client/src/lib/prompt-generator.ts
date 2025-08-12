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
    'prototype': 'Rapid Prototype/POC',
    'code-generation': 'Code Generation',
    'debugging': 'Code Review & Debugging',
    'consulting': 'Technical Consulting',
    'integration': 'API Integration',
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
    'prototype': '- **Frontend:** React with TypeScript, Tailwind CSS\n- **Backend:** Node.js with Express\n- **Database:** In-memory or SQLite for speed\n- **Development:** Vite for fast iteration\n- **Hosting:** Replit, Vercel, or Netlify',
    'code-generation': '- **AI Tools:** Advanced code generation algorithms\n- **Languages:** TypeScript, JavaScript, Python\n- **Frameworks:** React, Vue, Node.js, FastAPI\n- **Quality:** ESLint, Prettier, automated testing\n- **Documentation:** Auto-generated comments',
    'debugging': '- **Analysis:** Static code analysis, performance profiling\n- **Tools:** TypeScript compiler, ESLint, testing frameworks\n- **Monitoring:** Error tracking, performance metrics\n- **Optimization:** Bundle analysis, code refactoring\n- **Documentation:** Technical debt analysis',
    'consulting': '- **Architecture:** Scalable system design patterns\n- **Technologies:** Modern frameworks and tools\n- **Performance:** Optimization strategies\n- **Security:** Best practices and auditing\n- **DevOps:** CI/CD and deployment strategies',

    'integration': '- **APIs:** RESTful and GraphQL integration\n- **Authentication:** OAuth, JWT, API keys\n- **Data:** JSON processing and validation\n- **Testing:** API testing and mocking\n- **Security:** Rate limiting and validation',
  };
  return stacks[projectType] || null;
}

function getProjectPhases(projectType: string, timeline: string): string | null {
  const isRush = timeline === 'asap';
  
  const phases: Record<string, string> = {
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

    'code-generation': `**Phase 1: Analysis & Setup (${isRush ? '1 day' : '2-3 days'})**
- Code requirements analysis
- Template and pattern identification
- Development environment configuration

**Phase 2: Generation & Customization (${isRush ? '2-3 days' : '1 week'})**
- Automated code generation
- Custom logic implementation
- Code quality optimization

**Phase 3: Review & Documentation (${isRush ? '1 day' : '2-3 days'})**
- Code review and testing
- Documentation generation
- Best practices implementation`,

    'debugging': `**Phase 1: Analysis & Assessment (${isRush ? '1-2 days' : '3-5 days'})**
- Codebase analysis and issue identification
- Performance profiling and bottleneck detection
- Technical debt assessment

**Phase 2: Optimization & Fixes (${isRush ? '3-5 days' : '1-2 weeks'})**
- Bug fixes and error resolution
- Performance optimization
- Code refactoring and improvements

**Phase 3: Testing & Documentation (${isRush ? '1-2 days' : '3-5 days'})**
- Comprehensive testing
- Documentation updates
- Best practices recommendations`,

    'consulting': `**Phase 1: Discovery & Assessment (${isRush ? '2-3 days' : '1 week'})**
- Current system analysis
- Requirements gathering
- Technology assessment

**Phase 2: Strategy Development (${isRush ? '3-5 days' : '1-2 weeks'})**
- Architecture planning
- Technology recommendations
- Implementation roadmap creation

**Phase 3: Presentation & Handoff (${isRush ? '1-2 days' : '3-5 days'})**
- Strategy presentation
- Documentation delivery
- Implementation guidance`,



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
