import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
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

const STEP_ICONS: Record<WorkflowStepType, any> = {
  start: Play,
  form_input: FileText,
  approval: CheckSquare,
  review: Eye,
  notification: Bell,
  decision: GitBranch,
  parallel_gateway: Shuffle,
  exclusive_gateway: Square,
  end: StopCircle,
  document_upload: Upload,
  document_review: FileCheck,
  quality_check: Shield,
  regulatory_check: Gavel,
  compliance_verification: CheckCircle2,
  risk_assessment: AlertTriangle,
  technical_review: Cpu,
  management_approval: Crown,
  batch_record: FileSpreadsheet,
  test_execution: TestTube,
  calibration: Settings,
  training_verification: GraduationCap,
  supplier_verification: Truck,
  deviation_investigation: AlertCircle,
  corrective_action: Wrench,
  change_control: GitMerge,
  validation_step: CheckSquare,
  equipment_qualification: Cog,
  sample_testing: Beaker,
  data_analysis: BarChart,
  audit_step: Search,
  capa_implementation: Target
};

const STEP_COLORS: Record<WorkflowStepType, string> = {
  start: 'bg-green-500',
  form_input: 'bg-blue-500',
  approval: 'bg-orange-500',
  review: 'bg-purple-500',
  notification: 'bg-yellow-500',
  decision: 'bg-indigo-500',
  parallel_gateway: 'bg-gray-500',
  exclusive_gateway: 'bg-pink-500',
  end: 'bg-red-500',
  document_upload: 'bg-blue-600',
  document_review: 'bg-indigo-500',
  quality_check: 'bg-emerald-500',
  regulatory_check: 'bg-teal-500',
  compliance_verification: 'bg-green-600',
  risk_assessment: 'bg-amber-500',
  technical_review: 'bg-violet-500',
  management_approval: 'bg-purple-600',
  batch_record: 'bg-lime-500',
  test_execution: 'bg-rose-500',
  calibration: 'bg-gray-600',
  training_verification: 'bg-indigo-600',
  supplier_verification: 'bg-orange-600',
  deviation_investigation: 'bg-red-600',
  corrective_action: 'bg-orange-700',
  change_control: 'bg-purple-700',
  validation_step: 'bg-emerald-600',
  equipment_qualification: 'bg-stone-500',
  sample_testing: 'bg-cyan-600',
  data_analysis: 'bg-blue-700',
  audit_step: 'bg-slate-500',
  capa_implementation: 'bg-red-700'
};

interface WorkflowNodeProps {
  data: {
    label: string;
    stepType: WorkflowStepType;
    description?: string;
  };
  selected?: boolean;
}

export const WorkflowNode = memo(({ data, selected }: WorkflowNodeProps) => {
  const Icon = STEP_ICONS[data.stepType];
  const colorClass = STEP_COLORS[data.stepType];
  
  const showTopHandle = data.stepType !== 'start';
  const showBottomHandle = data.stepType !== 'end';
  const showMultipleOutputs = data.stepType === 'decision' || data.stepType === 'parallel_gateway';

  return (
    <div className={`
      relative min-w-[150px] rounded-lg border-2 bg-background shadow-lg
      ${selected ? 'border-primary' : 'border-border'}
      transition-all duration-200 hover:shadow-xl
    `}>
      {/* Top handle */}
      {showTopHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 border-2 border-white"
          style={{ background: '#6b7280' }}
        />
      )}
      
      {/* Node content */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-full ${colorClass} text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-medium text-sm">{data.label}</h3>
        </div>
        
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {data.description}
          </p>
        )}
      </div>
      
      {/* Bottom handles */}
      {showBottomHandle && (
        <>
          {showMultipleOutputs ? (
            <>
              <Handle
                type="source"
                position={Position.Bottom}
                id="yes"
                className="w-3 h-3 border-2 border-white"
                style={{ 
                  background: '#10b981',
                  left: '25%'
                }}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="no"
                className="w-3 h-3 border-2 border-white"
                style={{ 
                  background: '#ef4444',
                  left: '75%'
                }}
              />
            </>
          ) : (
            <Handle
              type="source"
              position={Position.Bottom}
              className="w-3 h-3 border-2 border-white"
              style={{ background: '#6b7280' }}
            />
          )}
        </>
      )}
    </div>
  );
});