-- Update Simple Document Approval workflow with complete, realistic configurations
UPDATE workflow_definitions 
SET flow_data = '{
  "nodes": [
    {
      "id": "start-1",
      "type": "workflow",
      "position": {"x": 100, "y": 50},
      "data": {
        "label": "Document Submitted",
        "stepType": "start",
        "description": "Document submission initiated",
        "configuration": {
          "instructions": "Submit your document for approval process",
          "requiredDocuments": ["Document draft", "Supporting materials"],
          "submissionGuidelines": "Ensure all required fields are completed before submission"
        }
      }
    },
    {
      "id": "form-input-1", 
      "type": "workflow",
      "position": {"x": 300, "y": 50},
      "data": {
        "label": "Document Details",
        "stepType": "form_input", 
        "description": "Collect comprehensive document information",
        "configuration": {
          "formFields": [
            {
              "id": "document_title",
              "label": "Document Title",
              "type": "text",
              "required": true,
              "placeholder": "Enter descriptive document title",
              "validation": "minimum 10 characters"
            },
            {
              "id": "document_type",
              "label": "Document Type", 
              "type": "select",
              "required": true,
              "options": ["Standard Operating Procedure", "Work Instruction", "Policy", "Quality Manual", "Training Material", "Form Template", "Technical Specification"]
            },
            {
              "id": "document_description",
              "label": "Document Purpose & Scope",
              "type": "textarea", 
              "required": true,
              "placeholder": "Describe the purpose, scope, and intended audience of this document",
              "validation": "minimum 50 characters"
            },
            {
              "id": "department",
              "label": "Responsible Department",
              "type": "select",
              "required": true,
              "options": ["Quality Assurance", "Production", "Engineering", "Regulatory Affairs", "Human Resources", "Information Technology", "Maintenance"]
            },
            {
              "id": "effective_date",
              "label": "Requested Effective Date",
              "type": "date",
              "required": true
            },
            {
              "id": "review_frequency",
              "label": "Review Frequency",
              "type": "select",
              "required": true,
              "options": ["Annual", "Bi-annual", "Quarterly", "As needed"]
            },
            {
              "id": "business_justification",
              "label": "Business Justification",
              "type": "textarea",
              "required": true,
              "placeholder": "Explain why this document is needed and its business impact"
            }
          ],
          "instructions": "Please provide complete and accurate document information. All fields marked with * are required.",
          "timeLimit": 72,
          "autoSave": true
        }
      }
    },
    {
      "id": "review-1",
      "type": "workflow", 
      "position": {"x": 500, "y": 50},
      "data": {
        "label": "Technical Review",
        "stepType": "review",
        "description": "Subject matter expert technical review",
        "configuration": {
          "approvers": ["john.smith@company.com", "sarah.johnson@company.com", "mike.wilson@company.com"],
          "approvalType": "single",
          "timeLimit": 48,
          "escalationTime": 24,
          "escalationTo": ["review.supervisor@company.com"],
          "instructions": "Conduct thorough technical review focusing on: 1) Technical accuracy and completeness 2) Compliance with company standards 3) Clarity and usability 4) Proper formatting and references 5) Alignment with regulatory requirements",
          "reviewCriteria": [
            "Technical accuracy verified",
            "Compliance standards met", 
            "Content clarity acceptable",
            "Formatting standards followed",
            "References properly cited"
          ],
          "requiredActions": [
            "Complete technical assessment",
            "Verify regulatory compliance", 
            "Check against existing procedures",
            "Validate technical specifications"
          ],
          "notificationTemplate": "Document {{document_title}} ({{document_type}}) has been assigned to you for technical review. Please complete your review within {{timeLimit}} hours. Access the document at: {{document_link}}",
          "reminderSchedule": [12, 24, 36]
        }
      }
    },
    {
      "id": "decision-1",
      "type": "workflow",
      "position": {"x": 700, "y": 50}, 
      "data": {
        "label": "Review Decision Gateway",
        "stepType": "decision",
        "description": "Automated routing based on technical review outcome",
        "configuration": {
          "conditions": [
            {
              "field": "review_status",
              "operator": "equals", 
              "value": "approved",
              "outputLabel": "Technical Review Approved",
              "nextStep": "approval-1",
              "notificationMessage": "Technical review completed successfully. Proceeding to management approval."
            },
            {
              "field": "review_status",
              "operator": "equals",
              "value": "needs_revision", 
              "outputLabel": "Requires Revision",
              "nextStep": "notification-revision",
              "notificationMessage": "Document requires technical revisions before proceeding."
            },
            {
              "field": "review_status",
              "operator": "equals",
              "value": "rejected",
              "outputLabel": "Technical Review Rejected",
              "nextStep": "notification-rejected",
              "notificationMessage": "Document rejected during technical review."
            }
          ],
          "autoRoute": true,
          "logDecision": true,
          "decisionAuditTrail": true
        }
      }
    },
    {
      "id": "approval-1",
      "type": "workflow",
      "position": {"x": 900, "y": 50},
      "data": {
        "label": "Management Approval", 
        "stepType": "approval",
        "description": "Final management approval for document release",
        "configuration": {
          "approvers": ["director.operations@company.com", "qa.manager@company.com", "compliance.officer@company.com"],
          "approvalType": "majority",
          "minimumApprovals": 2,
          "timeLimit": 72,
          "escalationTime": 48,
          "escalationTo": ["senior.management@company.com"],
          "instructions": "Final approval evaluation: 1) Business impact assessment 2) Resource allocation review 3) Strategic alignment verification 4) Risk assessment completion 5) Implementation feasibility",
          "approvalCriteria": [
            "Business case validated",
            "Resources adequately planned",
            "Risks properly mitigated",
            "Implementation plan feasible",
            "ROI expectations realistic"
          ],
          "requiredDocuments": [
            "Technical review report",
            "Impact assessment",
            "Implementation timeline"
          ],
          "notificationTemplate": "Document {{document_title}} requires your management approval. Technical review completed by {{reviewer_name}} with status: {{review_outcome}}. Please review and approve within {{timeLimit}} hours.",
          "approvalLevels": [
            {"level": 1, "title": "Department Manager", "emails": ["dept.manager@company.com"]},
            {"level": 2, "title": "QA Manager", "emails": ["qa.manager@company.com"]},
            {"level": 3, "title": "Compliance Officer", "emails": ["compliance.officer@company.com"]}
          ],
          "reminderSchedule": [24, 48, 60],
          "autoApproveAfter": 168,
          "delegationAllowed": true
        }
      }
    },
    {
      "id": "notification-approved",
      "type": "workflow",
      "position": {"x": 1100, "y": 50},
      "data": {
        "label": "Approval Notification",
        "stepType": "notification",
        "description": "Comprehensive approval notification to all stakeholders", 
        "configuration": {
          "recipients": [
            "{{requester_email}}",
            "document.control@company.com",
            "training.coordinator@company.com", 
            "{{department_head}}",
            "all.staff@company.com"
          ],
          "ccRecipients": [
            "quality.team@company.com",
            "regulatory.affairs@company.com"
          ],
          "template": "Document Approval Notification\\n\\nDear Team,\\n\\nDocument: {{document_title}}\\nType: {{document_type}}\\nDepartment: {{department}}\\nApproved by: {{approver_name}}\\nApproval Date: {{approval_date}}\\nEffective Date: {{effective_date}}\\n\\nThis document has been officially approved and is now effective. Please ensure:\\n1. All relevant personnel are trained on new procedures\\n2. Obsolete versions are removed from use\\n3. Document is properly distributed per controlled distribution list\\n\\nDocument Location: {{document_repository_link}}\\nTraining Requirements: {{training_requirements}}\\n\\nFor questions, contact Document Control at document.control@company.com\\n\\nBest regards,\\nDocument Management System",
          "subject": "APPROVED: {{document_title}} - Effective {{effective_date}}",
          "priority": "high",
          "deliveryConfirmation": true,
          "attachments": ["approved_document.pdf", "training_checklist.pdf"],
          "followUpActions": [
            "Schedule training sessions",
            "Update document register",
            "Archive previous versions",
            "Notify external partners if applicable"
          ]
        }
      }
    },
    {
      "id": "notification-revision",
      "type": "workflow", 
      "position": {"x": 700, "y": 200},
      "data": {
        "label": "Revision Request Notice",
        "stepType": "notification",
        "description": "Detailed revision request with specific feedback",
        "configuration": {
          "recipients": ["{{requester_email}}", "{{document_author}}"],
          "ccRecipients": ["{{department_head}}", "document.control@company.com"],
          "template": "Document Revision Required\\n\\nDear {{requester_name}},\\n\\nYour document submission requires revision before approval can proceed.\\n\\nDocument: {{document_title}}\\nSubmission Date: {{submission_date}}\\nReviewer: {{reviewer_name}}\\nReview Date: {{review_date}}\\n\\nRequired Revisions:\\n{{review_comments}}\\n\\nSpecific Issues Identified:\\n{{revision_details}}\\n\\nPlease address all comments and resubmit within {{revision_deadline}} days.\\n\\nRevision Guidelines:\\n1. Address each comment specifically\\n2. Track changes for easy review\\n3. Provide response summary for each revision\\n4. Update document version number\\n\\nFor assistance, contact: {{reviewer_email}}\\n\\nThank you,\\nDocument Review Team",
          "subject": "REVISION REQUIRED: {{document_title}} - Action Required",
          "priority": "normal",
          "revisionDeadline": 168,
          "supportContact": "document.support@company.com",
          "revisionGuidelines": "document_revision_process.pdf"
        }
      }
    },
    {
      "id": "notification-rejected", 
      "type": "workflow",
      "position": {"x": 700, "y": 350},
      "data": {
        "label": "Rejection Notification",
        "stepType": "notification", 
        "description": "Formal rejection notice with detailed reasoning",
        "configuration": {
          "recipients": ["{{requester_email}}", "{{document_author}}"],
          "ccRecipients": ["{{department_head}}", "document.control@company.com", "qa.manager@company.com"],
          "template": "Document Submission Rejected\\n\\nDear {{requester_name}},\\n\\nAfter careful review, your document submission has been rejected.\\n\\nDocument: {{document_title}}\\nSubmission Date: {{submission_date}}\\nReviewer: {{reviewer_name}}\\nRejection Date: {{rejection_date}}\\n\\nRejection Reasons:\\n{{rejection_reason}}\\n\\nDetailed Analysis:\\n{{rejection_details}}\\n\\nNext Steps:\\n1. Review rejection feedback thoroughly\\n2. Consult with {{reviewer_name}} for clarification\\n3. Consider alternative approaches\\n4. May resubmit if fundamental issues are resolved\\n\\nIf you believe this rejection was in error, please contact:\\n- Quality Manager: qa.manager@company.com\\n- Document Control: document.control@company.com\\n\\nA formal appeal process is available if needed.\\n\\nRegards,\\nDocument Review Committee",
          "subject": "REJECTED: {{document_title}} - Review Required",
          "priority": "high",
          "appealProcess": "document_appeal_process.pdf",
          "supportContacts": [
            "qa.manager@company.com",
            "document.control@company.com"
          ]
        }
      }
    },
    {
      "id": "end-approved",
      "type": "workflow",
      "position": {"x": 1300, "y": 50},
      "data": {
        "label": "Document Approved & Active",
        "stepType": "end", 
        "description": "Document successfully approved and activated",
        "configuration": {
          "finalStatus": "approved_active",
          "archiveLocation": "approved_documents_repository",
          "documentNumber": "auto_generated",
          "effectiveDate": "{{approval_date}}",
          "nextReviewDate": "{{calculated_review_date}}",
          "distributionList": "controlled_distribution",
          "completionActions": [
            "Update document register",
            "Archive previous versions", 
            "Notify controlled distribution list",
            "Schedule mandatory training",
            "Update quality management system"
          ],
          "metrics": [
            "approval_cycle_time",
            "reviewer_response_time", 
            "stakeholder_satisfaction"
          ]
        }
      }
    },
    {
      "id": "end-revision",
      "type": "workflow",
      "position": {"x": 900, "y": 200}, 
      "data": {
        "label": "Pending Author Revision",
        "stepType": "end",
        "description": "Document returned to author for revision",
        "configuration": {
          "finalStatus": "pending_revision", 
          "nextStep": "author_revision_process",
          "revisionDeadline": "{{calculated_deadline}}",
          "trackingRequired": true,
          "escalationRules": [
            {"days": 7, "action": "reminder_notification"},
            {"days": 14, "action": "supervisor_notification"},
            {"days": 21, "action": "automatic_withdrawal"}
          ],
          "supportResources": [
            "revision_guidelines.pdf",
            "document_standards.pdf",
            "reviewer_contact_info.pdf"
          ]
        }
      }
    },
    {
      "id": "end-rejected",
      "type": "workflow",
      "position": {"x": 900, "y": 350},
      "data": {
        "label": "Document Rejected - Process Complete",
        "stepType": "end",
        "description": "Document formally rejected, process terminated", 
        "configuration": {
          "finalStatus": "rejected_final",
          "archiveLocation": "rejected_documents_archive",
          "retentionPeriod": "7_years",
          "appealPeriod": "30_days",
          "appealContact": "qa.manager@company.com",
          "closeoutActions": [
            "Archive submission materials",
            "Update rejection statistics",
            "Document lessons learned",
            "Notify quality metrics team"
          ],
          "followUpRequired": false,
          "learningOpportunity": true
        }
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "start-1", 
      "target": "form-input-1",
      "type": "smoothstep",
      "label": "Initialize"
    },
    {
      "id": "e2",
      "source": "form-input-1",
      "target": "review-1", 
      "type": "smoothstep",
      "label": "Submit for Review"
    },
    {
      "id": "e3", 
      "source": "review-1",
      "target": "decision-1",
      "type": "smoothstep",
      "label": "Review Complete"
    },
    {
      "id": "e4-approved",
      "source": "decision-1", 
      "target": "approval-1",
      "type": "smoothstep", 
      "label": "Approved by Reviewer"
    },
    {
      "id": "e4-revision",
      "source": "decision-1",
      "target": "notification-revision",
      "type": "smoothstep",
      "label": "Needs Revision"
    },
    {
      "id": "e4-rejected",
      "source": "decision-1",
      "target": "notification-rejected", 
      "type": "smoothstep",
      "label": "Rejected by Reviewer"
    },
    {
      "id": "e5",
      "source": "approval-1",
      "target": "notification-approved",
      "type": "smoothstep", 
      "label": "Management Approved"
    },
    {
      "id": "e6-approved",
      "source": "notification-approved",
      "target": "end-approved",
      "type": "smoothstep",
      "label": "Process Complete"
    },
    {
      "id": "e6-revision", 
      "source": "notification-revision",
      "target": "end-revision",
      "type": "smoothstep",
      "label": "Awaiting Revision"
    },
    {
      "id": "e6-rejected",
      "source": "notification-rejected",
      "target": "end-rejected",
      "type": "smoothstep",
      "label": "Final Rejection"
    }
  ],
  "viewport": {"x": -100, "y": 0, "zoom": 0.5}
}'::jsonb,
description = 'Complete enterprise-grade document approval workflow with comprehensive configurations, realistic email addresses, detailed notification templates, escalation procedures, and full audit trail capabilities'
WHERE name = 'Simple Document Approval';