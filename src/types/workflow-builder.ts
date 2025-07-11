export type WorkflowStepType = 
  | 'start'
  | 'form_input'
  | 'approval'
  | 'review'
  | 'notification'
  | 'decision'
  | 'parallel_gateway'
  | 'exclusive_gateway'
  | 'end'
  | 'document_upload'
  | 'document_review'
  | 'quality_check'
  | 'regulatory_check'
  | 'compliance_verification'
  | 'risk_assessment'
  | 'technical_review'
  | 'management_approval'
  | 'batch_record'
  | 'test_execution'
  | 'calibration'
  | 'training_verification'
  | 'supplier_verification'
  | 'deviation_investigation'
  | 'corrective_action'
  | 'change_control'
  | 'validation_step'
  | 'equipment_qualification'
  | 'sample_testing'
  | 'data_analysis'
  | 'audit_step'
  | 'capa_implementation';

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
    options?: string[];
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      message?: string;
    };
  }>;
  
  // Notification config
  recipients?: string[];
  template?: string;
  notificationType?: 'email' | 'sms' | 'in_app' | 'all';
  
  // Decision config
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
    outputLabel: string;
  }>;
  
  // Document upload config
  allowedFileTypes?: string[];
  maxFileSize?: number;
  requireDigitalSignature?: boolean;
  
  // Quality/Regulatory check config
  checklistItems?: Array<{
    id: string;
    description: string;
    required: boolean;
    criteria?: string;
  }>;
  
  // Risk assessment config
  riskCategories?: string[];
  riskMatrix?: {
    probability: string[];
    impact: string[];
  };
  
  // Testing/Validation config
  testParameters?: Array<{
    parameter: string;
    acceptanceCriteria: string;
    testMethod?: string;
  }>;
  
  // Equipment/Calibration config
  equipmentId?: string;
  calibrationStandards?: string[];
  toleranceSpec?: string;
  
  // Training config
  requiredTraining?: string[];
  competencyChecks?: string[];
  
  // Audit config
  auditType?: 'internal' | 'external' | 'regulatory';
  auditScope?: string;
  auditChecklist?: string[];
  
  // CAPA config
  rootCauseAnalysis?: boolean;
  effectivenessCheck?: boolean;
  implementationPlan?: boolean;
  
  // General
  timeLimit?: number;
  instructions?: string;
  sop?: string;
  department?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}