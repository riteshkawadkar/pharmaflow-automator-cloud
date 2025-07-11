import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/90"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-primary rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6 animate-fade-in">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              21 CFR Part 11 Compliant
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-pharma-gray mb-6 animate-fade-in">
            No-Code Workflow Automation
            <span className="block text-primary">for Pharmaceutical Excellence</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Streamline pharmaceutical processes with our compliant, visual workflow platform. 
            Build, deploy, and manage complex business processes while maintaining full regulatory compliance.
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center text-pharma-gray">
              <CheckCircle className="w-5 h-5 mr-2 text-accent" />
              FDA 21 CFR Part 11 Ready
            </div>
            <div className="flex items-center text-pharma-gray">
              <Zap className="w-5 h-5 mr-2 text-accent" />
              5x Faster Implementation
            </div>
            <div className="flex items-center text-pharma-gray">
              <Shield className="w-5 h-5 mr-2 text-accent" />
              Enterprise Security
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" variant="hero" className="text-lg px-8 py-6">
              Request Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View Platform Tour
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-muted-foreground mb-4">Trusted by leading pharmaceutical companies</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-lg font-semibold">BigPharma Corp</div>
              <div className="text-lg font-semibold">MedTech Solutions</div>
              <div className="text-lg font-semibold">BioInnovate</div>
              <div className="text-lg font-semibold">PharmaCare Ltd</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};