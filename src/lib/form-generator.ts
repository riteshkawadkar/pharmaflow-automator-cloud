import { WorkflowDefinition } from '@/types/workflow-builder';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'email' | 'file' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  description?: string;
  fileTypes?: string[];
  multiple?: boolean;
}

export interface GeneratedFormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  stepType: string;
}

export interface GeneratedForm {
  title: string;
  description?: string;
  sections: GeneratedFormSection[];
}

export class WorkflowFormGenerator {
  static generateFormFromWorkflow(workflowDefinition: WorkflowDefinition): GeneratedForm {
    console.log('🚀 Generating form for workflow:', workflowDefinition.name);
    console.log('📋 Workflow nodes:', workflowDefinition.flow_data?.nodes?.length || 0);
    
    const form: GeneratedForm = {
      title: `${workflowDefinition.name} Request`,
      description: workflowDefinition.description,
      sections: []
    };

    // Extract form-generating nodes from the workflow
    const formNodes = workflowDefinition.flow_data.nodes.filter(node => 
      ['form_input', 'start'].includes(node.data?.stepType)
    );

    console.log('🔍 Found form nodes:', formNodes.length);
    
    formNodes.forEach((node, index) => {
      console.log(`📝 Processing node ${index + 1}:`, node.data?.label, 'Type:', node.data?.stepType);
      const section = this.generateSectionFromNode(node, index);
      if (section) {
        console.log('✅ Generated section:', section.title, 'with', section.fields.length, 'fields');
        form.sections.push(section);
      }
    });

    // If no form nodes found, create a basic section
    if (form.sections.length === 0) {
      form.sections.push({
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Please provide the required information for this request',
        fields: [
          {
            id: 'request_details',
            label: 'Request Details',
            type: 'textarea',
            required: true,
            placeholder: 'Describe your request in detail'
          }
        ],
        stepType: 'form_input'
      });
    }

    return form;
  }

  private static generateSectionFromNode(node: any, index: number): GeneratedFormSection | null {
    const { data } = node;
    const config = data?.configuration || {};

    // Skip start nodes without form fields
    if (data?.stepType === 'start' && !config.formFields?.length) {
      return null;
    }

    const section: GeneratedFormSection = {
      id: node.id,
      title: data?.label || `Section ${index + 1}`,
      description: data?.description,
      fields: [],
      stepType: data?.stepType || 'form_input'
    };

    // Generate fields from workflow configuration
    if (config.formFields && Array.isArray(config.formFields)) {
      section.fields = config.formFields.map(this.convertWorkflowFieldToFormField);
    }

    // Add file upload fields for document requirements
    if (config.requiredDocuments && Array.isArray(config.requiredDocuments)) {
      config.requiredDocuments.forEach((doc: any) => {
        section.fields.push({
          id: `document_${doc.id || doc.type}`,
          label: doc.label || doc.type,
          type: 'file',
          required: doc.required !== false,
          description: doc.description,
          fileTypes: doc.acceptedTypes || ['pdf', 'doc', 'docx']
        });
      });
    }

    // Add equipment selection fields
    if (config.equipmentSelection) {
      section.fields.push({
        id: 'equipment_selection',
        label: config.equipmentSelection.label || 'Equipment Selection',
        type: 'select',
        required: config.equipmentSelection.required !== false,
        options: config.equipmentSelection.options || [],
        multiple: config.equipmentSelection.multiple || false
      });
    }

    // Add approval assignment fields (for transparency)
    if (config.approvers && Array.isArray(config.approvers)) {
      section.fields.push({
        id: 'assigned_approvers',
        label: 'Assigned Approvers',
        type: 'text',
        required: false,
        placeholder: config.approvers.join(', '),
        description: 'This request will be routed to these approvers'
      });
    }

    return section;
  }

  private static convertWorkflowFieldToFormField(workflowField: any): FormField {
    const formField: FormField = {
      id: workflowField.id,
      label: workflowField.label,
      type: workflowField.type || 'text',
      required: workflowField.required !== false,
      placeholder: workflowField.placeholder,
      description: workflowField.description
    };

    // Handle select field options
    if (workflowField.options && Array.isArray(workflowField.options)) {
      if (typeof workflowField.options[0] === 'string') {
        // Convert string array to option objects
        formField.options = workflowField.options.map((option: string) => ({
          value: option.toLowerCase().replace(/\s+/g, '_'),
          label: option
        }));
      } else {
        // Already in correct format
        formField.options = workflowField.options;
      }
    }

    return formField;
  }

  static getFormFieldValue(formData: Record<string, any>, fieldId: string): any {
    return formData[fieldId] || '';
  }

  static setFormFieldValue(formData: Record<string, any>, fieldId: string, value: any): Record<string, any> {
    return {
      ...formData,
      [fieldId]: value
    };
  }

  static validateGeneratedForm(form: GeneratedForm, formData: Record<string, any>): string[] {
    const errors: string[] = [];

    form.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          const value = this.getFormFieldValue(formData, field.id);
          
          if (!value || (typeof value === 'string' && !value.trim())) {
            errors.push(`${field.label} is required`);
          }
          
          // Validate file uploads
          if (field.type === 'file' && (!value || (Array.isArray(value) && value.length === 0))) {
            errors.push(`${field.label} file is required`);
          }
        }
        
        // Type-specific validation
        if (field.type === 'email') {
          const value = this.getFormFieldValue(formData, field.id);
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${field.label} must be a valid email address`);
          }
        }
        
        if (field.type === 'number') {
          const value = this.getFormFieldValue(formData, field.id);
          if (value && isNaN(Number(value))) {
            errors.push(`${field.label} must be a valid number`);
          }
        }
      });
    });

    return errors;
  }
}