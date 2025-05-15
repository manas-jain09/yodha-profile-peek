
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Filter, X, ChevronDown } from "lucide-react";

interface UserFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  status: string[];
  role: string[];
}

const UserFilters = ({ onFilterChange }: UserFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    role: []
  });

  const statuses = ["Active", "Inactive", "Pending"];
  const roles = ["Admin", "Manager", "User", "Guest"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleStatusChange = (status: string) => {
    let newStatuses: string[];
    
    if (filters.status.includes(status)) {
      newStatuses = filters.status.filter(s => s !== status);
    } else {
      newStatuses = [...filters.status, status];
    }
    
    const newFilters = { ...filters, status: newStatuses };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRoleChange = (role: string) => {
    let newRoles: string[];
    
    if (filters.role.includes(role)) {
      newRoles = filters.role.filter(r => r !== role);
    } else {
      newRoles = [...filters.role, role];
    }
    
    const newFilters = { ...filters, role: newRoles };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { search: "", status: [], role: [] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Filter className="mr-2 h-5 w-5 text-slate-500" /> Filter Users
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Search by name, email or ID..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between w-full md:w-auto">
              Status <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            {statuses.map(status => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.status.includes(status)}
                onCheckedChange={() => handleStatusChange(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between w-full md:w-auto">
              Role <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            {roles.map(role => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={filters.role.includes(role)}
                onCheckedChange={() => handleRoleChange(role)}
              >
                {role}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          className="w-full md:w-auto"
          title="Clear filters"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Active filters display */}
      {(filters.search || filters.status.length > 0 || filters.role.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.status.map(status => (
            <div key={status} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full flex items-center">
              {status}
              <button onClick={() => handleStatusChange(status)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {filters.role.map(role => (
            <div key={role} className="bg-violet-50 text-violet-700 text-sm px-3 py-1 rounded-full flex items-center">
              {role}
              <button onClick={() => handleRoleChange(role)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFilters;
