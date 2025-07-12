import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Download, Copy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkflowBuilderWrapper } from "@/components/WorkflowBuilder/WorkflowBuilderWrapper";
import { WorkflowDefinition } from "@/types/workflow-builder";
import { WORKFLOW_CONFIGS } from "@/types/workflows";

type ViewMode = 'list' | 'builder';

export default function WorkflowManagement() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [workflowDefinitions, setWorkflowDefinitions] = useState<WorkflowDefinition[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkflowDefinitions();
    }
  }, [user]);

  const fetchWorkflowDefinitions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workflow_definitions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setWorkflowDefinitions((data || []).map(item => ({
        ...item,
        flow_data: typeof item.flow_data === 'string' 
          ? JSON.parse(item.flow_data) 
          : item.flow_data || { nodes: [], edges: [] }
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch workflow definitions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewWorkflow = () => {
    setSelectedWorkflow(undefined);
    setViewMode('builder');
  };

  const editWorkflow = (workflow: WorkflowDefinition) => {
    setSelectedWorkflow(workflow);
    setViewMode('builder');
  };

  const duplicateWorkflow = async (workflow: WorkflowDefinition) => {
    try {
      const { data, error } = await supabase
        .from('workflow_definitions')
        .insert([{
          name: `${workflow.name} (Copy)`,
          description: workflow.description,
          workflow_type: workflow.workflow_type as any,
          status: 'draft' as const,
          flow_data: workflow.flow_data as any,
          created_by: user!.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Workflow Duplicated",
        description: "Workflow has been successfully duplicated",
      });
      
      fetchWorkflowDefinitions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteWorkflow = async (workflow: WorkflowDefinition) => {
    if (!confirm(`Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('workflow_definitions')
        .delete()
        .eq('id', workflow.id);

      if (error) throw error;
      
      toast({
        title: "Workflow Deleted",
        description: "Workflow has been successfully deleted",
      });
      
      fetchWorkflowDefinitions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportWorkflow = (workflow: WorkflowDefinition) => {
    const exportData = {
      name: workflow.name,
      description: workflow.description,
      workflow_type: workflow.workflow_type,
      flow_data: workflow.flow_data
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const getWorkflowTypeLabel = (type: string) => {
    const config = WORKFLOW_CONFIGS.find(c => c.type === type);
    return config?.label || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <div className="text-center">Please log in to access workflow management.</div>
      </div>
    );
  }

  if (viewMode === 'builder') {
    return (
      <WorkflowBuilderWrapper
        workflowDefinition={selectedWorkflow}
        onBack={() => {
          setViewMode('list');
          setSelectedWorkflow(undefined);
          fetchWorkflowDefinitions(); // Refresh the list
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflow Management</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage visual workflows for your pharmaceutical processes
            </p>
          </div>
          <Button onClick={createNewWorkflow} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading workflows...</div>
        ) : workflowDefinitions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Workflows Found</CardTitle>
              <CardDescription>
                Get started by creating your first visual workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Create visual workflows to standardize your pharmaceutical processes
                </p>
                <Button onClick={createNewWorkflow} variant="outline">
                  Create First Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowDefinitions.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {getWorkflowTypeLabel(workflow.workflow_type)}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {workflow.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {workflow.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-muted-foreground mb-4">
                    <div>Version: {workflow.version}</div>
                    <div>Updated: {new Date(workflow.updated_at).toLocaleDateString()}</div>
                    <div>
                      Nodes: {workflow.flow_data?.nodes?.length || 0} | 
                      Edges: {workflow.flow_data?.edges?.length || 0}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editWorkflow(workflow)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateWorkflow(workflow)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportWorkflow(workflow)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWorkflow(workflow)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
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