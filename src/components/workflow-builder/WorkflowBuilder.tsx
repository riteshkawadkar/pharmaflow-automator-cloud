import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { WorkflowNode } from './WorkflowNode';
import { NodePalette } from './NodePalette';
import { WorkflowBuilderToolbar } from './WorkflowBuilderToolbar';
import { NodePropertiesPanel } from './NodePropertiesPanel';
import { WorkflowStepType, WorkflowDefinition } from '@/types/workflow-builder';
import { WorkflowType } from '@/types/workflows';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  workflow: WorkflowNode,
};

interface WorkflowBuilderProps {
  workflowDefinition?: WorkflowDefinition;
  onBack: () => void;
}

export const WorkflowBuilder = ({ workflowDefinition, onBack }: WorkflowBuilderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Workflow metadata
  const [workflowName, setWorkflowName] = useState(workflowDefinition?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflowDefinition?.description || '');
  const [workflowType, setWorkflowType] = useState<WorkflowType>(
    (workflowDefinition?.workflow_type as WorkflowType) || 'drug_approval'
  );
  const [workflowStatus, setWorkflowStatus] = useState(workflowDefinition?.status || 'draft');
  const [workflowId, setWorkflowId] = useState(workflowDefinition?.id);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflowDefinition?.flow_data?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflowDefinition?.flow_data?.edges || []
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const stepType = event.dataTransfer.getData('application/reactflow') as WorkflowStepType;

      if (typeof stepType === 'undefined' || !stepType) {
        return;
      }

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${stepType}-${Date.now()}`,
        type: 'workflow',
        position,
        data: {
          label: getStepLabel(stepType),
          stepType,
          description: getStepDescription(stepType),
          configuration: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event: React.DragEvent, stepType: WorkflowStepType) => {
    event.dataTransfer.setData('application/reactflow', stepType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getStepLabel = (stepType: WorkflowStepType): string => {
    const labels: Record<WorkflowStepType, string> = {
      start: 'Start',
      form_input: 'Form Input',
      approval: 'Approval',
      review: 'Review',
      notification: 'Notification',
      decision: 'Decision',
      parallel_gateway: 'Parallel Gateway',
      exclusive_gateway: 'Exclusive Gateway',
      end: 'End',
      document_upload: 'Document Upload',
      document_review: 'Document Review',
      quality_check: 'Quality Check',
      regulatory_check: 'Regulatory Check',
      compliance_verification: 'Compliance Verification',
      risk_assessment: 'Risk Assessment',
      technical_review: 'Technical Review',
      management_approval: 'Management Approval',
      batch_record: 'Batch Record',
      test_execution: 'Test Execution',
      calibration: 'Calibration',
      training_verification: 'Training Verification',
      supplier_verification: 'Supplier Verification',
      deviation_investigation: 'Deviation Investigation',
      corrective_action: 'Corrective Action',
      change_control: 'Change Control',
      validation_step: 'Validation Step',
      equipment_qualification: 'Equipment Qualification',
      sample_testing: 'Sample Testing',
      data_analysis: 'Data Analysis',
      audit_step: 'Audit Step',
      capa_implementation: 'CAPA Implementation',
    };
    return labels[stepType];
  };

  const getStepDescription = (stepType: WorkflowStepType): string => {
    const descriptions: Record<WorkflowStepType, string> = {
      start: 'Workflow starting point',
      form_input: 'Collect data from user',
      approval: 'Requires approval from designated approvers',
      review: 'Document or data review step',
      notification: 'Send notifications to stakeholders',
      decision: 'Conditional branching based on criteria',
      parallel_gateway: 'Split workflow into parallel paths',
      exclusive_gateway: 'Choose one path based on conditions',
      end: 'Workflow completion point',
      document_upload: 'Upload and manage documents',
      document_review: 'Review and validate documents',
      quality_check: 'Quality control verification',
      regulatory_check: 'Regulatory compliance verification',
      compliance_verification: 'Verify compliance requirements',
      risk_assessment: 'Evaluate and assess risks',
      technical_review: 'Technical evaluation and review',
      management_approval: 'Senior management approval',
      batch_record: 'Manufacturing batch documentation',
      test_execution: 'Execute testing procedures',
      calibration: 'Equipment calibration step',
      training_verification: 'Verify training completion',
      supplier_verification: 'Verify supplier qualifications',
      deviation_investigation: 'Investigate process deviations',
      corrective_action: 'Implement corrective measures',
      change_control: 'Manage process changes',
      validation_step: 'Process or method validation',
      equipment_qualification: 'Qualify equipment for use',
      sample_testing: 'Laboratory sample analysis',
      data_analysis: 'Analyze test data and results',
      audit_step: 'Internal or external audit',
      capa_implementation: 'Corrective and Preventive Actions',
    };
    return descriptions[stepType];
  };

  const saveWorkflow = async (publish = false) => {
    if (!user || !workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a workflow name",
        variant: "destructive",
      });
      return;
    }

    const setSaving = publish ? setIsPublishing : setIsSaving;
    setSaving(true);

    try {
      const flowData = {
        nodes,
        edges,
        viewport: reactFlowInstance?.getViewport() || { x: 0, y: 0, zoom: 1 }
      };

      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        workflow_type: workflowType,
        status: (publish ? 'active' : 'draft') as 'draft' | 'active' | 'inactive' | 'archived',
        flow_data: flowData,
        ...(publish && { published_at: new Date().toISOString() })
      };

      if (workflowId) {
        // Update existing workflow
        const { error } = await supabase
          .from('workflow_definitions')
          .update(workflowData)
          .eq('id', workflowId);

        if (error) throw error;
      } else {
        // Create new workflow
        const { data, error } = await supabase
          .from('workflow_definitions')
          .insert([{
            ...workflowData,
            created_by: user.id,
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setWorkflowId(data.id);
        }
      }

      if (publish) {
        setWorkflowStatus('active');
      }

      toast({
        title: publish ? "Workflow Published" : "Workflow Saved",
        description: publish 
          ? "Your workflow is now active and ready for use"
          : "Your workflow has been saved as a draft",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const exportWorkflow = () => {
    const exportData = {
      name: workflowName,
      description: workflowDescription,
      workflow_type: workflowType,
      flow_data: {
        nodes,
        edges,
        viewport: reactFlowInstance?.getViewport()
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName || 'workflow'}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        setWorkflowName(importedData.name || '');
        setWorkflowDescription(importedData.description || '');
        setWorkflowType(importedData.workflow_type || 'drug_approval');
        
        if (importedData.flow_data) {
          setNodes(importedData.flow_data.nodes || []);
          setEdges(importedData.flow_data.edges || []);
          
          if (importedData.flow_data.viewport && reactFlowInstance) {
            reactFlowInstance.setViewport(importedData.flow_data.viewport);
          }
        }
        
        toast({
          title: "Workflow Imported",
          description: "Workflow has been successfully imported",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import workflow. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const loadTemplate = (templateData: any) => {
    setWorkflowName(templateData.name);
    setWorkflowDescription(templateData.description || '');
    setWorkflowType(templateData.workflow_type);
    
    if (templateData.flow_data) {
      setNodes(templateData.flow_data.nodes || []);
      setEdges(templateData.flow_data.edges || []);
      
      if (templateData.flow_data.viewport && reactFlowInstance) {
        reactFlowInstance.setViewport(templateData.flow_data.viewport);
      }
    }
    
    toast({
      title: "Template Loaded",
      description: "Workflow template has been successfully loaded",
    });
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, [setNodes]);

  return (
    <div className="h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 pt-4">
        <WorkflowBuilderToolbar
          workflowName={workflowName}
          workflowDescription={workflowDescription}
          workflowType={workflowType}
          workflowStatus={workflowStatus}
          onNameChange={setWorkflowName}
          onDescriptionChange={setWorkflowDescription}
          onTypeChange={setWorkflowType}
          onSave={() => saveWorkflow(false)}
          onPublish={() => saveWorkflow(true)}
          onBack={onBack}
          onExport={exportWorkflow}
          onImport={importWorkflow}
          onLoadTemplate={loadTemplate}
          isSaving={isSaving}
          isPublishing={isPublishing}
        />
      </div>

      <div className="flex h-full">
        <div className="p-4">
          <NodePalette onDragStart={onDragStart} />
        </div>
        
        <div className="flex-1 relative">
          <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={(instance) => setReactFlowInstance(instance)}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  switch (node.data.stepType) {
                    case 'start': return '#10b981';
                    case 'end': return '#ef4444';
                    case 'approval': return '#f59e0b';
                    case 'decision': return '#6366f1';
                    default: return '#6b7280';
                  }
                }}
              />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
        
        {/* Properties Panel */}
        <div className="absolute top-4 right-4 z-10">
          <NodePropertiesPanel
            selectedNode={selectedNode}
            onUpdateNode={updateNode}
          />
        </div>
      </div>
    </div>
  );
};

export const WorkflowBuilderWrapper = (props: WorkflowBuilderProps) => (
  <ReactFlowProvider>
    <WorkflowBuilder {...props} />
  </ReactFlowProvider>
);