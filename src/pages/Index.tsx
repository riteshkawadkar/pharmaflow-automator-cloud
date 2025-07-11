import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Compliance } from "@/components/Compliance";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <WorkflowBuilder />
      <Compliance />
      <Footer />
    </div>
  );
};

export default Index;
