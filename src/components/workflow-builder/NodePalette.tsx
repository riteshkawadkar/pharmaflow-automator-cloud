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
  StopCircle,
  Upload,
  FileCheck,
  Shield,
  Gavel,
  CheckCircle2,
  AlertTriangle,
  Search,
  Cpu,
  TestTube,
  Beaker,
  BarChart,
  Settings,
  Cog,
  Crown,
  GraduationCap,
  Truck,
  FileSpreadsheet,
  AlertCircle,
  Wrench,
  GitMerge,
  Target
} from 'lucide-react';
import { WorkflowStepType } from '@/types/workflow-builder';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, stepType: WorkflowStepType) => void;
}

const NODE_CATEGORIES = {
  'Core': [
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
  ],
  'Documents': [
    {
      type: 'document_upload' as WorkflowStepType,
      label: 'Document Upload',
      description: 'Upload and manage documents',
      icon: Upload,
      color: 'text-blue-700'
    },
    {
      type: 'document_review' as WorkflowStepType,
      label: 'Document Review',
      description: 'Review and validate documents',
      icon: FileCheck,
      color: 'text-indigo-700'
    }
  ],
  'Quality': [
    {
      type: 'quality_check' as WorkflowStepType,
      label: 'Quality Check',
      description: 'Quality control verification',
      icon: Shield,
      color: 'text-emerald-600'
    },
    {
      type: 'regulatory_check' as WorkflowStepType,
      label: 'Regulatory Check',
      description: 'Regulatory compliance verification',
      icon: Gavel,
      color: 'text-teal-600'
    },
    {
      type: 'compliance_verification' as WorkflowStepType,
      label: 'Compliance Verification',
      description: 'Verify compliance requirements',
      icon: CheckCircle2,
      color: 'text-green-700'
    },
    {
      type: 'risk_assessment' as WorkflowStepType,
      label: 'Risk Assessment',
      description: 'Evaluate and assess risks',
      icon: AlertTriangle,
      color: 'text-amber-600'
    },
    {
      type: 'audit_step' as WorkflowStepType,
      label: 'Audit Step',
      description: 'Internal or external audit',
      icon: Search,
      color: 'text-slate-600'
    }
  ],
  'Technical': [
    {
      type: 'technical_review' as WorkflowStepType,
      label: 'Technical Review',
      description: 'Technical evaluation and review',
      icon: Cpu,
      color: 'text-violet-600'
    },
    {
      type: 'test_execution' as WorkflowStepType,
      label: 'Test Execution',
      description: 'Execute testing procedures',
      icon: TestTube,
      color: 'text-rose-600'
    },
    {
      type: 'sample_testing' as WorkflowStepType,
      label: 'Sample Testing',
      description: 'Laboratory sample analysis',
      icon: Beaker,
      color: 'text-cyan-700'
    },
    {
      type: 'data_analysis' as WorkflowStepType,
      label: 'Data Analysis',
      description: 'Analyze test data and results',
      icon: BarChart,
      color: 'text-blue-800'
    },
    {
      type: 'calibration' as WorkflowStepType,
      label: 'Calibration',
      description: 'Equipment calibration step',
      icon: Settings,
      color: 'text-gray-700'
    },
    {
      type: 'equipment_qualification' as WorkflowStepType,
      label: 'Equipment Qualification',
      description: 'Qualify equipment for use',
      icon: Cog,
      color: 'text-stone-600'
    },
    {
      type: 'validation_step' as WorkflowStepType,
      label: 'Validation Step',
      description: 'Process or method validation',
      icon: CheckSquare,
      color: 'text-emerald-700'
    }
  ],
  'Management': [
    {
      type: 'management_approval' as WorkflowStepType,
      label: 'Management Approval',
      description: 'Senior management approval',
      icon: Crown,
      color: 'text-purple-700'
    },
    {
      type: 'training_verification' as WorkflowStepType,
      label: 'Training Verification',
      description: 'Verify training completion',
      icon: GraduationCap,
      color: 'text-indigo-800'
    },
    {
      type: 'supplier_verification' as WorkflowStepType,
      label: 'Supplier Verification',
      description: 'Verify supplier qualifications',
      icon: Truck,
      color: 'text-orange-700'
    }
  ],
  'Process': [
    {
      type: 'batch_record' as WorkflowStepType,
      label: 'Batch Record',
      description: 'Manufacturing batch documentation',
      icon: FileSpreadsheet,
      color: 'text-lime-600'
    },
    {
      type: 'deviation_investigation' as WorkflowStepType,
      label: 'Deviation Investigation',
      description: 'Investigate process deviations',
      icon: AlertCircle,
      color: 'text-red-700'
    },
    {
      type: 'corrective_action' as WorkflowStepType,
      label: 'Corrective Action',
      description: 'Implement corrective measures',
      icon: Wrench,
      color: 'text-orange-800'
    },
    {
      type: 'change_control' as WorkflowStepType,
      label: 'Change Control',
      description: 'Manage process changes',
      icon: GitMerge,
      color: 'text-purple-800'
    },
    {
      type: 'capa_implementation' as WorkflowStepType,
      label: 'CAPA Implementation',
      description: 'Corrective and Preventive Actions',
      icon: Target,
      color: 'text-red-800'
    }
  ]
};

export const NodePalette = ({ onDragStart }: NodePaletteProps) => {
  return (
    <Card className="w-80 h-fit max-h-[600px] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Workflow Steps</CardTitle>
        <CardDescription>
          Drag and drop to add steps to your workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(NODE_CATEGORIES).map(([categoryName, nodes]) => (
          <div key={categoryName} className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {categoryName}
            </h4>
            <div className="space-y-1">
              {nodes.map((nodeType) => {
                const IconComponent = nodeType.icon;
                return (
                  <Button
                    key={nodeType.type}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 cursor-grab active:cursor-grabbing hover:bg-muted/50"
                    draggable
                    onDragStart={(event) => onDragStart(event, nodeType.type)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${nodeType.color}`} />
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
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};