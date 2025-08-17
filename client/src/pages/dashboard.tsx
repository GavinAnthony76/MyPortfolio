import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Mail, Building, DollarSign, Calendar, FileText, Archive, Reply, File, LogOut, Home, Search, Filter, Inbox, CheckCircle, XCircle, Users, Trophy, Trash2, ChevronDown, ChevronUp, Play, CheckSquare, User } from "lucide-react";
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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/logout');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/status'] });
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out",
      });
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

  const { data: requests = [], isLoading, error } = useQuery<ProjectRequest[]>({
    queryKey: ['/api/project-requests'],
  });

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest('PATCH', `/api/project-requests/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-requests'] });
      toast({
        title: "Status updated",
        description: "Project request status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed", 
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
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
      !['archived', 'won', 'lost', 'complete'].includes(request.status)
    );
    
    const completed = filtered.filter(request => 
      ['won', 'lost', 'complete'].includes(request.status)
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

  const toggleCardExpanded = (requestId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  };

  // Get counts for tabs
  const requestCounts = useMemo(() => ({
    active: filteredAndCategorizedRequests.active.length,
    completed: filteredAndCategorizedRequests.completed.length,
    archived: filteredAndCategorizedRequests.archived.length,
    all: filteredAndCategorizedRequests.all.length
  }), [filteredAndCategorizedRequests]);

  // Get current requests based on active tab
  const currentRequests = filteredAndCategorizedRequests[activeTab as keyof typeof filteredAndCategorizedRequests] || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': { variant: 'default' as const, label: 'New', icon: Mail },
      'responded': { variant: 'secondary' as const, label: 'Responded', icon: Reply },
      'proposal-sent': { variant: 'default' as const, label: 'Proposal Sent', icon: File },
      'follow-up': { variant: 'outline' as const, label: 'Follow-up', icon: Clock },
      'in-progress': { variant: 'default' as const, label: 'In Progress', icon: Play },
      'complete': { variant: 'default' as const, label: 'Complete', icon: CheckSquare },
      'won': { variant: 'default' as const, label: 'Won', icon: CheckCircle },
      'lost': { variant: 'secondary' as const, label: 'Lost', icon: XCircle },
      'archived': { variant: 'outline' as const, label: 'Archived', icon: Archive }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return <Badge variant="secondary">{status}</Badge>;

    const Icon = config.icon;
    const className = status === 'in-progress' ? 'bg-blue-600 text-white' : 
                     (status === 'complete' || status === 'won') ? 'bg-green-600 text-white' : '';
    
    return (
      <Badge variant={config.variant} className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

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



    const projectTypeLabel = projectTypeLabels[request.projectType] || request.projectType;

    const companyInfo = request.company ? ` from ${request.company}` : '';

    const subject = `Re: ${projectTypeLabel} Project Request`;
    const body = `Hi ${request.firstName},

Thank you for your interest in ${projectTypeLabel.toLowerCase()} services${companyInfo}. I've reviewed your project requirements and am excited to work with you.

PROJECT: ${projectTypeLabel}
CLIENT: ${request.firstName} ${request.lastName}${companyInfo}
TIMELINE: ${request.timeline}

YOUR REQUIREMENTS:
${request.description}

I'll develop a comprehensive solution with modern design, clean code, performance optimization, security implementation, and full documentation.

NEXT STEPS:
1. Schedule discovery call for detailed requirements
2. Provide complete proposal with timeline and pricing
3. Begin development work

For your convenience, I accept payments via PayPal with flexible terms.

I'm excited to bring your vision to life! Would you be available for a call this week?

Best regards,
Gavin Anthony
Full-Stack Developer
projects@gavineanthony.com
(254) 300-8158`;

    // Update status to 'responded'
    updateStatusMutation.mutate({ id: request.id, status: 'responded' });

    const mailtoLink = `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.open(mailtoLink, '_self');
    } catch (error) {
      console.error('Error opening email client:', error);
      navigator.clipboard.writeText(`Subject: ${subject}\n\nTo: ${request.email}\n\n${body}`).then(() => {
        toast({
          title: "Email content copied",
          description: "Response copied to clipboard - please paste into your email client",
          duration: 6000,
        });
      });
    }
  };

  const followUpClient = (request: ProjectRequest) => {
    const subject = `Following up on your project request`;
    const body = `Hi ${request.firstName},

I wanted to follow up on the project request you submitted recently. I hope you received my previous response regarding your ${request.projectType} project.

I'm still very interested in working with you on this project and would love to discuss how I can help bring your vision to life.

If you have any questions or would like to schedule a call, please don't hesitate to reach out. For your convenience, I accept payments via PayPal with flexible terms.

Looking forward to hearing from you!

Best regards,
Gavin Anthony
Full-Stack Developer
projects@gavineanthony.com
(254) 300-8158
`;

    // Update status to 'follow-up'
    updateStatusMutation.mutate({ id: request.id, status: 'follow-up' });

    const mailtoLink = `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.open(mailtoLink, '_self');
    } catch (error) {
      console.error('Error opening email client:', error);
      navigator.clipboard.writeText(`Subject: ${subject}\n\nTo: ${request.email}\n\n${body}`).then(() => {
        toast({
          title: "Email content copied",
          description: "Follow-up copied to clipboard - please paste into your email client",
          duration: 6000,
        });
      });
    }
  };

  const generateProposal = (request: ProjectRequest) => {
    const projectTypeLabels: Record<string, string> = {
      'fullstack': 'Full-Stack Development',
      'prototype': 'Rapid Prototype/POC',
      'pwa': 'Progressive Web Applications',
      'landing': 'Landing Pages',
      'static': 'Static Web Page Development',
      'integration': 'API Integration',
      'other': 'Custom Development'
    };

    const serviceDescriptions: Record<string, string> = {
      'fullstack': 'Complete web application development with modern frontend, robust backend, database integration, user authentication, and comprehensive testing.',
      'prototype': 'Rapid development of proof-of-concept applications to validate ideas and demonstrate core functionality quickly.',
      'pwa': 'Modern Progressive Web Applications with offline capabilities, push notifications, and app-like user experiences.',
      'landing': 'High-converting landing pages with modern design, performance optimization, and lead generation features.',
      'static': 'Professional static websites with modern design, performance optimization, and content management capabilities.',
      'integration': 'Seamless integration with third-party APIs, payment processors, analytics tools, and external services.',
      'other': 'Custom development solutions tailored to your specific business needs and technical requirements.'
    };

    const projectTypeLabel = projectTypeLabels[request.projectType] || request.projectType;
    const serviceDescription = serviceDescriptions[request.projectType] || 'Custom development solution tailored to your specific requirements.';
    const companyInfo = request.company ? ` at ${request.company}` : '';

    const subject = `Proposal: ${projectTypeLabel} for ${request.firstName} ${request.lastName}`;
    const proposalBody = `Hi ${request.firstName},

Thank you for your interest in ${projectTypeLabel.toLowerCase()} services${companyInfo}. I've carefully reviewed your project requirements and am excited to present this comprehensive proposal.

DEVELOPMENT PROPOSAL
Client: ${request.firstName} ${request.lastName}${companyInfo}
Project Type: ${projectTypeLabel}
Date: ${new Date().toLocaleDateString()}

PROJECT OVERVIEW
${serviceDescription}

YOUR REQUIREMENTS
${request.description}

PROPOSED SOLUTION
Based on your requirements, I will develop a comprehensive solution that includes:

• Modern, responsive design that works across all devices
• Clean, maintainable code following industry best practices
• Performance optimization for fast loading and smooth user experience
• Security implementations to protect user data and transactions
• Testing and quality assurance throughout development
• Documentation and deployment assistance

DEVELOPMENT APPROACH
1. Discovery & Planning: Detailed requirements analysis and technical planning
2. Design Phase: User interface and user experience design
3. Development: Implementation of core functionality and features
4. Testing: Comprehensive testing across devices and browsers
5. Deployment: Assistance with hosting setup and launch
6. Support: Post-launch support and guidance

TIMELINE
Target completion: ${request.timeline}
(Actual timeline will be refined during our discovery phase)

INVESTMENT
Pricing is based on the selected project type with transparent, fixed rates.
Final pricing details will be provided during our initial consultation call.

PAYMENT OPTIONS
For your convenience, I accept payments via:
• PayPal: Payment link will be provided upon agreement
• Bank transfer (details provided upon agreement)
• Payment can be structured as 50% upfront, 50% upon completion

NEXT STEPS
1. Schedule a discovery call to discuss requirements in detail
2. Finalize project scope and timeline
3. Sign development agreement
4. Begin development work

I'm excited about the opportunity to work with you on this project and help bring your vision to life. Would you be available for a brief call this week to discuss the details?

Best regards,
Gavin Anthony
Full-Stack Developer
projects@gavineanthony.com
(254) 300-8158
Austin, TX

---
Proposal generated on ${new Date().toLocaleDateString()} for ${request.company || `${request.firstName} ${request.lastName}`}`;

    // Update status to 'proposal-sent'
    updateStatusMutation.mutate({ id: request.id, status: 'proposal-sent' });

    // Create and download the proposal as a text file
    const blob = new Blob([proposalBody], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal-${request.firstName}-${request.lastName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Proposal generated",
      description: "Proposal has been downloaded and status updated",
    });
  };

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
      <div className="space-y-3">
        {requestsToRender.map((request) => {
          const isExpanded = expandedCards.has(request.id);
          return (
            <Collapsible key={request.id} open={isExpanded} onOpenChange={() => toggleCardExpanded(request.id)}>
              <Card className="border border-slate-200 hover:shadow-md transition-shadow" data-testid={`card-request-${request.id}`}>
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-800" data-testid={`text-project-title-${request.id}`}>
                            {request.projectType.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')} Project
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center" data-testid={`text-client-${request.id}`}>
                            <User className="w-4 h-4 mr-1" />
                            <span>{request.firstName} {request.lastName}</span>
                          </div>
                          {request.company && (
                            <div className="flex items-center" data-testid={`text-company-${request.id}`}>
                              <Building className="w-4 h-4 mr-1" />
                              <span>{request.company}</span>
                            </div>
                          )}
                          <div className="flex items-center" data-testid={`text-timeline-${request.id}`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{request.timeline.replace('-', ' ')}</span>
                          </div>
                          <div className="flex items-center text-slate-500" data-testid={`text-created-${request.id}`}>
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="px-4 pb-4 pt-0 border-t border-slate-100">
                    {/* Project Description */}
                    <div className="mb-4">
                      <h4 className="font-medium text-slate-800 mb-2">Project Description:</h4>
                      <p className="text-sm text-slate-700">{request.description}</p>
                    </div>

                    {/* Generated Brief */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-slate-800 mb-3">Generated Development Brief:</h4>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap" data-testid={`text-prompt-${request.id}`}>
                        {request.generatedPrompt}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
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

                      {request.status !== 'archived' && request.status !== 'won' && request.status !== 'lost' && request.status !== 'complete' && (
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

                      {/* Status Update Buttons */}
                      {request.status !== 'in-progress' && !['archived', 'won', 'lost', 'complete'].includes(request.status) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: request.id, 
                            status: 'in-progress'
                          })}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`button-in-progress-${request.id}`}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          In Progress
                        </Button>
                      )}

                      {request.status === 'in-progress' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: request.id, 
                            status: 'complete'
                          })}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`button-complete-${request.id}`}
                        >
                          <CheckSquare className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}

                      {/* Won/Lost buttons - show for proposal-sent, follow-up, and in-progress until decision is made */}
                      {['proposal-sent', 'follow-up', 'in-progress'].includes(request.status) && (
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
                            <CheckCircle className="w-4 h-4 mr-1" />
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
                            <XCircle className="w-4 h-4 mr-1" />
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
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600">Loading dashboard...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <XCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                <p className="text-red-600">Error loading dashboard</p>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/project-requests'] })}
                  className="mt-4"
                >
                  Retry
                </Button>
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
}