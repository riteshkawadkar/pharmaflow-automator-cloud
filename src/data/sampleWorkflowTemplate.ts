import { WorkflowDefinition } from '@/types/workflow-builder';

export const drugApprovalWorkflowTemplate: WorkflowDefinition = {
  name: "Drug Approval Workflow - FDA Submission",
  description: "Complete pharmaceutical drug approval process from initial application to FDA approval decision",
  workflow_type: "drug_approval",
  version: 1,
  status: "draft",
  flow_data: {
    nodes: [
      {
        id: 'start-1',
        type: 'workflow',
        position: { x: 100, y: 50 },
        data: {
          label: 'Drug Application Submitted',
          stepType: 'start',
          description: 'Pharmaceutical company submits new drug application',
          configuration: {}
        }
      },
      {
        id: 'form_input-1',
        type: 'workflow',
        position: { x: 100, y: 180 },
        data: {
          label: 'Clinical Trial Data Collection',
          stepType: 'form_input',
          description: 'Collect comprehensive clinical trial data and documentation',
          configuration: {
            formFields: [
              {
                id: 'trial_phase',
                label: 'Trial Phase',
                type: 'select',
                required: true,
                options: [
                  { value: 'phase_i', label: 'Phase I' },
                  { value: 'phase_ii', label: 'Phase II' },
                  { value: 'phase_iii', label: 'Phase III' },
                  { value: 'phase_iv', label: 'Phase IV' }
                ]
              },
              {
                id: 'participant_count',
                label: 'Number of Participants',
                type: 'number',
                required: true,
                placeholder: 'Enter total number of participants'
              },
              {
                id: 'trial_duration',
                label: 'Trial Duration (months)',
                type: 'number',
                required: true,
                placeholder: 'Expected duration in months'
              },
              {
                id: 'primary_endpoint',
                label: 'Primary Endpoint',
                type: 'textarea',
                required: true,
                placeholder: 'Describe the primary efficacy endpoint'
              },
              {
                id: 'adverse_events',
                label: 'Serious Adverse Events',
                type: 'textarea',
                required: true,
                placeholder: 'List any serious adverse events observed'
              },
              {
                id: 'efficacy_data',
                label: 'Efficacy Data Summary',
                type: 'textarea',
                required: true,
                placeholder: 'Summarize key efficacy findings'
              }
            ],
            requiredDocuments: [
              {
                id: 'protocol_document',
                label: 'Clinical Trial Protocol',
                type: 'file',
                required: true,
                acceptedTypes: ['pdf', 'doc', 'docx'],
                description: 'Complete clinical trial protocol document'
              },
              {
                id: 'informed_consent',
                label: 'Informed Consent Forms',
                type: 'file',
                required: true,
                acceptedTypes: ['pdf', 'doc', 'docx'],
                description: 'Signed informed consent forms from participants'
              },
              {
                id: 'statistical_report',
                label: 'Statistical Analysis Report',
                type: 'file',
                required: false,
                acceptedTypes: ['pdf', 'doc', 'docx'],
                description: 'Detailed statistical analysis of trial results'
              }
            ],
            timeLimit: 72,
            instructions: 'Please provide complete clinical trial documentation as required by FDA guidelines'
          }
        }
      },
      {
        id: 'review-1',
        type: 'workflow',
        position: { x: 350, y: 180 },
        data: {
          label: 'Medical Officer Review',
          stepType: 'review',
          description: 'FDA medical officer conducts initial safety and efficacy review',
          configuration: {
            approvers: ['medical.officer@fda.gov', 'senior.reviewer@fda.gov'],
            timeLimit: 168, // 1 week
            instructions: 'Conduct comprehensive review of clinical data for safety signals and efficacy endpoints. Pay special attention to:1. Primary and secondary endpoint analysis2. Adverse event profile and severity3. Dose-response relationship4. Special population considerations5. Risk-benefit assessment'
          }
        }
      },
      {
        id: 'decision-1',
        type: 'workflow',
        position: { x: 350, y: 350 },
        data: {
          label: 'Safety Assessment Decision',
          stepType: 'decision',
          description: 'Determine if drug meets safety requirements for approval',
          configuration: {
            conditions: [
              {
                field: 'safety_review_result',
                operator: 'equals',
                value: 'approved',
                outputLabel: 'Safety Approved'
              },
              {
                field: 'safety_review_result',
                operator: 'equals',
                value: 'rejected',
                outputLabel: 'Safety Concerns'
              }
            ]
          }
        }
      },
      {
        id: 'approval-1',
        type: 'workflow',
        position: { x: 600, y: 280 },
        data: {
          label: 'Pharmacology Team Approval',
          stepType: 'approval',
          description: 'Pharmacology and toxicology team approval',
          configuration: {
            approvers: [
              'pharmacology.lead@fda.gov',
              'toxicology.specialist@fda.gov',
              'clinical.pharmacology@fda.gov'
            ],
            approvalType: 'majority',
            timeLimit: 120, // 5 days
            instructions: 'Review pharmacokinetics, drug interactions, and toxicology data'
          }
        }
      },
      {
        id: 'form_input-2',
        type: 'workflow',
        position: { x: 100, y: 520 },
        data: {
          label: 'Additional Information Request',
          stepType: 'form_input',
          description: 'Request additional data from pharmaceutical company',
          configuration: {
            formFields: [
              {
                id: 'requested_studies',
                label: 'Additional Studies Required',
                type: 'textarea',
                required: true
              },
              {
                id: 'safety_updates',
                label: 'Safety Updates',
                type: 'textarea',
                required: false
              },
              {
                id: 'response_timeline',
                label: 'Response Timeline (days)',
                type: 'number',
                required: true
              }
            ],
            timeLimit: 24,
            instructions: 'Specify additional information needed for approval decision'
          }
        }
      },
      {
        id: 'notification-1',
        type: 'workflow',
        position: { x: 350, y: 520 },
        data: {
          label: 'Stakeholder Notification',
          stepType: 'notification',
          description: 'Notify relevant stakeholders of review status',
          configuration: {
            recipients: [
              'regulatory.affairs@pharmacompany.com',
              'medical.affairs@pharmacompany.com',
              'fda.liaison@pharmacompany.com'
            ],
            template: `Dear Stakeholder,

This is to notify you that the drug application for {{drug_name}} has reached the {{current_stage}} stage of review.

Current Status: {{status}}
Review Timeline: {{timeline}}
Next Steps: {{next_steps}}

For questions, please contact the FDA project manager.

Best regards,
FDA Review Team`
          }
        }
      },
      {
        id: 'approval-2',
        type: 'workflow',
        position: { x: 600, y: 450 },
        data: {
          label: 'Final FDA Approval Decision',
          stepType: 'approval',
          description: 'Final approval decision by FDA review committee',
          configuration: {
            approvers: [
              'division.director@fda.gov',
              'office.director@fda.gov',
              'center.director@fda.gov'
            ],
            approvalType: 'unanimous',
            timeLimit: 48,
            instructions: 'Final review and approval decision considering all review team recommendations'
          }
        }
      },
      {
        id: 'notification-2',
        type: 'workflow',
        position: { x: 850, y: 350 },
        data: {
          label: 'Approval Letter',
          stepType: 'notification',
          description: 'Send official approval letter to pharmaceutical company',
          configuration: {
            recipients: [
              'ceo@pharmacompany.com',
              'regulatory.affairs@pharmacompany.com',
              'legal@pharmacompany.com'
            ],
            template: `DRUG APPROVAL LETTER

Date: {{current_date}}
Application Number: {{application_number}}
Drug Name: {{drug_name}}

Dear Applicant,

We are pleased to inform you that your New Drug Application (NDA) for {{drug_name}} has been APPROVED for marketing in the United States.

Approval Conditions:
{{approval_conditions}}

Post-Marketing Requirements:
{{post_marketing_requirements}}

This approval is effective immediately. You may begin commercial distribution of {{drug_name}} subject to the conditions outlined in this letter.

Sincerely,
FDA Drug Evaluation Team`
          }
        }
      },
      {
        id: 'notification-3',
        type: 'workflow',
        position: { x: 350, y: 680 },
        data: {
          label: 'Rejection Notice',
          stepType: 'notification',
          description: 'Send rejection notice with detailed feedback',
          configuration: {
            recipients: [
              'regulatory.affairs@pharmacompany.com',
              'medical.affairs@pharmacompany.com'
            ],
            template: `COMPLETE RESPONSE LETTER

Date: {{current_date}}
Application Number: {{application_number}}
Drug Name: {{drug_name}}

Dear Applicant,

After thorough review of your New Drug Application, we have identified deficiencies that preclude approval at this time.

Deficiencies Identified:
{{deficiencies}}

Recommendations:
{{recommendations}}

You may resubmit your application once these issues have been addressed.

Sincerely,
FDA Review Team`
          }
        }
      },
      {
        id: 'end-1',
        type: 'workflow',
        position: { x: 850, y: 500 },
        data: {
          label: 'Drug Approved',
          stepType: 'end',
          description: 'Drug successfully approved for market',
          configuration: {}
        }
      },
      {
        id: 'end-2',
        type: 'workflow',
        position: { x: 100, y: 780 },
        data: {
          label: 'Application Rejected',
          stepType: 'end',
          description: 'Drug application rejected - resubmission required',
          configuration: {}
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'form_input-1',
        type: 'smoothstep'
      },
      {
        id: 'e2',
        source: 'form_input-1',
        target: 'review-1',
        type: 'smoothstep'
      },
      {
        id: 'e3',
        source: 'review-1',
        target: 'decision-1',
        type: 'smoothstep'
      },
      {
        id: 'e4',
        source: 'decision-1',
        sourceHandle: 'yes',
        target: 'approval-1',
        type: 'smoothstep',
        label: 'Safety Approved'
      },
      {
        id: 'e5',
        source: 'decision-1',
        sourceHandle: 'no',
        target: 'form_input-2',
        type: 'smoothstep',
        label: 'Safety Concerns'
      },
      {
        id: 'e6',
        source: 'approval-1',
        target: 'approval-2',
        type: 'smoothstep'
      },
      {
        id: 'e7',
        source: 'form_input-2',
        target: 'notification-1',
        type: 'smoothstep'
      },
      {
        id: 'e8',
        source: 'notification-1',
        target: 'notification-3',
        type: 'smoothstep'
      },
      {
        id: 'e9',
        source: 'approval-2',
        target: 'notification-2',
        type: 'smoothstep'
      },
      {
        id: 'e10',
        source: 'notification-2',
        target: 'end-1',
        type: 'smoothstep'
      },
      {
        id: 'e11',
        source: 'notification-3',
        target: 'end-2',
        type: 'smoothstep'
      }
    ],
    viewport: { x: 0, y: 0, zoom: 0.8 }
  }
};

export const manufacturingChangeWorkflowTemplate: WorkflowDefinition = {
  name: "Manufacturing Change Control",
  description: "Workflow for managing manufacturing process changes in pharmaceutical production",
  workflow_type: "manufacturing_change_control",
  version: 1,
  status: "draft",
  flow_data: {
    nodes: [
      {
        id: 'start-1',
        type: 'workflow',
        position: { x: 100, y: 50 },
        data: {
          label: 'Change Request Initiated',
          stepType: 'start',
          description: 'Manufacturing change request submitted',
          configuration: {}
        }
      },
      {
        id: 'form_input-1',
        type: 'workflow',
        position: { x: 100, y: 180 },
        data: {
          label: 'Change Impact Assessment',
          stepType: 'form_input',
          description: 'Assess the impact of proposed manufacturing change',
          configuration: {
            formFields: [
              {
                id: 'change_type',
                label: 'Type of Change',
                type: 'select',
                required: true
              },
              {
                id: 'risk_level',
                label: 'Risk Level',
                type: 'select',
                required: true
              },
              {
                id: 'impact_assessment',
                label: 'Impact Assessment',
                type: 'textarea',
                required: true
              }
            ],
            timeLimit: 48
          }
        }
      },
      {
        id: 'decision-1',
        type: 'workflow',
        position: { x: 350, y: 180 },
        data: {
          label: 'Risk Assessment',
          stepType: 'decision',
          description: 'Evaluate risk level of manufacturing change',
          configuration: {
            conditions: [
              {
                field: 'risk_level',
                operator: 'equals',
                value: 'high',
                outputLabel: 'High Risk'
              },
              {
                field: 'risk_level',
                operator: 'equals',
                value: 'low',
                outputLabel: 'Low Risk'
              }
            ]
          }
        }
      },
      {
        id: 'approval-1',
        type: 'workflow',
        position: { x: 600, y: 120 },
        data: {
          label: 'Quality Assurance Approval',
          stepType: 'approval',
          description: 'QA team approval for high-risk changes',
          configuration: {
            approvers: ['qa.manager@company.com', 'quality.director@company.com'],
            approvalType: 'unanimous',
            timeLimit: 72
          }
        }
      },
      {
        id: 'end-1',
        type: 'workflow',
        position: { x: 600, y: 280 },
        data: {
          label: 'Change Approved',
          stepType: 'end',
          description: 'Manufacturing change approved for implementation',
          configuration: {}
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'form_input-1',
        type: 'smoothstep'
      },
      {
        id: 'e2',
        source: 'form_input-1',
        target: 'decision-1',
        type: 'smoothstep'
      },
      {
        id: 'e3',
        source: 'decision-1',
        sourceHandle: 'yes',
        target: 'approval-1',
        type: 'smoothstep',
        label: 'High Risk'
      },
      {
        id: 'e4',
        source: 'decision-1',
        sourceHandle: 'no',
        target: 'end-1',
        type: 'smoothstep',
        label: 'Low Risk'
      },
      {
        id: 'e5',
        source: 'approval-1',
        target: 'end-1',
        type: 'smoothstep'
      }
    ],
    viewport: { x: 0, y: 0, zoom: 1 }
  }
};

// Simple Linear Workflow Template
export const simpleDocumentApprovalTemplate: WorkflowDefinition = {
  name: "Simple Document Approval",
  description: "Basic linear document approval workflow",
  workflow_type: "change_request",
  version: 1,
  status: "draft",
  flow_data: {
    nodes: [
      {
        id: 'start-1',
        type: 'workflow',
        position: { x: 100, y: 50 },
        data: {
          label: 'Document Submitted',
          stepType: 'start',
          description: 'Document submitted for approval',
          configuration: {}
        }
      },
      {
        id: 'review-1',
        type: 'workflow',
        position: { x: 300, y: 50 },
        data: {
          label: 'Initial Review',
          stepType: 'review',
          description: 'Initial document review',
          configuration: {
            approvers: ['reviewer@company.com'],
            timeLimit: 24,
            instructions: 'Review document for completeness and accuracy'
          }
        }
      },
      {
        id: 'approval-1',
        type: 'workflow',
        position: { x: 500, y: 50 },
        data: {
          label: 'Manager Approval',
          stepType: 'approval',
          description: 'Manager approval required',
          configuration: {
            approvers: ['manager@company.com'],
            approvalType: 'single',
            timeLimit: 48,
            instructions: 'Final approval for document'
          }
        }
      },
      {
        id: 'notification-1',
        type: 'workflow',
        position: { x: 700, y: 50 },
        data: {
          label: 'Send Approval Notice',
          stepType: 'notification',
          description: 'Notify stakeholders of approval',
          configuration: {
            recipients: ['requester@company.com', 'team@company.com'],
            template: 'Document {{document_name}} has been approved and is now effective.'
          }
        }
      },
      {
        id: 'end-1',
        type: 'workflow',
        position: { x: 900, y: 50 },
        data: {
          label: 'Document Approved',
          stepType: 'end',
          description: 'Document approval process complete',
          configuration: {}
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'review-1',
        type: 'smoothstep'
      },
      {
        id: 'e2',
        source: 'review-1',
        target: 'approval-1',
        type: 'smoothstep'
      },
      {
        id: 'e3',
        source: 'approval-1',
        target: 'notification-1',
        type: 'smoothstep'
      },
      {
        id: 'e4',
        source: 'notification-1',
        target: 'end-1',
        type: 'smoothstep'
      }
    ],
    viewport: { x: 0, y: 0, zoom: 0.8 }
  }
};

// Conditional Workflow Template
export const conditionalQualityControlTemplate: WorkflowDefinition = {
  name: "Quality Control with Conditions",
  description: "Quality control workflow with conditional branches",
  workflow_type: "quality_deviation_investigation",
  version: 1,
  status: "draft",
  flow_data: {
    nodes: [
      {
        id: 'start-1',
        type: 'workflow',
        position: { x: 100, y: 100 },
        data: {
          label: 'Quality Issue Reported',
          stepType: 'start',
          description: 'Quality control issue reported',
          configuration: {}
        }
      },
      {
        id: 'form_input-1',
        type: 'workflow',
        position: { x: 100, y: 250 },
        data: {
          label: 'Issue Assessment',
          stepType: 'form_input',
          description: 'Assess severity and impact of quality issue',
          configuration: {
            formFields: [
              {
                id: 'severity',
                label: 'Severity Level',
                type: 'select',
                required: true,
                options: ['Critical', 'Major', 'Minor']
              },
              {
                id: 'product_affected',
                label: 'Product Affected',
                type: 'text',
                required: true
              },
              {
                id: 'batch_number',
                label: 'Batch Number',
                type: 'text',
                required: false
              }
            ],
            timeLimit: 8
          }
        }
      },
      {
        id: 'decision-1',
        type: 'workflow',
        position: { x: 350, y: 250 },
        data: {
          label: 'Severity Check',
          stepType: 'decision',
          description: 'Determine workflow path based on severity',
          configuration: {
            conditions: [
              {
                field: 'severity',
                operator: 'equals',
                value: 'Critical',
                outputLabel: 'Critical Path'
              },
              {
                field: 'severity',
                operator: 'in',
                value: ['Major', 'Minor'],
                outputLabel: 'Standard Path'
              }
            ]
          }
        }
      },
      {
        id: 'notification-1',
        type: 'workflow',
        position: { x: 600, y: 150 },
        data: {
          label: 'Emergency Alert',
          stepType: 'notification',
          description: 'Send emergency alert for critical issues',
          configuration: {
            recipients: ['qa.director@company.com', 'ceo@company.com', 'emergency.team@company.com'],
            template: 'CRITICAL QUALITY ALERT: {{product_affected}} - Batch {{batch_number}} requires immediate attention.'
          }
        }
      },
      {
        id: 'approval-1',
        type: 'workflow',
        position: { x: 850, y: 150 },
        data: {
          label: 'Executive Review',
          stepType: 'approval',
          description: 'Executive team approval for critical issues',
          configuration: {
            approvers: ['qa.director@company.com', 'operations.director@company.com'],
            approvalType: 'majority',
            timeLimit: 4,
            instructions: 'Immediate review required for critical quality issue'
          }
        }
      },
      {
        id: 'review-1',
        type: 'workflow',
        position: { x: 600, y: 350 },
        data: {
          label: 'Standard Investigation',
          stepType: 'review',
          description: 'Standard quality investigation process',
          configuration: {
            approvers: ['qa.specialist@company.com'],
            timeLimit: 72,
            instructions: 'Conduct thorough investigation and document findings'
          }
        }
      },
      {
        id: 'end-1',
        type: 'workflow',
        position: { x: 1100, y: 250 },
        data: {
          label: 'Issue Resolved',
          stepType: 'end',
          description: 'Quality issue investigation complete',
          configuration: {}
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'form_input-1',
        type: 'smoothstep'
      },
      {
        id: 'e2',
        source: 'form_input-1',
        target: 'decision-1',
        type: 'smoothstep'
      },
      {
        id: 'e3',
        source: 'decision-1',
        sourceHandle: 'yes',
        target: 'notification-1',
        type: 'smoothstep',
        label: 'Critical'
      },
      {
        id: 'e4',
        source: 'decision-1',
        sourceHandle: 'no',
        target: 'review-1',
        type: 'smoothstep',
        label: 'Standard'
      },
      {
        id: 'e5',
        source: 'notification-1',
        target: 'approval-1',
        type: 'smoothstep'
      },
      {
        id: 'e6',
        source: 'approval-1',
        target: 'end-1',
        type: 'smoothstep'
      },
      {
        id: 'e7',
        source: 'review-1',
        target: 'end-1',
        type: 'smoothstep'
      }
    ],
    viewport: { x: 0, y: 0, zoom: 0.7 }
  }
};

// Complex Conditional Workflow Template
export const complexSupplierQualificationTemplate: WorkflowDefinition = {
  name: "Complex Supplier Qualification",
  description: "Multi-stage supplier qualification with complex decision logic",
  workflow_type: "supplier_qualification",
  version: 1,
  status: "draft",
  flow_data: {
    nodes: [
      {
        id: 'start-1',
        type: 'workflow',
        position: { x: 100, y: 100 },
        data: {
          label: 'Supplier Application',
          stepType: 'start',
          description: 'New supplier qualification request',
          configuration: {}
        }
      },
      {
        id: 'form_input-1',
        type: 'workflow',
        position: { x: 100, y: 250 },
        data: {
          label: 'Initial Screening',
          stepType: 'form_input',
          description: 'Basic supplier information and capabilities',
          configuration: {
            formFields: [
              {
                id: 'supplier_type',
                label: 'Supplier Type',
                type: 'select',
                required: true,
                options: ['Raw Material', 'Equipment', 'Service', 'Packaging']
              },
              {
                id: 'risk_category',
                label: 'Risk Category',
                type: 'select',
                required: true,
                options: ['High', 'Medium', 'Low']
              },
              {
                id: 'regulatory_requirements',
                label: 'Regulatory Requirements',
                type: 'checkbox',
                required: true,
                options: ['FDA', 'EMA', 'ICH', 'ISO']
              }
            ],
            timeLimit: 48
          }
        }
      },
      {
        id: 'decision-1',
        type: 'workflow',
        position: { x: 350, y: 250 },
        data: {
          label: 'Risk Assessment',
          stepType: 'decision',
          description: 'Evaluate supplier risk level',
          configuration: {
            conditions: [
              {
                field: 'risk_category',
                operator: 'equals',
                value: 'High',
                outputLabel: 'High Risk Path'
              },
              {
                field: 'risk_category',
                operator: 'equals',
                value: 'Medium',
                outputLabel: 'Medium Risk Path'
              },
              {
                field: 'risk_category',
                operator: 'equals',
                value: 'Low',
                outputLabel: 'Low Risk Path'
              }
            ]
          }
        }
      },
      {
        id: 'parallel_gateway-1',
        type: 'workflow',
        position: { x: 600, y: 150 },
        data: {
          label: 'High Risk Evaluation',
          stepType: 'parallel_gateway',
          description: 'Parallel evaluation for high-risk suppliers',
          configuration: {}
        }
      },
      {
        id: 'approval-1',
        type: 'workflow',
        position: { x: 800, y: 100 },
        data: {
          label: 'Financial Review',
          stepType: 'approval',
          description: 'Financial stability assessment',
          configuration: {
            approvers: ['finance.director@company.com'],
            approvalType: 'single',
            timeLimit: 72
          }
        }
      },
      {
        id: 'approval-2',
        type: 'workflow',
        position: { x: 800, y: 200 },
        data: {
          label: 'Technical Review',
          stepType: 'approval',
          description: 'Technical capability assessment',
          configuration: {
            approvers: ['tech.lead@company.com', 'qa.manager@company.com'],
            approvalType: 'unanimous',
            timeLimit: 120
          }
        }
      },
      {
        id: 'review-1',
        type: 'workflow',
        position: { x: 600, y: 300 },
        data: {
          label: 'Standard Review',
          stepType: 'review',
          description: 'Standard supplier evaluation',
          configuration: {
            approvers: ['procurement.manager@company.com'],
            timeLimit: 96
          }
        }
      },
      {
        id: 'review-2',
        type: 'workflow',
        position: { x: 600, y: 400 },
        data: {
          label: 'Fast Track Review',
          stepType: 'review',
          description: 'Expedited review for low-risk suppliers',
          configuration: {
            approvers: ['procurement.specialist@company.com'],
            timeLimit: 24
          }
        }
      },
      {
        id: 'exclusive_gateway-1',
        type: 'workflow',
        position: { x: 1000, y: 250 },
        data: {
          label: 'Final Decision',
          stepType: 'exclusive_gateway',
          description: 'Consolidate all review results',
          configuration: {}
        }
      },
      {
        id: 'notification-1',
        type: 'workflow',
        position: { x: 1200, y: 200 },
        data: {
          label: 'Approval Notice',
          stepType: 'notification',
          description: 'Notify supplier of approval',
          configuration: {
            recipients: ['supplier@external.com', 'procurement@company.com'],
            template: 'Congratulations! Your supplier qualification has been approved.'
          }
        }
      },
      {
        id: 'notification-2',
        type: 'workflow',
        position: { x: 1200, y: 300 },
        data: {
          label: 'Rejection Notice',
          stepType: 'notification',
          description: 'Notify supplier of rejection',
          configuration: {
            recipients: ['supplier@external.com', 'procurement@company.com'],
            template: 'We regret to inform you that your supplier qualification was not approved at this time.'
          }
        }
      },
      {
        id: 'end-1',
        type: 'workflow',
        position: { x: 1400, y: 200 },
        data: {
          label: 'Supplier Qualified',
          stepType: 'end',
          description: 'Supplier successfully qualified',
          configuration: {}
        }
      },
      {
        id: 'end-2',
        type: 'workflow',
        position: { x: 1400, y: 300 },
        data: {
          label: 'Supplier Rejected',
          stepType: 'end',
          description: 'Supplier qualification rejected',
          configuration: {}
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'form_input-1',
        type: 'smoothstep'
      },
      {
        id: 'e2',
        source: 'form_input-1',
        target: 'decision-1',
        type: 'smoothstep'
      },
      {
        id: 'e3',
        source: 'decision-1',
        target: 'parallel_gateway-1',
        type: 'smoothstep',
        label: 'High Risk'
      },
      {
        id: 'e4',
        source: 'decision-1',
        target: 'review-1',
        type: 'smoothstep',
        label: 'Medium Risk'
      },
      {
        id: 'e5',
        source: 'decision-1',
        target: 'review-2',
        type: 'smoothstep',
        label: 'Low Risk'
      },
      {
        id: 'e6',
        source: 'parallel_gateway-1',
        target: 'approval-1',
        type: 'smoothstep'
      },
      {
        id: 'e7',
        source: 'parallel_gateway-1',
        target: 'approval-2',
        type: 'smoothstep'
      },
      {
        id: 'e8',
        source: 'approval-1',
        target: 'exclusive_gateway-1',
        type: 'smoothstep'
      },
      {
        id: 'e9',
        source: 'approval-2',
        target: 'exclusive_gateway-1',
        type: 'smoothstep'
      },
      {
        id: 'e10',
        source: 'review-1',
        target: 'exclusive_gateway-1',
        type: 'smoothstep'
      },
      {
        id: 'e11',
        source: 'review-2',
        target: 'exclusive_gateway-1',
        type: 'smoothstep'
      },
      {
        id: 'e12',
        source: 'exclusive_gateway-1',
        target: 'notification-1',
        type: 'smoothstep',
        label: 'Approved'
      },
      {
        id: 'e13',
        source: 'exclusive_gateway-1',
        target: 'notification-2',
        type: 'smoothstep',
        label: 'Rejected'
      },
      {
        id: 'e14',
        source: 'notification-1',
        target: 'end-1',
        type: 'smoothstep'
      },
      {
        id: 'e15',
        source: 'notification-2',
        target: 'end-2',
        type: 'smoothstep'
      }
    ],
    viewport: { x: 0, y: 0, zoom: 0.6 }
  }
};

// Loop-based Workflow Template
export const loopBasedValidationTemplate: WorkflowDefinition = {
  name: "Validation Protocol with Iterations",
  description: "Validation workflow with feedback loops and iterations",
  workflow_type: "validation_protocol",
  version: 1,
  status: "draft",
  flow_data: {
    nodes: [
      {
        id: 'start-1',
        type: 'workflow',
        position: { x: 100, y: 100 },
        data: {
          label: 'Validation Request',
          stepType: 'start',
          description: 'Equipment/process validation request initiated',
          configuration: {}
        }
      },
      {
        id: 'form_input-1',
        type: 'workflow',
        position: { x: 100, y: 250 },
        data: {
          label: 'Protocol Development',
          stepType: 'form_input',
          description: 'Develop validation protocol',
          configuration: {
            formFields: [
              {
                id: 'validation_type',
                label: 'Validation Type',
                type: 'select',
                required: true,
                options: ['IQ', 'OQ', 'PQ', 'Cleaning']
              },
              {
                id: 'protocol_version',
                label: 'Protocol Version',
                type: 'number',
                required: true
              },
              {
                id: 'test_parameters',
                label: 'Test Parameters',
                type: 'textarea',
                required: true
              }
            ],
            timeLimit: 120
          }
        }
      },
      {
        id: 'review-1',
        type: 'workflow',
        position: { x: 350, y: 250 },
        data: {
          label: 'Protocol Review',
          stepType: 'review',
          description: 'Review validation protocol for completeness',
          configuration: {
            approvers: ['validation.manager@company.com', 'qa.lead@company.com'],
            timeLimit: 72,
            instructions: 'Review protocol for technical accuracy and compliance'
          }
        }
      },
      {
        id: 'decision-1',
        type: 'workflow',
        position: { x: 600, y: 250 },
        data: {
          label: 'Protocol Approved?',
          stepType: 'decision',
          description: 'Check if protocol meets requirements',
          configuration: {
            conditions: [
              {
                field: 'review_result',
                operator: 'equals',
                value: 'approved',
                outputLabel: 'Approved'
              },
              {
                field: 'review_result',
                operator: 'equals',
                value: 'needs_revision',
                outputLabel: 'Needs Revision'
              }
            ]
          }
        }
      },
      {
        id: 'form_input-2',
        type: 'workflow',
        position: { x: 400, y: 450 },
        data: {
          label: 'Protocol Revision',
          stepType: 'form_input',
          description: 'Revise protocol based on feedback',
          configuration: {
            formFields: [
              {
                id: 'revision_notes',
                label: 'Revision Notes',
                type: 'textarea',
                required: true
              },
              {
                id: 'changes_made',
                label: 'Changes Made',
                type: 'textarea',
                required: true
              }
            ],
            timeLimit: 48
          }
        }
      },
      {
        id: 'form_input-3',
        type: 'workflow',
        position: { x: 850, y: 250 },
        data: {
          label: 'Execute Testing',
          stepType: 'form_input',
          description: 'Execute validation testing according to protocol',
          configuration: {
            formFields: [
              {
                id: 'test_results',
                label: 'Test Results',
                type: 'textarea',
                required: true
              },
              {
                id: 'deviations',
                label: 'Deviations Observed',
                type: 'textarea',
                required: false
              },
              {
                id: 'test_date',
                label: 'Test Date',
                type: 'date',
                required: true
              }
            ],
            timeLimit: 168
          }
        }
      },
      {
        id: 'review-2',
        type: 'workflow',
        position: { x: 1100, y: 250 },
        data: {
          label: 'Results Review',
          stepType: 'review',
          description: 'Review test results and compliance',
          configuration: {
            approvers: ['validation.specialist@company.com'],
            timeLimit: 48,
            instructions: 'Verify test results meet acceptance criteria'
          }
        }
      },
      {
        id: 'decision-2',
        type: 'workflow',
        position: { x: 1350, y: 250 },
        data: {
          label: 'Results Acceptable?',
          stepType: 'decision',
          description: 'Determine if validation results are acceptable',
          configuration: {
            conditions: [
              {
                field: 'results_status',
                operator: 'equals',
                value: 'passed',
                outputLabel: 'Passed'
              },
              {
                field: 'results_status',
                operator: 'equals',
                value: 'failed',
                outputLabel: 'Failed - Retest'
              }
            ]
          }
        }
      },
      {
        id: 'approval-1',
        type: 'workflow',
        position: { x: 1600, y: 150 },
        data: {
          label: 'Final Approval',
          stepType: 'approval',
          description: 'Final validation approval',
          configuration: {
            approvers: ['validation.director@company.com', 'qa.director@company.com'],
            approvalType: 'unanimous',
            timeLimit: 72,
            instructions: 'Final approval for validation completion'
          }
        }
      },
      {
        id: 'notification-1',
        type: 'workflow',
        position: { x: 1200, y: 450 },
        data: {
          label: 'Retest Required',
          stepType: 'notification',
          description: 'Notify team that retesting is required',
          configuration: {
            recipients: ['validation.team@company.com', 'operations@company.com'],
            template: 'Validation testing failed. Retesting required after corrective actions.'
          }
        }
      },
      {
        id: 'end-1',
        type: 'workflow',
        position: { x: 1850, y: 150 },
        data: {
          label: 'Validation Complete',
          stepType: 'end',
          description: 'Validation successfully completed',
          configuration: {}
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'form_input-1',
        type: 'smoothstep'
      },
      {
        id: 'e2',
        source: 'form_input-1',
        target: 'review-1',
        type: 'smoothstep'
      },
      {
        id: 'e3',
        source: 'review-1',
        target: 'decision-1',
        type: 'smoothstep'
      },
      {
        id: 'e4',
        source: 'decision-1',
        target: 'form_input-3',
        type: 'smoothstep',
        label: 'Approved'
      },
      {
        id: 'e5',
        source: 'decision-1',
        target: 'form_input-2',
        type: 'smoothstep',
        label: 'Needs Revision'
      },
      {
        id: 'e6',
        source: 'form_input-2',
        target: 'review-1',
        type: 'smoothstep'
      },
      {
        id: 'e7',
        source: 'form_input-3',
        target: 'review-2',
        type: 'smoothstep'
      },
      {
        id: 'e8',
        source: 'review-2',
        target: 'decision-2',
        type: 'smoothstep'
      },
      {
        id: 'e9',
        source: 'decision-2',
        target: 'approval-1',
        type: 'smoothstep',
        label: 'Passed'
      },
      {
        id: 'e10',
        source: 'decision-2',
        target: 'notification-1',
        type: 'smoothstep',
        label: 'Failed'
      },
      {
        id: 'e11',
        source: 'notification-1',
        target: 'form_input-3',
        type: 'smoothstep'
      },
      {
        id: 'e12',
        source: 'approval-1',
        target: 'end-1',
        type: 'smoothstep'
      }
    ],
    viewport: { x: 0, y: 0, zoom: 0.5 }
  }
};

// HPLC Equipment Access Request Template (Demonstrates auto-form generation)
export const hplcAccessRequestTemplate: WorkflowDefinition = {
  name: "HPLC Equipment Access Request",
  description: "Request access to HPLC analytical equipment with automatic form generation",
  workflow_type: "change_request",
  version: 1,
  status: "active", // Make it active so it shows in portal
  flow_data: {
    nodes: [
      {
        id: 'start-1',
        type: 'workflow',
        position: { x: 100, y: 50 },
        data: {
          label: 'Access Request Submitted',
          stepType: 'start',
          description: 'User submits HPLC equipment access request',
          configuration: {}
        }
      },
      {
        id: 'form_input-1',
        type: 'workflow',
        position: { x: 100, y: 200 },
        data: {
          label: 'User Information & Justification',
          stepType: 'form_input',
          description: 'Collect user details and business justification',
          configuration: {
            formFields: [
              {
                id: 'employee_id',
                label: 'Employee ID',
                type: 'text',
                required: true,
                placeholder: 'Enter your employee ID (e.g., EMP12345)'
              },
              {
                id: 'department',
                label: 'Department',
                type: 'select',
                required: true,
                options: [
                  { value: 'quality_control', label: 'Quality Control' },
                  { value: 'research_development', label: 'Research & Development' },
                  { value: 'regulatory_affairs', label: 'Regulatory Affairs' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                  { value: 'quality_assurance', label: 'Quality Assurance' }
                ]
              },
              {
                id: 'business_justification',
                label: 'Business Justification',
                type: 'textarea',
                required: true,
                placeholder: 'Explain why you need access to HPLC equipment and how it supports your work'
              },
              {
                id: 'project_name',
                label: 'Project/Study Name',
                type: 'text',
                required: true,
                placeholder: 'Enter the project or study name'
              }
            ]
          }
        }
      },
      {
        id: 'form_input-2',
        type: 'workflow',
        position: { x: 400, y: 200 },
        data: {
          label: 'Access Details & Equipment Selection',
          stepType: 'form_input',
          description: 'Specify access timeframe and equipment requirements',
          configuration: {
            formFields: [
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
                id: 'estimated_hours_per_week',
                label: 'Estimated Hours Per Week',
                type: 'number',
                required: true,
                placeholder: 'How many hours per week will you use the equipment?'
              },
              {
                id: 'sample_type',
                label: 'Sample Type',
                type: 'select',
                required: true,
                options: [
                  { value: 'pharmaceutical_api', label: 'Pharmaceutical API' },
                  { value: 'excipients', label: 'Excipients' },
                  { value: 'formulation', label: 'Formulation/Finished Product' },
                  { value: 'raw_materials', label: 'Raw Materials' },
                  { value: 'reference_standards', label: 'Reference Standards' }
                ]
              }
            ],
            equipmentSelection: {
              label: 'Select HPLC Equipment',
              required: true,
              multiple: false,
              options: [
                { value: 'hplc_agilent_1260', label: 'HPLC - Agilent 1260 Infinity (QC Lab A)' },
                { value: 'hplc_waters_acquity', label: 'UPLC - Waters Acquity (QC Lab B)' },
                { value: 'hplc_shimadzu_prominence', label: 'HPLC - Shimadzu Prominence (R&D Lab)' },
                { value: 'hplc_thermo_vanquish', label: 'UHPLC - Thermo Vanquish (Development Lab)' }
              ]
            }
          }
        }
      },
      {
        id: 'form_input-3',
        type: 'workflow',
        position: { x: 700, y: 200 },
        data: {
          label: 'Required Documentation Upload',
          stepType: 'form_input',
          description: 'Upload required training certificates and safety forms',
          configuration: {
            formFields: [
              {
                id: 'additional_notes',
                label: 'Additional Notes or Special Requirements',
                type: 'textarea',
                required: false,
                placeholder: 'Any special requirements or additional information'
              }
            ],
            requiredDocuments: [
              {
                id: 'training_certificate',
                label: 'HPLC Training Certificate',
                type: 'file',
                required: true,
                acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
                description: 'Valid HPLC equipment training certificate'
              },
              {
                id: 'safety_form',
                label: 'Laboratory Safety Assessment Form',
                type: 'file',
                required: true,
                acceptedTypes: ['pdf', 'doc', 'docx'],
                description: 'Completed laboratory safety assessment and acknowledgment form'
              },
              {
                id: 'id_copy',
                label: 'Photo ID Copy',
                type: 'file',
                required: true,
                acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
                description: 'Copy of government-issued photo identification'
              }
            ]
          }
        }
      },
      {
        id: 'approval-1',
        type: 'workflow',
        position: { x: 400, y: 350 },
        data: {
          label: 'Lab Supervisor Approval',
          stepType: 'approval',
          description: 'Lab supervisor reviews and approves equipment access request',
          configuration: {
            approvers: ['lab.supervisor@company.com'],
            approvalType: 'single',
            timeLimit: 48,
            instructions: 'Review employee qualifications, training status, and business justification for HPLC equipment access'
          }
        }
      },
      {
        id: 'notification-1',
        type: 'workflow',
        position: { x: 400, y: 500 },
        data: {
          label: 'Access Granted Notification',
          stepType: 'notification',
          description: 'Notify user and relevant parties of approved access',
          configuration: {
            recipients: ['{{requester_email}}', 'lab.manager@company.com', 'equipment.coordinator@company.com'],
            template: `Equipment Access Approved

Dear {{employee_name}},

Your request for HPLC equipment access has been approved.

Equipment: {{selected_equipment}}
Access Period: {{access_start_date}} to {{access_end_date}}
Project: {{project_name}}

Please ensure you follow all safety protocols and equipment usage guidelines.

Best regards,
Laboratory Management Team`
          }
        }
      },
      {
        id: 'end-1',
        type: 'workflow',
        position: { x: 400, y: 650 },
        data: {
          label: 'Access Granted',
          stepType: 'end',
          description: 'HPLC equipment access successfully granted',
          configuration: {}
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'form_input-1',
        type: 'smoothstep'
      },
      {
        id: 'e2',
        source: 'form_input-1',
        target: 'form_input-2',
        type: 'smoothstep'
      },
      {
        id: 'e3',
        source: 'form_input-2',
        target: 'form_input-3',
        type: 'smoothstep'
      },
      {
        id: 'e4',
        source: 'form_input-3',
        target: 'approval-1',
        type: 'smoothstep'
      },
      {
        id: 'e5',
        source: 'approval-1',
        target: 'notification-1',
        type: 'smoothstep'
      },
      {
        id: 'e6',
        source: 'notification-1',
        target: 'end-1',
        type: 'smoothstep'
      }
    ],
    viewport: { x: 0, y: 0, zoom: 0.8 }
  }
};