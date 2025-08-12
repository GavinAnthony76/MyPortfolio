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
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      'new': 'default',
      'in-review': 'secondary',
      'archived': 'destructive',
    };
    
    const labels: Record<string, string> = {
      'new': 'New',
      'in-review': 'In Review',
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
                            data-testid={`button-respond-${request.id}`}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Respond
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            data-testid={`button-proposal-${request.id}`}
                          >
                            <File className="w-4 h-4 mr-1" />
                            Create Proposal
                          </Button>
                        </div>
                        
                        {request.status !== 'archived' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ 
                              id: request.id, 
                              status: request.status === 'new' ? 'in-review' : 'archived' 
                            })}
                            disabled={updateStatusMutation.isPending}
                            data-testid={`button-update-status-${request.id}`}
                          >
                            <Archive className="w-4 h-4 mr-1" />
                            {request.status === 'new' ? 'Mark In Review' : 'Archive'}
                          </Button>
                        )}
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
