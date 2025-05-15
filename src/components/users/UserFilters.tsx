
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Filter, X, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  department: string[];
  course: string[];
  gradYear: number[];
}

const UserFilters = ({ onFilterChange }: UserFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    department: [],
    course: [],
    gradYear: []
  });
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [gradYears, setGradYears] = useState<number[]>([]);
  
  // Fetch distinct values for departments, courses, and grad years
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch distinct departments
        const { data: deptData } = await supabase
          .from('users')
          .select('department')
          .not('department', 'is', null)
          .order('department');
          
        if (deptData) {
          const uniqueDepts = [...new Set(deptData.map(item => item.department).filter(Boolean))];
          setDepartments(uniqueDepts as string[]);
        }
        
        // Fetch distinct courses
        const { data: courseData } = await supabase
          .from('users')
          .select('course')
          .not('course', 'is', null)
          .order('course');
          
        if (courseData) {
          const uniqueCourses = [...new Set(courseData.map(item => item.course).filter(Boolean))];
          setCourses(uniqueCourses as string[]);
        }
        
        // Fetch distinct grad years
        const { data: yearData } = await supabase
          .from('users')
          .select('grad_year')
          .not('grad_year', 'is', null)
          .order('grad_year');
          
        if (yearData) {
          const uniqueYears = [...new Set(yearData.map(item => item.grad_year).filter(Boolean))];
          setGradYears(uniqueYears as number[]);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    
    fetchFilterOptions();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleDepartmentChange = (dept: string) => {
    let newDepts: string[];
    
    if (filters.department.includes(dept)) {
      newDepts = filters.department.filter(d => d !== dept);
    } else {
      newDepts = [...filters.department, dept];
    }
    
    const newFilters = { ...filters, department: newDepts };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCourseChange = (course: string) => {
    let newCourses: string[];
    
    if (filters.course.includes(course)) {
      newCourses = filters.course.filter(c => c !== course);
    } else {
      newCourses = [...filters.course, course];
    }
    
    const newFilters = { ...filters, course: newCourses };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleGradYearChange = (year: number) => {
    let newYears: number[];
    
    if (filters.gradYear.includes(year)) {
      newYears = filters.gradYear.filter(y => y !== year);
    } else {
      newYears = [...filters.gradYear, year];
    }
    
    const newFilters = { ...filters, gradYear: newYears };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { search: "", department: [], course: [], gradYear: [] };
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
              Department <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Departments</DropdownMenuLabel>
            {departments.length > 0 ? (
              departments.map(dept => (
                <DropdownMenuCheckboxItem
                  key={dept}
                  checked={filters.department.includes(dept)}
                  onCheckedChange={() => handleDepartmentChange(dept)}
                >
                  {dept}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No departments found</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between w-full md:w-auto">
              Course <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Courses</DropdownMenuLabel>
            {courses.length > 0 ? (
              courses.map(course => (
                <DropdownMenuCheckboxItem
                  key={course}
                  checked={filters.course.includes(course)}
                  onCheckedChange={() => handleCourseChange(course)}
                >
                  {course}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No courses found</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between w-full md:w-auto">
              Grad Year <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Graduation Years</DropdownMenuLabel>
            {gradYears.length > 0 ? (
              gradYears.map(year => (
                <DropdownMenuCheckboxItem
                  key={year}
                  checked={filters.gradYear.includes(year)}
                  onCheckedChange={() => handleGradYearChange(year)}
                >
                  {year}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No graduation years found</div>
            )}
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
      {(filters.search || filters.department.length > 0 || filters.course.length > 0 || filters.gradYear.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.department.map(dept => (
            <div key={dept} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full flex items-center">
              {dept}
              <button onClick={() => handleDepartmentChange(dept)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {filters.course.map(course => (
            <div key={course} className="bg-violet-50 text-violet-700 text-sm px-3 py-1 rounded-full flex items-center">
              {course}
              <button onClick={() => handleCourseChange(course)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {filters.gradYear.map(year => (
            <div key={year} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center">
              {year}
              <button onClick={() => handleGradYearChange(year)} className="ml-1">
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
