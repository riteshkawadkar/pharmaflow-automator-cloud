import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  Bell,
  FileCheck,
  Gavel,
  CheckCircle2,
  Cpu,
  TestTube,
  Beaker,
  Settings,
  Cog,
  Crown,
  Truck,
  FileSpreadsheet,
  AlertCircle,
  Wrench,
  GitMerge,
  Target
} from 'lucide-react';

export interface ComplianceRequirement {
  id: string;
  regulation: string;
  requirement: string;
  mandatory: boolean;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: 'process' | 'integration' | 'compliance' | 'pharmaceutical' | 'quality';
  icon: string;
  description: string;
  defaultProperties: Record<string, any>;
  complianceRequirements?: ComplianceRequirement[];
  pharmaceuticalType?: string;
  estimatedDuration?: number;
  gxpCritical?: boolean;
}

export type ComponentCategory = 'process' | 'integration' | 'compliance' | 'pharmaceutical' | 'quality';

const iconMap: Record<string, any> = {
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

const componentLibrary: ComponentLibraryItem[] = [
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
    estimatedDuration: 15,
    gxpCritical: true
  },
  {
    id: 'approval',
    name: 'Approval Node',
    category: 'process',
    icon: 'approval',
    description: 'Multi-stage approval with electronic signatures',
    defaultProperties: {
      label: 'Approval Required',
      approvers: [],
      approvalType: 'single',
      requiresSignature: true
    },
    pharmaceuticalType: 'batch_release',
    complianceRequirements: [
      {
        id: 'cfr-part-11-esig',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures must be linked to their electronic records',
        mandatory: true
      }
    ],
    estimatedDuration: 30,
    gxpCritical: true
  },
  {
    id: 'review',
    name: 'Review Process',
    category: 'process',
    icon: 'review',
    description: 'Document or data review checkpoint',
    defaultProperties: {
      label: 'Review Stage',
      reviewers: [],
      reviewCriteria: ''
    },
    pharmaceuticalType: 'document_control',
    estimatedDuration: 20
  },
  {
    id: 'decision',
    name: 'Decision Gateway',
    category: 'process',
    icon: 'decision',
    description: 'Conditional branching based on criteria',
    defaultProperties: {
      label: 'Decision Point',
      conditions: [],
      defaultPath: 'continue'
    },
    estimatedDuration: 5
  },

  // Integration Components
  {
    id: 'api_connector',
    name: 'API Connector',
    category: 'integration',
    icon: 'api_connector',
    description: 'Connect to external APIs and web services',
    defaultProperties: {
      label: 'API Integration',
      endpoint: '',
      method: 'GET',
      headers: {},
      authentication: 'none'
    },
    estimatedDuration: 10
  },
  {
    id: 'database_query',
    name: 'Database Query',
    category: 'integration',
    icon: 'database_query',
    description: 'Execute database queries and data operations',
    defaultProperties: {
      label: 'Database Operation',
      query: '',
      database: '',
      operation: 'select'
    },
    complianceRequirements: [
      {
        id: 'data-integrity',
        regulation: 'Data Integrity Guidance',
        requirement: 'Ensure data completeness, consistency and accuracy',
        mandatory: true
      }
    ],
    estimatedDuration: 8,
    gxpCritical: true
  },
  {
    id: 'external_system',
    name: 'External System',
    category: 'integration',
    icon: 'external_system',
    description: 'Integration with external pharmaceutical systems',
    defaultProperties: {
      label: 'System Integration',
      systemType: '',
      connectionString: '',
      dataMapping: {}
    },
    pharmaceuticalType: 'system_integration',
    estimatedDuration: 15
  },

  // Pharmaceutical Specific Components
  {
    id: 'batch_record',
    name: 'Batch Record',
    category: 'pharmaceutical',
    icon: 'batch_record',
    description: 'Manufacturing batch documentation and tracking',
    defaultProperties: {
      label: 'Batch Record Creation',
      batchNumber: '',
      productCode: '',
      manufacturingSteps: []
    },
    pharmaceuticalType: 'manufacturing',
    complianceRequirements: [
      {
        id: 'gmp-batch-records',
        regulation: 'GMP Guidelines',
        requirement: 'Batch records must be complete and accurate',
        mandatory: true
      }
    ],
    estimatedDuration: 45,
    gxpCritical: true
  },
  {
    id: 'quality_check',
    name: 'Quality Control',
    category: 'pharmaceutical',
    icon: 'quality_check',
    description: 'Quality control testing and verification',
    defaultProperties: {
      label: 'QC Testing',
      testParameters: [],
      acceptanceCriteria: '',
      testMethods: []
    },
    pharmaceuticalType: 'quality_control',
    complianceRequirements: [
      {
        id: 'ich-q7-qc',
        regulation: 'ICH Q7',
        requirement: 'Quality control testing must follow validated methods',
        mandatory: true
      }
    ],
    estimatedDuration: 60,
    gxpCritical: true
  },
  {
    id: 'regulatory_check',
    name: 'Regulatory Compliance',
    category: 'compliance',
    icon: 'regulatory_check',
    description: 'Regulatory compliance verification and validation',
    defaultProperties: {
      label: 'Regulatory Review',
      regulations: [],
      complianceChecklist: [],
      requiredDocuments: []
    },
    pharmaceuticalType: 'regulatory_affairs',
    complianceRequirements: [
      {
        id: 'regulatory-compliance',
        regulation: 'Various Regulatory Requirements',
        requirement: 'Must comply with applicable regulatory standards',
        mandatory: true
      }
    ],
    estimatedDuration: 90,
    gxpCritical: true
  },

  // Quality & Compliance
  {
    id: 'audit_logger',
    name: 'Audit Trail',
    category: 'compliance',
    icon: 'audit_logger',
    description: 'Comprehensive audit trail and logging',
    defaultProperties: {
      label: 'Audit Logging',
      logLevel: 'detailed',
      retentionPeriod: '7_years',
      encryptionEnabled: true
    },
    complianceRequirements: [
      {
        id: 'cfr-part-11-audit',
        regulation: '21 CFR Part 11',
        requirement: 'Audit trails must be secure and tamper-evident',
        mandatory: true
      }
    ],
    estimatedDuration: 2,
    gxpCritical: true
  },
  {
    id: 'electronic_signature',
    name: 'E-Signature',
    category: 'compliance',
    icon: 'electronic_signature',
    description: 'Electronic signature capture and validation',
    defaultProperties: {
      label: 'Electronic Signature',
      signatureType: 'advanced',
      biometricCapture: false,
      witnessRequired: false
    },
    complianceRequirements: [
      {
        id: 'cfr-part-11-esig-capture',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures must be unique to one individual',
        mandatory: true
      }
    ],
    estimatedDuration: 5,
    gxpCritical: true
  },
  {
    id: 'training_verification',
    name: 'Training Verification',
    category: 'compliance',
    icon: 'training_verification',
    description: 'Verify personnel training and competency',
    defaultProperties: {
      label: 'Training Check',
      requiredTraining: [],
      competencyLevel: 'basic',
      expirationCheck: true
    },
    pharmaceuticalType: 'training_management',
    complianceRequirements: [
      {
        id: 'gmp-training',
        regulation: 'GMP Guidelines',
        requirement: 'Personnel must be qualified and trained',
        mandatory: true
      }
    ],
    estimatedDuration: 10,
    gxpCritical: true
  },

  // Notification & Communication
  {
    id: 'email_notifier',
    name: 'Email Notification',
    category: 'integration',
    icon: 'email_notifier',
    description: 'Send email notifications to stakeholders',
    defaultProperties: {
      label: 'Email Alert',
      recipients: [],
      subject: '',
      template: '',
      priority: 'normal'
    },
    estimatedDuration: 3
  },
  {
    id: 'sms_alert',
    name: 'SMS Alert',
    category: 'integration',
    icon: 'sms_alert',
    description: 'Send SMS alerts for critical events',
    defaultProperties: {
      label: 'SMS Notification',
      phoneNumbers: [],
      message: '',
      urgencyLevel: 'normal'
    },
    estimatedDuration: 2
  },

  // Reporting & Analytics
  {
    id: 'report_generator',
    name: 'Report Generator',
    category: 'integration',
    icon: 'report_generator',
    description: 'Generate automated reports and documentation',
    defaultProperties: {
      label: 'Report Creation',
      reportType: 'summary',
      format: 'pdf',
      schedule: 'manual'
    },
    pharmaceuticalType: 'reporting',
    complianceRequirements: [
      {
        id: 'gmp-documentation',
        regulation: 'GMP Guidelines',
        requirement: 'Documentation must be complete and contemporaneous',
        mandatory: true
      }
    ],
    estimatedDuration: 25,
    gxpCritical: true
  },
  {
    id: 'dashboard_update',
    name: 'Dashboard Update',
    category: 'integration',
    icon: 'dashboard_update',
    description: 'Update dashboards and real-time displays',
    defaultProperties: {
      label: 'Dashboard Sync',
      dashboardId: '',
      updateFrequency: 'real-time',
      dataPoints: []
    },
    estimatedDuration: 5
  }
];

interface ComponentLibraryProps {
  onDragStart: (event: React.DragEvent, componentId: string) => void;
}

export const ComponentLibrary = ({ onDragStart }: ComponentLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');

  const categories: Array<{ id: ComponentCategory | 'all'; name: string; count: number }> = [
    { id: 'all', name: 'All Components', count: componentLibrary.length },
    { id: 'process', name: 'Process', count: componentLibrary.filter(c => c.category === 'process').length },
    { id: 'pharmaceutical', name: 'Pharmaceutical', count: componentLibrary.filter(c => c.category === 'pharmaceutical').length },
    { id: 'compliance', name: 'Compliance', count: componentLibrary.filter(c => c.category === 'compliance').length },
    { id: 'integration', name: 'Integration', count: componentLibrary.filter(c => c.category === 'integration').length },
    { id: 'quality', name: 'Quality', count: componentLibrary.filter(c => c.category === 'quality').length }
  ];

  const filteredComponents = componentLibrary.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: ComponentCategory) => {
    const colors = {
      process: 'bg-blue-100 text-blue-800',
      pharmaceutical: 'bg-green-100 text-green-800',
      compliance: 'bg-purple-100 text-purple-800',
      integration: 'bg-orange-100 text-orange-800',
      quality: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-80 h-fit max-h-[600px] overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Component Library</CardTitle>
        <CardDescription>
          Drag and drop pharmaceutical workflow components
        </CardDescription>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ComponentCategory | 'all')} className="mb-4">
          <TabsList className="grid grid-cols-2 gap-1 h-auto p-1">
            {categories.slice(0, 4).map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Components Grid */}
        <div className="space-y-2">
          {filteredComponents.map((component) => {
            const IconComponent = iconMap[component.icon] || FileText;
            return (
              <Button
                key={component.id}
                variant="outline"
                className="w-full justify-start h-auto p-3 cursor-grab active:cursor-grabbing hover:bg-muted/50 border border-gray-200"
                draggable
                onDragStart={(event) => onDragStart(event, component.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{component.name}</span>
                      {component.gxpCritical && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          GxP
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {component.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(component.category)}`}>
                        {component.category}
                      </Badge>
                      {component.estimatedDuration && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {component.estimatedDuration}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No components found</p>
            <p className="text-xs">Try adjusting your search or category filter</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Export the component library data for use in other components
export { componentLibrary, iconMap };