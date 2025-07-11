import React, { useState } from 'react';
import { WorkflowTemplate } from '../../types/workflow';
import {
  FileText,
  GitBranch,
  Shuffle,
  RotateCcw,
  Play,
  Eye,
  Download,
  Search,
  Filter,
  Clock,
  Users,
  Shield,
  X
} from 'lucide-react';

// Mock workflow templates
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'template-batch-release',
    name: 'Batch Release Workflow',
    description: 'Standard pharmaceutical batch release process with QC testing and approval',
    category: 'quality_control',
    nodes: [],
    connections: [],
    version: '1.0',
    createdBy: 'System',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    complianceLevel: 'cfr_part_11'
  },
  {
    id: 'template-change-control',
    name: 'Change Control Process',
    description: 'Manufacturing change control workflow with impact assessment',
    category: 'document_control',
    nodes: [],
    connections: [],
    version: '1.0',
    createdBy: 'System',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    complianceLevel: 'gmp'
  },
  {
    id: 'template-deviation',
    name: 'Deviation Investigation',
    description: 'Quality deviation investigation and CAPA workflow',
    category: 'quality_control',
    nodes: [],
    connections: [],
    version: '1.0',
    createdBy: 'System',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    complianceLevel: 'gmp'
  }
];

const categoryColors = {
  quality_control: 'bg-blue-100 text-blue-800',
  document_control: 'bg-green-100 text-green-800',
  risk_assessment: 'bg-orange-100 text-orange-800',
  equipment_management: 'bg-purple-100 text-purple-800',
  training: 'bg-yellow-100 text-yellow-800',
  audit: 'bg-red-100 text-red-800',
  general: 'bg-gray-100 text-gray-800'
};

const complianceColors = {
  basic: 'bg-gray-100 text-gray-800',
  gmp: 'bg-yellow-100 text-yellow-800',
  cfr_part_11: 'bg-red-100 text-red-800',
  gamp_5: 'bg-purple-100 text-purple-800',
  iso_13485: 'bg-blue-100 text-blue-800'
};

interface TemplateLibraryProps {
  onTemplateSelect: (template: WorkflowTemplate) => void;
  onTemplatePreview: (template: WorkflowTemplate) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onTemplateSelect,
  onTemplatePreview,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredTemplates = workflowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Workflow Templates</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose from pre-built pharmaceutical workflow templates
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
            >
              <option value="all">All Categories</option>
              <option value="quality_control">Quality Control</option>
              <option value="document_control">Document Control</option>
              <option value="risk_assessment">Risk Assessment</option>
              <option value="equipment_management">Equipment Management</option>
              <option value="training">Training</option>
              <option value="audit">Audit</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-background"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <FileText className="w-5 h-5 text-muted-foreground ml-2" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[template.category]}`}>
                    {template.category.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${complianceColors[template.complianceLevel]}`}>
                    {template.complianceLevel.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{template.createdBy}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>v{template.version}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onTemplatePreview(template)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      onTemplateSelect(template);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all categories
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};