
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FilterState } from "./UserFilters";
import { User } from "@/types/supabaseTypes";

interface UsersTableProps {
  users: User[];
  filters: FilterState;
}

type SortKey = "name" | "email" | "gradYear" | "department" | "course";

const UsersTable = ({ users, filters }: UsersTableProps) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{key: SortKey, direction: 'asc' | 'desc'}>({
    key: "name",
    direction: "asc",
  });
  
  const viewUserDetails = (userId: string) => {
    navigate(`/user/${userId}`);
  };
  
  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Filter users based on filters
  const filteredUsers = users.filter(user => {
    // Search filter
    if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !user.email.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.id.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // We've removed status and role filters since we're not displaying them anymore
    
    return true;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === "gradYear") {
      // Handle grad year sorting (might be null)
      const yearA = a.grad_year || 0;
      const yearB = b.grad_year || 0;
      return sortConfig.direction === 'asc' ? yearA - yearB : yearB - yearA;
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Returns icon for sort direction
  const getSortDirectionIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("name")}
            >
              <div className="flex items-center">
                Name {getSortDirectionIcon("name")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("email")}
            >
              <div className="flex items-center">
                Email {getSortDirectionIcon("email")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("gradYear")}
            >
              <div className="flex items-center">
                Grad Year {getSortDirectionIcon("gradYear")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("department")}
            >
              <div className="flex items-center">
                Department {getSortDirectionIcon("department")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("course")}
            >
              <div className="flex items-center">
                Course {getSortDirectionIcon("course")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <TableRow 
                key={user.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => viewUserDetails(user.id)}
              >
                <TableCell>
                  <span className="font-medium">{user.name}</span>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.grad_year || "N/A"}</TableCell>
                <TableCell>{user.department || "N/A"}</TableCell>
                <TableCell>{user.course || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No users found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
