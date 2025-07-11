import { Database } from "@/integrations/supabase/types";

type WorkflowType = Database['public']['Enums']['workflow_type'];

export const workflowTypeOptions: { value: WorkflowType; label: string; description: string }[] = [
  {
    value: 'drug_approval',
    label: 'Drug Approval',
    description: 'FDA drug approval and regulatory submission process'
  },
  {
    value: 'clinical_trial_protocol',
    label: 'Clinical Trial Protocol',
    description: 'Clinical trial design and protocol approval'
  },
  {
    value: 'manufacturing_change_control',
    label: 'Manufacturing Change Control',
    description: 'Manufacturing process change management'
  },
  {
    value: 'quality_deviation_investigation',
    label: 'Quality Deviation Investigation',
    description: 'Quality control issue investigation and resolution'
  },
  {
    value: 'regulatory_submission',
    label: 'Regulatory Submission',
    description: 'Regulatory filing and submission process'
  },
  {
    value: 'pharmacovigilance_case',
    label: 'Pharmacovigilance Case',
    description: 'Adverse event reporting and safety monitoring'
  },
  {
    value: 'supplier_qualification',
    label: 'Supplier Qualification',
    description: 'Supplier evaluation and qualification process'
  },
  {
    value: 'batch_record_review',
    label: 'Batch Record Review',
    description: 'Manufacturing batch record review and release'
  },
  {
    value: 'validation_protocol',
    label: 'Validation Protocol',
    description: 'Equipment and process validation'
  },
  {
    value: 'change_request',
    label: 'Change Request',
    description: 'General change request and approval process'
  },
  {
    value: 'corrective_action',
    label: 'Corrective Action',
    description: 'CAPA (Corrective and Preventive Action) process'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Custom or miscellaneous workflow type'
  }
];

export const useWorkflowTypes = () => {
  return {
    workflowTypeOptions,
    getWorkflowTypeLabel: (type: WorkflowType) => {
      return workflowTypeOptions.find(option => option.value === type)?.label || type;
    },
    getWorkflowTypeDescription: (type: WorkflowType) => {
      return workflowTypeOptions.find(option => option.value === type)?.description || '';
    }
  };
};