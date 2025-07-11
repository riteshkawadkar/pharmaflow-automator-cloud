import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, X, Clock, Users, FileText, Mail, GitBranch, AlertTriangle, ChevronDown, ChevronRight, Settings, CheckCircle, XCircle, Info } from 'lucide-react';
import { WorkflowStepType, StepConfiguration } from '@/types/workflow-builder';

interface NodePropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void;
}

export const NodePropertiesPanel = ({ selectedNode, onUpdateNode }: NodePropertiesPanelProps) => {
  const [config, setConfig] = useState<StepConfiguration>(
    selectedNode?.data?.configuration || {}
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    fields: true,
    validation: true,
    issues: true
  });

  // Update config when selectedNode changes
  useEffect(() => {
    setConfig(selectedNode?.data?.configuration || {});
  }, [selectedNode?.id, selectedNode?.data?.configuration]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!selectedNode) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select a workflow step to configure its properties
          </p>
        </CardContent>
      </Card>
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
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    updateConfig({
      formFields: [...(config.formFields || []), newField]
    });
  };

  const removeFormField = (index: number) => {
    const fields = [...(config.formFields || [])];
    fields.splice(index, 1);
    updateConfig({ formFields: fields });
  };

  const addCondition = () => {
    const newCondition = {
      field: '',
      operator: 'equals',
      value: '',
      outputLabel: 'Branch'
    };
    updateConfig({
      conditions: [...(config.conditions || []), newCondition]
    });
  };

  const addRecipient = (email: string) => {
    if (email && !config.recipients?.includes(email)) {
      updateConfig({
        recipients: [...(config.recipients || []), email]
      });
    }
  };

  const removeRecipient = (email: string) => {
    updateConfig({
      recipients: config.recipients?.filter(r => r !== email) || []
    });
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

  const getFieldsCount = () => {
    switch (stepType) {
      case 'form_input':
        return config.formFields?.length || 0;
      case 'approval':
        return config.approvers?.length || 0;
      case 'notification':
        return config.recipients?.length || 0;
      case 'decision':
        return config.conditions?.length || 0;
      default:
        return 0;
    }
  };

  const getValidationStatus = () => {
    const hasRequiredFields = getFieldsCount() > 0;
    const hasProperConfig = stepType === 'start' || stepType === 'end' || hasRequiredFields;
    return hasProperConfig;
  };

  const getIssues = () => {
    const issues: string[] = [];
    
    if (stepType === 'approval' && (!config.approvers || config.approvers.length === 0)) {
      issues.push('Approval node must have at least one approver');
    }
    
    if (stepType === 'form_input' && (!config.formFields || config.formFields.length === 0)) {
      issues.push('Form must have at least one field');
    }
    
    if (stepType === 'notification' && (!config.recipients || config.recipients.length === 0)) {
      issues.push('Notification must have at least one recipient');
    }
    
    // GxP Compliance checks
    if (['approval', 'review', 'quality_check'].includes(stepType)) {
      issues.push('Compliance requirement not met: 21 CFR Part 11');
    }
    
    return issues;
  };

  return (
    <Card className="w-80 h-full overflow-y-auto border-2 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStepIcon()}
          {String(selectedNode.data.label)}
          <div className="flex gap-1 ml-auto">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <Info className="w-4 h-4 text-blue-500" />
            <Settings className="w-4 h-4 text-gray-500" />
          </div>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {String(selectedNode.data.description || 'No description')}
        </p>
        <Badge variant="outline" className="text-xs w-fit">
          {String(selectedNode.data.stepType || 'unknown').replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {/* Fields Section */}
        <Collapsible 
          open={expandedSections.fields} 
          onOpenChange={() => toggleSection('fields')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded border bg-muted/50">
            <div className="flex items-center gap-2">
              {expandedSections.fields ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span className="text-sm font-medium">Fields:</span>
              <Badge variant="secondary" className="text-xs">
                [{getFieldsCount()} items]
              </Badge>
              {getFieldsCount() > 3 && (
                <span className="text-xs text-muted-foreground">+{getFieldsCount() - 3} more...</span>
              )}
            </div>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="space-y-2 pl-6">
              <div>
                <Label>Step Name</Label>
                <Input
                  value={String(selectedNode.data.label || '')}
                  onChange={(e) => updateBasicInfo('label', e.target.value)}
                  placeholder="Step name"
                  className="text-xs"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={String(selectedNode.data.description || '')}
                  onChange={(e) => updateBasicInfo('description', e.target.value)}
                  placeholder="Step description"
                  rows={2}
                  className="text-xs"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Limit (hours)
                </Label>
                <Input
                  type="number"
                  value={config.timeLimit || ''}
                  onChange={(e) => updateConfig({ timeLimit: parseInt(e.target.value) || undefined })}
                  placeholder="No limit"
                  className="text-xs"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Validation Section */}
        <Collapsible 
          open={expandedSections.validation} 
          onOpenChange={() => toggleSection('validation')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded border bg-muted/50">
            <div className="flex items-center gap-2">
              {expandedSections.validation ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span className="text-sm font-medium">Validation:</span>
              <Badge variant={getValidationStatus() ? "default" : "destructive"} className="text-xs">
                {getValidationStatus() ? "true" : "false"}
              </Badge>
            </div>
            {getValidationStatus() ? 
              <CheckCircle className="w-4 h-4 text-green-500" /> : 
              <XCircle className="w-4 h-4 text-red-500" />
            }
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="pl-6 text-xs text-muted-foreground">
              {getValidationStatus() ? 
                "All required fields are configured" : 
                "Missing required configuration"
              }
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Step-specific configurations */}
        {stepType === 'approval' && (
          <div className="space-y-3">
            <h4 className="font-medium">Approval Configuration</h4>
            <div>
              <Label>Approval Type</Label>
              <Select
                value={config.approvalType || 'single'}
                onValueChange={(value) => updateConfig({ approvalType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Approver</SelectItem>
                  <SelectItem value="majority">Majority</SelectItem>
                  <SelectItem value="unanimous">Unanimous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Approvers (email addresses)</Label>
              <div className="space-y-2">
                {config.approvers?.map((email, index) => (
                  <Badge key={index} variant="secondary" className="mr-1">
                    {email}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => updateConfig({ 
                        approvers: config.approvers?.filter((_, i) => i !== index) 
                      })}
                    />
                  </Badge>
                ))}
                <Input
                  placeholder="Add approver email"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const email = (e.target as HTMLInputElement).value.trim();
                      if (email && !config.approvers?.includes(email)) {
                        updateConfig({ 
                          approvers: [...(config.approvers || []), email] 
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {stepType === 'form_input' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Form Fields</h4>
              <Button size="sm" onClick={addFormField}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {config.formFields?.map((field, index) => (
              <Card key={field.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Input
                      value={field.label}
                      onChange={(e) => {
                        const fields = [...(config.formFields || [])];
                        fields[index].label = e.target.value;
                        updateConfig({ formFields: fields });
                      }}
                      placeholder="Field label"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFormField(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Select
                    value={field.type}
                    onValueChange={(value) => {
                      const fields = [...(config.formFields || [])];
                      fields[index].type = value;
                      updateConfig({ formFields: fields });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => {
                        const fields = [...(config.formFields || [])];
                        fields[index].required = e.target.checked;
                        updateConfig({ formFields: fields });
                      }}
                    />
                    <span className="text-sm">Required</span>
                  </label>
                </div>
              </Card>
            ))}
          </div>
        )}

        {stepType === 'notification' && (
          <div className="space-y-3">
            <h4 className="font-medium">Notification Configuration</h4>
            <div>
              <Label>Recipients</Label>
              <div className="space-y-2">
                {config.recipients?.map((email) => (
                  <Badge key={email} variant="secondary" className="mr-1">
                    {email}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => removeRecipient(email)}
                    />
                  </Badge>
                ))}
                <Input
                  placeholder="Add recipient email"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const email = (e.target as HTMLInputElement).value.trim();
                      if (email) {
                        addRecipient(email);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Email Template</Label>
              <Textarea
                value={config.template || ''}
                onChange={(e) => updateConfig({ template: e.target.value })}
                placeholder="Email template content"
                rows={4}
              />
            </div>
          </div>
        )}

        {stepType === 'decision' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Decision Conditions</h4>
              <Button size="sm" onClick={addCondition}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {config.conditions?.map((condition, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-2">
                  <Input
                    value={condition.field || ''}
                    onChange={(e) => {
                      const conditions = [...(config.conditions || [])];
                      conditions[index].field = e.target.value;
                      updateConfig({ conditions });
                    }}
                    placeholder="Field name"
                  />
                  <Select
                    value={condition.operator || 'equals'}
                    onValueChange={(value) => {
                      const conditions = [...(config.conditions || [])];
                      conditions[index].operator = value;
                      updateConfig({ conditions });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={condition.value || ''}
                    onChange={(e) => {
                      const conditions = [...(config.conditions || [])];
                      conditions[index].value = e.target.value;
                      updateConfig({ conditions });
                    }}
                    placeholder="Value"
                  />
                  <Input
                    value={condition.outputLabel || ''}
                    onChange={(e) => {
                      const conditions = [...(config.conditions || [])];
                      conditions[index].outputLabel = e.target.value;
                      updateConfig({ conditions });
                    }}
                    placeholder="Output label"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {stepType === 'review' && (
          <div className="space-y-3">
            <h4 className="font-medium">Review Configuration</h4>
            <div>
              <Label>Instructions</Label>
              <Textarea
                value={config.instructions || ''}
                onChange={(e) => updateConfig({ instructions: e.target.value })}
                placeholder="Review instructions and guidelines"
                rows={3}
              />
            </div>
            <div>
              <Label>Reviewers (email addresses)</Label>
              <div className="space-y-2">
                {config.approvers?.map((email, index) => (
                  <Badge key={index} variant="secondary" className="mr-1">
                    {email}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => updateConfig({ 
                        approvers: config.approvers?.filter((_, i) => i !== index) 
                      })}
                    />
                  </Badge>
                ))}
                <Input
                  placeholder="Add reviewer email"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const email = (e.target as HTMLInputElement).value.trim();
                      if (email && !config.approvers?.includes(email)) {
                        updateConfig({ 
                          approvers: [...(config.approvers || []), email] 
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Issues Section */}
        <Collapsible 
          open={expandedSections.issues} 
          onOpenChange={() => toggleSection('issues')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded border bg-red-50">
            <div className="flex items-center gap-2">
              {expandedSections.issues ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span className="text-sm font-medium">Issues:</span>
            </div>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="pl-6 space-y-1">
              {getIssues().map((issue, index) => (
                <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  • {issue}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="text-xs text-muted-foreground text-center border-t pt-2">
          ID: {selectedNode.id}
        </div>
      </CardContent>
    </Card>
  );
};