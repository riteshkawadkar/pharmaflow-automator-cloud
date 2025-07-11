-- Update request_type enum to workflow_type with pharmaceutical workflows
DROP TYPE IF EXISTS public.request_type CASCADE;
CREATE TYPE public.workflow_type AS ENUM (
  'drug_approval',
  'clinical_trial_protocol',
  'manufacturing_change_control',
  'quality_deviation_investigation',
  'regulatory_submission',
  'pharmacovigilance_case',
  'supplier_qualification',
  'batch_record_review',
  'validation_protocol',
  'change_request',
  'corrective_action',
  'other'
);

-- Add workflow-specific dynamic fields as JSONB
ALTER TABLE public.requests 
DROP COLUMN IF EXISTS request_type,
ADD COLUMN workflow_type workflow_type NOT NULL DEFAULT 'other',
ADD COLUMN workflow_data JSONB DEFAULT '{}';

-- Update the column comment to explain workflow_data structure
COMMENT ON COLUMN public.requests.workflow_data IS 'Dynamic fields specific to each workflow type stored as JSON';