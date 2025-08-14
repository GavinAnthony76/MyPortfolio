import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, Building, DollarSign, Calendar, FileText, Archive, Reply, File } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ProjectRequest } from "@shared/schema";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const respondToClient = (request: ProjectRequest) => {
    const projectTypeLabels: Record<string, string> = {
      'fullstack': 'Full-Stack Development',
      'prototype': 'Rapid Prototype/POC',
      'pwa': 'Progressive Web Applications',
      'landing': 'Landing Pages',
      'static': 'Static Web Page Development',
      'integration': 'API Integration',
      'other': 'Custom Development'
    };

    const budgetLabels: Record<string, string> = {
      'under-5k': 'Under $5,000',
      '5k-10k': '$5,000 - $10,000',
      '10k-25k': '$10,000 - $25,000',
      '25k-50k': '$25,000 - $50,000',
      '50k-plus': '$50,000+',
      'discuss': "Let's discuss"
    };

    const timelineLabels: Record<string, string> = {
      'asap': 'ASAP',
      '1-month': 'Within 1 month',
      '2-3-months': '2-3 months',
      '3-6-months': '3-6 months',
      '6-plus-months': '6+ months',
      'flexible': 'Flexible'
    };

    const subject = `Re: ${projectTypeLabels[request.projectType]} Project Inquiry`;
    const body = `Hi ${request.firstName},

Thank you for reaching out about your ${projectTypeLabels[request.projectType]?.toLowerCase() || request.projectType} project. I've reviewed your requirements and I'm excited about the opportunity to work with you.

Based on your description, I understand you're looking for:
${request.description}

Your project specifications:
- Budget Range: ${budgetLabels[request.budget] || request.budget}
- Timeline: ${timelineLabels[request.timeline] || request.timeline}
${request.targetAudience ? `- Target Audience: ${request.targetAudience}` : ''}

I have extensive experience developing similar projects and believe I can deliver exactly what you're looking for. I'd love to schedule a brief call to discuss your project in more detail and answer any questions you might have.

My approach typically includes:
1. Detailed project analysis and technical planning
2. Modern, responsive development using React and Node.js
3. Regular progress updates and client collaboration
4. Comprehensive testing and deployment support

I'll be sending you a detailed proposal document separately with technical specifications, timeline, and pricing breakdown.

Would you be available for a 15-20 minute discovery call this week? I'm available most weekdays and can work around your schedule.

Looking forward to potentially working together on this exciting project!

Best regards,
Gavin Anthony
Full-Stack Developer
Email: guidato.llc@gmail.com
Phone: (254) 300-8158
Austin, TX

P.S. Feel free to check out some of my recent work at [your portfolio URL]`;

    // Create mailto link
    const mailtoLink = `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      // Try to open default email client
      window.open(mailtoLink, '_blank');
      
      // Update status to "responded" after successfully opening email
      updateStatusMutation.mutate({ id: request.id, status: 'responded' });
    } catch (error) {
      // Fallback: copy email content to clipboard
      const emailContent = `To: ${request.email}\nSubject: ${subject}\n\n${body}`;
      navigator.clipboard.writeText(emailContent).then(() => {
        alert('Email content copied to clipboard! Please paste it into your email client.');
      }).catch(() => {
        // Final fallback: show email content in a new window
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Email Response</title></head>
              <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h3>Copy this email content:</h3>
                <p><strong>To:</strong> ${request.email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${body}</pre>
              </body>
            </html>
          `);
        } else {
          alert('Please enable popups or copy this email manually:\n\nTo: ' + request.email + '\nSubject: ' + subject + '\n\n' + body);
        }
      });
    }
  };

  const generateProposal = (request: ProjectRequest) => {
    const proposalContent = createProposalDocument(request);
    
    // Create and download the proposal as a text file
    const blob = new Blob([proposalContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proposal-${request.firstName}-${request.lastName}-${request.projectType}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Update status to "proposal-sent" after generating proposal
    updateStatusMutation.mutate({ id: request.id, status: 'proposal-sent' });
  };

  const createProposalDocument = (request: ProjectRequest): string => {
    const projectTypeLabels: Record<string, string> = {
      'fullstack': 'Full-Stack Development',
      'prototype': 'Rapid Prototype/POC',
      'pwa': 'Progressive Web Applications',
      'landing': 'Landing Pages',
      'static': 'Static Web Page Development',
      'integration': 'API Integration',
      'other': 'Custom Development'
    };

    const budgetLabels: Record<string, string> = {
      'under-5k': 'Under $5,000',
      '5k-10k': '$5,000 - $10,000',
      '10k-25k': '$10,000 - $25,000',
      '25k-50k': '$25,000 - $50,000',
      '50k-plus': '$50,000+',
      'discuss': "Let's discuss"
    };

    const timelineLabels: Record<string, string> = {
      'asap': 'ASAP',
      '1-month': 'Within 1 month',
      '2-3-months': '2-3 months',
      '3-6-months': '3-6 months',
      '6-plus-months': '6+ months',
      'flexible': 'Flexible'
    };

    return `
PROFESSIONAL DEVELOPMENT PROPOSAL
${projectTypeLabels[request.projectType] || request.projectType}

=====================================

PROJECT OVERVIEW
=====================================

Client: ${request.firstName} ${request.lastName}
${request.company ? `Company: ${request.company}` : ''}
Email: ${request.email}
Project Type: ${projectTypeLabels[request.projectType] || request.projectType}
Budget Range: ${budgetLabels[request.budget] || request.budget}
Timeline: ${timelineLabels[request.timeline] || request.timeline}
Date: ${new Date().toLocaleDateString()}

=====================================

PROJECT DESCRIPTION
=====================================

${request.description}

${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}

${request.keyFeatures ? `
KEY FEATURES REQUIRED
=====================================

${request.keyFeatures}
` : ''}

${request.techPreferences ? `
TECHNICAL PREFERENCES
=====================================

${request.techPreferences}
` : ''}

${request.designReferences ? `
DESIGN REFERENCES
=====================================

${request.designReferences}
` : ''}

PROPOSED SOLUTION
=====================================

Based on your requirements, I propose developing a comprehensive ${projectTypeLabels[request.projectType]?.toLowerCase() || request.projectType} solution that addresses all your specified needs.

TECHNICAL APPROACH
=====================================

Frontend Development:
- React with TypeScript for type safety and maintainability
- Modern UI components using Tailwind CSS and Shadcn/ui
- Responsive design ensuring optimal experience across all devices
- Performance optimization and accessibility compliance

Backend Development:
- Node.js with Express.js for robust API development
- PostgreSQL database with Drizzle ORM for data management
- RESTful API architecture with proper error handling
- Secure authentication and authorization implementation

DEVELOPMENT PHASES
=====================================

Phase 1: Planning & Architecture (Week 1)
- Requirements analysis and technical specification
- Database schema design and API planning
- UI/UX wireframes and component architecture
- Development environment setup

Phase 2: Core Development (Weeks 2-4)
- Backend API development and testing
- Database implementation and migrations
- Frontend component development
- Integration and functionality testing

Phase 3: Enhancement & Optimization (Week 5)
- Performance optimization and security hardening
- Cross-browser testing and responsive design verification
- User experience refinement and accessibility improvements
- Documentation and deployment preparation

Phase 4: Deployment & Launch (Week 6)
- Production deployment and configuration
- Final testing and quality assurance
- Client training and documentation handover
- Post-launch support and monitoring setup

DELIVERABLES
=====================================

✓ Fully functional web application
✓ Responsive design for all device types
✓ Complete source code with documentation
✓ Production deployment and hosting setup
✓ User documentation and training materials
✓ 30-day post-launch support and bug fixes

INVESTMENT
=====================================

Project Cost: ${budgetLabels[request.budget] || request.budget}
Timeline: ${timelineLabels[request.timeline] || request.timeline}

Payment Schedule:
- 30% upfront to begin development
- 40% at milestone completion (Phase 2)
- 30% upon project completion and deployment

NEXT STEPS
=====================================

1. Review this proposal and provide feedback
2. Schedule a discovery call to discuss technical details
3. Finalize project scope and timeline
4. Sign development agreement and begin work

${request.additionalInfo ? `
ADDITIONAL NOTES
=====================================

${request.additionalInfo}
` : ''}

CONTACT INFORMATION
=====================================

Gavin Anthony
Full-Stack Developer
Email: guidato.llc@gmail.com
Phone: (254) 300-8158
Location: Austin, TX
Portfolio: https://your-portfolio-url.com

Thank you for considering my services for your ${projectTypeLabels[request.projectType]?.toLowerCase() || request.projectType} project. I look forward to discussing how we can bring your vision to life.

---
Generated on ${new Date().toLocaleDateString()} for ${request.company || `${request.firstName} ${request.lastName}`}
    `.trim();
  };

  const { data: requests = [], isLoading, error } = useQuery<ProjectRequest[]>({
    queryKey: ['/api/project-requests'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/project-requests/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-requests'] });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'new': 'default',
      'responded': 'secondary',
      'proposal-sent': 'outline',
      'follow-up': 'secondary',
      'won': 'default',
      'lost': 'destructive',
      'archived': 'destructive',
    };
    
    const labels: Record<string, string> = {
      'new': 'New',
      'responded': 'Responded',
      'proposal-sent': 'Proposal Sent',
      'follow-up': 'Follow-up',
      'won': 'Won',
      'lost': 'Lost',
      'archived': 'Archived',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <p className="text-lg text-slate-600">Loading project requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 text-lg">Failed to load project requests</p>
                <p className="text-slate-600 mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-slate-800" data-testid="dashboard-title">Developer Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">
                  {requests.length} request{requests.length !== 1 ? 's' : ''}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/project-requests'] })}
                  data-testid="button-refresh"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-state">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Project Requests</h3>
                <p className="text-slate-500">New project requests will appear here when submitted.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((request) => (
                  <Card key={request.id} className="border border-slate-200 hover:shadow-md transition-shadow" data-testid={`card-request-${request.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-2" data-testid={`text-project-title-${request.id}`}>
                            {request.projectType.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')} Project
                          </h3>
                          <div className="flex items-center flex-wrap gap-4 text-sm text-slate-600">
                            <div className="flex items-center" data-testid={`text-client-${request.id}`}>
                              <Mail className="w-4 h-4 mr-1" />
                              {request.firstName} {request.lastName}
                            </div>
                            {request.company && (
                              <div className="flex items-center" data-testid={`text-company-${request.id}`}>
                                <Building className="w-4 h-4 mr-1" />
                                {request.company}
                              </div>
                            )}
                            <div className="flex items-center" data-testid={`text-budget-${request.id}`}>
                              <DollarSign className="w-4 h-4 mr-1" />
                              {request.budget.replace('-', ' - ').replace('k', 'K')}
                            </div>
                            <div className="flex items-center" data-testid={`text-timeline-${request.id}`}>
                              <Calendar className="w-4 h-4 mr-1" />
                              {request.timeline.replace('-', ' ')}
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                        <div className="text-sm text-slate-500" data-testid={`text-created-${request.id}`}>
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-slate-800 mb-3">Generated Development Brief:</h4>
                        <div className="text-sm text-slate-700 whitespace-pre-wrap" data-testid={`text-prompt-${request.id}`}>
                          {request.generatedPrompt}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => respondToClient(request)}
                            data-testid={`button-respond-${request.id}`}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Respond
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => generateProposal(request)}
                            data-testid={`button-proposal-${request.id}`}
                          >
                            <File className="w-4 h-4 mr-1" />
                            Create Proposal
                          </Button>
                        </div>
                        
                        <div className="flex space-x-2">
                          {request.status !== 'archived' && request.status !== 'won' && request.status !== 'lost' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ 
                                id: request.id, 
                                status: 'follow-up'
                              })}
                              disabled={updateStatusMutation.isPending}
                              data-testid={`button-follow-up-${request.id}`}
                            >
                              <Reply className="w-4 h-4 mr-1" />
                              Follow-up
                            </Button>
                          )}
                          
                          {(request.status === 'proposal-sent' || request.status === 'follow-up') && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-green-500 text-green-600 hover:bg-green-50"
                                onClick={() => updateStatusMutation.mutate({ 
                                  id: request.id, 
                                  status: 'won'
                                })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-won-${request.id}`}
                              >
                                Won
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500 text-red-600 hover:bg-red-50"
                                onClick={() => updateStatusMutation.mutate({ 
                                  id: request.id, 
                                  status: 'lost'
                                })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-lost-${request.id}`}
                              >
                                Lost
                              </Button>
                            </>
                          )}
                          
                          {request.status !== 'archived' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ 
                                id: request.id, 
                                status: 'archived'
                              })}
                              disabled={updateStatusMutation.isPending}
                              data-testid={`button-archive-${request.id}`}
                            >
                              <Archive className="w-4 h-4 mr-1" />
                              Archive
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
