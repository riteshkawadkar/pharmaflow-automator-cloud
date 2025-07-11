import React from 'react';
import { WorkflowNode, Connection, ValidationResult, ValidationError, ValidationWarning } from '../../types/workflow';
import { AlertTriangle, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface ValidationEngineProps {
  nodes: WorkflowNode[];
  connections: Connection[];
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

  const validateNode = (node: WorkflowNode, allNodes: WorkflowNode[], allConnections: Connection[]): ValidationResult => {
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

    // Non-start nodes should have at least one incoming connection
    if (node.type !== 'start' && incomingConnections.length === 0) {
      warnings.push({
        id: `${node.id}-no-incoming`,
        message: 'Node has no incoming connections',
        suggestion: 'Connect this node to a previous step'
      });
    }

    // Non-end nodes should have at least one outgoing connection
    if (node.type !== 'end' && outgoingConnections.length === 0) {
      warnings.push({
        id: `${node.id}-no-outgoing`,
        message: 'Node has no outgoing connections',
        suggestion: 'Connect this node to a next step'
      });
    }

    // Node-specific validation
    switch (node.type) {
      case 'form':
        if (!node.data.properties?.fields || node.data.properties.fields.length === 0) {
          warnings.push({
            id: `${node.id}-no-fields`,
            message: 'Form has no fields defined',
            suggestion: 'Add form fields in the properties panel'
          });
        }
        break;

      case 'approval':
        if (!node.data.properties?.approvers || node.data.properties.approvers.length === 0) {
          errors.push({
            id: `${node.id}-no-approvers`,
            message: 'Approval node must have at least one approver',
            severity: 'error'
          });
        }
        break;

      case 'decision':
        if (!node.data.properties?.conditions || node.data.properties.conditions.length === 0) {
          warnings.push({
            id: `${node.id}-no-conditions`,
            message: 'Decision node has no conditions defined',
            suggestion: 'Define decision conditions in the properties panel'
          });
        }
        break;
    }

    // Compliance validation
    if (node.data.complianceRequirements) {
      node.data.complianceRequirements.forEach(req => {
        if (req.mandatory) {
          warnings.push({
            id: `${node.id}-compliance-${req.id}`,
            message: `Compliance requirement: ${req.regulation}`,
            suggestion: req.requirement
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const getWorkflowValidationSummary = () => {
    const totalErrors = Object.values(validationResults).reduce((sum, result) => sum + result.errors.length, 0);
    const totalWarnings = Object.values(validationResults).reduce((sum, result) => sum + result.warnings.length, 0);
    const validNodes = Object.values(validationResults).filter(result => result.isValid).length;

    return {
      totalErrors,
      totalWarnings,
      validNodes,
      totalNodes: nodes.length
    };
  };

  const summary = getWorkflowValidationSummary();

  return (
    <div className="bg-white border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Validation</h3>
        <div className="flex items-center space-x-2">
          {summary.totalErrors > 0 && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-xs">{summary.totalErrors}</span>
            </div>
          )}
          {summary.totalWarnings > 0 && (
            <div className="flex items-center text-yellow-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">{summary.totalWarnings}</span>
            </div>
          )}
          {summary.totalErrors === 0 && summary.totalWarnings === 0 && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">Valid</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {summary.validNodes}/{summary.totalNodes} nodes valid
      </div>

      {summary.totalErrors > 0 && (
        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
          <div className="text-xs text-red-800 font-medium mb-1">Errors found:</div>
          {Object.entries(validationResults)
            .filter(([_, result]) => result.errors.length > 0)
            .slice(0, 3)
            .map(([nodeId, result]) => (
              <div key={nodeId} className="text-xs text-red-700">
                • {result.errors[0].message}
              </div>
            ))}
          {Object.values(validationResults).filter(r => r.errors.length > 0).length > 3 && (
            <div className="text-xs text-red-600">
              +{Object.values(validationResults).filter(r => r.errors.length > 0).length - 3} more...
            </div>
          )}
        </div>
      )}
    </div>
  );
};