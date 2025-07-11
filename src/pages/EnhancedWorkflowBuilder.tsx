import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  Edge, 
  Node,
  useReactFlow 
} from '@xyflow/react';
import { WorkflowBuilderWrapper } from '@/components/workflow-builder/WorkflowBuilder';
import { ComponentLibrary, ComponentLibraryItem, componentLibrary } from '@/components/workflow-builder/ComponentLibrary';
import { WorkflowNode } from '@/components/workflow-builder/WorkflowNode';
import { WorkflowStepType } from '@/types/workflow-builder';
import { Play, Save, Share, Download, Upload, Settings, Users, FileCheck, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Advanced workflow features
interface EnhancedWorkflowNode extends Node {
  data: {
    label: string;
    stepType: WorkflowStepType;
    description?: string;
    pharmaceuticalType?: string;
    complianceRequirements?: ComplianceRequirement[];
    properties?: Record<string, any>;
  };
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

interface ComplianceRequirement {
  id: string;
  regulation: string;
  requirement: string;
  mandatory: boolean;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: EnhancedWorkflowNode[];
  edges: Edge[];
}

const nodeTypes = {
  workflowNode: WorkflowNode,
};

// Mock templates
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'batch-release',
    name: 'Batch Release Workflow',
    description: 'Quality control batch release process',
    category: 'Quality Control',
    nodes: [
      {
        id: 'start-1',
        type: 'workflowNode',
        position: { x: 100, y: 100 },
        data: {
          label: 'Start QC Process',
          stepType: 'start',
          description: 'Begin quality control batch release workflow',
          pharmaceuticalType: 'batch_release',
          complianceRequirements: []
        }
      }
    ],
    edges: []
  }
];

export const EnhancedWorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<EnhancedWorkflowNode | null>(null);
  const [activeTab, setActiveTab] = useState('design');
  const { getNodes, getEdges } = useReactFlow();

  // Node selection handler
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as EnhancedWorkflowNode);
  }, []);

  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // Keyboard shortcuts
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteSelectedNode();
    }
  }, [deleteSelectedNode]);

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  // Update node properties
  const updateNodeProperty = useCallback((nodeId: string, property: string, value: any) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              [property]: value
            }
          } as EnhancedWorkflowNode;
          
          // Update selected node if it's the one being modified
          if (selectedNode?.id === nodeId) {
            setSelectedNode(updatedNode);
          }
          
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes, selectedNode]);

  // Validate workflow
  const validateWorkflow = useCallback(() => {
    const currentNodes = getNodes() as EnhancedWorkflowNode[];
    const validationResults = currentNodes.map((node) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Basic validation rules
      if (!node.data.label.trim()) {
        errors.push('Node label is required');
      }

      if (node.data.stepType === 'start' && currentNodes.filter(n => n.data.stepType === 'start').length > 1) {
        errors.push('Only one start node is allowed');
      }

      if (node.data.stepType === 'end' && currentNodes.filter(n => n.data.stepType === 'end').length === 0) {
        warnings.push('Workflow should have at least one end node');
      }

      // Pharmaceutical-specific validation
      if (node.data.stepType === 'approval' && !node.data.properties?.approvers?.length) {
        warnings.push('Approval step should have designated approvers');
      }

      return {
        nodeId: node.id,
        isValid: errors.length === 0,
        errors,
        warnings
      };
    });

    // Update nodes with validation results
    setNodes((nds) => 
      nds.map((node) => {
        const result = validationResults.find(r => r.nodeId === node.id);
        return {
          ...node,
          validation: result
        } as EnhancedWorkflowNode;
      })
    );

    return validationResults;
  }, [getNodes, setNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, componentId: string) => {
    const component = componentLibrary.find(c => c.id === componentId);
    if (component) {
      event.dataTransfer.setData('application/reactflow', JSON.stringify(component));
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const componentData = event.dataTransfer.getData('application/reactflow');

      if (!componentData) return;

      let component: ComponentLibraryItem;
      try {
        component = JSON.parse(componentData);
      } catch {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      const newNode: EnhancedWorkflowNode = {
        id: `${component.id}-${Date.now()}`,
        type: 'workflowNode',
        position,
        data: {
          label: component.defaultProperties.label || component.name,
          stepType: component.id as WorkflowStepType,
          description: component.description,
          pharmaceuticalType: component.pharmaceuticalType,
          complianceRequirements: component.complianceRequirements || [],
          properties: { ...component.defaultProperties }
        },
        validation: {
          isValid: true,
          errors: [],
          warnings: []
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const loadTemplate = (template: WorkflowTemplate) => {
    setNodes(template.nodes);
    setEdges(template.edges);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Enhanced Workflow Builder</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={validateWorkflow}>
              <FileCheck className="w-4 h-4 mr-2" />
              Validate
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={deleteSelectedNode}
              disabled={!selectedNode}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Component Library */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full p-4 border-r">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="validation">Validation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="components" className="mt-4">
                  <ComponentLibrary onDragStart={onDragStart} />
                </TabsContent>
                
                <TabsContent value="templates" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Templates</CardTitle>
                      <CardDescription>Pre-built pharmaceutical workflows</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {workflowTemplates.map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          className="w-full justify-start h-auto p-3"
                          onClick={() => loadTemplate(template)}
                        >
                          <div className="text-left">
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {template.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="validation" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Validation Results</CardTitle>
                      <CardDescription>Workflow compliance & validation status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button onClick={validateWorkflow} className="w-full">
                          <FileCheck className="w-4 h-4 mr-2" />
                          Run Validation
                        </Button>
                        
                        {nodes.map((node) => {
                          const n = node as EnhancedWorkflowNode;
                          if (!n.validation) return null;
                          
                          return (
                            <div key={n.id} className="border rounded p-3">
                              <div className="flex items-center gap-2 mb-2">
                                {n.validation.isValid ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <span className="font-medium text-sm">{n.data.label}</span>
                              </div>
                              
                              {n.validation.errors.map((error, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                                  <XCircle className="w-3 h-3" />
                                  {error}
                                </div>
                              ))}
                              
                              {n.validation.warnings.map((warning, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-amber-600">
                                  <AlertTriangle className="w-3 h-3" />
                                  {warning}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Canvas */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                className="bg-background"
                fitView
                deleteKeyCode={['Delete', 'Backspace']}
                multiSelectionKeyCode={['Control', 'Meta']}
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Properties */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full p-4 border-l">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Properties
                    {selectedNode && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={deleteSelectedNode}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>Configure selected component</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="space-y-4">
                      {/* Basic Properties */}
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="label">Label</Label>
                          <Input 
                            id="label"
                            value={selectedNode.data.label}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'label', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea 
                            id="description"
                            value={selectedNode.data.description || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'description', e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label>Step Type</Label>
                          <Badge variant="secondary" className="mt-1">
                            {selectedNode.data.stepType}
                          </Badge>
                        </div>
                      </div>

                      {/* Configuration based on step type */}
                      {selectedNode.data.stepType === 'approval' && (
                        <div className="space-y-3 border-t pt-4">
                          <h4 className="font-medium">Approval Configuration</h4>
                          <div>
                            <Label htmlFor="approvalType">Approval Type</Label>
                            <Select 
                              value={selectedNode.data.properties?.approvalType || 'single'}
                              onValueChange={(value) => updateNodeProperty(selectedNode.id, 'properties', {
                                ...selectedNode.data.properties,
                                approvalType: value
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Single Approver</SelectItem>
                                <SelectItem value="majority">Majority Vote</SelectItem>
                                <SelectItem value="unanimous">Unanimous</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="approvers">Approvers (comma-separated emails)</Label>
                            <Textarea 
                              id="approvers"
                              value={selectedNode.data.properties?.approvers?.join(', ') || ''}
                              onChange={(e) => {
                                const approvers = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                updateNodeProperty(selectedNode.id, 'properties', {
                                  ...selectedNode.data.properties,
                                  approvers
                                });
                              }}
                              className="mt-1"
                              placeholder="user1@company.com, user2@company.com"
                            />
                          </div>
                        </div>
                      )}

                      {selectedNode.data.stepType === 'form_input' && (
                        <div className="space-y-3 border-t pt-4">
                          <h4 className="font-medium">Form Configuration</h4>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={selectedNode.data.properties?.required || false}
                              onCheckedChange={(checked) => updateNodeProperty(selectedNode.id, 'properties', {
                                ...selectedNode.data.properties,
                                required: checked
                              })}
                            />
                            <Label>Required Field</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={selectedNode.data.properties?.autoSave || false}
                              onCheckedChange={(checked) => updateNodeProperty(selectedNode.id, 'properties', {
                                ...selectedNode.data.properties,
                                autoSave: checked
                              })}
                            />
                            <Label>Auto Save</Label>
                          </div>
                        </div>
                      )}

                      {selectedNode.data.stepType === 'notification' && (
                        <div className="space-y-3 border-t pt-4">
                          <h4 className="font-medium">Notification Configuration</h4>
                          <div>
                            <Label htmlFor="recipients">Recipients</Label>
                            <Textarea 
                              id="recipients"
                              value={selectedNode.data.properties?.recipients?.join(', ') || ''}
                              onChange={(e) => {
                                const recipients = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                updateNodeProperty(selectedNode.id, 'properties', {
                                  ...selectedNode.data.properties,
                                  recipients
                                });
                              }}
                              className="mt-1"
                              placeholder="user1@company.com, user2@company.com"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="template">Message Template</Label>
                            <Textarea 
                              id="template"
                              value={selectedNode.data.properties?.template || ''}
                              onChange={(e) => updateNodeProperty(selectedNode.id, 'properties', {
                                ...selectedNode.data.properties,
                                template: e.target.value
                              })}
                              className="mt-1"
                              placeholder="Enter notification message template"
                            />
                          </div>
                        </div>
                      )}

                      {/* Validation Status */}
                      {selectedNode.validation && (
                        <div className="space-y-2 border-t pt-4">
                          <h4 className="font-medium">Validation Status</h4>
                          <div className="flex items-center gap-2">
                            {selectedNode.validation.isValid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm">
                              {selectedNode.validation.isValid ? 'Valid' : 'Invalid'}
                            </span>
                          </div>
                          
                          {selectedNode.validation.errors.map((error, i) => (
                            <div key={i} className="text-sm text-red-600 flex items-center gap-2">
                              <XCircle className="w-3 h-3" />
                              {error}
                            </div>
                          ))}
                          
                          {selectedNode.validation.warnings.map((warning, i) => (
                            <div key={i} className="text-sm text-amber-600 flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3" />
                              {warning}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a component to view and edit its properties
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};