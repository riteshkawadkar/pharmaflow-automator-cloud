export type WorkflowStepType = 
  | 'start'
  | 'form_input'
  | 'approval'
  | 'review'
  | 'notification'
  | 'decision'
  | 'parallel_gateway'
  | 'exclusive_gateway'
  | 'end';

export interface WorkflowNodeData {
  label: string;
  stepType: WorkflowStepType;
  configuration?: Record<string, any>;
  description?: string;
}

export interface WorkflowDefinition {
  id?: string;
  name: string;
  description?: string;
  workflow_type: string;
  version: number;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  created_by?: string;
  flow_data: {
    nodes: any[];
    edges: any[];
    viewport?: { x: number; y: number; zoom: number };
  };
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface StepConfiguration {
  // Approval step config
  approvers?: string[];
  approvalType?: 'single' | 'majority' | 'unanimous';
  
  // Form input config
  formFields?: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
  }>;
  
  // Notification config
  recipients?: string[];
  template?: string;
  
  // Decision config
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
    outputLabel: string;
  }>;
  
  // General
  timeLimit?: number;
  instructions?: string;
}