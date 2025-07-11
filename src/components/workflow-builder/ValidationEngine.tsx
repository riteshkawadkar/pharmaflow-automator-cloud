import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Shield } from 'lucide-react';

export interface ValidationError {
  id: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  id: string;
  message: string;
  severity: 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface WorkflowValidationNode {
  id: string;
  type: string;
  data: {
    label: string;
    description?: string;
    [key: string]: any;
  };
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
}

interface ValidationEngineProps {
  nodes: WorkflowValidationNode[];
  connections: WorkflowConnection[];
  onValidationUpdate: (nodeId: string, validation: ValidationResult) => void;
}

export const ValidationEngine: React.FC<ValidationEngineProps> = ({
  nodes,
  connections,
  onValidationUpdate
}) => {
  const [validationResults, setValidationResults] = React.useState<Record<string, ValidationResult>>({});

  // Real-time validation
  React.useEffect(() => {
    const validateWorkflow = () => {
      const results: Record<string, ValidationResult> = {};

      nodes.forEach(node => {
        const validation = validateNode(node, nodes, connections);
        results[node.id] = validation;
        onValidationUpdate(node.id, validation);
      });

      setValidationResults(results);
    };

    validateWorkflow();
  }, [nodes, connections, onValidationUpdate]);

  const validateNode = (node: WorkflowValidationNode, allNodes: WorkflowValidationNode[], allConnections: WorkflowConnection[]): ValidationResult => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic node validation
    if (!node.data.label || node.data.label.trim() === '') {
      errors.push({
        id: `${node.id}-no-label`,
        message: 'Node must have a label',
        severity: 'error'
      });
    }

    // Connection validation
    const incomingConnections = allConnections.filter(conn => conn.targetNodeId === node.id);
    const outgoingConnections = allConnections.filter(conn => conn.sourceNodeId === node.id);

    // Start nodes should have no incoming connections
    if (node.type === 'start' && incomingConnections.length > 0) {
      errors.push({
        id: `${node.id}-start-incoming`,
        message: 'Start nodes cannot have incoming connections',
        severity: 'error'
      });
    }

    // End nodes should have no outgoing connections
    if (node.type === 'end' && outgoingConnections.length > 0) {
      errors.push({
        id: `${node.id}-end-outgoing`,
        message: 'End nodes cannot have outgoing connections',
        severity: 'error'
      });
    }

    // Form nodes should have at least one outgoing connection
    if (node.type === 'form' && outgoingConnections.length === 0) {
      warnings.push({
        id: `${node.id}-form-no-output`,
        message: 'Form nodes should have at least one outgoing connection',
        severity: 'warning'
      });
    }

    // Approval nodes validation
    if (node.type === 'approval') {
      if (!node.data.approvers || node.data.approvers.length === 0) {
        warnings.push({
          id: `${node.id}-approval-no-approvers`,
          message: 'Approval nodes should have designated approvers',
          severity: 'warning'
        });
      }
    }

    // Pharmaceutical compliance checks
    if (node.data.pharmaceuticalType === 'batch_release') {
      if (!node.data.complianceRequirements || node.data.complianceRequirements.length === 0) {
        warnings.push({
          id: `${node.id}-no-compliance`,
          message: 'Batch release workflows should have compliance requirements',
          severity: 'warning'
        });
      }
    }

    // GxP critical validation
    if (node.data.gxpCritical && !node.data.auditTrail) {
      errors.push({
        id: `${node.id}-gxp-no-audit`,
        message: 'GxP critical nodes must have audit trail enabled',
        severity: 'error'
      });
    }

    // Check for isolated nodes (except start and end)
    if (node.type !== 'start' && node.type !== 'end' && 
        incomingConnections.length === 0 && outgoingConnections.length === 0) {
      warnings.push({
        id: `${node.id}-isolated`,
        message: 'Node is not connected to the workflow',
        severity: 'warning'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const getOverallValidation = (): ValidationResult => {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    Object.values(validationResults).forEach(result => {
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    });

    // Workflow-level validations
    const startNodes = nodes.filter(node => node.type === 'start');
    const endNodes = nodes.filter(node => node.type === 'end');

    if (startNodes.length === 0) {
      allErrors.push({
        id: 'workflow-no-start',
        message: 'Workflow must have at least one start node',
        severity: 'error'
      });
    }

    if (startNodes.length > 1) {
      allWarnings.push({
        id: 'workflow-multiple-start',
        message: 'Workflow has multiple start nodes',
        severity: 'warning'
      });
    }

    if (endNodes.length === 0) {
      allWarnings.push({
        id: 'workflow-no-end',
        message: 'Workflow should have at least one end node',
        severity: 'warning'
      });
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  };

  const renderValidationSummary = () => {
    const overall = getOverallValidation();
    
    return (
      <div className="p-4 border rounded-lg bg-white">
        <div className="flex items-center gap-2 mb-3">
          {overall.isValid ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <h3 className="font-semibold">
            Workflow Validation {overall.isValid ? 'Passed' : 'Failed'}
          </h3>
        </div>

        {overall.errors.length > 0 && (
          <div className="mb-3">
            <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Errors ({overall.errors.length})
            </h4>
            <ul className="space-y-1">
              {overall.errors.map((error) => (
                <li key={error.id} className="text-sm text-red-600 pl-6">
                  • {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {overall.warnings.length > 0 && (
          <div>
            <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Warnings ({overall.warnings.length})
            </h4>
            <ul className="space-y-1">
              {overall.warnings.map((warning) => (
                <li key={warning.id} className="text-sm text-yellow-600 pl-6">
                  • {warning.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {overall.isValid && overall.warnings.length === 0 && (
          <p className="text-sm text-green-600">
            All validation checks passed successfully!
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderValidationSummary()}
    </div>
  );
};