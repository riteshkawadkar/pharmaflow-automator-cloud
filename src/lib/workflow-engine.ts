import { supabase } from '@/integrations/supabase/client';

export class WorkflowEngine {
  static async executeWorkflowStep(requestId: string, nodeId: string, workflowDefinitionId?: string) {
    try {
      // Get request data
      const { data: request } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) {
        throw new Error('Request not found');
      }

      // Get workflow definition
      let workflowDef;
      if (workflowDefinitionId) {
        const { data } = await supabase
          .from('workflow_definitions')
          .select('*')
          .eq('id', workflowDefinitionId)
          .single();
        workflowDef = data;
      } else {
        const { data } = await supabase
          .from('workflow_definitions')
          .select('*')
          .eq('workflow_type', request.workflow_type)
          .eq('status', 'active')
          .single();
        workflowDef = data;
      }

      if (!workflowDef) {
        throw new Error('Workflow definition not found');
      }

      // Find the specific node in the workflow
      const flowData = workflowDef.flow_data as any;
      const node = flowData.nodes.find((n: any) => n.id === nodeId);
      
      if (!node) {
        throw new Error(`Node ${nodeId} not found in workflow`);
      }

      console.log('Executing workflow step:', {
        requestId,
        nodeId,
        stepType: node.data.stepType,
        label: node.data.label
      });

      // Handle different node types
      switch (node.data.stepType) {
        case 'notification':
          await this.handleNotificationNode(requestId, node, request);
          break;
        
        case 'approval':
          await this.handleApprovalNode(requestId, node, request);
          break;
        
        case 'review':
          await this.handleReviewNode(requestId, node, request);
          break;
        
        case 'decision':
          await this.handleDecisionNode(requestId, node, request);
          break;
        
        case 'form_input':
          await this.handleFormInputNode(requestId, node, request);
          break;
        
        default:
          console.log(`Node type ${node.data.stepType} requires no automatic action`);
      }

      // Update workflow execution tracking
      await this.updateWorkflowExecution(requestId, nodeId, workflowDef.id, 'completed');

    } catch (error: any) {
      console.error('Error executing workflow step:', error);
      if (workflowDefinitionId) {
        await this.updateWorkflowExecution(requestId, nodeId, workflowDefinitionId, 'error', error.message);
      }
      throw error;
    }
  }

  static async handleNotificationNode(requestId: string, node: any, request: any) {
    console.log('Handling notification node:', node.data.label);
    
    if (!node.data.configuration || !node.data.configuration.recipients) {
      console.warn('No notification configuration found for node:', node.id);
      return;
    }

    // Use the actual Supabase project URL and anon key
    const supabaseUrl = 'https://zdlicluuurjmyyfjrben.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkbGljbHV1dXJqbXl5ZmpyYmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjQyMTksImV4cCI6MjA2NzgwMDIxOX0.g1flpp-Soaf1X3Ggy5cDj4YePPKTdAlom3KX_k4QRKk';

    // Call the edge function to send email
    const response = await fetch(`${supabaseUrl}/functions/v1/send-workflow-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        requestId,
        nodeId: node.id,
        nodeData: node.data,
        requestData: request
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send notification: ${error}`);
    }

    const result = await response.json();
    console.log('Notification sent successfully:', result);
  }

  static async handleApprovalNode(requestId: string, node: any, request: any) {
    console.log('Handling approval node:', node.data.label);
    
    // Send notification to approvers
    if (node.data.configuration?.approvers) {
      const notificationNode = {
        id: `${node.id}-notification`,
        data: {
          ...node.data,
          stepType: 'notification',
          configuration: {
            recipients: node.data.configuration.approvers,
            ccRecipients: node.data.configuration.ccRecipients || [],
            subject: `ACTION REQUIRED: Approval needed for ${request.title}`,
            template: `Approval Required\\n\\nDear Approver,\\n\\nA request requires your approval:\\n\\nTitle: {{request_title}}\\nType: {{workflow_type}}\\nRequester: {{requester_name}}\\nSubmitted: {{submission_date}}\\n\\nDescription:\\n{{request_description}}\\n\\nInstructions: ${node.data.configuration.instructions || 'Please review and approve this request.'}\\n\\nTime Limit: ${node.data.configuration.timeLimit || 'Not specified'} hours\\n\\nPlease log in to the system to review and approve this request.\\n\\nThank you,\\nWorkflow System`,
            priority: 'high'
          }
        }
      };
      
      await this.handleNotificationNode(requestId, notificationNode, request);
    }

    // Update request status to under review
    await supabase
      .from('requests')
      .update({ status: 'under_review' })
      .eq('id', requestId);
  }

  static async handleReviewNode(requestId: string, node: any, request: any) {
    console.log('Handling review node:', node.data.label);
    
    // Send notification to reviewers
    if (node.data.configuration?.approvers) {
      const notificationNode = {
        id: `${node.id}-notification`,
        data: {
          ...node.data,
          stepType: 'notification',
          configuration: {
            recipients: node.data.configuration.approvers,
            ccRecipients: node.data.configuration.ccRecipients || [],
            subject: `REVIEW REQUIRED: ${request.title}`,
            template: `Review Assignment\\n\\nDear Reviewer,\\n\\nA document has been assigned for your review:\\n\\nTitle: {{request_title}}\\nType: {{workflow_type}}\\nRequester: {{requester_name}}\\nSubmitted: {{submission_date}}\\n\\nDescription:\\n{{request_description}}\\n\\nReview Instructions: ${node.data.configuration.instructions || 'Please conduct a thorough review.'}\\n\\nTime Limit: ${node.data.configuration.timeLimit || 'Not specified'} hours\\n\\nReview Criteria:\\n${node.data.configuration.reviewCriteria?.join('\\n') || 'Standard review criteria apply'}\\n\\nPlease complete your review within the specified timeframe.\\n\\nThank you,\\nWorkflow System`,
            priority: 'normal'
          }
        }
      };
      
      await this.handleNotificationNode(requestId, notificationNode, request);
    }

    // Update request status to under review
    await supabase
      .from('requests')
      .update({ status: 'under_review' })
      .eq('id', requestId);
  }

  static async handleDecisionNode(requestId: string, node: any, request: any) {
    console.log('Handling decision node:', node.data.label);
    
    // Decision nodes typically require manual intervention
    // For now, we'll just log the decision point
    console.log('Decision node reached - manual intervention required');
    
    // In a full implementation, this would:
    // 1. Evaluate conditions based on request data
    // 2. Automatically route to next step if conditions are met
    // 3. Send notifications to decision makers if manual review needed
  }

  static async handleFormInputNode(requestId: string, node: any, request: any) {
    console.log('Handling form input node:', node.data.label);
    
    // Form input nodes typically require user interaction
    // Update request status to indicate form input is needed
    await supabase
      .from('requests')
      .update({ status: 'draft' })
      .eq('id', requestId);
  }

  static async updateWorkflowExecution(requestId: string, nodeId: string, workflowDefinitionId: string, status: string, errorMessage?: string) {
    await supabase
      .from('workflow_executions')
      .upsert({
        request_id: requestId,
        workflow_definition_id: workflowDefinitionId,
        current_node_id: nodeId,
        execution_status: status,
        execution_data: errorMessage ? { error: errorMessage } : {},
        updated_at: new Date().toISOString()
      });
  }

  static async startWorkflowExecution(requestId: string) {
    console.log('Starting workflow execution for request:', requestId);
    
    try {
      // Get request data
      const { data: request } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) {
        throw new Error('Request not found');
      }

      // Get workflow definition
      const { data: workflowDef } = await supabase
        .from('workflow_definitions')
        .select('*')
        .eq('workflow_type', request.workflow_type)
        .eq('status', 'active')
        .single();

      if (!workflowDef) {
        throw new Error('Workflow definition not found');
      }

      const flowData = workflowDef.flow_data as any;
      const startNode = flowData.nodes.find((n: any) => n.data.stepType === 'start');
      
      if (!startNode) {
        throw new Error('No start node found in workflow');
      }

      // Create workflow execution record
      await supabase
        .from('workflow_executions')
        .insert({
          request_id: requestId,
          workflow_definition_id: workflowDef.id,
          current_node_id: startNode.id,
          execution_status: 'active'
        });

      // Execute the first step (usually form input)
      const nextNodes = this.getNextNodes(flowData, startNode.id);
      if (nextNodes.length > 0) {
        await this.executeWorkflowStep(requestId, nextNodes[0], workflowDef.id);
      }

      console.log('Workflow execution started successfully');
      
    } catch (error: any) {
      console.error('Error starting workflow execution:', error);
      throw error;
    }
  }

  static getNextNodes(flowData: any, currentNodeId: string): string[] {
    const edges = flowData.edges.filter((edge: any) => edge.source === currentNodeId);
    return edges.map((edge: any) => edge.target);
  }
}