
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { mockUsers } from "@/data/mockUsers";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with timeout
    const timer = setTimeout(() => {
      const foundUser = mockUsers.find(u => u.id === id);
      setUser(foundUser || null);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-indigo-600">Loading user data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <p className="text-slate-600 mb-8">The user you're looking for doesn't exist or was removed.</p>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </AdminLayout>
    );
  }

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
    <AdminLayout>
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl mb-1">{user.name}</CardTitle>
                <CardDescription className="text-base">{user.role}</CardDescription>
                <Badge 
                  variant="outline" 
                  className={cn("mt-2", getStatusColor(user.status))}
                >
                  {user.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-slate-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <CalendarDays className="h-5 w-5 text-slate-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(user.joinDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{user.bio || "No bio provided"}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs Section */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-sm">Full Name</h3>
                      <p className="text-slate-600">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Email Address</h3>
                      <p className="text-slate-600">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Role</h3>
                      <p className="text-slate-600">{user.role}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Department</h3>
                      <p className="text-slate-600">{user.department || "Not assigned"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Status</h3>
                      <Badge 
                        variant="outline" 
                        className={cn(getStatusColor(user.status))}
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Last Active</h3>
                      <p className="text-slate-600">
                        {format(new Date(user.lastActive), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>
                    User's recent actions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.recentActivity && user.recentActivity.length > 0 ? (
                    <div className="space-y-8">
                      {user.recentActivity.map((activity, index) => (
                        <div key={index} className="relative pl-6">
                          <div className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                          <div className="space-y-1">
                            <p className="font-medium text-sm">
                              {activity.action}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(activity.date), 'MMM d, yyyy HH:mm')}
                            </div>
                            <p className="text-sm text-slate-600">{activity.details}</p>
                          </div>
                          {index < user.recentActivity.length - 1 && (
                            <div className="absolute top-3 left-0.75 w-px h-full bg-slate-200" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No recent activity recorded
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Permissions</CardTitle>
                  <CardDescription>
                    Permissions assigned to this user account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4 bg-slate-50">
                      <div className="font-medium mb-2">Role-based permissions</div>
                      <p className="text-sm text-slate-600 mb-4">
                        This user has the <strong>{user.role}</strong> role, which grants the following permissions:
                      </p>
                      <div className="space-y-2">
                        {user.permissions && user.permissions.map((permission) => (
                          <div key={permission} className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <span className="text-sm">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetail;
