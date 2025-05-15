
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import UserFilters, { FilterState } from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import { mockUsers } from "@/data/mockUsers";

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    role: []
  });

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
              {mockUsers.length} total users
            </div>
          </div>
        </div>
        
        <UserFilters onFilterChange={onFilterChange} />
        <UsersTable users={mockUsers} filters={filters} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
