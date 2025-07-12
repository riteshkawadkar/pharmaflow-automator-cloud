import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Play, FileCheck } from "lucide-react";

export const WorkflowBuilder = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Visual Workflow Builder
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Design, validate, and deploy pharmaceutical workflows with our intuitive drag-and-drop interface
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Drag & Drop Design
              </CardTitle>
              <CardDescription>
                Build complex workflows using our visual components library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background border border-border rounded-lg p-6 mb-4">
                {/* Mock workflow preview */}
                <div className="flex items-center justify-between space-x-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                  </div>
                  <div className="flex-1 h-0.5 bg-border"></div>
                  <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-secondary rounded-full"></div>
                  </div>
                  <div className="flex-1 h-0.5 bg-border"></div>
                  <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-accent rounded-full"></div>
                  </div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Pre-built pharmaceutical components</li>
                <li>• Real-time validation & compliance checks</li>
                <li>• Collaborative editing capabilities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Compliance Ready
              </CardTitle>
              <CardDescription>
                Built-in validation for pharmaceutical regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <span className="text-sm">21 CFR Part 11</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Validated</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <span className="text-sm">ICH Guidelines</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Compliant</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <span className="text-sm">GxP Requirements</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="inline-flex gap-4">
            <Button size="lg" className="px-8">
              <Play className="w-4 h-4 mr-2" />
              Test Workflow
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Settings className="w-4 h-4 mr-2" />
              Deploy to Production
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};