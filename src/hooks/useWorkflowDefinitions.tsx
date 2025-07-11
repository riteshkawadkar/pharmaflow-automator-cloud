import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWorkflowDefinitions = () => {
  const [workflowDefinitions, setWorkflowDefinitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWorkflowDefinitions();
  }, []);

  const loadWorkflowDefinitions = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_definitions')
        .select('id, name, description, workflow_type, status')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setWorkflowDefinitions(data || []);
    } catch (error) {
      console.error('Error loading workflow definitions:', error);
      toast({
        title: "Error loading workflows",
        description: "Failed to load workflow definitions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getWorkflowDefinitionById = (id: string) => {
    return workflowDefinitions.find(wf => wf.id === id);
  };

  const getWorkflowDefinitionByType = (type: string) => {
    return workflowDefinitions.find(wf => wf.workflow_type === type);
  };

  return {
    workflowDefinitions,
    loading,
    getWorkflowDefinitionById,
    getWorkflowDefinitionByType,
    reload: loadWorkflowDefinitions
  };
};