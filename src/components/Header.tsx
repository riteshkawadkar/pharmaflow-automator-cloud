import { Button } from "@/components/ui/button";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-pharma-gray">PharmaFlow</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#compliance" className="text-muted-foreground hover:text-primary transition-colors">
              Compliance
            </a>
            <a href="#integrations" className="text-muted-foreground hover:text-primary transition-colors">
              Integrations
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button variant="hero">Request Demo</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#compliance" className="text-muted-foreground hover:text-primary transition-colors">
                Compliance
              </a>
              <a href="#integrations" className="text-muted-foreground hover:text-primary transition-colors">
                Integrations
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost">Sign In</Button>
                <Button variant="hero">Request Demo</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};