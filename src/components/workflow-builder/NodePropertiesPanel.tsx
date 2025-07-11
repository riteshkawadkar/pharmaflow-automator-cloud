import { useState } from 'react';
import { Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Clock, Users, FileText, Mail, GitBranch, AlertTriangle } from 'lucide-react';
import { WorkflowStepType, StepConfiguration } from '@/types/workflow-builder';

interface NodePropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void;
}

export const NodePropertiesPanel = ({ selectedNode, onUpdateNode }: NodePropertiesPanelProps) => {
  const [config, setConfig] = useState<StepConfiguration>(
    selectedNode?.data?.configuration || {}
  );

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

  return (
    <Card className="w-80 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStepIcon()}
          {String(selectedNode.data.label)} Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Properties */}
        <div className="space-y-3">
          <div>
            <Label>Step Name</Label>
            <Input
              value={String(selectedNode.data.label || '')}
              onChange={(e) => updateBasicInfo('label', e.target.value)}
              placeholder="Step name"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={String(selectedNode.data.description || '')}
              onChange={(e) => updateBasicInfo('description', e.target.value)}
              placeholder="Step description"
              rows={2}
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
            />
          </div>
        </div>

        <Separator />

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
      </CardContent>
    </Card>
  );
};