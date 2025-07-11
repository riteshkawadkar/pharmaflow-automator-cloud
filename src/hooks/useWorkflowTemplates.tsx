import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { 
  drugApprovalWorkflowTemplate, 
  manufacturingChangeWorkflowTemplate,
  simpleDocumentApprovalTemplate,
  conditionalQualityControlTemplate,
  complexSupplierQualificationTemplate,
  loopBasedValidationTemplate
} from "@/data/sampleWorkflowTemplate";

type WorkflowType = Database['public']['Enums']['workflow_type'];
type WorkflowStatus = Database['public']['Enums']['workflow_status'];

export const useWorkflowTemplates = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const templates = [
    drugApprovalWorkflowTemplate,
    manufacturingChangeWorkflowTemplate,
    simpleDocumentApprovalTemplate,
    conditionalQualityControlTemplate,
    complexSupplierQualificationTemplate,
    loopBasedValidationTemplate
  ];

  const createWorkflowTemplates = async () => {
    if (!supabase.auth.getUser()) {
      toast({
        title: "Authentication required",
        description: "Please log in to create workflow templates.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Check if templates already exist
      const { data: existingWorkflows } = await supabase
        .from('workflow_definitions')
        .select('workflow_type')
        .in('workflow_type', templates.map(t => t.workflow_type as WorkflowType));

      const existingTypes = new Set(existingWorkflows?.map(w => w.workflow_type) || []);
      const templatesToCreate = templates.filter(t => !existingTypes.has(t.workflow_type as WorkflowType));

      if (templatesToCreate.length === 0) {
        toast({
          title: "Templates already exist",
          description: "All workflow templates have already been created.",
        });
        return;
      }

      // Create workflow definitions
      const workflowsToInsert = templatesToCreate.map(template => ({
        name: template.name,
        description: template.description,
        workflow_type: template.workflow_type as WorkflowType,
        version: template.version,
        status: 'active' as WorkflowStatus,
        flow_data: template.flow_data,
        created_by: user.id
      }));

      const { error } = await supabase
        .from('workflow_definitions')
        .insert(workflowsToInsert);

      if (error) throw error;

      toast({
        title: "Templates created successfully",
        description: `Created ${templatesToCreate.length} workflow templates.`,
      });

    } catch (error) {
      console.error('Error creating workflow templates:', error);
      toast({
        title: "Error creating templates",
        description: "Failed to create workflow templates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createWorkflowTemplates,
    isCreating,
    templates
  };
};