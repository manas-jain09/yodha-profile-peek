
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  lastActive: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate: string;
  department?: string;
  permissions?: string[];
  recentActivity?: {
    action: string;
    date: string;
    details: string;
  }[];
}
