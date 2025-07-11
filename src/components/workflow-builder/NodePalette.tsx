import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  FileText, 
  CheckSquare, 
  Eye, 
  Bell, 
  GitBranch, 
  Shuffle, 
  Square,
  StopCircle
} from 'lucide-react';
import { WorkflowStepType } from '@/types/workflow-builder';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, stepType: WorkflowStepType) => void;
}

const NODE_TYPES = [
  {
    type: 'start' as WorkflowStepType,
    label: 'Start',
    description: 'Workflow starting point',
    icon: Play,
    color: 'text-green-600'
  },
  {
    type: 'form_input' as WorkflowStepType,
    label: 'Form Input',
    description: 'Data collection step',
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    type: 'approval' as WorkflowStepType,
    label: 'Approval',
    description: 'Requires approval',
    icon: CheckSquare,
    color: 'text-orange-600'
  },
  {
    type: 'review' as WorkflowStepType,
    label: 'Review',
    description: 'Document review',
    icon: Eye,
    color: 'text-purple-600'
  },
  {
    type: 'notification' as WorkflowStepType,
    label: 'Notification',
    description: 'Send notifications',
    icon: Bell,
    color: 'text-yellow-600'
  },
  {
    type: 'decision' as WorkflowStepType,
    label: 'Decision',
    description: 'Conditional branching',
    icon: GitBranch,
    color: 'text-indigo-600'
  },
  {
    type: 'parallel_gateway' as WorkflowStepType,
    label: 'Parallel Gateway',
    description: 'Split into parallel paths',
    icon: Shuffle,
    color: 'text-gray-600'
  },
  {
    type: 'exclusive_gateway' as WorkflowStepType,
    label: 'Exclusive Gateway',
    description: 'Exclusive path selection',
    icon: Square,
    color: 'text-pink-600'
  },
  {
    type: 'end' as WorkflowStepType,
    label: 'End',
    description: 'Workflow endpoint',
    icon: StopCircle,
    color: 'text-red-600'
  }
];

export const NodePalette = ({ onDragStart }: NodePaletteProps) => {
  return (
    <Card className="w-64 h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Workflow Steps</CardTitle>
        <CardDescription>
          Drag and drop to add steps to your workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {NODE_TYPES.map((nodeType) => {
          const IconComponent = nodeType.icon;
          return (
            <Button
              key={nodeType.type}
              variant="outline"
              className="w-full justify-start h-auto p-3 cursor-grab active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 ${nodeType.color}`} />
                <div className="text-left">
                  <div className="font-medium text-sm">{nodeType.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {nodeType.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};