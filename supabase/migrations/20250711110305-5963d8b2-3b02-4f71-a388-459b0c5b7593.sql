-- Create workflow notifications tracking table
CREATE TABLE public.workflow_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL,
  node_id TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  recipients TEXT[] NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  email_provider_id TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow execution tracking table
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  workflow_definition_id UUID NOT NULL,
  current_node_id TEXT NOT NULL,
  execution_status TEXT NOT NULL DEFAULT 'active',
  execution_data JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workflow_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- Policies for workflow_notifications
CREATE POLICY "Users can view notifications for their requests" 
ON public.workflow_notifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.requests r 
    WHERE r.id = request_id 
    AND r.requester_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all notifications" 
ON public.workflow_notifications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage notifications" 
ON public.workflow_notifications 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Policies for workflow_executions
CREATE POLICY "Users can view executions for their requests" 
ON public.workflow_executions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.requests r 
    WHERE r.id = request_id 
    AND r.requester_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all executions" 
ON public.workflow_executions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage executions" 
ON public.workflow_executions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for timestamps
CREATE TRIGGER update_workflow_notifications_updated_at
BEFORE UPDATE ON public.workflow_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_executions_updated_at
BEFORE UPDATE ON public.workflow_executions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();