import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarIcon, Loader2, Save, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface RequestFormData {
  title: string;
  description: string;
  request_type: "drug_approval" | "clinical_trial" | "manufacturing_change" | "quality_control" | "regulatory_submission" | "safety_update" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  target_completion_date: Date | null;
  justification: string;
  business_impact: string;
  regulatory_requirements: string;
}

interface RequestFormProps {
  onSuccess?: () => void;
  initialData?: Partial<RequestFormData>;
  requestId?: string;
}

const REQUEST_TYPES = [
  { value: "drug_approval", label: "Drug Approval" },
  { value: "clinical_trial", label: "Clinical Trial" },
  { value: "manufacturing_change", label: "Manufacturing Change" },
  { value: "quality_control", label: "Quality Control" },
  { value: "regulatory_submission", label: "Regulatory Submission" },
  { value: "safety_update", label: "Safety Update" },
  { value: "other", label: "Other" }
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" }
];

export const RequestForm = ({ onSuccess, initialData, requestId }: RequestFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RequestFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    request_type: initialData?.request_type || "drug_approval",
    priority: initialData?.priority || "medium",
    target_completion_date: initialData?.target_completion_date || null,
    justification: initialData?.justification || "",
    business_impact: initialData?.business_impact || "",
    regulatory_requirements: initialData?.regulatory_requirements || ""
  });

  const updateField = (field: keyof RequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.request_type) errors.push("Request type is required");
    if (!formData.justification.trim()) errors.push("Justification is required");
    
    return errors;
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const requestData = {
        requester_id: user.id,
        ...formData,
        target_completion_date: formData.target_completion_date?.toISOString().split('T')[0] || null,
        status: 'draft' as const
      };

      if (requestId) {
        const { error } = await supabase
          .from('requests')
          .update(requestData)
          .eq('id', requestId);
        
        if (error) throw error;
        
        toast({
          title: "Draft saved",
          description: "Your request has been saved as a draft.",
        });
      } else {
        const { error } = await supabase
          .from('requests')
          .insert([requestData]);
        
        if (error) throw error;
        
        toast({
          title: "Draft saved",
          description: "Your request has been saved as a draft.",
        });
      }
      
      onSuccess?.();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    if (!user) return;
    
    setLoading(true);
    try {
      const requestData = {
        requester_id: user.id,
        ...formData,
        target_completion_date: formData.target_completion_date?.toISOString().split('T')[0] || null,
        status: 'submitted' as const,
        submitted_at: new Date().toISOString()
      };

      if (requestId) {
        const { error } = await supabase
          .from('requests')
          .update(requestData)
          .eq('id', requestId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('requests')
          .insert([requestData]);
        
        if (error) throw error;
      }
      
      toast({
        title: "Request submitted",
        description: "Your request has been submitted for review.",
      });
      
      navigate('/requests');
      onSuccess?.();
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

  return (
    <Card className="border-border/50 shadow-elegant">
      <CardHeader>
        <CardTitle>Create New Request</CardTitle>
        <CardDescription>
          Fill out the form below to submit a new pharmaceutical workflow request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Request Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Brief description of your request"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Detailed description of what you need"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="request_type">Request Type *</Label>
                <Select value={formData.request_type} onValueChange={(value) => updateField('request_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => updateField('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Completion Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.target_completion_date ? (
                      format(formData.target_completion_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.target_completion_date || undefined}
                    onSelect={(date) => updateField('target_completion_date', date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="justification">Business Justification *</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => updateField('justification', e.target.value)}
                placeholder="Explain why this request is necessary"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_impact">Business Impact</Label>
              <Textarea
                id="business_impact"
                value={formData.business_impact}
                onChange={(e) => updateField('business_impact', e.target.value)}
                placeholder="Describe the potential impact on business operations"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regulatory_requirements">Regulatory Requirements</Label>
              <Textarea
                id="regulatory_requirements"
                value={formData.regulatory_requirements}
                onChange={(e) => updateField('regulatory_requirements', e.target.value)}
                placeholder="Any specific regulatory requirements or compliance considerations"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};