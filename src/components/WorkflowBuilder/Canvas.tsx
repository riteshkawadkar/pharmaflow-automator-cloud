import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WorkflowNode, Connection, CanvasState, ComponentLibraryItem } from '../../types/workflow';
import { ZoomIn, ZoomOut, Maximize, Save, Play, Users, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CanvasProps {
  nodes: WorkflowNode[];
  connections: Connection[];
  canvasState: CanvasState;
  onNodeMove: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeSelect: (nodeId: string, multiSelect?: boolean) => void;
  onConnectionCreate: (connection: Omit<Connection, 'id'>) => void;
  onCanvasStateChange: (state: Partial<CanvasState>) => void;
  onSave: () => void;
  onExecute: () => void;
  onNodeAdd: (node: WorkflowNode) => void;
  onNodeConfigure: (nodeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeDuplicate: (nodeId: string) => void;
  isReadOnly?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  connections,
  canvasState,
  onNodeMove,
  onNodeSelect,
  onConnectionCreate,
  onCanvasStateChange,
  onSave,
  onExecute,
  onNodeAdd,
  onNodeConfigure,
  onNodeDelete,
  onNodeDuplicate,
  isReadOnly = false
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Handle node drag and drop from component library
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current?.getBoundingClientRect();
      
      if (rect) {
        const x = e.clientX - rect.left - canvasState.pan.x;
        const y = e.clientY - rect.top - canvasState.pan.y;
        
        const newNode: WorkflowNode = {
          id: uuidv4(),
          type: componentData.id,
          position: { x, y },
          data: {
            label: componentData.defaultProperties.label || componentData.name,
            description: componentData.description,
            properties: componentData.defaultProperties,
            pharmaceuticalType: componentData.pharmaceuticalType,
            complianceRequirements: componentData.complianceRequirements || []
          },
          connections: []
        };
        
        onNodeAdd(newNode);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [canvasState.pan, onNodeAdd]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleZoomIn = () => {
    onCanvasStateChange({ zoom: Math.min(canvasState.zoom * 1.2, 3) });
  };

  const handleZoomOut = () => {
    onCanvasStateChange({ zoom: Math.max(canvasState.zoom / 1.2, 0.1) });
  };

  const handleFitToScreen = () => {
    onCanvasStateChange({ zoom: 1, pan: { x: 0, y: 0 } });
  };

  const handleAutoSave = async () => {
    if (!isReadOnly && nodes.length > 0) {
      setIsAutoSaving(true);
      try {
        await onSave();
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (!isReadOnly && nodes.length > 0) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [nodes, connections, isReadOnly]);

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={handleZoomIn}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitToScreen}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Fit to Screen"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <span className="text-sm text-gray-500">{Math.round(canvasState.zoom * 100)}%</span>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <button
          onClick={onSave}
          disabled={isAutoSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isAutoSaving ? 'Saving...' : 'Save'}</span>
        </button>
        <button
          onClick={onExecute}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Play className="w-4 h-4" />
          <span>Execute</span>
        </button>
      </div>

      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="absolute bottom-4 right-4 z-10 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Render connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
            const targetNode = nodes.find(n => n.id === connection.targetNodeId);
            
            if (!sourceNode || !targetNode) return null;
            
            const x1 = sourceNode.position.x + 100; // Assuming node width of 200
            const y1 = sourceNode.position.y + 25;  // Assuming node height of 50
            const x2 = targetNode.position.x;
            const y2 = targetNode.position.y + 25;
            
            return (
              <line
                key={connection.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#374151"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          
          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#374151"
              />
            </marker>
          </defs>
        </svg>

        {/* Render nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            className={`absolute bg-white border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move p-3 min-w-[200px] ${
              canvasState.selectedNodes.includes(node.id)
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-300'
            }`}
            style={{
              left: node.position.x,
              top: node.position.y
            }}
            onClick={() => onNodeSelect(node.id)}
            onDoubleClick={() => onNodeConfigure(node.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">{node.data.label}</div>
                <div className="text-xs text-gray-500 capitalize">{node.type.replace('_', ' ')}</div>
              </div>
              <div className="flex space-x-1">
                {node.validation?.errors && node.validation.errors.length > 0 && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            
            {node.data.description && (
              <div className="mt-2 text-xs text-gray-600">{node.data.description}</div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">Empty Workflow</div>
              <div className="text-sm">Drag components from the library to start building</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};