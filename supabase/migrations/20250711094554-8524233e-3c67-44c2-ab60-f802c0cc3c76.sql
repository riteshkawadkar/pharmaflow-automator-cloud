-- Create request status enum
CREATE TYPE public.request_status AS ENUM (
  'draft',
  'submitted', 
  'under_review',
  'approved',
  'rejected',
  'cancelled'
);

-- Create request priority enum
CREATE TYPE public.request_priority AS ENUM (
  'low',
  'medium', 
  'high',
  'urgent'
);

-- Create request type enum
CREATE TYPE public.request_type AS ENUM (
  'drug_approval',
  'clinical_trial',
  'manufacturing_change',
  'quality_control',
  'regulatory_submission',
  'safety_update',
  'other'
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  request_type request_type NOT NULL,
  priority request_priority NOT NULL DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'draft',
  target_completion_date DATE,
  justification TEXT,
  business_impact TEXT,
  regulatory_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT
);

-- Enable RLS
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = requester_id);

CREATE POLICY "Users can create their own requests" 
ON public.requests 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their own draft requests" 
ON public.requests 
FOR UPDATE 
USING (auth.uid() = requester_id AND status = 'draft');

CREATE POLICY "Approvers can view all requests" 
ON public.requests 
FOR SELECT 
USING (public.has_role(auth.uid(), 'approver'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Approvers can update request status" 
ON public.requests 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'approver'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for timestamps
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();