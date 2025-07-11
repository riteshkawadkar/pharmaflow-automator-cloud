import { Building2, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-pharma-gray text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PharmaFlow</span>
            </div>
            <p className="text-gray-300 mb-4">
              The leading no-code workflow automation platform for the pharmaceutical industry.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                contact@pharmaflow.com
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                Boston, MA, USA
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Quality Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Equipment Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Document Control</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Regulatory Affairs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Manufacturing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 PharmaFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};