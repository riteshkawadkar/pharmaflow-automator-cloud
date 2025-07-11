-- Manually update existing demo users' roles
-- Update admin user
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@pharmaflow.com'
);

-- Update approver user  
UPDATE public.user_roles 
SET role = 'approver'::app_role 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'approver@pharmaflow.com'
);