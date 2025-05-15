
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SimpleLayout from "@/components/layout/SimpleLayout";
import UsersTable from "@/components/users/UsersTable";
import UserFilters, { FilterState } from "@/components/users/UserFilters";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    department: [],
    course: [],
    gradYear: []
  });

  // Protect this route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          username,
          name,
          email,
          grad_year,
          department,
          course,
          prn
        `);
        
      if (error) throw error;
      return data || [];
    },
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
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

  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 mt-1">View and manage all users in the system.</p>
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
