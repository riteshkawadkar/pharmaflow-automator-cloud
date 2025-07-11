import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { FileText, Pill, Cog, Microscope, CheckCircle, AlertTriangle, GitBranch, RotateCcw } from "lucide-react";
import { 
  drugApprovalWorkflowTemplate, 
  manufacturingChangeWorkflowTemplate,
  simpleDocumentApprovalTemplate,
  conditionalQualityControlTemplate,
  complexSupplierQualificationTemplate,
  loopBasedValidationTemplate
} from "@/data/sampleWorkflowTemplate";

interface TemplateSelectorProps {
  onLoadTemplate: (template: any) => void;
}

export const TemplateSelector = ({ onLoadTemplate }: TemplateSelectorProps) => {
  const templates = [
    {
      name: "Simple Document Approval",
      description: "Basic linear workflow with sequential steps",
      icon: CheckCircle,
      template: simpleDocumentApprovalTemplate,
      category: "Simple"
    },
    {
      name: "Quality Control with Conditions",
      description: "Conditional workflow with decision branches",
      icon: AlertTriangle,
      template: conditionalQualityControlTemplate,
      category: "Conditional"
    },
    {
      name: "Complex Supplier Qualification",
      description: "Multi-stage workflow with parallel processing",
      icon: GitBranch,
      template: complexSupplierQualificationTemplate,
      category: "Complex"
    },
    {
      name: "Validation with Iterations",
      description: "Loop-based workflow with feedback cycles",
      icon: RotateCcw,
      template: loopBasedValidationTemplate,
      category: "Loop-based"
    },
    {
      name: "Drug Approval Workflow",
      description: "Complete FDA drug approval process",
      icon: Pill,
      template: drugApprovalWorkflowTemplate,
      category: "Complex"
    },
    {
      name: "Manufacturing Change Control",
      description: "Manufacturing process change workflow",
      icon: Cog,
      template: manufacturingChangeWorkflowTemplate,
      category: "Conditional"
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-1" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {templates.map((template, index) => {
          const IconComponent = template.icon;
          return (
            <DropdownMenuItem
              key={index}
              className="flex items-start gap-3 p-3 cursor-pointer"
              onClick={() => onLoadTemplate(template.template)}
            >
              <IconComponent className="w-4 h-4 mt-0.5 text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">{template.name}</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                    {template.category}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {template.description}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-center text-xs text-muted-foreground p-2">
          Templates demonstrate various workflow patterns:<br />
          Simple → Conditional → Complex → Loop-based
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};