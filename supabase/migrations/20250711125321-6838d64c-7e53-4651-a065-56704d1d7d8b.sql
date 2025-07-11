-- Insert the HPLC Equipment Access Request workflow template
INSERT INTO workflow_definitions (
  name,
  description,
  workflow_type,
  version,
  status,
  created_by,
  flow_data
) VALUES (
  'HPLC Equipment Access Request',
  'Request access to HPLC analytical equipment with automatic form generation',
  'change_request',
  1,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  '{
    "nodes": [
      {
        "id": "start-1",
        "type": "workflow",
        "position": { "x": 100, "y": 50 },
        "data": {
          "label": "Access Request Submitted",
          "stepType": "start",
          "description": "User submits HPLC equipment access request",
          "configuration": {}
        }
      },
      {
        "id": "form_input-1",
        "type": "workflow",
        "position": { "x": 100, "y": 200 },
        "data": {
          "label": "User Information & Justification",
          "stepType": "form_input",
          "description": "Collect user details and business justification",
          "configuration": {
            "formFields": [
              {
                "id": "employee_id",
                "label": "Employee ID",
                "type": "text",
                "required": true,
                "placeholder": "Enter your employee ID (e.g., EMP12345)"
              },
              {
                "id": "department",
                "label": "Department",
                "type": "select",
                "required": true,
                "options": [
                  { "value": "quality_control", "label": "Quality Control" },
                  { "value": "research_development", "label": "Research & Development" },
                  { "value": "regulatory_affairs", "label": "Regulatory Affairs" }
                ]
              },
              {
                "id": "business_justification",
                "label": "Business Justification",
                "type": "textarea",
                "required": true,
                "placeholder": "Explain why you need access to HPLC equipment"
              }
            ]
          }
        }
      },
      {
        "id": "end-1",
        "type": "workflow",
        "position": { "x": 400, "y": 350 },
        "data": {
          "label": "Access Granted",
          "stepType": "end",
          "description": "HPLC equipment access successfully granted",
          "configuration": {}
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "start-1",
        "target": "form_input-1",
        "type": "smoothstep"
      },
      {
        "id": "e2",
        "source": "form_input-1",
        "target": "end-1",
        "type": "smoothstep"
      }
    ],
    "viewport": { "x": 0, "y": 0, "zoom": 0.8 }
  }'::jsonb
);