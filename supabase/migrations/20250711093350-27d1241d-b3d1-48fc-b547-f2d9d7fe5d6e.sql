-- Fix RLS policies to allow role insertion during user creation
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;

-- Create new policies that allow role insertion during signup
CREATE POLICY "Users can insert their own roles during signup" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow users to update their roles if they're admin (for demo user creation)
CREATE POLICY "Users can delete their own roles" 
ON public.user_roles 
FOR DELETE 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));