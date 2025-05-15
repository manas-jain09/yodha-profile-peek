
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { FilterState } from "./UserFilters";
import { User } from "@/types/supabaseTypes";

interface UsersTableProps {
  users: User[];
  filters: FilterState;
}

type SortKey = "name" | "email" | "role" | "status" | "lastActive";

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
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(user.status)) {
      return false;
    }
    
    // Role filter
    if (filters.role.length > 0 && !filters.role.includes(user.role)) {
      return false;
    }
    
    return true;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === "lastActive") {
      const dateA = new Date(a[sortConfig.key]).getTime();
      const dateB = new Date(b[sortConfig.key]).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
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

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Inactive": return "bg-gray-100 text-gray-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
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
              onClick={() => requestSort("role")}
            >
              <div className="flex items-center">
                Role {getSortDirectionIcon("role")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("status")}
            >
              <div className="flex items-center">
                Status {getSortDirectionIcon("status")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => requestSort("lastActive")}
            >
              <div className="flex items-center">
                Last Active {getSortDirectionIcon("lastActive")}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(getStatusColor(user.status))}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        viewUserDetails(user.id);
                      }}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
