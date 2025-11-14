import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Brototype
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Student Problem Management System
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A centralized platform for students to raise issues and track resolutions efficiently
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="min-w-[200px]">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Issue Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Raise and track your issues with real-time status updates
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Categories</h3>
              <p className="text-sm text-muted-foreground">
                Technical, Hostel, HR, Placement, and more
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Powerful tools for administrators to manage and resolve issues
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
