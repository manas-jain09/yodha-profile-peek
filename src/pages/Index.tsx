
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-full">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          YodhaAdmin Dashboard
        </h1>
        <p className="text-slate-600 text-lg mb-8">
          Powerful admin dashboard for managing user profiles with advanced filtering capabilities
        </p>
        <Button 
          onClick={() => navigate('/dashboard')}
          size="lg" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
        >
          Enter Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;
