import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Loader2, Save, Send, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { WorkflowType, WORKFLOW_CONFIGS, getWorkflowConfig, WorkflowField } from "@/types/workflows";

export interface RequestFormData {
  title: string;
  description: string;
  workflow_type: WorkflowType;
  priority: "low" | "medium" | "high" | "urgent";
  target_completion_date: Date | null;
  justification: string;
  business_impact: string;
  regulatory_requirements: string;
  workflow_data: Record<string, any>;
}

interface RequestFormProps {
  onSuccess?: () => void;
  initialData?: Partial<RequestFormData>;
  requestId?: string;
}

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
    workflow_type: (initialData?.workflow_type as WorkflowType) || "drug_approval",
    priority: initialData?.priority || "medium",
    target_completion_date: initialData?.target_completion_date || null,
    justification: initialData?.justification || "",
    business_impact: initialData?.business_impact || "",
    regulatory_requirements: initialData?.regulatory_requirements || "",
    workflow_data: initialData?.workflow_data || {}
  });

  const selectedWorkflow = getWorkflowConfig(formData.workflow_type);

  const updateField = (field: keyof RequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateWorkflowData = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workflow_data: {
        ...prev.workflow_data,
        [fieldId]: value
      }
    }));
  };

  const handleWorkflowTypeChange = (newWorkflowType: WorkflowType) => {
    setFormData(prev => ({
      ...prev,
      workflow_type: newWorkflowType,
      workflow_data: {} // Reset workflow-specific data when changing types
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.workflow_type) errors.push("Workflow type is required");
    if (!formData.justification.trim()) errors.push("Justification is required");
    
    // Validate workflow-specific required fields
    if (selectedWorkflow) {
      selectedWorkflow.additionalFields.forEach(field => {
        if (field.required && !formData.workflow_data[field.id]) {
          errors.push(`${field.label} is required`);
        }
      });
    }
    
    return errors;
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const requestData = {
        requester_id: user.id,
        title: formData.title,
        description: formData.description,
        workflow_type: formData.workflow_type,
        priority: formData.priority,
        target_completion_date: formData.target_completion_date?.toISOString().split('T')[0] || null,
        justification: formData.justification,
        business_impact: formData.business_impact,
        regulatory_requirements: formData.regulatory_requirements,
        workflow_data: formData.workflow_data,
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
          description: "Your workflow request has been saved as a draft.",
        });
      } else {
        const { error } = await supabase
          .from('requests')
          .insert([requestData]);
        
        if (error) throw error;
        
        toast({
          title: "Draft saved",
          description: "Your workflow request has been saved as a draft.",
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
        title: formData.title,
        description: formData.description,
        workflow_type: formData.workflow_type,
        priority: formData.priority,
        target_completion_date: formData.target_completion_date?.toISOString().split('T')[0] || null,
        justification: formData.justification,
        business_impact: formData.business_impact,
        regulatory_requirements: formData.regulatory_requirements,
        workflow_data: formData.workflow_data,
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
        title: "Workflow request submitted",
        description: "Your workflow request has been submitted for review.",
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

  const renderWorkflowField = (field: WorkflowField) => {
    const value = formData.workflow_data[field.id] || '';
    
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => updateWorkflowData(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <Input
            id={field.id}
            type="number"
            value={value}
            onChange={(e) => updateWorkflowData(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => updateWorkflowData(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="min-h-[80px]"
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(newValue) => updateWorkflowData(field.id, newValue)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        const dateValue = value ? new Date(value) : null;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={dateValue || undefined}
                onSelect={(date) => updateWorkflowData(field.id, date?.toISOString().split('T')[0] || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="border-border/50 shadow-elegant">
      <CardHeader>
        <CardTitle>Create New Workflow Request</CardTitle>
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
                placeholder="Brief description of your workflow request"
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
                <Label htmlFor="workflow_type">Workflow Type *</Label>
                <Select value={formData.workflow_type} onValueChange={handleWorkflowTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKFLOW_CONFIGS.map((workflow) => (
                      <SelectItem key={workflow.type} value={workflow.type}>
                        {workflow.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedWorkflow && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {selectedWorkflow.description}
                  </p>
                )}
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

          {/* Workflow-Specific Fields */}
          {selectedWorkflow && selectedWorkflow.additionalFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{selectedWorkflow.label} Details</h3>
              {selectedWorkflow.additionalFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderWorkflowField(field)}
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="justification">Business Justification *</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => updateField('justification', e.target.value)}
                placeholder="Explain why this workflow request is necessary"
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