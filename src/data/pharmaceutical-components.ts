// Pharmaceutical equipment database
export const PHARMACEUTICAL_EQUIPMENT = {
  analytical: [
    { value: 'hplc_agilent_1260', label: 'HPLC - Agilent 1260 Infinity', location: 'QC Lab A' },
    { value: 'hplc_waters_acquity', label: 'UPLC - Waters Acquity', location: 'QC Lab B' },
    { value: 'gcms_shimadzu_2030', label: 'GC-MS - Shimadzu GCMS-QP2030', location: 'QC Lab A' },
    { value: 'ftir_bruker_alpha', label: 'FTIR - Bruker Alpha II', location: 'Materials Lab' },
    { value: 'uv_vis_perkin_lambda', label: 'UV-Vis - PerkinElmer Lambda 25', location: 'QC Lab C' },
    { value: 'dissolution_distek_2500', label: 'Dissolution Tester - Distek Evolution 2500', location: 'Dissolution Lab' }
  ],
  manufacturing: [
    { value: 'tablet_press_korsch_xl400', label: 'Tablet Press - Korsch XL 400', location: 'Production Floor 1' },
    { value: 'fluid_bed_glatt_gpcg', label: 'Fluid Bed Dryer - Glatt GPCG 60', location: 'Production Floor 2' },
    { value: 'coating_pan_ldcs_250', label: 'Coating Pan - LDCS-250', location: 'Coating Area' },
    { value: 'mixer_bohle_bts', label: 'High Shear Mixer - Bohle BTS-250', location: 'Mixing Area' },
    { value: 'capsule_filler_mg2_planeta', label: 'Capsule Filler - MG2 Planeta 20', location: 'Encapsulation Area' },
    { value: 'blender_tote_ibc', label: 'IBC Tote Blender - 1000L', location: 'Blending Area' }
  ],
  weighing: [
    { value: 'balance_mettler_xs', label: 'Analytical Balance - Mettler Toledo XS205', location: 'Weighing Room A' },
    { value: 'balance_sartorius_cubis', label: 'Micro Balance - Sartorius Cubis MSA2.7S', location: 'Weighing Room B' },
    { value: 'scale_mettler_ind780', label: 'Industrial Scale - Mettler Toledo IND780 (500kg)', location: 'Warehouse' },
    { value: 'scale_portable_ohaus', label: 'Portable Scale - Ohaus Ranger 3000 (30kg)', location: 'Mobile' }
  ],
  environmental: [
    { value: 'stability_chamber_binder', label: 'Stability Chamber - Binder KBF 720', location: 'Stability Lab' },
    { value: 'oven_despatch_v400', label: 'Drying Oven - Despatch V-400', location: 'Drying Room' },
    { value: 'incubator_thermo_heratherm', label: 'Incubator - Thermo Heratherm IMH400', location: 'Microbiology Lab' },
    { value: 'freezer_ultra_low', label: 'Ultra-Low Freezer (-80°C) - Thermo TSX', location: 'Cold Storage' }
  ]
};

// Common pharmaceutical document types
export const PHARMACEUTICAL_DOCUMENTS = [
  {
    id: 'training_certificate',
    label: 'Training Certificate',
    description: 'Equipment-specific training certification',
    required: true,
    acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    category: 'training'
  },
  {
    id: 'safety_form',
    label: 'Safety Assessment Form',
    description: 'Completed safety assessment and acknowledgment',
    required: true,
    acceptedTypes: ['pdf', 'doc', 'docx'],
    category: 'safety'
  },
  {
    id: 'id_copy',
    label: 'ID Copy',
    description: 'Copy of government-issued photo ID',
    required: true,
    acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    category: 'identification'
  },
  {
    id: 'protocol_document',
    label: 'Protocol Document',
    description: 'Detailed protocol or procedure document',
    required: true,
    acceptedTypes: ['pdf', 'doc', 'docx'],
    category: 'protocol'
  },
  {
    id: 'batch_record',
    label: 'Batch Production Record',
    description: 'Completed batch manufacturing record',
    required: true,
    acceptedTypes: ['pdf', 'doc', 'docx'],
    category: 'manufacturing'
  },
  {
    id: 'coa_certificate',
    label: 'Certificate of Analysis (COA)',
    description: 'Material certificate of analysis',
    required: false,
    acceptedTypes: ['pdf', 'doc', 'docx'],
    category: 'quality'
  },
  {
    id: 'sds_sheet',
    label: 'Safety Data Sheet (SDS)',
    description: 'Material safety data sheet',
    required: false,
    acceptedTypes: ['pdf', 'doc', 'docx'],
    category: 'safety'
  },
  {
    id: 'regulatory_submission',
    label: 'Regulatory Submission',
    description: 'Regulatory filing or amendment documents',
    required: true,
    acceptedTypes: ['pdf', 'doc', 'docx'],
    category: 'regulatory'
  }
];

// Form field templates for different workflow types
export const WORKFLOW_FORM_TEMPLATES = {
  equipment_access: {
    name: 'Equipment Access Request',
    description: 'Request access to pharmaceutical equipment',
    sections: [
      {
        id: 'user_info',
        title: 'User Information',
        fields: [
          {
            id: 'employee_id',
            label: 'Employee ID',
            type: 'text',
            required: true,
            placeholder: 'Enter your employee ID'
          },
          {
            id: 'department',
            label: 'Department',
            type: 'select',
            required: true,
            options: [
              { value: 'quality_control', label: 'Quality Control' },
              { value: 'manufacturing', label: 'Manufacturing' },
              { value: 'research_development', label: 'Research & Development' },
              { value: 'regulatory_affairs', label: 'Regulatory Affairs' },
              { value: 'quality_assurance', label: 'Quality Assurance' }
            ]
          },
          {
            id: 'business_justification',
            label: 'Business Justification',
            type: 'textarea',
            required: true,
            placeholder: 'Explain why you need access to this equipment'
          }
        ]
      },
      {
        id: 'access_details',
        title: 'Access Details',
        fields: [
          {
            id: 'access_start_date',
            label: 'Access Start Date',
            type: 'date',
            required: true
          },
          {
            id: 'access_end_date',
            label: 'Access End Date',
            type: 'date',
            required: true
          },
          {
            id: 'equipment_category',
            label: 'Equipment Category',
            type: 'select',
            required: true,
            options: [
              { value: 'analytical', label: 'Analytical Equipment' },
              { value: 'manufacturing', label: 'Manufacturing Equipment' },
              { value: 'weighing', label: 'Weighing Equipment' },
              { value: 'environmental', label: 'Environmental Chambers' }
            ]
          }
        ]
      }
    ],
    documents: ['training_certificate', 'safety_form', 'id_copy']
  },
  
  document_review: {
    name: 'Document Review Request',
    description: 'Submit documents for review and approval',
    sections: [
      {
        id: 'document_info',
        title: 'Document Information',
        fields: [
          {
            id: 'document_title',
            label: 'Document Title',
            type: 'text',
            required: true,
            placeholder: 'Enter the document title'
          },
          {
            id: 'document_type',
            label: 'Document Type',
            type: 'select',
            required: true,
            options: [
              { value: 'sop', label: 'Standard Operating Procedure (SOP)' },
              { value: 'protocol', label: 'Protocol' },
              { value: 'specification', label: 'Specification' },
              { value: 'validation', label: 'Validation Document' },
              { value: 'regulatory', label: 'Regulatory Submission' }
            ]
          },
          {
            id: 'version_number',
            label: 'Version Number',
            type: 'text',
            required: true,
            placeholder: 'e.g., 1.0, 2.1'
          },
          {
            id: 'change_summary',
            label: 'Summary of Changes',
            type: 'textarea',
            required: true,
            placeholder: 'Describe what has changed in this version'
          }
        ]
      },
      {
        id: 'review_details',
        title: 'Review Details',
        fields: [
          {
            id: 'urgency_level',
            label: 'Urgency Level',
            type: 'select',
            required: true,
            options: [
              { value: 'routine', label: 'Routine (14 days)' },
              { value: 'expedited', label: 'Expedited (7 days)' },
              { value: 'urgent', label: 'Urgent (3 days)' },
              { value: 'emergency', label: 'Emergency (24 hours)' }
            ]
          },
          {
            id: 'implementation_date',
            label: 'Requested Implementation Date',
            type: 'date',
            required: true
          }
        ]
      }
    ],
    documents: ['protocol_document', 'coa_certificate']
  },

  training_request: {
    name: 'Training Request',
    description: 'Request training on equipment or procedures',
    sections: [
      {
        id: 'training_info',
        title: 'Training Information',
        fields: [
          {
            id: 'training_type',
            label: 'Training Type',
            type: 'select',
            required: true,
            options: [
              { value: 'equipment', label: 'Equipment Training' },
              { value: 'procedure', label: 'Procedure Training' },
              { value: 'safety', label: 'Safety Training' },
              { value: 'regulatory', label: 'Regulatory Training' },
              { value: 'quality', label: 'Quality System Training' }
            ]
          },
          {
            id: 'training_topic',
            label: 'Training Topic',
            type: 'text',
            required: true,
            placeholder: 'Specify the equipment or procedure'
          },
          {
            id: 'current_skill_level',
            label: 'Current Skill Level',
            type: 'select',
            required: true,
            options: [
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
              { value: 'expert', label: 'Expert' }
            ]
          },
          {
            id: 'learning_objectives',
            label: 'Learning Objectives',
            type: 'textarea',
            required: true,
            placeholder: 'What do you hope to learn from this training?'
          }
        ]
      },
      {
        id: 'scheduling',
        title: 'Scheduling Preferences',
        fields: [
          {
            id: 'preferred_date',
            label: 'Preferred Training Date',
            type: 'date',
            required: true
          },
          {
            id: 'alternative_date',
            label: 'Alternative Date',
            type: 'date',
            required: false
          },
          {
            id: 'training_format',
            label: 'Preferred Training Format',
            type: 'select',
            required: true,
            options: [
              { value: 'hands_on', label: 'Hands-on Training' },
              { value: 'classroom', label: 'Classroom Instruction' },
              { value: 'online', label: 'Online Training' },
              { value: 'mixed', label: 'Mixed Format' }
            ]
          }
        ]
      }
    ],
    documents: ['id_copy']
  }
};

// Approval roles for pharmaceutical workflows
export const APPROVAL_ROLES = [
  { value: 'supervisor', label: 'Direct Supervisor' },
  { value: 'qa_manager', label: 'QA Manager' },
  { value: 'qc_manager', label: 'QC Manager' },
  { value: 'lab_supervisor', label: 'Lab Supervisor' },
  { value: 'production_manager', label: 'Production Manager' },
  { value: 'regulatory_manager', label: 'Regulatory Manager' },
  { value: 'safety_officer', label: 'Safety Officer' },
  { value: 'training_coordinator', label: 'Training Coordinator' },
  { value: 'department_head', label: 'Department Head' },
  { value: 'plant_manager', label: 'Plant Manager' }
];

export const getEquipmentByCategory = (category: keyof typeof PHARMACEUTICAL_EQUIPMENT) => {
  return PHARMACEUTICAL_EQUIPMENT[category] || [];
};

export const getDocumentsByCategory = (category: string) => {
  return PHARMACEUTICAL_DOCUMENTS.filter(doc => doc.category === category);
};

export const getWorkflowTemplate = (templateId: keyof typeof WORKFLOW_FORM_TEMPLATES) => {
  return WORKFLOW_FORM_TEMPLATES[templateId];
};