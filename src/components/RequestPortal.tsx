import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Clock, Users, Workflow } from 'lucide-react';
import { useWorkflowDefinitions } from '@/hooks/useWorkflowDefinitions';
import { DynamicForm } from '@/components/DynamicForm';
import { WorkflowFormGenerator } from '@/lib/form-generator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WorkflowEngine } from '@/lib/workflow-engine';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

type WorkflowType = Database['public']['Enums']['workflow_type'];

interface RequestPortalProps {
  onBack?: () => void;
}

export const RequestPortal: React.FC<RequestPortalProps> = ({ onBack }) => {
  const { workflowDefinitions, loading } = useWorkflowDefinitions();
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleWorkflowSelect = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setFormData({});
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmitRequest = async (submissionData: Record<string, any>) => {
    if (!user || !selectedWorkflow) return;

    setIsSubmitting(true);
    try {
      // Create the request with auto-generated form data
      const requestData = {
        requester_id: user.id,
        title: `${selectedWorkflow.name} Request`,
        description: selectedWorkflow.description || 'Auto-generated request from workflow',
        workflow_type: selectedWorkflow.workflow_type as WorkflowType,
        priority: 'medium' as const,
        justification: submissionData.justification || 'Generated from workflow form',
        business_impact: submissionData.business_impact || '',
        regulatory_requirements: submissionData.regulatory_requirements || '',
        workflow_data: submissionData,
        status: 'submitted' as const,
        submitted_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('requests')
        .insert([requestData])
        .select('id')
        .single();

      if (error) throw error;

      // Start workflow execution
      try {
        await WorkflowEngine.startWorkflowExecution(data.id);
        console.log('Workflow execution started for request:', data.id);
      } catch (workflowError: any) {
        console.error('Failed to start workflow execution:', workflowError);
      }

      toast({
        title: "Request submitted successfully",
        description: "Your workflow request has been submitted and processing has started.",
      });

      navigate('/requests');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (draftData: Record<string, any>) => {
    if (!user || !selectedWorkflow) return;

    try {
      const requestData = {
        requester_id: user.id,
        title: `${selectedWorkflow.name} Request (Draft)`,
        description: selectedWorkflow.description || 'Auto-generated request from workflow',
        workflow_type: selectedWorkflow.workflow_type as WorkflowType,
        priority: 'medium' as const,
        justification: draftData.justification || 'Generated from workflow form',
        business_impact: draftData.business_impact || '',
        regulatory_requirements: draftData.regulatory_requirements || '',
        workflow_data: draftData,
        status: 'draft' as const
      };

      const { error } = await supabase
        .from('requests')
        .insert([requestData]);

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your workflow request has been saved as a draft.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading available workflows...</p>
        </div>
      </div>
    );
  }

  if (selectedWorkflow) {
    const generatedForm = WorkflowFormGenerator.generateFormFromWorkflow(selectedWorkflow);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedWorkflow(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workflows
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedWorkflow.name}</h2>
            <p className="text-muted-foreground">{selectedWorkflow.description}</p>
          </div>
        </div>

        <DynamicForm
          form={generatedForm}
          formData={formData}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmitRequest}
          onSaveDraft={handleSaveDraft}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // Active workflows only
  const activeWorkflows = workflowDefinitions.filter(w => w.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Request Portal</h2>
          <p className="text-muted-foreground">
            Browse available workflows and submit requests with auto-generated forms
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      {activeWorkflows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Workflows</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are currently no active workflows available for requests. 
              Contact your administrator to publish workflows.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeWorkflows.map((workflow) => {
            const generatedForm = WorkflowFormGenerator.generateFormFromWorkflow(workflow);
            const fieldCount = generatedForm.sections.reduce((total, section) => total + section.fields.length, 0);
            const hasDocuments = generatedForm.sections.some(section => 
              section.fields.some(field => field.type === 'file')
            );
            const hasApprovals = workflow.flow_data.nodes.some((node: any) => 
              node.data?.stepType === 'approval'
            );

            return (
              <Card 
                key={workflow.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-border/50"
                onClick={() => handleWorkflowSelect(workflow)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {workflow.workflow_type.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription className="line-clamp-2">
                    {workflow.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{fieldCount} fields</span>
                      </div>
                      {hasDocuments && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Documents</span>
                        </div>
                      )}
                      {hasApprovals && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Approvals</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full" size="sm">
                        Start Request
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated {new Date(workflow.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};