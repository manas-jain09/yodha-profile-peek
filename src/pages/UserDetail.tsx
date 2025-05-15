import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone, Briefcase, BookOpen, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getProfileById,
  getUserTrainings,
  getUserAssessments,
  getUserWorkExperience,
  getUserProjects,
  getUserCertificates,
  getUserPublications,
  getUserSkills,
  getUserBadges,
  getUserProgress,
  calculateLearningProgress,
  mapProfileToUser
} from "@/services/supabaseService";
import { toast } from "@/components/ui/use-toast";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => id ? getProfileById(id) : null,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', profile],
    queryFn: () => profile ? mapProfileToUser(profile) : null,
    enabled: !!profile,
  });

  const { data: trainings = [] } = useQuery({
    queryKey: ['trainings', id],
    queryFn: () => id ? getUserTrainings(id) : [],
    enabled: !!id,
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['assessments', id],
    queryFn: () => id ? getUserAssessments(id) : [],
    enabled: !!id,
  });

  const { data: workExperience = [] } = useQuery({
    queryKey: ['workExperience', id],
    queryFn: () => id ? getUserWorkExperience(id) : [],
    enabled: !!id,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', id],
    queryFn: () => id ? getUserProjects(id) : [],
    enabled: !!id,
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates', id],
    queryFn: () => id ? getUserCertificates(id) : [],
    enabled: !!id,
  });

  const { data: publications = [] } = useQuery({
    queryKey: ['publications', id],
    queryFn: () => id ? getUserPublications(id) : [],
    enabled: !!id,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills', id],
    queryFn: () => id ? getUserSkills(id) : [],
    enabled: !!id,
  });

  const { data: badges = { userBadges: [], badgeTypes: [] } } = useQuery({
    queryKey: ['badges', id],
    queryFn: () => id ? getUserBadges(id) : { userBadges: [], badgeTypes: [] },
    enabled: !!id,
  });

  const { data: progressData = { progress: [], learningPaths: [], topics: [], questions: [] } } = useQuery({
    queryKey: ['progress', id],
    queryFn: () => id ? getUserProgress(id) : { progress: [], learningPaths: [], topics: [], questions: [] },
    enabled: !!id,
  });

  // Calculate learning progress statistics
  const learningStats = calculateLearningProgress(
    progressData.progress,
    progressData.questions,
    progressData.topics,
    progressData.learningPaths
  );

  useEffect(() => {
    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
  }, [profileError]);

  if (isProfileLoading || isUserLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-indigo-600">Loading user data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!profile || !user) {
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
                
                {profile.prn && (
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">PRN</p>
                      <p className="text-sm text-muted-foreground">{profile.prn}</p>
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
                
                {skills.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="text-xs">
                          {skill.skill_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{profile.bio || "No bio provided"}</p>
            </CardContent>
          </Card>
          
          {badges.userBadges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" /> Badges
                </CardTitle>
                <CardDescription>Achievements and recognitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {badges.userBadges.map(userBadge => {
                    const badgeType = badges.badgeTypes.find(bt => bt.id === userBadge.badge_id);
                    if (!badgeType) return null;
                    
                    return (
                      <div 
                        key={userBadge.id} 
                        className="flex flex-col items-center p-2 rounded-lg border"
                        style={{ 
                          backgroundColor: `${badgeType.background_color}20`, 
                          borderColor: badgeType.background_color 
                        }}
                      >
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center mb-2"
                          style={{ backgroundColor: badgeType.background_color }}
                        >
                          <Star 
                            className="h-5 w-5" 
                            style={{ color: badgeType.text_color }} 
                          />
                        </div>
                        <div className="text-xs font-medium text-center">{badgeType.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {format(new Date(userBadge.earned_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Tabs Section */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
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
                      <p className="text-slate-600">{profile.real_name || profile.username}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Email Address</h3>
                      <p className="text-slate-600">{profile.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Department</h3>
                      <p className="text-slate-600">{profile.department || "Not assigned"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Course</h3>
                      <p className="text-slate-600">{profile.course || "Not assigned"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Graduation Year</h3>
                      <p className="text-slate-600">{profile.grad_year || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">CGPA</h3>
                      <p className="text-slate-600">{profile.cgpa || "Not available"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">College</h3>
                      <p className="text-slate-600">{profile.college_name || "Not specified"}</p>
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
                  </div>
                </CardContent>
              </Card>
              
              {profile.linkedin_url || profile.github_url || profile.leetcode_url || profile.hackerrank_url || profile.gfg_url ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Social Profiles</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.linkedin_url && (
                      <a 
                        href={profile.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="bg-blue-100 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">LinkedIn</p>
                          <p className="text-xs text-slate-500">View Profile</p>
                        </div>
                      </a>
                    )}
                    
                    {profile.github_url && (
                      <a 
                        href={profile.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="bg-gray-100 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">GitHub</p>
                          <p className="text-xs text-slate-500">View Profile</p>
                        </div>
                      </a>
                    )}
                    
                    {profile.leetcode_url && (
                      <a 
                        href={profile.leetcode_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="bg-yellow-100 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3" /><path d="M12 12v9" /><path d="m12 12 8-4.5" /><path d="m12 12-8-4.5" /></svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">LeetCode</p>
                          <p className="text-xs text-slate-500">View Profile</p>
                        </div>
                      </a>
                    )}
                    
                    {profile.hackerrank_url && (
                      <a 
                        href={profile.hackerrank_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="bg-green-100 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">HackerRank</p>
                          <p className="text-xs text-slate-500">View Profile</p>
                        </div>
                      </a>
                    )}
                    
                    {profile.gfg_url && (
                      <a 
                        href={profile.gfg_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="bg-green-100 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path></svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">GeeksforGeeks</p>
                          <p className="text-xs text-slate-500">View Profile</p>
                        </div>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </TabsContent>
            
            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessments & Certifications</CardTitle>
                  <CardDescription>
                    Completed assessments and earned certifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {certificates.length > 0 || assessments.length > 0 ? (
                    <div className="space-y-6">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h3 className="font-medium">{cert.title}</h3>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <span className="font-medium">{cert.issuer}</span>
                            <span className="mx-2">•</span>
                            <span>Issued {format(new Date(cert.issue_date), 'MMM yyyy')}</span>
                            {cert.expiry_date && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Expires {format(new Date(cert.expiry_date), 'MMM yyyy')}</span>
                              </>
                            )}
                          </div>
                          {cert.credential_url && (
                            <a 
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                      
                      {assessments.map((assessment) => (
                        <div key={assessment.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h3 className="font-medium">{assessment.title}</h3>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <span className="font-medium">{assessment.provider}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(assessment.assessment_date), 'MMM d, yyyy')}</span>
                            <span className="mx-2">•</span>
                            <span>Score: {assessment.score}/{assessment.max_score}</span>
                          </div>
                          {assessment.certificate_url && (
                            <a 
                              href={assessment.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No certifications or assessments found
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trainings</CardTitle>
                  <CardDescription>
                    Completed trainings and courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trainings.length > 0 ? (
                    <div className="space-y-6">
                      {trainings.map((training) => (
                        <div key={training.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h3 className="font-medium">{training.title}</h3>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <span className="font-medium">{training.organization}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {format(new Date(training.start_date), 'MMM yyyy')} - 
                              {training.end_date 
                                ? format(new Date(training.end_date), ' MMM yyyy') 
                                : ' Present'}
                            </span>
                          </div>
                          {training.description && (
                            <p className="text-sm text-slate-600 mt-2">{training.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No trainings found
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Publications</CardTitle>
                  <CardDescription>
                    Research papers and publications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {publications.length > 0 ? (
                    <div className="space-y-6">
                      {publications.map((publication) => (
                        <div key={publication.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h3 className="font-medium">{publication.title}</h3>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <span className="font-medium">{publication.publication_name}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(publication.publication_date), 'MMM yyyy')}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">
                            Authors: {publication.authors.join(', ')}
                          </p>
                          {publication.doi && (
                            <p className="text-sm text-slate-600 mt-1">DOI: {publication.doi}</p>
                          )}
                          {publication.url && (
                            <a 
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
                            >
                              View Publication
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No publications found
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-slate-500" /> Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workExperience.length > 0 ? (
                    <div className="space-y-6">
                      {workExperience.map((exp) => (
                        <div key={exp.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <h3 className="font-medium">{exp.position}</h3>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <span className="font-medium">{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{exp.location}</span>
                              </>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            {format(new Date(exp.start_date), 'MMM yyyy')} - 
                            {exp.end_date 
                              ? format(new Date(exp.end_date), ' MMM yyyy') 
                              : ' Present'}
                          </div>
                          <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                          
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {exp.technologies.map((tech, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No work experience found
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Projects</CardTitle>
                  <CardDescription>
                    Personal and professional projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {projects.map((project) => (
                        <div key={project.id} className="rounded-lg border overflow-hidden">
                          {project.image_url && (
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={project.image_url} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-medium">{project.title}</h3>
                            <div className="text-xs text-slate-500 mt-1">
                              {format(new Date(project.start_date), 'MMM yyyy')} - 
                              {project.end_date 
                                ? format(new Date(project.end_date), ' MMM yyyy') 
                                : ' Present'}
                            </div>
                            <p className="text-sm text-slate-600 mt-2 line-clamp-3">{project.description}</p>
                            
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-1">
                                  {project.technologies.map((tech, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {project.project_url && (
                              <div className="mt-3">
                                <a 
                                  href={project.project_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-600 hover:underline inline-flex items-center"
                                >
                                  View Project
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No projects found
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Progress</CardTitle>
                  <CardDescription>
                    Progress across learning paths and question difficulty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {learningStats.completedCount}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Completed Questions</div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {learningStats.totalCount}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Total Questions</div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {learningStats.totalCount > 0 
                          ? Math.round((learningStats.completedCount / learningStats.totalCount) * 100) 
                          : 0}%
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Completion Rate</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Progress by Difficulty</h3>
                      <div className="space-y-3">
                        {Object.entries(learningStats.completedByDifficulty).map(([difficulty, stats]) => {
                          const percentage = stats.total > 0 
                            ? Math.round((stats.completed / stats.total) * 100) 
                            : 0;
                          
                          let bgColor = "bg-green-500";
                          if (difficulty === "Medium") bgColor = "bg-yellow-500";
                          if (difficulty === "Hard") bgColor = "bg-red-500";
                          
                          return (
                            <div key={difficulty}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{difficulty}</span>
                                <span className="text-sm text-slate-600">{stats.completed}/{stats.total} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`${bgColor} h-2 rounded-full`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Progress by Learning Path</h3>
                      <div className="space-y-4">
                        {Object.values(learningStats.completedByLearningPath)
                          .filter(stats => stats.total > 0)
                          .map(stats => {
                            const percentage = Math.round((stats.completed / stats.total) * 100);
                            return (
                              <div key={Math.random()}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">{stats.name}</span>
                                  <span className="text-sm text-slate-600">{stats.completed}/{stats.total} ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-indigo-500 h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                        })}
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
