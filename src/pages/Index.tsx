
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SimpleLayout from "@/components/layout/SimpleLayout";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SimpleLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="bg-indigo-600 p-4 rounded-full mb-6">
          <ShieldCheck className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Welcome to YodhaAdmin
        </h1>
        <p className="text-xl text-slate-600 max-w-xl mb-8">
          Student management platform to track progress, skills, and achievements
        </p>
        
        {isAuthenticated ? (
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
};

export default Index;
