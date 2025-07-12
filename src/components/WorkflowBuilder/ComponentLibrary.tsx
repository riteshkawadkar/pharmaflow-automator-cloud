import React, { useState } from 'react';
import { ComponentLibraryItem, ComponentCategory } from '../../types/workflow';

export type { ComponentLibraryItem };
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
  Search,
  Filter
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
  compliance_checker: AlertTriangle
};

export const componentLibrary: ComponentLibraryItem[] = [
  // Process Nodes
  {
    id: 'start',
    name: 'Start',
    category: 'process',
    icon: 'start',
    description: 'Workflow entry point',
    defaultProperties: { label: 'Start' },
    complianceRequirements: []
  },
  {
    id: 'end',
    name: 'End',
    category: 'process',
    icon: 'end',
    description: 'Workflow completion point',
    defaultProperties: { label: 'End' },
    complianceRequirements: []
  },
  {
    id: 'form',
    name: 'Form Builder',
    category: 'process',
    icon: 'form',
    description: 'Configurable data collection form',
    defaultProperties: {
      label: 'Data Collection Form',
      fields: [],
      validation: true
    },
    pharmaceuticalType: 'batch_release',
    complianceRequirements: [
      {
        id: 'cfr-part-11-form',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic records must be accurate and reliable',
        mandatory: true
      }
    ],
    estimatedDuration: 15
  },
  {
    id: 'approval',
    name: 'Approval Node',
    category: 'approvals',
    icon: 'approval',
    description: 'Single or multi-reviewer approval step',
    defaultProperties: {
      label: 'Approval Required',
      approvers: [],
      approvalType: 'single'
    },
    pharmaceuticalType: 'batch_release',
    complianceRequirements: [
      {
        id: 'cfr-part-11-approval',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures must be unique to one individual',
        mandatory: true
      }
    ],
    estimatedDuration: 24
  },
  {
    id: 'review',
    name: 'Review Node',
    category: 'process',
    icon: 'review',
    description: 'Document or data review step',
    defaultProperties: {
      label: 'Review Required',
      reviewers: [],
      reviewType: 'document'
    },
    pharmaceuticalType: 'document_control',
    complianceRequirements: [
      {
        id: 'gmp-review',
        regulation: 'GMP Guidelines',
        requirement: 'All documents must be reviewed by qualified personnel',
        mandatory: true
      }
    ],
    estimatedDuration: 60
  },
  {
    id: 'decision',
    name: 'Decision Gate',
    category: 'process',
    icon: 'decision',
    description: 'Conditional branching based on data',
    defaultProperties: {
      label: 'Decision Point',
      conditions: [],
      defaultPath: 'continue'
    },
    complianceRequirements: [],
    estimatedDuration: 0
  },
  {
    id: 'timer',
    name: 'Timer',
    category: 'utilities',
    icon: 'timer',
    description: 'Wait for specified duration',
    defaultProperties: {
      label: 'Wait',
      duration: 24,
      unit: 'hours'
    },
    complianceRequirements: [],
    estimatedDuration: 0
  },
  {
    id: 'api_connector',
    name: 'API Connector',
    category: 'integrations',
    icon: 'api_connector',
    description: 'Connect to external REST APIs',
    defaultProperties: {
      label: 'API Call',
      url: '',
      method: 'GET',
      headers: {}
    },
    complianceRequirements: [
      {
        id: 'data-security',
        regulation: 'Data Security Standards',
        requirement: 'API connections must use secure protocols',
        mandatory: true
      }
    ],
    estimatedDuration: 1
  },
  {
    id: 'database_query',
    name: 'Database Query',
    category: 'integrations',
    icon: 'database_query',
    description: 'Query database systems',
    defaultProperties: {
      label: 'Database Query',
      connection: '',
      query: ''
    },
    complianceRequirements: [
      {
        id: 'data-integrity',
        regulation: 'Data Integrity Guidelines',
        requirement: 'Database access must be logged and auditable',
        mandatory: true
      }
    ],
    estimatedDuration: 2
  },
  {
    id: 'external_system',
    name: 'External System',
    category: 'integrations',
    icon: 'external_system',
    description: 'Interface with external systems',
    defaultProperties: {
      label: 'External System Call',
      system: '',
      interface: 'api'
    },
    complianceRequirements: [
      {
        id: 'system-validation',
        regulation: 'CSV Guidelines',
        requirement: 'External system interfaces must be validated',
        mandatory: true
      }
    ],
    estimatedDuration: 5
  },
  {
    id: 'file_processor',
    name: 'File Processor',
    category: 'utilities',
    icon: 'file_processor',
    description: 'Process uploaded files',
    defaultProperties: {
      label: 'Process File',
      allowedTypes: ['pdf', 'doc', 'xls'],
      maxSize: 10
    },
    pharmaceuticalType: 'document_control',
    complianceRequirements: [
      {
        id: 'document-control',
        regulation: 'Document Control SOP',
        requirement: 'All documents must be version controlled',
        mandatory: true
      }
    ],
    estimatedDuration: 5
  },
  {
    id: 'email_notifier',
    name: 'Email Notification',
    category: 'notifications',
    icon: 'email_notifier',
    description: 'Send email notifications',
    defaultProperties: {
      label: 'Send Email',
      recipients: [],
      template: 'default'
    },
    complianceRequirements: [],
    estimatedDuration: 1
  },
  {
    id: 'sms_alert',
    name: 'SMS Alert',
    category: 'notifications',
    icon: 'sms_alert',
    description: 'Send SMS alerts for urgent notifications',
    defaultProperties: {
      label: 'Send SMS',
      recipients: [],
      message: ''
    },
    complianceRequirements: [],
    estimatedDuration: 1
  },
  {
    id: 'dashboard_update',
    name: 'Dashboard Update',
    category: 'analytics',
    icon: 'dashboard_update',
    description: 'Update dashboard metrics',
    defaultProperties: {
      label: 'Update Dashboard',
      metrics: [],
      dashboard: 'main'
    },
    complianceRequirements: [],
    estimatedDuration: 1
  },
  {
    id: 'report_generator',
    name: 'Report Generator',
    category: 'analytics',
    icon: 'report_generator',
    description: 'Generate reports and documents',
    defaultProperties: {
      label: 'Generate Report',
      template: '',
      format: 'pdf'
    },
    pharmaceuticalType: 'batch_release',
    complianceRequirements: [
      {
        id: 'report-integrity',
        regulation: 'GMP Guidelines',
        requirement: 'Reports must be accurate and complete',
        mandatory: true
      }
    ],
    estimatedDuration: 10
  },
  {
    id: 'electronic_signature',
    name: 'Electronic Signature',
    category: 'compliance',
    icon: 'electronic_signature',
    description: 'Capture electronic signatures',
    defaultProperties: {
      label: 'Electronic Signature',
      signers: [],
      reason: 'approval'
    },
    complianceRequirements: [
      {
        id: 'cfr-part-11-esig',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures must be legally binding',
        mandatory: true
      }
    ],
    estimatedDuration: 5
  },
  {
    id: 'audit_logger',
    name: 'Audit Logger',
    category: 'compliance',
    icon: 'audit_logger',
    description: 'Log audit trail events',
    defaultProperties: {
      label: 'Audit Log',
      events: [],
      retention: 'permanent'
    },
    complianceRequirements: [
      {
        id: 'audit-trail',
        regulation: 'GMP Guidelines',
        requirement: 'All critical operations must be logged',
        mandatory: true
      }
    ],
    estimatedDuration: 1
  },
  {
    id: 'training_verification',
    name: 'Training Verification',
    category: 'compliance',
    icon: 'training_verification',
    description: 'Verify user training status',
    defaultProperties: {
      label: 'Verify Training',
      courses: [],
      expiryCheck: true
    },
    pharmaceuticalType: 'training_management',
    complianceRequirements: [
      {
        id: 'training-current',
        regulation: 'GMP Training Requirements',
        requirement: 'Personnel must have current training',
        mandatory: true
      }
    ],
    estimatedDuration: 2
  },
  {
    id: 'compliance_checker',
    name: 'Compliance Checker',
    category: 'compliance',
    icon: 'compliance_checker',
    description: 'Validate compliance requirements',
    defaultProperties: {
      label: 'Compliance Check',
      regulations: [],
      strictMode: true
    },
    complianceRequirements: [
      {
        id: 'compliance-validation',
        regulation: 'Quality System',
        requirement: 'All processes must meet regulatory requirements',
        mandatory: true
      }
    ],
    estimatedDuration: 15
  }
];

interface ComponentLibraryProps {
  onDragStart: (event: React.DragEvent, componentId: string) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onDragStart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const categories: { value: ComponentCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Components' },
    { value: 'process', label: 'Process' },
    { value: 'forms', label: 'Forms' },
    { value: 'approvals', label: 'Approvals' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'utilities', label: 'Utilities' }
  ];

  const filteredComponents = componentLibrary.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedComponents = categories.reduce((acc, category) => {
    if (category.value === 'all') return acc;
    
    const categoryComponents = filteredComponents.filter(comp => comp.category === category.value);
    if (categoryComponents.length > 0) {
      acc[category.value] = categoryComponents;
    }
    return acc;
  }, {} as Record<ComponentCategory, ComponentLibraryItem[]>);

  const handleDragStart = (e: React.DragEvent, component: ComponentLibraryItem) => {
    e.dataTransfer.setData('application/reactflow', component.id);
    e.dataTransfer.effectAllowed = 'move';
    
    onDragStart(e, component.id);
  };

  const renderComponent = (component: ComponentLibraryItem) => {
    const Icon = iconMap[component.icon as keyof typeof iconMap] || FileText;
    
    return (
      <div
        key={component.id}
        draggable
        onDragStart={(e) => handleDragStart(e, component)}
        className="group flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 cursor-grab active:cursor-grabbing transition-all duration-200"
      >
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {component.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {component.description}
          </div>
          
          {component.estimatedDuration && (
            <div className="flex items-center mt-1">
              <Clock className="w-3 h-3 text-gray-400 mr-1" />
              <span className="text-xs text-gray-400">
                {component.estimatedDuration < 60 
                  ? `${component.estimatedDuration}m`
                  : `${Math.round(component.estimatedDuration / 60)}h`
                }
              </span>
            </div>
          )}
          
          {component.complianceRequirements.length > 0 && (
            <div className="flex items-center mt-1">
              <Shield className="w-3 h-3 text-orange-500 mr-1" />
              <span className="text-xs text-orange-600">
                {component.complianceRequirements.length} requirement{component.complianceRequirements.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
        
        {isExpanded && (
          <>
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ComponentCategory | 'all')}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Component List */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4">
          {selectedCategory === 'all' ? (
            // Show all components grouped by category
            <div className="space-y-6">
              {Object.entries(groupedComponents).map(([category, components]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                    {categories.find(c => c.value === category)?.label}
                  </h3>
                  <div className="space-y-2">
                    {components.map(renderComponent)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show components for selected category
            <div className="space-y-2">
              {filteredComponents.map(renderComponent)}
            </div>
          )}
          
          {filteredComponents.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">
                No components match your search
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};