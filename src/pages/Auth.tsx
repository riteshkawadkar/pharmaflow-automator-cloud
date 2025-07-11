import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User, Session } from '@supabase/supabase-js';

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [department, setDepartment] = useState("");

  // Demo users for quick testing
  const demoUsers = [
    { email: "admin@pharmaflow.com", role: "Admin", name: "John Admin" },
    { email: "approver@pharmaflow.com", role: "Approver", name: "Sarah Approver" },
    { email: "requester@pharmaflow.com", role: "Requester", name: "Mike Requester" }
  ];

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleSignIn = async (e: React.FormEvent, demoEmail?: string) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      cleanupAuthState();
      
      const signInEmail = demoEmail || email;
      const signInPassword = demoEmail ? "password123" : password;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            department: department,
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoUsers = async () => {
    setLoading(true);
    let successCount = 0;
    
    try {
      const demoUsersData = [
        { 
          email: "admin@pharmaflow.com", 
          password: "password123",
          firstName: "John",
          lastName: "Admin",
          companyName: "PharmaFlow Corp",
          department: "IT Administration",
          role: "admin" as const
        },
        { 
          email: "approver@pharmaflow.com", 
          password: "password123",
          firstName: "Sarah",
          lastName: "Approver",
          companyName: "PharmaFlow Corp",
          department: "Regulatory Affairs",
          role: "approver" as const
        },
        { 
          email: "requester@pharmaflow.com", 
          password: "password123",
          firstName: "Mike",
          lastName: "Requester",
          companyName: "PharmaFlow Corp",
          department: "Research & Development",
          role: "requester" as const
        }
      ];

      for (const user of demoUsersData) {
        try {
          // Sign up each user
          const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
              data: {
                first_name: user.firstName,
                last_name: user.lastName,
                company_name: user.companyName,
                department: user.department,
              }
            }
          });

          if (error) {
            console.error(`Error creating user ${user.email}:`, error);
            continue;
          }

          if (data.user) {
            // Update role if not default requester
            if (user.role !== 'requester') {
              try {
                // First delete the default role
                const { error: deleteError } = await supabase
                  .from('user_roles')
                  .delete()
                  .eq('user_id', data.user.id);

                if (deleteError) {
                  console.error('Error deleting default role:', deleteError);
                }

                // Then insert the correct role
                const { error: insertError } = await supabase
                  .from('user_roles')
                  .insert({
                    user_id: data.user.id,
                    role: user.role
                  });

                if (insertError) {
                  console.error('Error inserting new role:', insertError);
                }
              } catch (roleError) {
                console.error('Error updating user role:', roleError);
              }
            }
            
            successCount++;
          }
        } catch (userError) {
          console.error(`Failed to create user ${user.email}:`, userError);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Demo users created!",
          description: `Successfully created ${successCount} demo users. You can now log in with any of them.`,
        });
      } else {
        toast({
          title: "Users might already exist",
          description: "Try logging in with the demo credentials below.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Try logging in with existing demo users below.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">PharmaFlow</span>
          </div>
        </div>

        <Card className="border-border/50 shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isSignIn ? "signin" : "signup"} onValueChange={(value) => setIsSignIn(value === "signin")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>

                {/* Demo Users */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={createDemoUsers}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Demo Users
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Click this first if demo users don't exist yet
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 text-center">Quick Demo Access:</p>
                  <div className="space-y-2">
                    {demoUsers.map((user) => (
                      <Button
                        key={user.email}
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                        onClick={(e) => handleSignIn(e, user.email)}
                        disabled={loading}
                      >
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    All demo accounts use password: password123
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}