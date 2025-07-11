import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MousePointer2, 
  Play, 
  Settings, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Workflow
} from "lucide-react";

export const WorkflowBuilder = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pharma-gray mb-4">
            Visual Workflow Builder
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design complex pharmaceutical processes with our intuitive drag-and-drop interface. 
            No coding required - just drag, connect, and deploy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Workflow Canvas Mockup */}
          <div className="relative">
            <div className="bg-gradient-card rounded-lg shadow-large p-6 border">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MousePointer2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Select</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                  <Button size="sm" variant="hero">
                    Deploy
                  </Button>
                </div>
              </div>

              {/* Canvas with Sample Workflow */}
              <div className="relative bg-white rounded border-2 border-dashed border-border p-8 min-h-[400px]">
                {/* Start Node */}
                <div className="absolute top-4 left-4">
                  <div className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium shadow-soft">
                    Request Submitted
                  </div>
                </div>

                {/* Form Node */}
                <div className="absolute top-20 left-20">
                  <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-soft">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Equipment Form
                  </div>
                </div>

                {/* Approval Node */}
                <div className="absolute top-32 left-40">
                  <div className="bg-pharma-blue text-white px-4 py-2 rounded-lg text-sm font-medium shadow-soft">
                    <Users className="w-4 h-4 inline mr-2" />
                    Manager Approval
                  </div>
                </div>

                {/* Settings Node */}
                <div className="absolute top-20 right-20">
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-soft">
                    <Settings className="w-4 h-4 inline mr-2" />
                    System Update
                  </div>
                </div>

                {/* End Node */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-soft">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Complete
                  </div>
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                    </marker>
                  </defs>
                  <path d="M 80 40 Q 120 60 160 80" stroke="#cbd5e1" strokeWidth="2" 
                        fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M 200 100 Q 240 120 280 140" stroke="#cbd5e1" strokeWidth="2" 
                        fill="none" markerEnd="url(#arrowhead)" />
                  <path d="M 160 120 Q 200 160 280 180" stroke="#cbd5e1" strokeWidth="2" 
                        fill="none" markerEnd="url(#arrowhead)" />
                </svg>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pharma-gray mb-2">
                  Drag & Drop Interface
                </h3>
                <p className="text-muted-foreground">
                  Intuitive visual design with pharmaceutical-specific components. 
                  Build complex approval chains, routing logic, and integration points.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-accent rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pharma-gray mb-2">
                  Real-time Collaboration
                </h3>
                <p className="text-muted-foreground">
                  Multiple team members can edit workflows simultaneously. 
                  See changes instantly with conflict resolution and version control.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-orange-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pharma-gray mb-2">
                  Built-in Validation
                </h3>
                <p className="text-muted-foreground">
                  Automatic compliance checking and validation as you build. 
                  Ensure regulatory requirements are met before deployment.
                </p>
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full">
              Try the Workflow Builder
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};