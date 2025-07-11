import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { MasterDataLookup } from '../MasterDataLookup';
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
  Zap
} from 'lucide-react';

interface NodePropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void;
}

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, updates: Partial<Node>) => void;
  onClose?: () => void;
}

export const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  selectedNode,
  onUpdateNode
}) => {
  return (
    <PropertiesPanel
      selectedNode={selectedNode}
      onNodeUpdate={onUpdateNode}
      onClose={() => {}}
    />
  );
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'compliance' | 'advanced'>('general');
  const [nodeProperties, setNodeProperties] = useState(selectedNode?.data?.properties || {});
  const [formFields, setFormFields] = useState<any[]>([]);

  // Update local state when selectedNode changes
  React.useEffect(() => {
    if (selectedNode) {
      const properties = selectedNode.data?.properties as Record<string, any> || {};
      setNodeProperties(properties);
      setFormFields(properties.fields || []);
    }
  }, [selectedNode]);

  const handlePropertyChange = (key: string, value: any) => {
    if (!selectedNode) return;

    const updatedProperties = { ...(nodeProperties as Record<string, any>), [key]: value };
    setNodeProperties(updatedProperties);

    onNodeUpdate(selectedNode.id, {
      data: {
        ...selectedNode.data,
        properties: updatedProperties
      }
    });
  };

  const addFormField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      name: `field_${formFields.length + 1}`,
      type: 'text',
      label: `Field ${formFields.length + 1}`,
      required: false,
      placeholder: '',
      validation: {}
    };

    const updatedFields = [...formFields, newField];
    setFormFields(updatedFields);
    handlePropertyChange('fields', updatedFields);
  };

  const updateFormField = (index: number, updates: any) => {
    const updatedFields = formFields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFormFields(updatedFields);
    handlePropertyChange('fields', updatedFields);
  };

  const removeFormField = (index: number) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    handlePropertyChange('fields', updatedFields);
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
              <button
                onClick={() => removeFormField(index)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Label</label>
                <input
                  type="text"
                  value={field.label || ''}
                  onChange={(e) => updateFormField(index, { label: e.target.value })}
                  className="w-full px-2 py-1 border border-border rounded text-xs bg-background"
                  placeholder="Field label"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Type</label>
                <select
                  value={field.type || 'text'}
                  onChange={(e) => updateFormField(index, { type: e.target.value })}
                  className="w-full px-2 py-1 border border-border rounded text-xs bg-background"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="file">File Upload</option>
                  <option value="pharmaceutical">Pharmaceutical</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Name</label>
                <input
                  type="text"
                  value={field.name || ''}
                  onChange={(e) => updateFormField(index, { name: e.target.value })}
                  className="w-full px-2 py-1 border border-border rounded text-xs bg-background"
                  placeholder="field_name"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                  className="w-full px-2 py-1 border border-border rounded text-xs bg-background"
                  placeholder="Enter placeholder"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-4">
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateFormField(index, { required: e.target.checked })}
                  className="w-3 h-3 mr-1"
                />
                Required
              </label>

              {field.type === 'pharmaceutical' && (
                <select
                  value={field.pharmaceuticalType || ''}
                  onChange={(e) => updateFormField(index, { pharmaceuticalType: e.target.value })}
                  className="px-2 py-1 border border-border rounded text-xs bg-background"
                >
                  <option value="">Select type</option>
                  <option value="batch_lot_number">Batch/Lot Number</option>
                  <option value="equipment_id">Equipment ID</option>
                  <option value="product_code">Product Code</option>
                  <option value="regulatory_reference">Regulatory Reference</option>
                </select>
              )}
            </div>

            {field.type === 'select' && (
              <div className="mt-2">
                <label className="block text-muted-foreground mb-1 text-xs">Options (one per line)</label>
                <textarea
                  value={field.options?.map((opt: any) => `${opt.value}:${opt.label}`).join('\n') || ''}
                  onChange={(e) => {
                    const options = e.target.value.split('\n').filter(line => line.trim()).map(line => {
                      const [value, label] = line.split(':');
                      return { value: value?.trim() || '', label: label?.trim() || value?.trim() || '' };
                    });
                    updateFormField(index, { options });
                  }}
                  className="w-full px-2 py-1 border border-border rounded text-xs bg-background"
                  rows={3}
                  placeholder="value1:Label 1&#10;value2:Label 2"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFormField = (
    key: string,
    label: string,
    type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' = 'text',
    options?: { value: string; label: string }[],
    placeholder?: string
  ) => {
    const properties = nodeProperties as Record<string, any>;
    const value = properties[key] || '';

    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>

        {type === 'text' && (
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
          />
        )}

        {type === 'number' && (
          <input
            type="number"
            value={value}
            onChange={(e) => handlePropertyChange(key, parseInt(e.target.value) || 0)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
          />
        )}

        {type === 'textarea' && (
          <textarea
            value={value}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
          />
        )}

        {type === 'select' && (
          <select
            value={value}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
          >
            <option value="">Select {label}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {type === 'checkbox' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handlePropertyChange(key, e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="ml-2 text-sm">{label}</span>
          </div>
        )}
      </div>
    );
  };

  const renderNodeSpecificConfiguration = () => {
    const nodeType = selectedNode?.data?.stepType || selectedNode?.type;
    
    switch (nodeType) {
      case 'form':
      case 'form_input':
        return (
          <div className="space-y-4">
            {renderFormField('template', 'Form Template', 'select', [
              { value: 'batch_release', label: 'Batch Release Form' },
              { value: 'equipment_qual', label: 'Equipment Qualification' },
              { value: 'document_review', label: 'Document Review' },
              { value: 'custom', label: 'Custom Form' }
            ])}
            {renderFormField('validation', 'Enable Validation', 'checkbox')}
            {renderFormField('autoSave', 'Auto-save', 'checkbox')}
            {renderFormField('attachments', 'Allow Attachments', 'checkbox')}

            {/* Form Fields Management */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium">Form Fields</h5>
                <button
                  onClick={() => addFormField()}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Field</span>
                </button>
              </div>

              {renderFormFieldsList()}
            </div>
          </div>
        );

      case 'approval':
        return (
          <div className="space-y-4">
            {renderFormField('approvalType', 'Approval Type', 'select', [
              { value: 'single', label: 'Single Approver' },
              { value: 'multiple', label: 'Multiple Approvers' },
              { value: 'majority', label: 'Majority Vote' },
              { value: 'unanimous', label: 'Unanimous' }
            ])}
            {renderFormField('deadline', 'Deadline (hours)', 'number', undefined, '24')}
            {renderFormField('escalation', 'Enable Escalation', 'checkbox')}
            {renderFormField('escalationTime', 'Escalation Time (hours)', 'number', undefined, '48')}
          </div>
        );

      case 'email_notifier':
      case 'notification':
        return (
          <div className="space-y-4">
            {renderFormField('template', 'Email Template', 'select', [
              { value: 'approval_request', label: 'Approval Request' },
              { value: 'status_update', label: 'Status Update' },
              { value: 'completion', label: 'Completion Notice' },
              { value: 'custom', label: 'Custom Template' }
            ])}
            {renderFormField('priority', 'Priority', 'select', [
              { value: 'low', label: 'Low' },
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' }
            ])}
            {renderFormField('includeAttachments', 'Include Attachments', 'checkbox')}
          </div>
        );

      case 'api_connector':
        return (
          <div className="space-y-4">
            {renderFormField('url', 'API URL', 'text', undefined, 'https://api.example.com/endpoint')}
            {renderFormField('method', 'HTTP Method', 'select', [
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' }
            ])}
            {renderFormField('authentication', 'Authentication', 'select', [
              { value: 'none', label: 'None' },
              { value: 'basic', label: 'Basic Auth' },
              { value: 'bearer', label: 'Bearer Token' },
              { value: 'api_key', label: 'API Key' }
            ])}
            {renderFormField('timeout', 'Timeout (seconds)', 'number', undefined, '30')}
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground text-center py-4">
            Configuration options for {String(nodeType)} node will be available soon.
          </div>
        );
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-background border-l border-border flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  console.log('🔧 PropertiesPanel rendering with:', {
    selectedNodeId: selectedNode.id,
    selectedNodeType: selectedNode.type,
    selectedNodeLabel: selectedNode.data.label,
    nodeProperties: Object.keys(nodeProperties)
  });

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Properties</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <div className="font-medium">{String(selectedNode.data.label)}</div>
          <div className="text-xs capitalize">
            {String(selectedNode.data.stepType || selectedNode.type || 'unknown').replace('_', ' ')} Node
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {(['general', 'compliance', 'advanced'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            {/* Basic Properties */}
            <div>
              <h4 className="text-sm font-medium mb-3">Basic Information</h4>

              {renderFormField('label', 'Node Label', 'text', undefined, 'Enter node label')}
              {renderFormField('description', 'Description', 'textarea', undefined, 'Enter node description')}
            </div>

            {/* Node-Specific Configuration */}
            <div>
              <h4 className="text-sm font-medium mb-3">Configuration</h4>
              {renderNodeSpecificConfiguration()}
            </div>

            {/* Master Data Integration */}
            {(selectedNode.data.stepType === 'form_input' || selectedNode.type === 'form' || selectedNode.type === 'api_connector') && (
              <div>
                <h4 className="text-sm font-medium mb-3">Master Data Integration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Equipment Reference
                    </label>
                    <MasterDataLookup
                      type="equipment"
                      value={(nodeProperties as Record<string, any>).equipmentId || ''}
                      onChange={(value, data) => {
                        handlePropertyChange('equipmentId', value);
                        if (data) {
                          handlePropertyChange('equipmentData', data);
                        }
                      }}
                      placeholder="Search equipment..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Code
                    </label>
                    <MasterDataLookup
                      type="product_code"
                      value={(nodeProperties as Record<string, any>).productCode || ''}
                      onChange={(value, data) => {
                        handlePropertyChange('productCode', value);
                        if (data) {
                          handlePropertyChange('productData', data);
                        }
                      }}
                      placeholder="Search product codes..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium mb-3">Compliance Requirements</h4>

            {(selectedNode.data as any)?.complianceRequirements && Array.isArray((selectedNode.data as any).complianceRequirements) && (selectedNode.data as any).complianceRequirements.length > 0 ? (
              <div className="space-y-3">
                {(selectedNode.data as any).complianceRequirements.map((req: any, index: number) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-800">{req.regulation}</div>
                        <div className="text-xs text-red-600 mt-1">{req.requirement}</div>
                        {req.mandatory && (
                          <div className="text-xs text-red-500 mt-1 font-medium">Mandatory</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium mb-3">Advanced Settings</h4>

            {renderFormField('timeout', 'Timeout (seconds)', 'number', undefined, '30')}
            {renderFormField('retryAttempts', 'Retry Attempts', 'number', undefined, '3')}
            {renderFormField('errorHandling', 'Error Handling', 'select', [
              { value: 'stop', label: 'Stop Workflow' },
              { value: 'continue', label: 'Continue' },
              { value: 'retry', label: 'Retry' },
              { value: 'escalate', label: 'Escalate' }
            ])}
            {renderFormField('logging', 'Enable Logging', 'checkbox')}
          </div>
        )}
      </div>
    </div>
  );
};