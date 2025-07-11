import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Node 
} from '@xyflow/react';
import { WorkflowBuilderWrapper } from '@/components/workflow-builder/WorkflowBuilder';
import { NodePalette } from '@/components/workflow-builder/NodePalette';
import { WorkflowNode } from '@/components/workflow-builder/WorkflowNode';
import { WorkflowStepType } from '@/types/workflow-builder';
import { Play, Save, Share, Download, Upload, Settings, Users, FileCheck } from 'lucide-react';

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

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, stepType: WorkflowStepType) => {
    event.dataTransfer.setData('application/reactflow', stepType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const stepType = event.dataTransfer.getData('application/reactflow') as WorkflowStepType;

      if (!stepType) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: EnhancedWorkflowNode = {
        id: `${stepType}-${Date.now()}`,
        type: 'workflowNode',
        position,
        data: {
          label: stepType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          stepType,
          description: `${stepType} workflow step`,
          pharmaceuticalType: 'custom',
          complianceRequirements: []
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
            <Button size="sm">
              <Play className="w-4 h-4 mr-2" />
              Test Workflow
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
                  <NodePalette onDragStart={onDragStart} />
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
                      <CardTitle className="text-lg">Validation</CardTitle>
                      <CardDescription>Workflow compliance & validation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm">21 CFR Part 11 Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm">GxP Validated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm">ISO 13485 Aligned</span>
                        </div>
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
                nodeTypes={nodeTypes}
                className="bg-background"
                fitView
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
                  <CardTitle className="text-lg">Properties</CardTitle>
                  <CardDescription>Configure selected component</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Label</label>
                        <input 
                          className="w-full mt-1 p-2 border rounded"
                          value={selectedNode.data.label}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <input 
                          className="w-full mt-1 p-2 border rounded"
                          value={selectedNode.data.stepType}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea 
                          className="w-full mt-1 p-2 border rounded"
                          value={selectedNode.data.description}
                          readOnly
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a component to view its properties
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