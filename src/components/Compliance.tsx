import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Globe,
  Archive,
  Users
} from "lucide-react";

export const Compliance = () => {
  const complianceFeatures = [
    {
      icon: Shield,
      title: "21 CFR Part 11",
      description: "FDA electronic records and electronic signatures compliance",
      status: "Certified"
    },
    {
      icon: Globe,
      title: "EU GMP Annex 11",
      description: "European computerized systems validation requirements",
      status: "Compliant"
    },
    {
      icon: FileText,
      title: "GAMP 5",
      description: "Good Automated Manufacturing Practice validation framework",
      status: "Aligned"
    },
    {
      icon: Lock,
      title: "SOC 2 Type II",
      description: "Security, availability, and confidentiality controls",
      status: "Audited"
    }
  ];

  const auditFeatures = [
    {
      icon: Clock,
      title: "Real-time Audit Trails",
      description: "Comprehensive ALCOA+ compliant audit logging"
    },
    {
      icon: Archive,
      title: "Long-term Preservation",
      description: "20+ year data retention with cryptographic integrity"
    },
    {
      icon: Users,
      title: "Role-based Security",
      description: "Granular permissions with segregation of duties"
    },
    {
      icon: CheckCircle2,
      title: "Automated Validation",
      description: "Built-in validation protocols and testing frameworks"
    }
  ];

  return (
    <section id="compliance" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Regulatory Compliance
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-pharma-gray mb-4">
            Built for Pharmaceutical Compliance
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the most stringent regulatory requirements with our compliance-first platform. 
            Designed specifically for the pharmaceutical industry's unique needs.
          </p>
        </div>

        {/* Compliance Standards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {complianceFeatures.map((feature, index) => (
            <Card key={index} className="text-center bg-white border-0 shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit mb-2">
                  <feature.icon className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-lg font-semibold text-pharma-gray">
                  {feature.title}
                </CardTitle>
                <Badge variant="outline" className="mx-auto text-accent border-accent">
                  {feature.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Compliance Features */}
        <div className="bg-white rounded-lg shadow-large p-8">
          <h3 className="text-2xl font-bold text-pharma-gray mb-6 text-center">
            Comprehensive Audit & Security Framework
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {auditFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-pharma-gray mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="hero" size="lg">
              Download Compliance Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};