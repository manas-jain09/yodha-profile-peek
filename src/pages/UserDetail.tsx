
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  getProfileById,
  getUserTrainings,
  getUserAssessmentsAndCertificates,
  getUserWorkExperience,
  getUserProjects,
  getUserPublications,
  getUserSkills,
  getUserBadges,
  getLearningProgressByDifficulty,
  getUserLearningPathsProgress
} from "@/services/supabaseService";
import SimpleLayout from "@/components/layout/SimpleLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Book, 
  BookOpen, 
  Award, 
  Star, 
  GraduationCap,
  Briefcase,
  Code,
  File,
  Trophy,
  User,
  Gauge,
  ListChecks,
  FileText,
  Layers
} from "lucide-react";
import { Profile } from "@/types/supabaseTypes";
import UserAvatar from "@/components/users/UserAvatar";
import { useAuth } from "@/context/AuthContext";

const UserDetail = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Protect this route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Fetch user profile
  const { 
    data: profile, 
    isLoading: isProfileLoading,
    error: profileError 
  } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id as string),
    enabled: !!id && isAuthenticated,
  });
  
  // Fetch user trainings
  const { 
    data: trainings = [], 
    isLoading: isTrainingsLoading 
  } = useQuery({
    queryKey: ['trainings', id],
    queryFn: () => getUserTrainings(id as string),
    enabled: !!id,
  });
  
  // Fetch user assessments and certificates
  const {
    data: acData = { assessments: [], certificates: [] },
    isLoading: isACLoading
  } = useQuery({
    queryKey: ['assessments-certificates', id],
    queryFn: () => getUserAssessmentsAndCertificates(id as string),
    enabled: !!id,
  });
  
  // Fetch work experience
  const { 
    data: workExperience = [], 
    isLoading: isWorkLoading 
  } = useQuery({
    queryKey: ['work', id],
    queryFn: () => getUserWorkExperience(id as string),
    enabled: !!id,
  });
  
  // Fetch user projects
  const { 
    data: projects = [], 
    isLoading: isProjectsLoading 
  } = useQuery({
    queryKey: ['projects', id],
    queryFn: () => getUserProjects(id as string),
    enabled: !!id,
  });
  
  // Fetch user publications
  const { 
    data: publications = [], 
    isLoading: isPublicationsLoading 
  } = useQuery({
    queryKey: ['publications', id],
    queryFn: () => getUserPublications(id as string),
    enabled: !!id,
  });
  
  // Fetch user skills
  const { 
    data: skills = [], 
    isLoading: isSkillsLoading 
  } = useQuery({
    queryKey: ['skills', id],
    queryFn: () => getUserSkills(id as string),
    enabled: !!id,
  });
  
  // Fetch user badges
  const { 
    data: badgesData = { userBadges: [], badgeTypes: [] }, 
    isLoading: isBadgesLoading 
  } = useQuery({
    queryKey: ['badges', id],
    queryFn: () => getUserBadges(id as string),
    enabled: !!id,
  });
  
  // Fetch learning progress by difficulty
  const {
    data: progressByDifficulty = {
      easy: { completed: 0, total: 0 },
      medium: { completed: 0, total: 0 },
      hard: { completed: 0, total: 0 },
      theory: { completed: 0, total: 0 }
    },
    isLoading: isProgressLoading
  } = useQuery({
    queryKey: ['progress-difficulty', id],
    queryFn: () => getLearningProgressByDifficulty(id as string),
    enabled: !!id,
  });
  
  // Fetch learning paths progress
  const {
    data: learningPathsProgress = [],
    isLoading: isLearningPathsLoading
  } = useQuery({
    queryKey: ['learning-paths-progress', id],
    queryFn: () => getUserLearningPathsProgress(id as string),
    enabled: !!id,
  });
  
  useEffect(() => {
    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    }
  }, [profileError]);
  
  const isLoading = 
    isProfileLoading || 
    isTrainingsLoading || 
    isACLoading || 
    isWorkLoading || 
    isProjectsLoading ||
    isPublicationsLoading ||
    isSkillsLoading ||
    isBadgesLoading ||
    isProgressLoading ||
    isLearningPathsLoading;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Invalid Date";
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (isLoading || authLoading) {
    return (
      <SimpleLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-pulse text-indigo-600 text-xl">
            Loading user details...
          </div>
        </div>
      </SimpleLayout>
    );
  }
  
  if (!profile) {
    return (
      <SimpleLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-xl font-semibold text-red-600">
            User not found
          </div>
          <Button onClick={goBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </SimpleLayout>
    );
  }

  // Destructure the user data
  const { assessments } = acData;
  const { certificates } = acData;
  const { userBadges, badgeTypes } = badgesData;

  // Calculate total progress across all difficulties
  const totalCompleted = 
    progressByDifficulty.easy.completed + 
    progressByDifficulty.medium.completed + 
    progressByDifficulty.hard.completed + 
    progressByDifficulty.theory.completed;
  
  const totalQuestions = 
    progressByDifficulty.easy.total + 
    progressByDifficulty.medium.total + 
    progressByDifficulty.hard.total + 
    progressByDifficulty.theory.total;
  
  const overallProgressPercent = totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;

  // Get difficulty color classes
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'hard': return 'bg-rose-500';
      case 'advanced': return 'bg-purple-500';
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <SimpleLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goBack} className="hover:bg-slate-100 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </div>
        
        {/* Enhanced Profile Header Section */}
        <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
          <div className="relative px-6 py-10 md:px-10 md:py-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <UserAvatar name={profile.real_name} size="lg" className="h-28 w-28 shadow-lg border-4 border-white" />
                <div className="absolute -right-2 -bottom-2">
                  {badgesData.userBadges.length > 0 && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
                      <Trophy size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                  {profile.real_name}
                  {profile.active && (
                    <Badge className="ml-3 bg-green-500 hover:bg-green-600">Active</Badge>
                  )}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {profile.email} • Joined {formatDate(profile.created_at)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.department && (
                    <Badge variant="secondary" className="text-xs">
                      <GraduationCap className="mr-1 h-3 w-3" />
                      {profile.department}
                    </Badge>
                  )}
                  {profile.course && (
                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {profile.course}
                    </Badge>
                  )}
                  {profile.grad_year && (
                    <Badge variant="secondary" className="text-xs">
                      Class of {profile.grad_year}
                    </Badge>
                  )}
                  {profile.location && (
                    <Badge variant="outline" className="text-xs">
                      {profile.location}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Social links */}
              <div className="md:ml-auto flex items-center gap-2">
                {profile.linkedin_url && (
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors hover:scale-110 duration-200 shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {profile.github_url && (
                  <a 
                    href={profile.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors hover:scale-110 duration-200 shadow-sm"
                    aria-label="GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {profile.leetcode_url && (
                  <a 
                    href={profile.leetcode_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors hover:scale-110 duration-200 shadow-sm"
                    aria-label="LeetCode"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.111.744 1.823.744 2.159 0 3.388-2.51 1.907-4.069L15.13 3.701c-2.04-1.988-5.736-1.896-7.688.12L3.105 8.423c-2.005 2.033-2.005 5.306 0 7.339l4.332 4.362c2.04 2.033 5.732 2.042 7.775 0l4.402-4.375c1.458-1.458.195-3.689-1.888-3.689-.744 0-1.355.225-1.824.695z" />
                    </svg>
                  </a>
                )}
                {profile.hackerrank_url && (
                  <a 
                    href={profile.hackerrank_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors hover:scale-110 duration-200 shadow-sm"
                    aria-label="HackerRank"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908c0-.141-.115-.257-.258-.257h-1.85c-.141 0-.258.115-.258.257v9.917c0 .143.115.258.258.258h1.85c.143 0 .258-.115.258-.258v-3.887h4.074v3.887c0 .143.115.258.258.258h1.85c.143 0 .258-.115.258-.258V6.908c0-.142-.115-.257-.258-.257h-1.85v-.002z" />
                    </svg>
                  </a>
                )}
                {profile.gfg_url && (
                  <a 
                    href={profile.gfg_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors hover:scale-110 duration-200 shadow-sm"
                    aria-label="GeeksforGeeks"
                  >
                    <span className="font-bold text-sm">G4G</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mt-8 md:mt-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Overall Learning Progress</h3>
                <span className="text-sm font-semibold">
                  {Math.round(overallProgressPercent)}%
                </span>
              </div>
              <Progress 
                value={overallProgressPercent} 
                className="h-2 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200"
              />
            </div>
          </div>
        </Card>
        
        {/* Tabbed Content */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="bg-white mb-6 p-1 shadow-sm border rounded-lg w-full flex flex-wrap justify-start overflow-x-auto">
            <TabsTrigger value="progress" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800">
              <Gauge className="h-4 w-4 mr-2" /> Progress
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-800">
              <Award className="h-4 w-4 mr-2" /> Skills & Badges
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800">
              <Briefcase className="h-4 w-4 mr-2" /> Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-800">
              <GraduationCap className="h-4 w-4 mr-2" /> Education
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-800">
              <Code className="h-4 w-4 mr-2" /> Projects
            </TabsTrigger>
            <TabsTrigger value="publications" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-800">
              <FileText className="h-4 w-4 mr-2" /> Publications
            </TabsTrigger>
          </TabsList>
          
          {/* Progress Tab Content */}
          <TabsContent value="progress" className="space-y-6">
            {/* Learning Paths Progress */}
            {learningPathsProgress.length > 0 && (
              <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                    Learning Paths Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {learningPathsProgress.map((path, index) => (
                      <div 
                        key={path.pathId} 
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{path.title}</h3>
                            <p className="text-sm text-gray-500">{path.description}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <Badge 
                              className={`${getDifficultyColor(path.difficulty)} text-white`}
                            >
                              {path.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{path.completed} of {path.total} completed</span>
                            <span className="font-medium">{path.percentComplete}%</span>
                          </div>
                          <Progress 
                            value={path.percentComplete} 
                            className={`h-2 ${getDifficultyColor(path.difficulty).replace('bg-', 'bg-opacity-20 ')} ${getDifficultyColor(path.difficulty)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Learning Progress By Difficulty */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <CardTitle className="text-lg flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-indigo-600" />
                  Progress by Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Easy Questions */}
                  <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>
                        Easy Questions
                      </span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.easy.completed} / {progressByDifficulty.easy.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.easy.total > 0 
                        ? (progressByDifficulty.easy.completed / progressByDifficulty.easy.total) * 100 
                        : 0} 
                      className="h-2 bg-emerald-100"
                    />
                  </div>
                  
                  {/* Medium Questions */}
                  <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                        Medium Questions
                      </span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.medium.completed} / {progressByDifficulty.medium.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.medium.total > 0 
                        ? (progressByDifficulty.medium.completed / progressByDifficulty.medium.total) * 100 
                        : 0} 
                      className="h-2 bg-amber-100"
                    />
                  </div>
                  
                  {/* Hard Questions */}
                  <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <span className="h-3 w-3 rounded-full bg-rose-500 mr-2"></span>
                        Hard Questions
                      </span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.hard.completed} / {progressByDifficulty.hard.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.hard.total > 0 
                        ? (progressByDifficulty.hard.completed / progressByDifficulty.hard.total) * 100 
                        : 0} 
                      className="h-2 bg-rose-100"
                    />
                  </div>
                  
                  {/* Theory Questions */}
                  <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium flex items-center">
                        <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                        Theory Questions
                      </span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.theory.completed} / {progressByDifficulty.theory.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.theory.total > 0 
                        ? (progressByDifficulty.theory.completed / progressByDifficulty.theory.total) * 100 
                        : 0} 
                      className="h-2 bg-blue-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Skills and Badges Tab Content */}
          <TabsContent value="skills" className="space-y-6">
            {/* Skills */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-lg flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-emerald-600" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={skill.id} 
                        variant="secondary" 
                        className="px-3 py-1 text-sm hover:bg-emerald-100 transition-colors animate-fade-in hover-scale"
                        style={{ animationDelay: `${200 + (index * 30)}ms` }}
                      >
                        {skill.skill_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No skills found</p>
                )}
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-amber-600" />
                  Earned Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {userBadges.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {userBadges.map((userBadge, index) => {
                      const badge = badgeTypes.find(b => b.id === userBadge.badge_id);
                      if (!badge) return null;
                      
                      return (
                        <div 
                          key={userBadge.id} 
                          className="flex flex-col items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover-scale animate-fade-in"
                          style={{
                            backgroundColor: badge.background_color || '#f8fafc',
                            color: badge.text_color || '#1e293b',
                            animationDelay: `${250 + (index * 50)}ms`
                          }}
                        >
                          {/* Use icon based on icon_name */}
                          {badge.icon_name === 'book' && <Book className="h-8 w-8 mb-3" />}
                          {badge.icon_name === 'book-open' && <BookOpen className="h-8 w-8 mb-3" />}
                          {badge.icon_name === 'award' && <Award className="h-8 w-8 mb-3" />}
                          {badge.icon_name === 'star' && <Star className="h-8 w-8 mb-3" />}
                          {badge.icon_name === 'file' && <File className="h-8 w-8 mb-3" />}
                          
                          <span className="text-sm font-medium text-center">{badge.name}</span>
                          <span className="text-xs mt-1 opacity-80">
                            {formatDate(userBadge.earned_at)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No badges earned yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Experience Tab Content */}
          <TabsContent value="experience" className="space-y-6">
            {/* Work Experience */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-amber-600" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {workExperience.length > 0 ? (
                  <div className="divide-y">
                    {workExperience.map((work, index) => (
                      <div 
                        key={work.id} 
                        className="p-6 hover:bg-amber-50/30 transition-colors animate-fade-in" 
                        style={{ animationDelay: `${250 + (index * 50)}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{work.position}</h3>
                            <p className="text-gray-600">{work.company}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(work.start_date)} - {work.end_date ? formatDate(work.end_date) : 'Present'}
                              {work.location && ` • ${work.location}`}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-gray-700">{work.description}</p>
                        {work.technologies && work.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {work.technologies.map((tech, idx) => (
                              <Badge key={idx} variant="outline" className="hover-scale">{tech}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-6">No work experience found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Education Tab Content */}
          <TabsContent value="education" className="space-y-6">
            {/* Training */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-violet-600" />
                  Trainings & Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {trainings.length > 0 ? (
                  <div className="space-y-4">
                    {trainings.map((training, index) => (
                      <div 
                        key={training.id}
                        className="p-4 rounded-lg border border-violet-100 hover:bg-violet-50/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${300 + (index * 50)}ms` }}
                      >
                        <h4 className="font-medium text-gray-800">{training.title}</h4>
                        <p className="text-sm text-gray-600">{training.organization}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(training.start_date)} - {training.end_date ? formatDate(training.end_date) : 'Ongoing'}
                        </p>
                        {training.description && (
                          <p className="text-sm mt-2 text-gray-700">{training.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No trainings found</p>
                )}
              </CardContent>
            </Card>

            {/* Assessments */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
                <CardTitle className="text-lg flex items-center">
                  <Award className="mr-2 h-5 w-5 text-purple-600" />
                  Assessments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {assessments.length > 0 ? (
                  <div className="space-y-4">
                    {assessments.map((assessment, index) => (
                      <div 
                        key={assessment.id}
                        className="p-4 rounded-lg border border-purple-100 hover:bg-purple-50/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${350 + (index * 50)}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{assessment.title}</h4>
                            <p className="text-sm text-gray-600">{assessment.provider}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(assessment.assessment_date)}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <Badge variant="secondary" className="bg-purple-100">
                              Score: {assessment.score}/{assessment.max_score}
                            </Badge>
                          </div>
                        </div>
                        {assessment.certificate_url && (
                          <a 
                            href={assessment.certificate_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-purple-600 hover:underline text-xs block mt-3 story-link inline-flex items-center"
                          >
                            View Certificate
                            <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No assessments found</p>
                )}
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-indigo-600" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((certificate, index) => (
                      <div 
                        key={certificate.id}
                        className="p-4 rounded-lg border border-indigo-100 hover:bg-indigo-50/30 transition-colors animate-fade-in hover-scale"
                        style={{ animationDelay: `${400 + (index * 50)}ms` }}
                      >
                        <h4 className="font-medium text-gray-800">{certificate.title}</h4>
                        <p className="text-sm text-gray-600">{certificate.issuer}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(certificate.issue_date)}
                          {certificate.expiry_date && ` - Expires: ${formatDate(certificate.expiry_date)}`}
                        </p>
                        {certificate.credential_url && (
                          <a 
                            href={certificate.credential_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:underline text-xs block mt-2 story-link inline-flex items-center"
                          >
                            View Certificate
                            <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No certificates found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Projects Tab Content */}
          <TabsContent value="projects" className="space-y-6">
            {/* Projects */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                <CardTitle className="text-lg flex items-center">
                  <Code className="mr-2 h-5 w-5 text-teal-600" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {projects.length > 0 ? (
                  <div className="divide-y">
                    {projects.map((project, index) => (
                      <div 
                        key={project.id} 
                        className="p-6 hover:bg-teal-50/30 transition-colors animate-fade-in" 
                        style={{ animationDelay: `${350 + (index * 50)}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{project.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Ongoing'}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-gray-700">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.technologies.map((tech, idx) => (
                              <Badge key={idx} variant="outline" className="hover-scale bg-teal-50">{tech}</Badge>
                            ))}
                          </div>
                        )}
                        {project.project_url && (
                          <div className="mt-3">
                            <a 
                              href={project.project_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-teal-600 hover:underline text-sm story-link inline-flex items-center"
                            >
                              View Project
                              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-6">No projects found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Publications Tab Content */}
          <TabsContent value="publications" className="space-y-6">
            {/* Publications */}
            <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
                <CardTitle className="text-lg flex items-center">
                  <File className="mr-2 h-5 w-5 text-purple-600" />
                  Publications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {publications.length > 0 ? (
                  <div className="divide-y">
                    {publications.map((publication, index) => (
                      <div 
                        key={publication.id} 
                        className="p-6 hover:bg-purple-50/30 transition-colors animate-fade-in" 
                        style={{ animationDelay: `${450 + (index * 50)}ms` }}
                      >
                        <h3 className="font-semibold text-gray-800">{publication.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(publication.publication_date)} • {publication.publication_name}
                        </p>
                        <p className="mt-1 text-gray-700">Authors: {publication.authors.join(', ')}</p>
                        {publication.doi && (
                          <p className="text-sm mt-1 text-gray-600">DOI: {publication.doi}</p>
                        )}
                        {publication.url && (
                          <div className="mt-2">
                            <a 
                              href={publication.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-purple-600 hover:underline text-sm story-link inline-flex items-center"
                            >
                              View Publication
                              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-6">No publications found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SimpleLayout>
  );
};

export default UserDetail;
