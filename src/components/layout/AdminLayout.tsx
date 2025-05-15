
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Settings, LayoutDashboard, Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard" },
    { name: "Users", icon: <Users className="h-5 w-5" />, path: "/dashboard" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 font-bold text-lg">YodhaAdmin</span>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-300 transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 border-b border-slate-200">
          <Link to="/dashboard" className="flex items-center" onClick={() => setSidebarOpen(false)}>
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 font-bold text-lg">YodhaAdmin</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                location.pathname === item.path 
                  ? "bg-indigo-50 text-indigo-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={cn(
        "lg:ml-64 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-0",
      )}>
        <main className="p-4 pt-16 lg:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
