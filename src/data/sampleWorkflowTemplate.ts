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
                options: ['Phase I', 'Phase II', 'Phase III', 'Phase IV']
              },
              {
                id: 'participant_count',
                label: 'Number of Participants',
                type: 'number',
                required: true
              },
              {
                id: 'trial_duration',
                label: 'Trial Duration (months)',
                type: 'number',
                required: true
              },
              {
                id: 'primary_endpoint',
                label: 'Primary Endpoint',
                type: 'textarea',
                required: true
              },
              {
                id: 'adverse_events',
                label: 'Serious Adverse Events',
                type: 'textarea',
                required: true
              },
              {
                id: 'efficacy_data',
                label: 'Efficacy Data Summary',
                type: 'textarea',
                required: true
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