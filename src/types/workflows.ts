export type WorkflowType = 
  | 'drug_approval'
  | 'clinical_trial_protocol' 
  | 'manufacturing_change_control'
  | 'quality_deviation_investigation'
  | 'regulatory_submission'
  | 'pharmacovigilance_case'
  | 'supplier_qualification'
  | 'batch_record_review'
  | 'validation_protocol'
  | 'change_request'
  | 'corrective_action'
  | 'other';

export interface WorkflowField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'email';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  description?: string;
}

export interface WorkflowConfig {
  type: WorkflowType;
  label: string;
  description: string;
  additionalFields: WorkflowField[];
}

export const WORKFLOW_CONFIGS: WorkflowConfig[] = [
  {
    type: 'drug_approval',
    label: 'Drug Approval',
    description: 'Request for new drug compound approval',
    additionalFields: [
      {
        id: 'compound_name',
        label: 'Compound Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., XYZ-123'
      },
      {
        id: 'indication',
        label: 'Therapeutic Indication',
        type: 'text',
        required: true,
        placeholder: 'e.g., Hypertension, Diabetes'
      },
      {
        id: 'dosage_form',
        label: 'Dosage Form',
        type: 'select',
        required: true,
        options: [
          { value: 'tablet', label: 'Tablet' },
          { value: 'capsule', label: 'Capsule' },
          { value: 'injection', label: 'Injection' },
          { value: 'cream', label: 'Cream/Ointment' },
          { value: 'suspension', label: 'Suspension' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'regulatory_pathway',
        label: 'Regulatory Pathway',
        type: 'select',
        required: true,
        options: [
          { value: 'nda', label: 'New Drug Application (NDA)' },
          { value: 'anda', label: 'Abbreviated NDA (ANDA)' },
          { value: 'bla', label: 'Biologics License Application (BLA)' },
          { value: 'ind', label: 'Investigational New Drug (IND)' }
        ]
      }
    ]
  },
  {
    type: 'clinical_trial_protocol',
    label: 'Clinical Trial Protocol',
    description: 'Submit clinical trial protocol for review',
    additionalFields: [
      {
        id: 'protocol_number',
        label: 'Protocol Number',
        type: 'text',
        required: true,
        placeholder: 'e.g., CT-2024-001'
      },
      {
        id: 'study_phase',
        label: 'Study Phase',
        type: 'select',
        required: true,
        options: [
          { value: 'phase_i', label: 'Phase I' },
          { value: 'phase_ii', label: 'Phase II' },
          { value: 'phase_iii', label: 'Phase III' },
          { value: 'phase_iv', label: 'Phase IV' },
          { value: 'bioequivalence', label: 'Bioequivalence' }
        ]
      },
      {
        id: 'patient_population',
        label: 'Target Patient Population',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the target patient demographics and inclusion criteria'
      },
      {
        id: 'study_duration',
        label: 'Expected Study Duration (months)',
        type: 'number',
        required: true
      },
      {
        id: 'enrollment_target',
        label: 'Target Enrollment',
        type: 'number',
        required: true,
        placeholder: 'Number of patients'
      }
    ]
  },
  {
    type: 'manufacturing_change_control',
    label: 'Manufacturing Change Control',
    description: 'Request for manufacturing process changes',
    additionalFields: [
      {
        id: 'product_name',
        label: 'Product Name',
        type: 'text',
        required: true
      },
      {
        id: 'change_type',
        label: 'Type of Change',
        type: 'select',
        required: true,
        options: [
          { value: 'equipment', label: 'Equipment Change' },
          { value: 'process', label: 'Process Parameter' },
          { value: 'raw_material', label: 'Raw Material Supplier' },
          { value: 'facility', label: 'Manufacturing Facility' },
          { value: 'batch_size', label: 'Batch Size' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'current_process',
        label: 'Current Process Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the current manufacturing process'
      },
      {
        id: 'proposed_change',
        label: 'Proposed Change Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the proposed changes in detail'
      },
      {
        id: 'change_rationale',
        label: 'Rationale for Change',
        type: 'textarea',
        required: true,
        placeholder: 'Explain why this change is necessary'
      }
    ]
  },
  {
    type: 'quality_deviation_investigation',
    label: 'Quality Deviation Investigation',
    description: 'Report and investigate quality deviations',
    additionalFields: [
      {
        id: 'deviation_type',
        label: 'Deviation Type',
        type: 'select',
        required: true,
        options: [
          { value: 'out_of_specification', label: 'Out of Specification (OOS)' },
          { value: 'batch_failure', label: 'Batch Failure' },
          { value: 'equipment_malfunction', label: 'Equipment Malfunction' },
          { value: 'procedure_deviation', label: 'Procedure Deviation' },
          { value: 'contamination', label: 'Contamination Event' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'batch_number',
        label: 'Affected Batch Number(s)',
        type: 'text',
        required: true,
        placeholder: 'e.g., BT240001, BT240002'
      },
      {
        id: 'discovery_date',
        label: 'Date of Discovery',
        type: 'date',
        required: true
      },
      {
        id: 'immediate_action',
        label: 'Immediate Actions Taken',
        type: 'textarea',
        required: true,
        placeholder: 'Describe immediate containment actions'
      },
      {
        id: 'potential_impact',
        label: 'Potential Impact Assessment',
        type: 'textarea',
        required: true,
        placeholder: 'Assess potential impact on product quality and patient safety'
      }
    ]
  },
  {
    type: 'regulatory_submission',
    label: 'Regulatory Submission',
    description: 'Submit regulatory filing or amendment',
    additionalFields: [
      {
        id: 'submission_type',
        label: 'Submission Type',
        type: 'select',
        required: true,
        options: [
          { value: 'annual_report', label: 'Annual Report' },
          { value: 'safety_update', label: 'Periodic Safety Update Report (PSUR)' },
          { value: 'labeling_change', label: 'Labeling Change' },
          { value: 'manufacturing_supplement', label: 'Manufacturing Supplement' },
          { value: 'post_market_study', label: 'Post-Marketing Study' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'regulatory_authority',
        label: 'Regulatory Authority',
        type: 'select',
        required: true,
        options: [
          { value: 'fda', label: 'FDA (United States)' },
          { value: 'ema', label: 'EMA (European Union)' },
          { value: 'pmda', label: 'PMDA (Japan)' },
          { value: 'health_canada', label: 'Health Canada' },
          { value: 'tga', label: 'TGA (Australia)' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'submission_deadline',
        label: 'Regulatory Deadline',
        type: 'date',
        required: true,
        description: 'Date by which submission must be filed'
      },
      {
        id: 'reference_number',
        label: 'Reference/Application Number',
        type: 'text',
        placeholder: 'e.g., IND-12345, NDA-67890'
      }
    ]
  },
  {
    type: 'pharmacovigilance_case',
    label: 'Pharmacovigilance Case',
    description: 'Report adverse events and safety cases',
    additionalFields: [
      {
        id: 'case_type',
        label: 'Case Type',
        type: 'select',
        required: true,
        options: [
          { value: 'serious_ae', label: 'Serious Adverse Event' },
          { value: 'non_serious_ae', label: 'Non-Serious Adverse Event' },
          { value: 'pregnancy_exposure', label: 'Pregnancy Exposure' },
          { value: 'lack_of_efficacy', label: 'Lack of Efficacy' },
          { value: 'medication_error', label: 'Medication Error' },
          { value: 'other', label: 'Other Safety Issue' }
        ]
      },
      {
        id: 'reporter_type',
        label: 'Reporter Type',
        type: 'select',
        required: true,
        options: [
          { value: 'healthcare_professional', label: 'Healthcare Professional' },
          { value: 'patient', label: 'Patient/Consumer' },
          { value: 'regulatory_authority', label: 'Regulatory Authority' },
          { value: 'literature', label: 'Literature Report' },
          { value: 'study', label: 'Clinical Study' }
        ]
      },
      {
        id: 'onset_date',
        label: 'Event Onset Date',
        type: 'date',
        required: true
      },
      {
        id: 'seriousness_criteria',
        label: 'Seriousness Criteria (if applicable)',
        type: 'select',
        options: [
          { value: 'death', label: 'Death' },
          { value: 'life_threatening', label: 'Life-threatening' },
          { value: 'hospitalization', label: 'Hospitalization/Prolonged' },
          { value: 'disability', label: 'Persistent/Significant Disability' },
          { value: 'birth_defect', label: 'Congenital Anomaly/Birth Defect' },
          { value: 'other_important', label: 'Other Medically Important' }
        ]
      }
    ]
  },
  {
    type: 'other',
    label: 'Other',
    description: 'Custom workflow request',
    additionalFields: [
      {
        id: 'workflow_category',
        label: 'Workflow Category',
        type: 'text',
        required: true,
        placeholder: 'Specify the type of workflow'
      }
    ]
  }
];

export const getWorkflowConfig = (workflowType: WorkflowType): WorkflowConfig | undefined => {
  return WORKFLOW_CONFIGS.find(config => config.type === workflowType);
};