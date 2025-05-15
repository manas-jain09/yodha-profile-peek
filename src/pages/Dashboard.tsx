
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SimpleLayout from "@/components/layout/SimpleLayout";
import UsersTable from "@/components/users/UsersTable";
import UserFilters, { FilterState } from "@/components/users/UserFilters";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { User } from "@/types/supabaseTypes";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, logout, user } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    department: [],
    course: [],
    gradYear: []
  });

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Query the users table and join with profiles to get the necessary data
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          username,
          email,
          grad_year,
          department,
          course,
          prn,
          created_at
        `);
        
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users data",
          variant: "destructive",
        });
        throw error;
      }
      
      if (!data) return [];
      
      // Transform the data to match the User type
      return data.map(user => ({
        id: user.id,
        name: user.username || '', // Using username as name
        email: user.email,
        grad_year: user.grad_year,
        department: user.department,
        course: user.course,
        avatar: '', // Will be generated from name initials in the component
        joinDate: user.created_at
      }));
    },
    enabled: isAuthenticated, // Only run query when authenticated
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <SimpleLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-indigo-600 text-xl">Loading...</div>
        </div>
      </SimpleLayout>
    );
  }

  // Don't render anything if not authenticated (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-500 mt-1">View and manage all users in the system.</p>
          </div>
{/*           <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </Button> */}
        </div>

        <UserFilters onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="animate-pulse text-indigo-600">Loading users...</div>
          </div>
        ) : (
          <UsersTable users={users} filters={filters} />
        )}
      </div>
    </SimpleLayout>
  );
};

export default Dashboard;
