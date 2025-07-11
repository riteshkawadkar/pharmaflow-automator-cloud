import React, { useState, useRef, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Play,
  Square,
  FileText,
  CheckCircle,
  Eye,
  GitBranch,
  Clock,
  Database,
  Zap,
  Globe,
  Upload,
  Mail,
  MessageSquare,
  BarChart3,
  FileDown,
  PenTool,
  Shield,
  GraduationCap,
  AlertTriangle,
  MoreVertical,
  Settings,
  Trash2,
  Copy,
  Bell,
  FileCheck,
  Gavel,
  CheckCircle2,
  Cpu,
  TestTube,
  Beaker,
  Cog,
  Crown,
  Truck,
  FileSpreadsheet,
  AlertCircle,
  Wrench,
  GitMerge,
  Target
} from 'lucide-react';

const iconMap = {
  start: Play,
  end: Square,
  form: FileText,
  approval: CheckCircle,
  review: Eye,
  decision: GitBranch,
  timer: Clock,
  api_connector: Zap,
  database_query: Database,
  external_system: Globe,
  file_processor: Upload,
  email_notifier: Mail,
  sms_alert: MessageSquare,
  dashboard_update: BarChart3,
  report_generator: FileDown,
  electronic_signature: PenTool,
  audit_logger: Shield,
  training_verification: GraduationCap,
  compliance_checker: AlertTriangle,
  notification: Bell,
  document_review: FileCheck,
  regulatory_check: Gavel,
  quality_check: Shield,
  compliance_verification: CheckCircle2,
  risk_assessment: AlertTriangle,
  technical_review: Cpu,
  test_execution: TestTube,
  sample_testing: Beaker,
  calibration: Settings,
  equipment_qualification: Cog,
  management_approval: Crown,
  supplier_verification: Truck,
  batch_record: FileSpreadsheet,
  deviation_investigation: AlertCircle,
  corrective_action: Wrench,
  change_control: GitMerge,
  capa_implementation: Target
};

const nodeColors = {
  start: 'bg-green-100 border-green-300 text-green-800',
  end: 'bg-red-100 border-red-300 text-red-800',
  form: 'bg-blue-100 border-blue-300 text-blue-800',
  approval: 'bg-purple-100 border-purple-300 text-purple-800',
  review: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  decision: 'bg-orange-100 border-orange-300 text-orange-800',
  timer: 'bg-gray-100 border-gray-300 text-gray-800',
  api_connector: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  database_query: 'bg-cyan-100 border-cyan-300 text-cyan-800',
  external_system: 'bg-teal-100 border-teal-300 text-teal-800',
  file_processor: 'bg-pink-100 border-pink-300 text-pink-800',
  email_notifier: 'bg-blue-100 border-blue-300 text-blue-800',
  sms_alert: 'bg-green-100 border-green-300 text-green-800',
  dashboard_update: 'bg-purple-100 border-purple-300 text-purple-800',
  report_generator: 'bg-orange-100 border-orange-300 text-orange-800',
  electronic_signature: 'bg-red-100 border-red-300 text-red-800',
  audit_logger: 'bg-gray-100 border-gray-300 text-gray-800',
  training_verification: 'bg-green-100 border-green-300 text-green-800',
  compliance_checker: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  notification: 'bg-blue-100 border-blue-300 text-blue-800',
  document_review: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  regulatory_check: 'bg-teal-100 border-teal-300 text-teal-800',
  quality_check: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  compliance_verification: 'bg-green-100 border-green-300 text-green-800',
  risk_assessment: 'bg-amber-100 border-amber-300 text-amber-800',
  technical_review: 'bg-violet-100 border-violet-300 text-violet-800',
  test_execution: 'bg-rose-100 border-rose-300 text-rose-800',
  sample_testing: 'bg-cyan-100 border-cyan-300 text-cyan-800',
  calibration: 'bg-gray-100 border-gray-300 text-gray-800',
  equipment_qualification: 'bg-stone-100 border-stone-300 text-stone-800',
  management_approval: 'bg-purple-100 border-purple-300 text-purple-800',
  supplier_verification: 'bg-orange-100 border-orange-300 text-orange-800',
  batch_record: 'bg-lime-100 border-lime-300 text-lime-800',
  deviation_investigation: 'bg-red-100 border-red-300 text-red-800',
  corrective_action: 'bg-orange-100 border-orange-300 text-orange-800',
  change_control: 'bg-purple-100 border-purple-300 text-purple-800',
  capa_implementation: 'bg-red-100 border-red-300 text-red-800'
};

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
  selected,
  isConnectable = true,
  onNodeClick,
  onNodeDelete,
  onNodeCopy,
  onNodeConfigure
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const nodeType = data.type || 'form';
  const IconComponent = iconMap[nodeType as keyof typeof iconMap] || FileText;
  const colorClass = nodeColors[nodeType as keyof typeof nodeColors] || 'bg-gray-100 border-gray-300 text-gray-800';

  const handleNodeClick = useCallback(() => {
    onNodeClick?.(id);
  }, [id, onNodeClick]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }, [showMenu]);

  const handleMenuAction = useCallback((action: string) => {
    setShowMenu(false);
    switch (action) {
      case 'configure':
        onNodeConfigure?.(id);
        break;
      case 'copy':
        onNodeCopy?.(id);
        break;
      case 'delete':
        onNodeDelete?.(id);
        break;
    }
  }, [id, onNodeConfigure, onNodeCopy, onNodeDelete]);

  // Click outside to close menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const showTopHandle = nodeType !== 'start';
  const showBottomHandle = nodeType !== 'end';
  const showMultipleOutputs = nodeType === 'decision' || nodeType === 'parallel_gateway';

  return (
    <div
      className={`
        relative min-w-[200px] max-w-[280px] rounded-lg border-2 shadow-lg cursor-pointer
        transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02]
        ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
        ${colorClass}
      `}
      onClick={handleNodeClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handle */}
      {showTopHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 border-2 border-white bg-gray-600"
          isConnectable={isConnectable}
        />
      )}

      {/* Node Header */}
      <div className="flex items-center justify-between p-3 border-b border-current/20">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 rounded-md bg-white/20">
            <IconComponent className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm truncate">{data.label}</h3>
        </div>
        
        {/* Node Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className={`
              p-1 rounded hover:bg-white/20 transition-opacity duration-200
              ${isHovered || showMenu ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
              <button
                onClick={() => handleMenuAction('configure')}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Settings className="w-3 h-3" />
                Configure
              </button>
              <button
                onClick={() => handleMenuAction('copy')}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Duplicate
              </button>
              <hr className="border-gray-200" />
              <button
                onClick={() => handleMenuAction('delete')}
                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3">
        {data.description && (
          <p className="text-xs opacity-80 mb-2 line-clamp-2">{data.description}</p>
        )}
        
        {/* Node Badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {data.gxpCritical && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              <Shield className="w-3 h-3 mr-1" />
              GxP
            </span>
          )}
          {data.pharmaceuticalType && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {data.pharmaceuticalType.replace('_', ' ')}
            </span>
          )}
          {data.estimatedDuration && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              <Clock className="w-3 h-3 mr-1" />
              {data.estimatedDuration}m
            </span>
          )}
        </div>

        {/* Compliance Requirements */}
        {data.complianceRequirements && data.complianceRequirements.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-1 text-xs opacity-80">
              <Shield className="w-3 h-3" />
              <span>{data.complianceRequirements.length} compliance req.</span>
            </div>
          </div>
        )}
      </div>

      {/* Output Handles */}
      {showBottomHandle && (
        <>
          {showMultipleOutputs ? (
            <>
              <Handle
                type="source"
                position={Position.Bottom}
                id="yes"
                className="w-3 h-3 border-2 border-white bg-green-600"
                style={{ left: '25%' }}
                isConnectable={isConnectable}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="no"
                className="w-3 h-3 border-2 border-white bg-red-600"
                style={{ left: '75%' }}
                isConnectable={isConnectable}
              />
            </>
          ) : (
            <Handle
              type="source"
              position={Position.Bottom}
              className="w-3 h-3 border-2 border-white bg-gray-600"
              isConnectable={isConnectable}
            />
          )}
        </>
      )}
    </div>
  );
};