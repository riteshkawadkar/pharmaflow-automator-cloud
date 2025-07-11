import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { File, Pill, Cog, Microscope } from "lucide-react";
import { drugApprovalWorkflowTemplate, manufacturingChangeWorkflowTemplate } from "@/data/sampleWorkflowTemplate";

interface TemplateSelectorProps {
  onLoadTemplate: (template: any) => void;
}

export const TemplateSelector = ({ onLoadTemplate }: TemplateSelectorProps) => {
  const templates = [
    {
      name: "Drug Approval Workflow",
      description: "Complete FDA drug approval process",
      icon: Pill,
      template: drugApprovalWorkflowTemplate
    },
    {
      name: "Manufacturing Change Control",
      description: "Manufacturing process change workflow",
      icon: Cog,
      template: manufacturingChangeWorkflowTemplate
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <File className="w-4 h-4 mr-1" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
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
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {template.description}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-center text-xs text-muted-foreground">
          More templates coming soon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};