-- Create workflow definitions and steps tables
CREATE TYPE public.workflow_step_type AS ENUM (
  'start',
  'form_input',
  'approval',
  'review',
  'notification',
  'decision',
  'parallel_gateway',
  'exclusive_gateway',
  'end'
);

CREATE TYPE public.workflow_status AS ENUM (
  'draft',
  'active',
  'inactive',
  'archived'
);

-- Workflow definitions table
CREATE TABLE public.workflow_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  workflow_type workflow_type NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status workflow_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flow_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(workflow_type, version, status) -- Only one active version per workflow type
);

-- Workflow steps table (for detailed step configuration)
CREATE TABLE public.workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_definition_id UUID NOT NULL REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL, -- matches node ID in flow_data
  step_type workflow_step_type NOT NULL,
  name TEXT NOT NULL,
  configuration JSONB NOT NULL DEFAULT '{}',
  position_x REAL NOT NULL DEFAULT 0,
  position_y REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workflow_definition_id, step_id)
);

-- Enable RLS
ALTER TABLE public.workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;

-- Policies for workflow_definitions
CREATE POLICY "Users can view workflow definitions they created" 
ON public.workflow_definitions 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can create workflow definitions" 
ON public.workflow_definitions 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own workflow definitions" 
ON public.workflow_definitions 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all workflow definitions" 
ON public.workflow_definitions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all workflow definitions" 
ON public.workflow_definitions 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policies for workflow_steps
CREATE POLICY "Users can manage steps for their workflow definitions" 
ON public.workflow_steps 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.workflow_definitions wd 
    WHERE wd.id = workflow_definition_id 
    AND wd.created_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage all workflow steps" 
ON public.workflow_steps 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for timestamps
CREATE TRIGGER update_workflow_definitions_updated_at
BEFORE UPDATE ON public.workflow_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();