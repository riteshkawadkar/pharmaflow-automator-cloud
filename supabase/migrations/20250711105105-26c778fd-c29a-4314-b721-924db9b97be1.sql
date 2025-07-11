-- Update the Simple Document Approval workflow with enhanced node configurations
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
          "instructions": "Submit your document for approval process"
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
        "description": "Collect document information",
        "configuration": {
          "formFields": [
            {
              "id": "document_title",
              "label": "Document Title",
              "type": "text",
              "required": true
            },
            {
              "id": "document_type",
              "label": "Document Type", 
              "type": "select",
              "required": true,
              "options": ["Policy", "Procedure", "Work Instruction", "Form", "Other"]
            },
            {
              "id": "document_description",
              "label": "Description",
              "type": "textarea", 
              "required": true
            },
            {
              "id": "department",
              "label": "Department",
              "type": "select",
              "required": true,
              "options": ["Quality", "Production", "Engineering", "Regulatory", "HR"]
            }
          ],
          "instructions": "Please provide complete document information"
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
        "description": "Subject matter expert review",
        "configuration": {
          "approvers": ["technical.reviewer@company.com", "quality.lead@company.com"],
          "approvalType": "single",
          "timeLimit": 48,
          "instructions": "Review document for technical accuracy, completeness, and compliance with standards. Check formatting, references, and content quality."
        }
      }
    },
    {
      "id": "decision-1",
      "type": "workflow",
      "position": {"x": 700, "y": 50}, 
      "data": {
        "label": "Review Decision",
        "stepType": "decision",
        "description": "Determine next steps based on review",
        "configuration": {
          "conditions": [
            {
              "field": "review_status",
              "operator": "equals", 
              "value": "approved",
              "outputLabel": "Approved - Continue to Manager"
            },
            {
              "field": "review_status",
              "operator": "equals",
              "value": "needs_revision", 
              "outputLabel": "Needs Revision - Return to Submitter"
            },
            {
              "field": "review_status",
              "operator": "equals",
              "value": "rejected",
              "outputLabel": "Rejected - End Process"
            }
          ]
        }
      }
    },
    {
      "id": "approval-1",
      "type": "workflow",
      "position": {"x": 900, "y": 50},
      "data": {
        "label": "Manager Approval", 
        "stepType": "approval",
        "description": "Final management approval",
        "configuration": {
          "approvers": ["department.manager@company.com", "document.controller@company.com"],
          "approvalType": "majority",
          "timeLimit": 72,
          "instructions": "Final approval for document release. Verify business impact, resource requirements, and alignment with organizational objectives."
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
        "description": "Notify stakeholders of approval", 
        "configuration": {
          "recipients": ["requester@company.com", "team@company.com", "document.library@company.com"],
          "template": "Document {{document_title}} ({{document_type}}) has been approved by {{approver_name}} on {{approval_date}}. The document is now effective and available in the document library.",
          "subject": "Document Approved: {{document_title}}"
        }
      }
    },
    {
      "id": "notification-revision",
      "type": "workflow", 
      "position": {"x": 700, "y": 200},
      "data": {
        "label": "Revision Request",
        "stepType": "notification",
        "description": "Request document revision",
        "configuration": {
          "recipients": ["requester@company.com"],
          "template": "Document {{document_title}} requires revision. Reviewer comments: {{review_comments}}. Please make the necessary changes and resubmit.",
          "subject": "Document Revision Required: {{document_title}}"
        }
      }
    },
    {
      "id": "notification-rejected", 
      "type": "workflow",
      "position": {"x": 700, "y": 350},
      "data": {
        "label": "Rejection Notice",
        "stepType": "notification", 
        "description": "Notify of document rejection",
        "configuration": {
          "recipients": ["requester@company.com", "department.manager@company.com"],
          "template": "Document {{document_title}} has been rejected. Reason: {{rejection_reason}}. Please contact the reviewer for more details.",
          "subject": "Document Rejected: {{document_title}}"
        }
      }
    },
    {
      "id": "end-approved",
      "type": "workflow",
      "position": {"x": 1300, "y": 50},
      "data": {
        "label": "Document Approved",
        "stepType": "end", 
        "description": "Document approval process completed successfully",
        "configuration": {
          "finalStatus": "approved",
          "archiveLocation": "document_library"
        }
      }
    },
    {
      "id": "end-revision",
      "type": "workflow",
      "position": {"x": 900, "y": 200}, 
      "data": {
        "label": "Pending Revision",
        "stepType": "end",
        "description": "Document returned for revision",
        "configuration": {
          "finalStatus": "pending_revision", 
          "nextStep": "resubmit_after_revision"
        }
      }
    },
    {
      "id": "end-rejected",
      "type": "workflow",
      "position": {"x": 900, "y": 350},
      "data": {
        "label": "Document Rejected",
        "stepType": "end",
        "description": "Document approval process ended - rejected", 
        "configuration": {
          "finalStatus": "rejected",
          "archiveLocation": "rejected_documents"
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
      "label": "Submit"
    },
    {
      "id": "e2",
      "source": "form-input-1",
      "target": "review-1", 
      "type": "smoothstep",
      "label": "To Review"
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
      "label": "Approved"
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
      "label": "Rejected"
    },
    {
      "id": "e5",
      "source": "approval-1",
      "target": "notification-approved",
      "type": "smoothstep", 
      "label": "Final Approval"
    },
    {
      "id": "e6-approved",
      "source": "notification-approved",
      "target": "end-approved",
      "type": "smoothstep",
      "label": "Complete"
    },
    {
      "id": "e6-revision", 
      "source": "notification-revision",
      "target": "end-revision",
      "type": "smoothstep",
      "label": "Pending Revision"
    },
    {
      "id": "e6-rejected",
      "source": "notification-rejected",
      "target": "end-rejected",
      "type": "smoothstep",
      "label": "Process Ended"
    }
  ],
  "viewport": {"x": 0, "y": 0, "zoom": 0.6}
}'::jsonb,
description = 'Comprehensive document approval workflow with form input, technical review, conditional routing, and multiple end states'
WHERE name = 'Simple Document Approval';