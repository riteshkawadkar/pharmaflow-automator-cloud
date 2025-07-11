import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WorkflowNotificationRequest {
  requestId: string;
  nodeId: string;
  nodeData: {
    label: string;
    stepType: string;
    configuration: {
      recipients: string[];
      ccRecipients?: string[];
      template: string;
      subject: string;
      priority?: string;
    };
  };
  requestData: {
    title: string;
    description: string;
    workflow_type: string;
    requester_id: string;
    [key: string]: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId, nodeId, nodeData, requestData }: WorkflowNotificationRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get requester information
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('user_id', requestData.requester_id)
      .single();

    // Process template variables
    const templateVariables = {
      request_title: requestData.title,
      request_description: requestData.description,
      workflow_type: requestData.workflow_type,
      requester_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
      requester_email: profile?.email || 'unknown@company.com',
      request_id: requestId,
      current_date: new Date().toLocaleDateString(),
      current_time: new Date().toLocaleTimeString(),
      node_label: nodeData.label,
      step_type: nodeData.stepType,
      // Add more variables as needed
      document_title: requestData.title,
      document_type: requestData.workflow_type,
      department: requestData.department || 'Unknown',
      submission_date: new Date().toLocaleDateString(),
      reviewer_name: 'System Reviewer',
      review_date: new Date().toLocaleDateString(),
      approval_date: new Date().toLocaleDateString(),
      effective_date: new Date().toLocaleDateString(),
    };

    // Replace template variables in subject and content
    let processedSubject = nodeData.configuration.subject;
    let processedTemplate = nodeData.configuration.template;

    Object.entries(templateVariables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
      processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), value);
    });

    // Process recipients (replace template variables)
    const processedRecipients = nodeData.configuration.recipients.map(recipient => {
      let processedRecipient = recipient;
      Object.entries(templateVariables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        processedRecipient = processedRecipient.replace(new RegExp(placeholder, 'g'), value);
      });
      return processedRecipient;
    }).filter(email => email.includes('@') && !email.includes('{{'));

    // Process CC recipients if they exist
    const processedCcRecipients = nodeData.configuration.ccRecipients?.map(recipient => {
      let processedRecipient = recipient;
      Object.entries(templateVariables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        processedRecipient = processedRecipient.replace(new RegExp(placeholder, 'g'), value);
      });
      return processedRecipient;
    }).filter(email => email.includes('@') && !email.includes('{{')) || [];

    // Convert template newlines to HTML
    const htmlContent = processedTemplate.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');

    console.log('Sending email notification:', {
      requestId,
      nodeId,
      subject: processedSubject,
      recipients: processedRecipients,
      cc: processedCcRecipients
    });

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "Workflow System <workflow@company.com>",
      to: processedRecipients,
      cc: processedCcRecipients,
      subject: processedSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">${nodeData.label}</h2>
            <p style="color: #666; margin: 5px 0 0 0;">Workflow Notification</p>
          </div>
          <div style="padding: 20px; background-color: white; border: 1px solid #e9ecef; border-radius: 8px;">
            ${htmlContent}
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666;">
            <p><strong>Request Details:</strong></p>
            <p>Request ID: ${requestId}<br>
            Workflow Type: ${requestData.workflow_type}<br>
            Generated: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    // Log the notification in the database
    await supabase
      .from('workflow_notifications')
      .insert({
        request_id: requestId,
        node_id: nodeId,
        notification_type: nodeData.stepType,
        recipients: processedRecipients,
        subject: processedSubject,
        content: processedTemplate,
        status: 'sent',
        sent_at: new Date().toISOString(),
        email_provider_id: emailResponse.data?.id
      });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.data?.id,
      recipients: processedRecipients,
      subject: processedSubject
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-workflow-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);