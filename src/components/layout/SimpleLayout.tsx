
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

interface SimpleLayoutProps {
  children: ReactNode;
}

export const SimpleLayout = ({ children }: SimpleLayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    // Navigation is now handled inside the logout function
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center">
            <span className="font-bold text-lg text-red-600">YodhaAdmin</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium hidden md:inline-block">
                  Welcome, {user?.username || 'User'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} YodhaAdmin. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SimpleLayout;
