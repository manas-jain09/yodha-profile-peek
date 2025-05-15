
import { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "usr-001",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "Admin",
    status: "Active",
    lastActive: "2025-05-14T14:32:00Z",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Product manager with 5+ years of experience in SaaS products",
    joinDate: "2024-01-15",
    department: "Product",
    permissions: ["users.read", "users.write", "settings.write"],
    recentActivity: [
      {
        action: "User Profile Updated",
        date: "2025-05-14T14:32:00Z",
        details: "Updated profile information and security settings"
      },
      {
        action: "Document Created",
        date: "2025-05-12T09:45:00Z",
        details: "Created new product roadmap document"
      },
      {
        action: "Settings Changed",
        date: "2025-05-10T16:20:00Z",
        details: "Modified notification preferences"
      }
    ]
  },
  {
    id: "usr-002",
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "Manager",
    status: "Active",
    lastActive: "2025-05-15T09:15:00Z",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, USA",
    bio: "Marketing professional specializing in growth and customer acquisition",
    joinDate: "2024-02-03",
    department: "Marketing",
    permissions: ["users.read", "settings.read"],
    recentActivity: [
      {
        action: "Campaign Created",
        date: "2025-05-15T09:10:00Z",
        details: "Launched Q2 email marketing campaign"
      },
      {
        action: "Report Downloaded",
        date: "2025-05-13T11:30:00Z",
        details: "Analytics report for April 2025"
      }
    ]
  },
  {
    id: "usr-003",
    name: "David Chen",
    email: "david.chen@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "User",
    status: "Inactive",
    lastActive: "2025-04-28T16:45:00Z",
    phone: "+1 (555) 234-5678",
    location: "Chicago, USA",
    bio: "Software engineer focused on backend development and system architecture",
    joinDate: "2024-01-20",
    department: "Engineering",
    permissions: ["users.read"],
    recentActivity: [
      {
        action: "Login",
        date: "2025-04-28T16:45:00Z",
        details: "Last login from Chrome on Windows"
      },
      {
        action: "Password Changed",
        date: "2025-04-28T16:50:00Z",
        details: "Password updated through account settings"
      }
    ]
  },
  {
    id: "usr-004",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    role: "User",
    status: "Active",
    lastActive: "2025-05-14T18:20:00Z",
    phone: "+1 (555) 876-5432",
    location: "Austin, USA",
    bio: "UX/UI designer with a passion for accessible and intuitive interfaces",
    joinDate: "2024-03-05",
    department: "Design",
    permissions: ["users.read"],
    recentActivity: [
      {
        action: "Design Uploaded",
        date: "2025-05-14T18:15:00Z",
        details: "New homepage mockups uploaded to project"
      },
      {
        action: "Comment Added",
        date: "2025-05-14T16:30:00Z",
        details: "Provided feedback on navigation design"
      }
    ]
  },
  {
    id: "usr-005",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "Manager",
    status: "Active",
    lastActive: "2025-05-15T11:10:00Z",
    phone: "+1 (555) 345-6789",
    location: "Seattle, USA",
    bio: "Sales director with expertise in enterprise solutions and team leadership",
    joinDate: "2024-01-10",
    department: "Sales",
    permissions: ["users.read", "users.write"],
    recentActivity: [
      {
        action: "Deal Updated",
        date: "2025-05-15T11:05:00Z",
        details: "Updated status of Enterprise client deal"
      },
      {
        action: "Meeting Scheduled",
        date: "2025-05-15T10:45:00Z",
        details: "Set up Q2 review with leadership team"
      }
    ]
  },
  {
    id: "usr-006",
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    avatar: "https://i.pravatar.cc/150?img=6",
    role: "Guest",
    status: "Pending",
    lastActive: "2025-05-12T14:20:00Z",
    phone: "+1 (555) 456-7890",
    location: "Denver, USA",
    bio: "Content strategist and copywriter focusing on brand storytelling",
    joinDate: "2024-04-15",
    department: "Marketing",
    permissions: ["users.read"],
    recentActivity: [
      {
        action: "Account Created",
        date: "2025-05-12T14:15:00Z",
        details: "Account created and verification email sent"
      }
    ]
  },
  {
    id: "usr-007",
    name: "Robert Lee",
    email: "robert.lee@example.com",
    avatar: "https://i.pravatar.cc/150?img=7",
    role: "Admin",
    status: "Active",
    lastActive: "2025-05-15T08:30:00Z",
    phone: "+1 (555) 567-8901",
    location: "Boston, USA",
    bio: "IT Director with expertise in security and infrastructure",
    joinDate: "2024-01-05",
    department: "IT",
    permissions: ["users.read", "users.write", "settings.write"],
    recentActivity: [
      {
        action: "Security Update",
        date: "2025-05-15T08:25:00Z",
        details: "Implemented new security protocols"
      },
      {
        action: "User Permission Changed",
        date: "2025-05-14T17:10:00Z",
        details: "Updated role permissions for marketing team"
      }
    ]
  },
  {
    id: "usr-008",
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    role: "User",
    status: "Active",
    lastActive: "2025-05-14T13:45:00Z",
    phone: "+1 (555) 678-9012",
    location: "Miami, USA",
    bio: "Customer support lead focusing on client satisfaction and retention",
    joinDate: "2024-02-20",
    department: "Support",
    permissions: ["users.read"],
    recentActivity: [
      {
        action: "Ticket Resolved",
        date: "2025-05-14T13:40:00Z",
        details: "Resolved customer inquiry about billing"
      },
      {
        action: "Knowledge Base Article",
        date: "2025-05-13T15:20:00Z",
        details: "Published new support article on account settings"
      }
    ]
  },
  {
    id: "usr-009",
    name: "Thomas Wright",
    email: "thomas.wright@example.com",
    avatar: "https://i.pravatar.cc/150?img=10",
    role: "User",
    status: "Inactive",
    lastActive: "2025-05-01T10:15:00Z",
    phone: "+1 (555) 789-0123",
    location: "Portland, USA",
    bio: "Data analyst specializing in business intelligence and market research",
    joinDate: "2024-03-10",
    department: "Analytics",
    permissions: ["users.read"],
    recentActivity: [
      {
        action: "Report Generated",
        date: "2025-05-01T10:10:00Z",
        details: "Created monthly analytics dashboard"
      }
    ]
  },
  {
    id: "usr-010",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    avatar: "https://i.pravatar.cc/150?img=11",
    role: "Manager",
    status: "Active",
    lastActive: "2025-05-14T16:50:00Z",
    phone: "+1 (555) 890-1234",
    location: "Los Angeles, USA",
    bio: "HR manager focused on employee experience and organizational development",
    joinDate: "2024-02-15",
    department: "HR",
    permissions: ["users.read", "users.write"],
    recentActivity: [
      {
        action: "Employee Onboarded",
        date: "2025-05-14T16:45:00Z",
        details: "Completed onboarding process for new designer"
      },
      {
        action: "Policy Updated",
        date: "2025-05-13T14:30:00Z",
        details: "Updated remote work policy documentation"
      }
    ]
  }
];
