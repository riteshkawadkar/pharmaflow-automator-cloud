// Workflow Builder Types

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  connections: Connection[];
  validation?: ValidationResult;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: ConnectionType;
}

export interface NodeData {
  label: string;
  description?: string;
  properties: Record<string, any>;
  pharmaceuticalType?: PharmaceuticalNodeType;
  complianceRequirements?: ComplianceRequirement[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  id: string;
  message: string;
  severity: 'error' | 'warning';
  field?: string;
}

export interface ValidationWarning {
  id: string;
  message: string;
  suggestion?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  nodes: WorkflowNode[];
  connections: Connection[];
  version: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  complianceLevel: ComplianceLevel;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: ComponentCategory;
  icon: string;
  description: string;
  defaultProperties: Record<string, any>;
  pharmaceuticalType?: PharmaceuticalNodeType;
  complianceRequirements: ComplianceRequirement[];
  estimatedDuration?: number;
}

export type NodeType =
  | 'start'
  | 'end'
  | 'form'
  | 'approval'
  | 'review'
  | 'decision'
  | 'timer'
  | 'api_connector'
  | 'database_query'
  | 'external_system'
  | 'file_processor'
  | 'email_notifier'
  | 'sms_alert'
  | 'dashboard_update'
  | 'report_generator'
  | 'electronic_signature'
  | 'audit_logger'
  | 'training_verification'
  | 'compliance_checker';

export type ConnectionType =
  | 'sequence'
  | 'conditional'
  | 'escalation'
  | 'parallel'
  | 'loop';

export type ComponentCategory =
  | 'process'
  | 'forms'
  | 'approvals'
  | 'integrations'
  | 'notifications'
  | 'analytics'
  | 'compliance'
  | 'utilities';

export type WorkflowCategory =
  | 'quality_control'
  | 'document_control'
  | 'risk_assessment'
  | 'equipment_management'
  | 'training'
  | 'audit'
  | 'general';

export type PharmaceuticalNodeType =
  | 'batch_release'
  | 'quality_control'
  | 'equipment_qualification'
  | 'cleaning_validation'
  | 'change_control'
  | 'deviation_investigation'
  | 'supplier_qualification'
  | 'training_management'
  | 'audit_management'
  | 'document_control'
  | 'regulatory_submission'
  | 'pharmacovigilance'
  | 'clinical_trial'
  | 'manufacturing'
  | 'packaging_labeling';

export type ComplianceLevel =
  | 'basic'
  | 'gmp'
  | 'cfr_part_11'
  | 'gamp_5'
  | 'iso_13485';

export interface ComplianceRequirement {
  id: string;
  regulation: string;
  requirement: string;
  mandatory: boolean;
  description?: string;
}

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  selectedNodes: string[];
  selectedConnections: string[];
  isConnecting: boolean;
  connectionStart?: { nodeId: string; handle: string };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentNodeId: string;
  data: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  nodeId: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}