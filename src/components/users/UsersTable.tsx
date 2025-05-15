
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterState } from "./UserFilters";
import { User } from "@/types/supabaseTypes";
import UserAvatar from "./UserAvatar";

interface UsersTableProps {
  users: User[];
  filters: FilterState;
}

type SortKey = "name" | "email" | "grad_year" | "department" | "course";

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
    if (filters.search && !user.name?.toLowerCase().includes(filters.search.toLowerCase()) && 
        !user.email?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.id.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Department filter
    if (filters.department.length > 0 && (!user.department || !filters.department.includes(user.department))) {
      return false;
    }
    
    // Course filter
    if (filters.course.length > 0 && (!user.course || !filters.course.includes(user.course))) {
      return false;
    }
    
    // Grad Year filter
    if (filters.gradYear.length > 0 && (!user.grad_year || !filters.gradYear.includes(user.grad_year))) {
      return false;
    }
    
    return true;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === "grad_year") {
      // Handle grad year sorting (might be null)
      const yearA = a.grad_year || 0;
      const yearB = b.grad_year || 0;
      return sortConfig.direction === 'asc' ? yearA - yearB : yearB - yearA;
    }
    
    // Handle potential null values
    const valA = a[sortConfig.key] || '';
    const valB = b[sortConfig.key] || '';
    
    if (valA < valB) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
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
            <TableHead className="w-12"></TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("name")}
            >
              <div className="flex items-center">
                Name {getSortDirectionIcon("name")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hidden md:table-cell"
              onClick={() => requestSort("email")}
            >
              <div className="flex items-center">
                Email {getSortDirectionIcon("email")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("grad_year")}
            >
              <div className="flex items-center">
                Grad Year {getSortDirectionIcon("grad_year")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hidden md:table-cell"
              onClick={() => requestSort("department")}
            >
              <div className="flex items-center">
                Department {getSortDirectionIcon("department")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hidden lg:table-cell"
              onClick={() => requestSort("course")}
            >
              <div className="flex items-center">
                Course {getSortDirectionIcon("course")}
              </div>
            </TableHead>
            <TableHead className="text-right w-20">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <TableRow 
                key={user.id}
                className="hover:bg-slate-50"
              >
                <TableCell>
                  <UserAvatar name={user.name || ''} size="sm" />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{user.name || "N/A"}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell>
                  {user.grad_year ? 
                    <Badge variant="outline">{user.grad_year}</Badge> : 
                    <span className="text-muted-foreground">N/A</span>
                  }
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.department || <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {user.course || <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => viewUserDetails(user.id)}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
