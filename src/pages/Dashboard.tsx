
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import UserFilters, { FilterState } from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import { getAllProfiles, mapProfilesToUsers } from "@/services/supabaseService";
import { User } from "@/types/supabaseTypes";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    role: []
  });

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: getAllProfiles,
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['users', profiles],
    queryFn: () => mapProfilesToUsers(profiles || []),
    enabled: !!profiles && profiles.length > 0,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive",
      });
    }
  }, [error]);

  const onFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-slate-500">
              {isLoading || isUsersLoading 
                ? "Loading users..." 
                : `${users.length} total users`}
            </div>
          </div>
        </div>
        
        <UserFilters onFilterChange={onFilterChange} />
        
        {isLoading || isUsersLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-indigo-600">Loading user data...</div>
          </div>
        ) : (
          <UsersTable users={users} filters={filters} />
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
