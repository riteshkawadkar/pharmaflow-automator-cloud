import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RequestForm } from "@/components/RequestForm";
import { Plus, Settings, Database } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkflowTemplates } from "@/hooks/useWorkflowTemplates";
import { useWorkflowTypes } from "@/hooks/useWorkflowTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Requests() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const { createWorkflowTemplates, isCreating } = useWorkflowTemplates();
  const { getWorkflowTypeLabel } = useWorkflowTypes();

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast({
        title: "Error loading requests",
        description: "Failed to load your requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">Please log in to access requests.</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-subtle pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
              className="mb-4"
            >
              ← Back to Requests
            </Button>
          </div>
          <RequestForm onSuccess={() => {
            setShowForm(false);
            loadRequests();
          }} />
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'default';
      case 'under_review': return 'outline';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Requests</h1>
            <p className="text-muted-foreground mt-2">
              Manage your pharmaceutical workflow requests
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={createWorkflowTemplates}
              disabled={isCreating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              {isCreating ? 'Creating...' : 'Initialize Templates'}
            </Button>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </div>
        </div>

        {loadingRequests ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">Loading requests...</div>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Requests</CardTitle>
              <CardDescription>
                No requests found. Create your first request to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't created any requests yet.
                </p>
                <Button onClick={() => setShowForm(true)} variant="outline">
                  Create First Request
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Requests</CardTitle>
                <CardDescription>
                  {requests.length} request{requests.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
            </Card>
            
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {request.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(request.priority)}>
                          {request.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {getWorkflowTypeLabel(request.workflow_type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Created: {new Date(request.created_at).toLocaleDateString()}</span>
                    {request.target_completion_date && (
                      <span>Target: {new Date(request.target_completion_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}