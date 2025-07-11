import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Settings,
  Shield,
  Clock,
  Users,
  Database,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Mail,
  MessageSquare,
  Globe,
  Upload,
  BarChart3,
  FileDown,
  PenTool,
  GraduationCap,
  Zap,
  FileText,
  GitBranch
} from 'lucide-react';
import { WorkflowStepType, StepConfiguration } from '@/types/workflow-builder';

interface NodePropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void;
}

interface FormField {
  id: string;
  name?: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  validation?: Record<string, any>;
  options?: Array<{ value: string; label: string }>;
  pharmaceuticalType?: string;
}

export const NodePropertiesPanel = ({ selectedNode, onUpdateNode }: NodePropertiesPanelProps) => {
  const [config, setConfig] = useState<StepConfiguration>(
    selectedNode?.data?.configuration || {}
  );
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [activeTab, setActiveTab] = useState('general');

  // Update config when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      const nodeConfig = selectedNode.data?.configuration as StepConfiguration || {};
      setConfig(nodeConfig);
      // Handle the type conversion for formFields
      const fields = nodeConfig.formFields || [];
      setFormFields(fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        name: field.name || '',
        placeholder: field.placeholder || '',
        options: field.options || [],
        pharmaceuticalType: field.pharmaceuticalType,
        validation: field.validation
      })));
    }
  }, [selectedNode?.id, selectedNode?.data?.configuration]);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const stepType = selectedNode.data.stepType as WorkflowStepType;

  const updateConfig = (updates: Partial<StepConfiguration>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onUpdateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        configuration: newConfig
      }
    });
  };

  const updateBasicInfo = (field: string, value: string) => {
    onUpdateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        [field]: value
      }
    });
  };

  const addFormField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: `field_${formFields.length + 1}`,
      type: 'text',
      label: `Field ${formFields.length + 1}`,
      required: false,
      placeholder: 'Enter placeholder'
    };

    const updatedFields = [...formFields, newField];
    setFormFields(updatedFields);
    // Convert for StepConfiguration
    const configFields = updatedFields.map(field => ({
      ...field,
      options: field.options?.map(opt => opt) || []
    }));
    updateConfig({ formFields: configFields });
  };

  const updateFormField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = formFields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFormFields(updatedFields);
    // Convert for StepConfiguration
    const configFields = updatedFields.map(field => ({
      ...field,
      options: field.options?.map(opt => opt) || []
    }));
    updateConfig({ formFields: configFields });
  };

  const removeFormField = (index: number) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    // Convert for StepConfiguration
    const configFields = updatedFields.map(field => ({
      ...field,
      options: field.options?.map(opt => opt) || []
    }));
    updateConfig({ formFields: configFields });
  };

  const getStepIcon = () => {
    switch (stepType) {
      case 'approval': return <Users className="w-4 h-4" />;
      case 'form_input': return <FileText className="w-4 h-4" />;
      case 'notification': return <Mail className="w-4 h-4" />;
      case 'decision': return <GitBranch className="w-4 h-4" />;
      case 'review': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderFormFieldsList = () => {
    if (formFields.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground text-sm border border-dashed border-border rounded">
          No form fields added yet. Click "Add Field" to get started.
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {formFields.map((field, index) => (
          <div key={field.id || index} className="p-3 border border-border rounded-md bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {field.label || `Field ${index + 1}`}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFormField(index)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={field.label || ''}
                  onChange={(e) => updateFormField(index, { label: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="Field label"
                />
              </div>

              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={field.type || 'text'}
                  onValueChange={(value) => updateFormField(index, { type: value })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={field.name || ''}
                  onChange={(e) => updateFormField(index, { name: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="field_name"
                />
              </div>

              <div>
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={field.placeholder || ''}
                  onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="Enter placeholder"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${index}`}
                  checked={field.required || false}
                  onCheckedChange={(checked) => updateFormField(index, { required: !!checked })}
                />
                <Label htmlFor={`required-${index}`} className="text-xs">Required</Label>
              </div>

              {field.type === 'pharmaceutical' && (
                <Select
                  value={field.pharmaceuticalType || ''}
                  onValueChange={(value) => updateFormField(index, { pharmaceuticalType: value })}
                >
                  <SelectTrigger className="h-7 text-xs w-32">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="batch_lot_number">Batch/Lot Number</SelectItem>
                    <SelectItem value="equipment_id">Equipment ID</SelectItem>
                    <SelectItem value="product_code">Product Code</SelectItem>
                    <SelectItem value="regulatory_reference">Regulatory Reference</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Properties</h3>
          <div className="flex gap-1">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <Settings className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <div className="font-medium">{String(selectedNode.data.label)}</div>
          <div className="text-xs capitalize">
            {String(selectedNode.data.stepType || 'unknown').replace('_', ' ')} Node
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border bg-background">
          <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">Compliance</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="general" className="p-4 space-y-4 mt-0">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-medium mb-3">Basic Information</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Node Label</Label>
                  <Input
                    value={String(selectedNode.data.label || '')}
                    onChange={(e) => updateBasicInfo('label', e.target.value)}
                    placeholder="Data Collection Form"
                    className="h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={String(selectedNode.data.description || '')}
                    onChange={(e) => updateBasicInfo('description', e.target.value)}
                    placeholder="Enter node description"
                    rows={2}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h4 className="text-sm font-medium mb-3">Configuration</h4>
              
              {stepType === 'form_input' && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Form Template</Label>
                    <Select
                      value={config.template || ''}
                      onValueChange={(value) => updateConfig({ template: value })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select Form Template" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border">
                        <SelectItem value="batch_release">Batch Release Form</SelectItem>
                        <SelectItem value="quality_check">Quality Check Form</SelectItem>
                        <SelectItem value="deviation_report">Deviation Report</SelectItem>
                        <SelectItem value="custom">Custom Form</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableValidation"
                      checked={config.enableValidation || false}
                      onCheckedChange={(checked) => updateConfig({ enableValidation: !!checked })}
                    />
                    <Label htmlFor="enableValidation" className="text-xs">Enable Validation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoSave"
                      checked={config.autoSave || false}
                      onCheckedChange={(checked) => updateConfig({ autoSave: !!checked })}
                    />
                    <Label htmlFor="autoSave" className="text-xs">Auto-save</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowAttachments"
                      checked={config.allowAttachments || false}
                      onCheckedChange={(checked) => updateConfig({ allowAttachments: !!checked })}
                    />
                    <Label htmlFor="allowAttachments" className="text-xs">Allow Attachments</Label>
                  </div>
                </div>
              )}

              {stepType === 'approval' && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Approval Type</Label>
                    <Select
                      value={config.approvalType || 'single'}
                      onValueChange={(value) => updateConfig({ approvalType: value as any })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border">
                        <SelectItem value="single">Single Approver</SelectItem>
                        <SelectItem value="majority">Majority</SelectItem>
                        <SelectItem value="unanimous">Unanimous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            {stepType === 'form_input' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Form Fields</h4>
                  <Button size="sm" onClick={addFormField} className="h-6 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Field
                  </Button>
                </div>
                {renderFormFieldsList()}
              </div>
            )}

            {/* Master Data Integration */}
            <div>
              <h4 className="text-sm font-medium mb-3">Master Data Integration</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Equipment Reference</Label>
                  <Input
                    placeholder="Search equipment..."
                    className="h-8 text-xs"
                    value={config.equipmentId || ''}
                    onChange={(e) => updateConfig({ equipmentId: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Product Code</Label>
                  <Input
                    placeholder="Search product codes..."
                    className="h-8 text-xs"
                    value={config.productCode || ''}
                    onChange={(e) => updateConfig({ productCode: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="p-4 space-y-4 mt-0">
            <h4 className="text-sm font-medium mb-3">Compliance Requirements</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-800">21 CFR Part 11</div>
                    <div className="text-xs text-red-600 mt-1">Electronic records must be accurate and reliable</div>
                    <div className="text-xs text-red-500 mt-1 font-medium">Mandatory</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-4 mt-0">
            <h4 className="text-sm font-medium mb-3">Advanced Settings</h4>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Timeout (seconds)</Label>
                <Input
                  type="number"
                  value={config.timeout || ''}
                  onChange={(e) => updateConfig({ timeout: parseInt(e.target.value) || undefined })}
                  placeholder="30"
                  className="h-8 text-xs"
                />
              </div>
              
              <div>
                <Label className="text-xs">Retry Attempts</Label>
                <Input
                  type="number"
                  value={config.retryAttempts || ''}
                  onChange={(e) => updateConfig({ retryAttempts: parseInt(e.target.value) || undefined })}
                  placeholder="3"
                  className="h-8 text-xs"
                />
              </div>
              
              <div>
                <Label className="text-xs">Error Handling</Label>
                <Select
                  value={config.errorHandling || ''}
                  onValueChange={(value) => updateConfig({ errorHandling: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select error handling" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="stop">Stop Workflow</SelectItem>
                    <SelectItem value="continue">Continue</SelectItem>
                    <SelectItem value="retry">Retry</SelectItem>
                    <SelectItem value="escalate">Escalate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="logging"
                  checked={config.logging || false}
                  onCheckedChange={(checked) => updateConfig({ logging: !!checked })}
                />
                <Label htmlFor="logging" className="text-xs">Enable Logging</Label>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center border-t border-border p-2">
        ID: {selectedNode.id}
      </div>
    </div>
  );
};