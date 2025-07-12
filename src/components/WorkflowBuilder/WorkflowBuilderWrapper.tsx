import React from 'react';
import { WorkflowBuilder } from '../../pages/WorkflowBuilder';

interface WorkflowBuilderWrapperProps {
  workflowDefinition?: any;
  onBack: () => void;
}

export const WorkflowBuilderWrapper: React.FC<WorkflowBuilderWrapperProps> = ({
  workflowDefinition,
  onBack
}) => {
  return <WorkflowBuilder />;
};