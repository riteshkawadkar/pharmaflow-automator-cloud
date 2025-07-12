import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { WorkflowStepType } from '@/types/workflow-builder';

interface WorkflowNodeComponentProps {
  id: string;
  data: {
    label: string;
    description?: string;
    type?: string;
    properties?: Record<string, any>;
    pharmaceuticalType?: string;
    complianceRequirements?: any[];
    gxpCritical?: boolean;
    estimatedDuration?: number;
  };
  selected?: boolean;
  isConnectable?: boolean;
  onNodeClick?: (nodeId: string) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeCopy?: (nodeId: string) => void;
  onNodeConfigure?: (nodeId: string) => void;
}

export const WorkflowNodeComponent: React.FC<WorkflowNodeComponentProps> = ({
  id,
  data,
  selected = false,
  isConnectable = true,
  onNodeClick,
  onNodeDelete,
  onNodeCopy,
  onNodeConfigure
}) => {
  return (
    <div 
      className={`
        w-48 p-3 bg-card border-2 rounded-lg shadow-sm
        ${selected ? 'border-primary' : 'border-border'}
        hover:shadow-md transition-shadow cursor-pointer
      `}
      onClick={() => onNodeClick?.(id)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary"
        isConnectable={isConnectable}
      />
      
      <div className="text-sm font-medium text-foreground mb-1">
        {data.label}
      </div>
      
      {data.description && (
        <div className="text-xs text-muted-foreground mb-2">
          {data.description}
        </div>
      )}
      
      {data.type && (
        <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded mb-2">
          {data.type}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary"
        isConnectable={isConnectable}
      />
    </div>
  );
};