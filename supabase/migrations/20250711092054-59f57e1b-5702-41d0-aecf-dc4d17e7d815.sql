-- Create mock users (these will be created through the auth system)
-- We'll insert the profile and role data for users that will be created via signup

-- Insert mock user profiles and roles
-- Note: The actual auth.users entries need to be created through the signup process
-- But we can prepare the roles for when those users are created

-- For now, let's just ensure our schema is ready and add some sample data structure
-- The actual user creation will happen through the Auth component

-- Add admin role policy for managing users
CREATE POLICY "Admins can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));