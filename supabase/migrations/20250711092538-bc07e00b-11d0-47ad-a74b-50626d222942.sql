-- Create demo users manually
-- Note: We need to insert into auth.users first, then profiles and roles

-- Insert demo users into auth.users (this is typically done by Supabase Auth, but we can do it manually)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@pharmaflow.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'approver@pharmaflow.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'requester@pharmaflow.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
);

-- Insert corresponding profiles
INSERT INTO public.profiles (user_id, first_name, last_name, email, company_name, department) VALUES
('11111111-1111-1111-1111-111111111111', 'John', 'Admin', 'admin@pharmaflow.com', 'PharmaFlow Corp', 'IT Administration'),
('22222222-2222-2222-2222-222222222222', 'Sarah', 'Approver', 'approver@pharmaflow.com', 'PharmaFlow Corp', 'Regulatory Affairs'),
('33333333-3333-3333-3333-333333333333', 'Mike', 'Requester', 'requester@pharmaflow.com', 'PharmaFlow Corp', 'Research & Development');

-- Insert roles for demo users
INSERT INTO public.user_roles (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin'),
('22222222-2222-2222-2222-222222222222', 'approver'),
('33333333-3333-3333-3333-333333333333', 'requester');