import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Play, ArrowLeft, Download, Upload } from "lucide-react";
import { WorkflowType, WORKFLOW_CONFIGS } from "@/types/workflows";
import { TemplateSelector } from "./TemplateSelector";

interface WorkflowBuilderToolbarProps {
  workflowName: string;
  workflowDescription: string;
  workflowType: WorkflowType;
  workflowStatus: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onTypeChange: (type: WorkflowType) => void;
  onSave: () => void;
  onPublish: () => void;
  onBack: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadTemplate: (template: any) => void;
  isSaving?: boolean;
  isPublishing?: boolean;
}

export const WorkflowBuilderToolbar = ({
  workflowName,
  workflowDescription,
  workflowType,
  workflowStatus,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
  onSave,
  onPublish,
  onBack,
  onExport,
  onImport,
  onLoadTemplate,
  isSaving = false,
  isPublishing = false
}: WorkflowBuilderToolbarProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            Workflow Builder
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              workflowStatus === 'active' 
                ? 'bg-green-100 text-green-800' 
                : workflowStatus === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {workflowStatus}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workflow-type">Workflow Type</Label>
            <Select value={workflowType} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {WORKFLOW_CONFIGS.map((config) => (
                  <SelectItem key={config.type} value={config.type}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description</Label>
            <Input
              id="workflow-description"
              value={workflowDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Workflow description"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Actions</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={isSaving || !workflowName}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                onClick={onPublish}
                disabled={isPublishing || !workflowName || workflowStatus === 'active'}
              >
                <Play className="w-4 h-4 mr-1" />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="w-4 h-4 mr-1" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
              />
            </label>
          </Button>
          <TemplateSelector onLoadTemplate={onLoadTemplate} />
        </div>
      </CardContent>
    </Card>
  );
};