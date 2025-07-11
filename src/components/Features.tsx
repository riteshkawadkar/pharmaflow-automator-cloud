import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Workflow, 
  Building2, 
  Shield, 
  Smartphone, 
  Database, 
  Users,
  FileCheck,
  Zap,
  Settings
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Workflow,
      title: "Visual Workflow Builder",
      description: "Drag-and-drop canvas for creating complex pharmaceutical processes without coding. Real-time collaboration and validation.",
      highlight: "No-Code Platform"
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Built-in 21 CFR Part 11, EU GMP Annex 11, and GAMP 5 compliance features. Electronic signatures and comprehensive audit trails.",
      highlight: "FDA Ready"
    },
    {
      icon: Database,
      title: "Master Data Integration",
      description: "Seamlessly connect with equipment masters, product databases, and organizational hierarchies for accurate workflow routing.",
      highlight: "Enterprise Ready"
    },
    {
      icon: Smartphone,
      title: "Mobile Applications",
      description: "Native iOS and Android apps with offline capability. Complete workflows on any device with biometric authentication.",
      highlight: "Mobile First"
    },
    {
      icon: Building2,
      title: "ERP & LIMS Integration",
      description: "Pre-built connectors for SAP, Oracle, major LIMS platforms. Real-time data synchronization and automated updates.",
      highlight: "Connected"
    },
    {
      icon: FileCheck,
      title: "Request Portal",
      description: "Self-service interface for workflow initiation. Dynamic forms, file attachments, and real-time status tracking.",
      highlight: "User Friendly"
    },
    {
      icon: Users,
      title: "Collaboration Tools",
      description: "Multi-user editing, approval workflows, and notification systems. Role-based permissions and organizational hierarchy support.",
      highlight: "Team Focused"
    },
    {
      icon: Zap,
      title: "Automation Engine",
      description: "Intelligent automation with AI-powered optimization. Automated routing, escalations, and performance analytics.",
      highlight: "AI Powered"
    },
    {
      icon: Settings,
      title: "Advanced Analytics",
      description: "Real-time dashboards, performance metrics, and compliance reporting. Export capabilities for regulatory submissions.",
      highlight: "Data Driven"
    }
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pharma-gray mb-4">
            Comprehensive Pharmaceutical Workflow Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to digitize, automate, and optimize pharmaceutical processes 
            while maintaining the highest standards of compliance and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 group hover:-translate-y-2"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-accent px-2 py-1 bg-accent/10 rounded-full">
                    {feature.highlight}
                  </span>
                </div>
                <CardTitle className="text-pharma-gray group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};