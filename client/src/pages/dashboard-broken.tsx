import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Mail, Building, DollarSign, Calendar, FileText, Archive, Reply, File, LogOut, Home, Search, Filter, Inbox, CheckCircle, XCircle, Users, Trophy, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import type { ProjectRequest } from "@shared/schema";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectTypeFilter, setProjectTypeFilter] = useState('all');

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/logout');
    },
    onSuccess: () => {
      // Invalidate auth status to update authentication state
      queryClient.invalidateQueries({ queryKey: ['/api/auth/status'] });
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out",
      });
      // Redirect to home page
      setLocation('/');
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  const respondToClient = (request: ProjectRequest) => {
    const projectTypeLabels: Record<string, string> = {
      'fullstack': 'Full-Stack Development',
      'prototype': 'Rapid Prototype/POC',
      'redesign': 'Website Redesign',
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

  const followUpClient = (request: ProjectRequest) => {
    const projectTypeLabels: Record<string, string> = {
      'fullstack': 'Full-Stack Development',
      'prototype': 'Rapid Prototype/POC',
      'redesign': 'Website Redesign',
      'landing': 'Landing Pages',
      'static': 'Static Web Page Development',
      'integration': 'API Integration',
      'other': 'Custom Development'
    };

    const subject = `Follow-up: ${projectTypeLabels[request.projectType]} Project`;
    const body = `Hi ${request.firstName},

I wanted to follow up on your ${projectTypeLabels[request.projectType]?.toLowerCase() || request.projectType} project inquiry. I hope you received my previous response and proposal.

I'm still very interested in working with you on this project and wanted to check if you have any questions or need any clarification about:

- The technical approach and implementation details
- Timeline and project phases
- Pricing and payment structure
- Next steps to get started

I understand you might be evaluating different options, and I'd be happy to discuss any concerns or additional requirements you might have.

If you'd like to move forward, we could schedule a brief call to finalize the details and get your project started. I have availability this week and next.

Looking forward to hearing from you soon!

Best regards,
Gavin Anthony
Full-Stack Developer
Email: guidato.llc@gmail.com

Austin, TX

P.S. I'm committed to delivering high-quality work and ensuring your complete satisfaction with the final product.`;

    // Create mailto link
    const mailtoLink = `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      // Try to open default email client
      window.open(mailtoLink, '_blank');
      
      // Update status to "follow-up" after successfully opening email
      updateStatusMutation.mutate({ id: request.id, status: 'follow-up' });
    } catch (error) {
      // Fallback: copy email content to clipboard
      const emailContent = `To: ${request.email}\nSubject: ${subject}\n\n${body}`;
      navigator.clipboard.writeText(emailContent).then(() => {
        alert('Follow-up email content copied to clipboard! Please paste it into your email client.');
      }).catch(() => {
        // Final fallback: show email content in a new window
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Follow-up Email</title></head>
              <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h3>Copy this follow-up email content:</h3>
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
      'redesign': 'Website Redesign',
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

  // Filter and categorize requests
  const filteredAndCategorizedRequests = useMemo(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.projectType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply project type filter
    if (projectTypeFilter !== 'all') {
      filtered = filtered.filter(request => request.projectType === projectTypeFilter);
    }

    // Categorize requests
    const active = filtered.filter(request => 
      !['archived', 'won', 'lost'].includes(request.status)
    );
    
    const completed = filtered.filter(request => 
      ['won', 'lost'].includes(request.status)
    );
    
    const archived = filtered.filter(request => 
      request.status === 'archived'
    );

    return {
      all: filtered,
      active,
      completed,
      archived
    };
  }, [requests, searchTerm, statusFilter, projectTypeFilter]);

  // Get counts for tabs
  const requestCounts = useMemo(() => ({
    active: filteredAndCategorizedRequests.active.length,
    completed: filteredAndCategorizedRequests.completed.length,
    archived: filteredAndCategorizedRequests.archived.length,
    all: filteredAndCategorizedRequests.all.length
  }), [filteredAndCategorizedRequests]);

  // Get current requests based on active tab
  const currentRequests = filteredAndCategorizedRequests[activeTab as keyof typeof filteredAndCategorizedRequests] || [];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800" data-testid="dashboard-title">Developer Dashboard</h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <span className="text-sm text-slate-600 order-last sm:order-first">
                  {requests.length} total request{requests.length !== 1 ? 's' : ''}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/project-requests'] })}
                    data-testid="button-refresh"
                    className="flex-shrink-0"
                  >
                    <Clock className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGoHome}
                    data-testid="button-home"
                    className="flex-shrink-0"
                  >
                    <Home className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Portfolio</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                    className="flex-shrink-0"
                  >
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, email, company, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40" data-testid="select-status-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
                    <SelectTrigger className="w-40" data-testid="select-type-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="fullstack">Full-Stack</SelectItem>
                      <SelectItem value="prototype">Prototype</SelectItem>
                      <SelectItem value="pwa">PWA</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="static">Static Site</SelectItem>
                      <SelectItem value="integration">API Integration</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tabbed Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active" className="flex items-center gap-2" data-testid="tab-active">
                  <Inbox className="w-4 h-4" />
                  <span className="hidden sm:inline">Active</span>
                  <Badge variant="secondary" className="ml-1">{requestCounts.active}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2" data-testid="tab-completed">
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Completed</span>
                  <Badge variant="secondary" className="ml-1">{requestCounts.completed}</Badge>
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center gap-2" data-testid="tab-archived">
                  <Archive className="w-4 h-4" />
                  <span className="hidden sm:inline">Archived</span>
                  <Badge variant="secondary" className="ml-1">{requestCounts.archived}</Badge>
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2" data-testid="tab-all">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">All</span>
                  <Badge variant="secondary" className="ml-1">{requestCounts.all}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                {renderRequestsList(currentRequests, 'No active project requests')}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {renderRequestsList(currentRequests, 'No completed project requests')}
              </TabsContent>

              <TabsContent value="archived" className="mt-6">
                {renderRequestsList(currentRequests, 'No archived project requests')}
              </TabsContent>

              <TabsContent value="all" className="mt-6">
                {renderRequestsList(currentRequests, 'No project requests match your filters')}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function renderRequestsList(requestsToRender: ProjectRequest[], emptyMessage: string) {
    if (requestsToRender.length === 0) {
      return (
        <div className="text-center py-12" data-testid="empty-state">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">{emptyMessage}</h3>
          <p className="text-slate-500">
            {requests.length === 0 
              ? "New project requests will appear here when submitted." 
              : "Try adjusting your search or filters."
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {requestsToRender.map((request) => (
                  <Card key={request.id} className="border border-slate-200 hover:shadow-md transition-shadow" data-testid={`card-request-${request.id}`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2" data-testid={`text-project-title-${request.id}`}>
                            {request.projectType.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')} Project
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-4 text-sm text-slate-600">
                            <div className="flex items-center" data-testid={`text-client-${request.id}`}>
                              <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{request.firstName} {request.lastName}</span>
                            </div>
                            {request.company && (
                              <div className="flex items-center" data-testid={`text-company-${request.id}`}>
                                <Building className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{request.company}</span>
                              </div>
                            )}
                            <div className="flex items-center" data-testid={`text-budget-${request.id}`}>
                              <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{request.budget.replace('-', ' - ').replace('k', 'K')}</span>
                            </div>
                            <div className="flex items-center" data-testid={`text-timeline-${request.id}`}>
                              <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{request.timeline.replace('-', ' ')}</span>
                            </div>
                            <div className="col-span-full sm:col-span-1 lg:col-span-auto">
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500 flex-shrink-0 lg:text-right" data-testid={`text-created-${request.id}`}>
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
                              onClick={() => followUpClient(request)}
                              disabled={updateStatusMutation.isPending}
                              data-testid={`button-follow-up-${request.id}`}
                            >
                              <Reply className="w-4 h-4 mr-1" />
                              Follow-up
                            </Button>
                          )}
                          
                          {request.status === 'proposal-sent' && (
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
          </TabsContent>
        </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function renderRequestsList(requestsToRender: ProjectRequest[], emptyMessage: string) {
    if (requestsToRender.length === 0) {
      return (
        <div className="text-center py-12" data-testid="empty-state">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">{emptyMessage}</h3>
          <p className="text-slate-500">
            {requests.length === 0 
              ? "New project requests will appear here when submitted." 
              : "Try adjusting your search or filters."
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {requestsToRender.map((request) => (
          <Card key={request.id} className="border border-slate-200 hover:shadow-md transition-shadow" data-testid={`card-request-${request.id}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2" data-testid={`text-project-title-${request.id}`}>
                    {request.projectType.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')} Project
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-4 text-sm text-slate-600">
                    <div className="flex items-center" data-testid={`text-client-${request.id}`}>
                      <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{request.firstName} {request.lastName}</span>
                    </div>
                    {request.company && (
                      <div className="flex items-center" data-testid={`text-company-${request.id}`}>
                        <Building className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{request.company}</span>
                      </div>
                    )}
                    <div className="flex items-center" data-testid={`text-budget-${request.id}`}>
                      <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{request.budget.replace('-', ' - ').replace('k', 'K')}</span>
                    </div>
                    <div className="flex items-center" data-testid={`text-timeline-${request.id}`}>
                      <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{request.timeline.replace('-', ' ')}</span>
                    </div>
                    <div className="col-span-full sm:col-span-1 lg:col-span-auto">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-500 flex-shrink-0 lg:text-right" data-testid={`text-created-${request.id}`}>
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
                      onClick={() => followUpClient(request)}
                      disabled={updateStatusMutation.isPending}
                      data-testid={`button-follow-up-${request.id}`}
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Follow-up
                    </Button>
                  )}
                  
                  {request.status === 'proposal-sent' && (
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
    );
  }
}
