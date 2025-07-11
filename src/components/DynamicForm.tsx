import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { GeneratedForm, FormField, WorkflowFormGenerator } from '@/lib/form-generator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface DynamicFormProps {
  form: GeneratedForm;
  formData: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
  onSubmit: (formData: Record<string, any>) => void;
  onSaveDraft?: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
  showSaveDraft?: boolean;
}

interface FileUpload {
  file: File;
  id: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  form,
  formData,
  onFieldChange,
  onSubmit,
  onSaveDraft,
  isSubmitting = false,
  showSaveDraft = true
}) => {
  const [fileUploads, setFileUploads] = useState<Record<string, FileUpload[]>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFieldChange = (fieldId: string, value: any) => {
    onFieldChange(fieldId, value);
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleFileUpload = (fieldId: string, files: FileList | null, field: FormField) => {
    if (!files) return;

    const newFiles: FileUpload[] = [];
    const allowedTypes = field.fileTypes || ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    
    Array.from(files).forEach((file, index) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (allowedTypes.includes(fileExtension || '')) {
        newFiles.push({
          file,
          id: `${fieldId}_${Date.now()}_${index}`
        });
      }
    });

    if (field.multiple) {
      setFileUploads(prev => ({
        ...prev,
        [fieldId]: [...(prev[fieldId] || []), ...newFiles]
      }));
    } else {
      setFileUploads(prev => ({
        ...prev,
        [fieldId]: newFiles.slice(0, 1)
      }));
    }

    // Update form data with file references
    const fileData = field.multiple ? newFiles : newFiles[0] || null;
    handleFieldChange(fieldId, fileData);
  };

  const removeFile = (fieldId: string, fileId: string) => {
    setFileUploads(prev => {
      const updated = {
        ...prev,
        [fieldId]: prev[fieldId]?.filter(f => f.id !== fileId) || []
      };
      
      // Update form data
      const field = form.sections.flatMap(s => s.fields).find(f => f.id === fieldId);
      const fileData = field?.multiple ? updated[fieldId] : updated[fieldId]?.[0] || null;
      handleFieldChange(fieldId, fileData);
      
      return updated;
    });
  };

  const renderField = (field: FormField, sectionId: string) => {
    const fieldId = field.id;
    const value = WorkflowFormGenerator.getFormFieldValue(formData, fieldId);

    const fieldLabel = (
      <Label htmlFor={fieldId} className="flex items-center gap-2">
        {field.label}
        {field.required && <span className="text-destructive">*</span>}
      </Label>
    );

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={fieldId} className="space-y-2">
            {fieldLabel}
            <Input
              id={fieldId}
              type={field.type}
              value={value || ''}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldId} className="space-y-2">
            {fieldLabel}
            <Textarea
              id={fieldId}
              value={value || ''}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="min-h-[100px]"
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={fieldId} className="space-y-2">
            {fieldLabel}
            <Select
              value={value || ''}
              onValueChange={(newValue) => handleFieldChange(fieldId, newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={fieldId} className="space-y-2">
            {fieldLabel}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP") : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => handleFieldChange(fieldId, date?.toISOString())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldId} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={fieldId}
                checked={value || false}
                onCheckedChange={(checked) => handleFieldChange(fieldId, checked)}
              />
              <Label htmlFor={fieldId}>{field.label}</Label>
              {field.required && <span className="text-destructive">*</span>}
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'file':
        const fieldFiles = fileUploads[fieldId] || [];
        return (
          <div key={fieldId} className="space-y-2">
            {fieldLabel}
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor={fieldId}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {field.fileTypes ? field.fileTypes.join(', ').toUpperCase() : 'PDF, DOC, DOCX, JPG, PNG'}
                    </p>
                  </div>
                  <input
                    id={fieldId}
                    type="file"
                    className="hidden"
                    multiple={field.multiple}
                    accept={field.fileTypes?.map(type => `.${type}`).join(',')}
                    onChange={(e) => handleFileUpload(fieldId, e.target.files, field)}
                  />
                </label>
              </div>
              
              {fieldFiles.length > 0 && (
                <div className="space-y-2">
                  {fieldFiles.map((fileUpload) => (
                    <div
                      key={fileUpload.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">{fileUpload.file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(fieldId, fileUpload.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = WorkflowFormGenerator.validateGeneratedForm(form, formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSubmit(formData);
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  return (
    <Card className="border-border/50 shadow-elegant">
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        {form.description && (
          <p className="text-muted-foreground">{form.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {form.sections.map((section) => (
            <Card key={section.id} className="border-border/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                {section.description && (
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => renderField(field, section.id))}
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {showSaveDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex-1"
              >
                Save as Draft
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};