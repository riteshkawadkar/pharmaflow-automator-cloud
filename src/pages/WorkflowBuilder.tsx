import React, { useState, useCallback } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Canvas } from '../components/WorkflowBuilder/Canvas';
import { ComponentLibrary } from '../components/workflow-builder/ComponentLibrary';
import { PropertiesPanel } from '../components/workflow-builder/NodePropertiesPanel';
import { ValidationEngine } from '../components/WorkflowBuilder/ValidationEngine';
import { TemplateLibrary } from '../components/WorkflowBuilder/TemplateLibrary';
import { CollaborationPanel } from '../components/WorkflowBuilder/CollaborationPanel';
import { WorkflowNode, Connection, CanvasState, ComponentLibraryItem, WorkflowTemplate } from '../types/workflow';
import { FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Mock initial workflow data
const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 100, y: 200 },
    data: {
      label: 'Start QC Process',
      description: 'Begin quality control batch release workflow',
      properties: {},
      pharmaceuticalType: 'batch_release',
      complianceRequirements: []
    },
    connections: []
  },
  {
    id: 'form-1',
    type: 'form',
    position: { x: 400, y: 200 },
    data: {
      label: 'Batch Information Form',
      description: 'Collect batch details and testing requirements',
      properties: {
        fields: ['batch_number', 'product_code', 'test_type'],
        validation: true,
        autoSave: true
      },
      pharmaceuticalType: 'batch_release',
      complianceRequirements: [
        {
          id: 'cfr-part-11-form',
          regulation: '21 CFR Part 11',
          requirement: 'Electronic records must be accurate and reliable',
          mandatory: true
        }
      ]
    },
    connections: [],
    validation: {
      isValid: true,
      errors: [],
      warnings: []
    }
  }
];

const initialConnections: Connection[] = [];

export const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedNodes: [],
    selectedConnections: [],
    isConnecting: false
  });
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

  // Handle node movement
  const handleNodeMove = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, position } : node
    ));
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string, multiSelect = false) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setShowPropertiesPanel(true);
    }

    setCanvasState(prev => ({
      ...prev,
      selectedNodes: multiSelect
        ? prev.selectedNodes.includes(nodeId)
          ? prev.selectedNodes.filter(id => id !== nodeId)
          : [...prev.selectedNodes, nodeId]
        : [nodeId]
    }));
  }, [nodes]);

  // Handle connection creation
  const handleConnectionCreate = useCallback((connection: Omit<Connection, 'id'>) => {
    console.log('🔗 Creating connection:', connection);

    // Prevent duplicate connections
    const existingConnection = connections.find(conn =>
      conn.sourceNodeId === connection.sourceNodeId &&
      conn.targetNodeId === connection.targetNodeId
    );

    if (existingConnection) {
      console.log('Connection already exists between these nodes');
      alert('Connection already exists between these nodes');
      return;
    }

    // Prevent self-connections
    if (connection.sourceNodeId === connection.targetNodeId) {
      console.log('Cannot connect node to itself');
      alert('Cannot connect node to itself');
      return;
    }

    const newConnection: Connection = {
      ...connection,
      id: uuidv4()
    };

    setConnections(prev => [...prev, newConnection]);
    console.log('✅ Connection created successfully:', newConnection);

    // Show success feedback
    const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
    const targetNode = nodes.find(n => n.id === connection.targetNodeId);
    if (sourceNode && targetNode) {
      console.log(`Connected: ${sourceNode.data.label} → ${targetNode.data.label}`);
      alert(`✅ Connected: ${sourceNode.data.label} → ${targetNode.data.label}`);
    }
  }, [connections, nodes]);

  // Handle canvas state changes
  const handleCanvasStateChange = useCallback((updates: Partial<CanvasState>) => {
    setCanvasState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle component drag from library (updated to match ComponentLibrary interface)
  const handleComponentDragStart = useCallback((event: React.DragEvent, componentId: string) => {
    event.dataTransfer.setData('application/reactflow', componentId);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle node addition from drag and drop
  const handleNodeAdd = useCallback((node: WorkflowNode) => {
    setNodes(prev => [...prev, node]);
    console.log('✅ Node added to canvas:', node.data.label);

    // Auto-select the new node
    setSelectedNode(node);
    setShowPropertiesPanel(true);
    setCanvasState(prev => ({ ...prev, selectedNodes: [node.id] }));
  }, []);

  // Handle node updates from properties panel
  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    ));

    // Update selected node if it's the one being updated
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, ...updates } : null);
    }

    console.log('✅ Node updated:', nodeId, updates);
  }, [selectedNode]);

  // Handle validation updates
  const handleValidationUpdate = useCallback((nodeId: string, validation: any) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, validation } : node
    ));
  }, []);

  // Handle node configuration
  const handleNodeConfigure = useCallback((nodeId: string) => {
    console.log('⚙️ Configuring node:', nodeId);
    console.log('⚙️ Current showPropertiesPanel state:', showPropertiesPanel);
    console.log('⚙️ Current selectedNode:', selectedNode?.id);

    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      console.log('⚙️ Found node to configure:', node.data.label);
      setSelectedNode(node);
      setShowPropertiesPanel(true);
      setCanvasState(prev => ({ ...prev, selectedNodes: [nodeId] }));

      // Force a re-render to ensure state updates
      setTimeout(() => {
        console.log('✅ Properties panel state after timeout:', {
          showPropertiesPanel: true,
          selectedNodeId: node.id,
          selectedNodeLabel: node.data.label
        });
      }, 100);
    } else {
      console.error('❌ Node not found for configuration:', nodeId);
    }
  }, [nodes]);

  // Handle node deletion
  const handleNodeDelete = useCallback((nodeId: string) => {
    console.log('🗑️ Deleting node:', nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node && window.confirm(`Delete "${node.data.label}"?`)) {
      // Remove node
      setNodes(prev => prev.filter(n => n.id !== nodeId));

      // Remove connections involving this node
      setConnections(prev => prev.filter(conn =>
        conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
      ));

      // Clear selection if deleted node was selected
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
        setShowPropertiesPanel(false);
      }

      console.log('✅ Node deleted:', node.data.label);
    }
  }, [nodes, selectedNode]);


  const handleComponentDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const componentId = event.dataTransfer.getData('application/reactflow');
    if (!componentId) return;

    const canvasRect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: (event.clientX - canvasRect.left - canvasState.pan.x) / canvasState.zoom,
      y: (event.clientY - canvasRect.top - canvasState.pan.y) / canvasState.zoom
    };

    // Create new node from component library
    const newNode: WorkflowNode = {
      id: `${componentId}-${uuidv4()}`,
      type: componentId as any,
      position: position,
      data: {
        label: componentId.charAt(0).toUpperCase() + componentId.slice(1).replace(/_/g, ' '),
        description: `${componentId} node`,
        properties: {},
        pharmaceuticalType: 'batch_release',
        complianceRequirements: []
      },
      connections: []
    };

    handleNodeAdd(newNode);
  }, [canvasState, handleNodeAdd]);

  // Handle node duplication
  const handleNodeDuplicate = useCallback((nodeId: string) => {
    console.log('📋 Duplicating node:', nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const duplicatedNode: WorkflowNode = {
        ...node,
        id: uuidv4(),
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50
        },
        data: {
          ...node.data,
          label: `${node.data.label} (Copy)`
        }
      };

      setNodes(prev => [...prev, duplicatedNode]);
      console.log('✅ Node duplicated:', duplicatedNode.data.label);
      alert(`📋 Node duplicated: ${duplicatedNode.data.label}`);
    }
  }, [nodes]);

  // Handle workflow save
  const handleSave = useCallback(async () => {
    const workflow = {
      id: uuidv4(),
      name: 'QC Batch Release Workflow',
      description: 'Quality control batch release workflow with compliance',
      nodes,
      connections,
      version: '1.0',
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      complianceLevel: 'cfr_part_11' as const
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage for demo
      localStorage.setItem('pharmaflow-workflow', JSON.stringify(workflow));
      console.log('✅ Workflow saved successfully:', workflow);

      return workflow;
    } catch (error) {
      console.error('❌ Failed to save workflow:', error);
      throw error;
    }
  }, [nodes, connections]);

  // Handle workflow execution/testing
  const handleExecute = useCallback(() => {
    const executionData = {
      workflowId: 'current-workflow',
      nodes: nodes.length,
      connections: connections.length,
      startTime: new Date(),
      status: 'running'
    };

    console.log('🚀 Executing workflow:', executionData);

    // Validate workflow before execution
    const startNodes = nodes.filter(n => n.type === 'start');
    const endNodes = nodes.filter(n => n.type === 'end');

    if (startNodes.length === 0) {
      alert('❌ Workflow must have at least one Start node');
      return;
    }

    if (endNodes.length === 0) {
      alert('❌ Workflow must have at least one End node');
      return;
    }

    alert(`🚀 Workflow Execution Started!\n\n✅ Nodes: ${nodes.length}\n✅ Connections: ${connections.length}\n✅ Start Nodes: ${startNodes.length}\n✅ End Nodes: ${endNodes.length}\n\nCheck the browser console for detailed execution logs.`);
  }, [nodes, connections]);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: WorkflowTemplate) => {
    // Clear existing workflow
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
    setShowPropertiesPanel(false);

    // Load template nodes and connections
    setTimeout(() => {
      setNodes(template.nodes);
      setConnections(template.connections);

      // Reset canvas view
      setCanvasState(prev => ({
        ...prev,
        zoom: 1,
        pan: { x: 0, y: 0 },
        selectedNodes: [],
        selectedConnections: []
      }));

      console.log('✅ Template loaded:', template.name);
      alert(`✅ Template "${template.name}" loaded successfully!\n\n📊 Nodes: ${template.nodes.length}\n🔗 Connections: ${template.connections.length}`);
    }, 100);
  }, []);

  // Handle template preview
  const handleTemplatePreview = useCallback((template: WorkflowTemplate) => {
    console.log('👁️ Previewing template:', template.name);
    alert(`👁️ Template Preview: ${template.name}\n\n${template.description}\n\n📊 Nodes: ${template.nodes.length}\n🔗 Connections: ${template.connections.length}\n🏷️ Category: ${template.category}\n🛡️ Compliance: ${template.complianceLevel}`);
  }, []);

  return (
    <Layout>
      <div className="flex h-full">
        {/* Component Library */}
        <ComponentLibrary onDragStart={handleComponentDragStart} />

        {/* Canvas Area */}
        <div className="flex-1 relative flex flex-col">
          {/* Canvas Toolbar */}
          <div className="p-4 border-b border-border bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowTemplateLibrary(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <FileText className="w-4 h-4" />
                  <span>Load Template</span>
                </button>

                {/* Collaboration Panel */}
                <CollaborationPanel
                  workflowId="current-workflow"
                  currentUserId="current-user"
                  onUserCursorMove={(userId, position) => {
                    console.log('👆 User cursor move:', userId, position);
                  }}
                  onUserSelection={(userId, nodeIds) => {
                    console.log('🎯 User selection:', userId, nodeIds);
                  }}
                />
              </div>

              {/* Validation Engine */}
              <div className="flex-1 max-w-md ml-4">
                <ValidationEngine
                  nodes={nodes}
                  connections={connections}
                  onValidationUpdate={handleValidationUpdate}
                />
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1">
          <Canvas
            nodes={nodes}
            connections={connections}
            canvasState={canvasState}
            onNodeMove={handleNodeMove}
            onNodeSelect={handleNodeSelect}
            onConnectionCreate={handleConnectionCreate}
            onCanvasStateChange={handleCanvasStateChange}
            onSave={handleSave}
            onExecute={handleExecute}
            onNodeAdd={handleNodeAdd}
            onNodeConfigure={handleNodeConfigure}
            onNodeDelete={handleNodeDelete}
            onNodeDuplicate={handleNodeDuplicate}
            onDrop={handleComponentDrop}
          />
        </div>
        </div>

        {/* Properties Panel */}
        {showPropertiesPanel && selectedNode && (
          <div className="w-80 bg-background border-l border-border">
            <PropertiesPanel
            selectedNode={selectedNode as any}
            onNodeUpdate={handleNodeUpdate as any}
            onClose={() => {
              console.log('🔧 Closing properties panel');
              setShowPropertiesPanel(false);
              setSelectedNode(null);
              setCanvasState(prev => ({ ...prev, selectedNodes: [] }));
            }}
            />
          </div>
        )}
      </div>

      {/* Template Library Modal */}
      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onTemplateSelect={handleTemplateSelect}
        onTemplatePreview={handleTemplatePreview}
      />
    </Layout>
  );
};