
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SimpleLayout from "@/components/layout/SimpleLayout";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SimpleLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6">
          <span className="text-white text-2xl font-bold">YA</span>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Welcome to YodhaAdmin
        </h1>
        <p className="text-xl text-slate-600 max-w-xl mb-8">
          Student management platform to track progress, skills, and achievements
        </p>
        
        {isAuthenticated ? (
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
};

export default Index;
