import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Settings, Trash2 } from 'lucide-react';
import { WorkflowNode } from '../../types/workflow';

interface NodePropertiesPanelProps {
  selectedNode: WorkflowNode;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onClose: () => void;
}

export const PropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onClose
}) => {
  const handleLabelChange = (value: string) => {
    onNodeUpdate(selectedNode.id, {
      data: { ...selectedNode.data, label: value }
    });
  };

  const handleDescriptionChange = (value: string) => {
    onNodeUpdate(selectedNode.id, {
      data: { ...selectedNode.data, description: value }
    });
  };

  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Properties
          </CardTitle>
          <CardDescription>Configure node settings</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Properties */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input 
              id="label"
              value={selectedNode.data.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={selectedNode.data.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label>Node Type</Label>
            <Badge variant="secondary" className="mt-1">
              {selectedNode.type}
            </Badge>
          </div>

          {/* Pharmaceutical Type */}
          {selectedNode.data.pharmaceuticalType && (
            <div>
              <Label>Pharmaceutical Type</Label>
              <Badge variant="outline" className="mt-1">
                {selectedNode.data.pharmaceuticalType}
              </Badge>
            </div>
          )}

          {/* Compliance Requirements */}
          {selectedNode.data.complianceRequirements && selectedNode.data.complianceRequirements.length > 0 && (
            <div>
              <Label>Compliance Requirements</Label>
              <div className="mt-1 space-y-2">
                {selectedNode.data.complianceRequirements.map((req, index) => (
                  <div key={index} className="p-2 border rounded-md bg-muted/50">
                    <div className="text-sm font-medium">{req.regulation}</div>
                    <div className="text-xs text-muted-foreground">{req.requirement}</div>
                    {req.mandatory && (
                      <Badge variant="destructive" className="mt-1 text-xs">
                        Mandatory
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Position Information */}
        <div className="border-t pt-4">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label className="text-xs">X</Label>
              <Input 
                value={Math.round(selectedNode.position.x)}
                disabled
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input 
                value={Math.round(selectedNode.position.y)}
                disabled
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* Validation Status */}
        {selectedNode.validation && (
          <div className="border-t pt-4">
            <Label>Validation Status</Label>
            <div className="mt-1">
              {selectedNode.validation.isValid ? (
                <Badge variant="default" className="text-xs">
                  Valid
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Has Errors
                </Badge>
              )}
              
              {selectedNode.validation.errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  <Label className="text-xs text-destructive">Errors:</Label>
                  {selectedNode.validation.errors.map((error, index) => (
                    <div key={index} className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                      {typeof error === 'string' ? error : error.message}
                    </div>
                  ))}
                </div>
              )}
              
              {selectedNode.validation.warnings.length > 0 && (
                <div className="mt-2 space-y-1">
                  <Label className="text-xs text-yellow-600">Warnings:</Label>
                  {selectedNode.validation.warnings.map((warning, index) => (
                    <div key={index} className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                      {typeof warning === 'string' ? warning : warning.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};