
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
  getLearningProgressByDifficulty
} from "@/services/supabaseService";
import AdminLayout from "@/components/layout/AdminLayout";
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
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Book, BookOpen, Award, Star } from "lucide-react";
import { Profile } from "@/types/supabaseTypes";

const UserDetail = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  
  // Fetch user profile
  const { 
    data: profile, 
    isLoading: isProfileLoading,
    error: profileError 
  } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id as string),
    enabled: !!id,
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
    isProgressLoading;
  
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
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-pulse text-indigo-600 text-xl">
            Loading user details...
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!profile) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-xl font-semibold text-red-600">
            User not found
          </div>
          <Button onClick={goBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Destructure the user data
  const { assessments } = acData;
  const { certificates } = acData;
  const { userBadges, badgeTypes } = badgesData;
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{profile.real_name}</CardTitle>
                <CardDescription>
                  {profile.email} • Joined {formatDate(profile.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Education</h3>
                    <p className="mt-1">
                      {profile.department ? `${profile.department}` : 'Department not specified'} 
                      {profile.course ? ` • ${profile.course}` : ''} 
                      {profile.grad_year ? ` • Class of ${profile.grad_year}` : ''}
                    </p>
                  </div>
                  
                  {profile.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">About</h3>
                      <p className="mt-1">{profile.bio}</p>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1">{profile.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Easy Questions */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Easy Questions</span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.easy.completed} / {progressByDifficulty.easy.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.easy.total > 0 
                        ? (progressByDifficulty.easy.completed / progressByDifficulty.easy.total) * 100 
                        : 0} 
                      className="h-2 bg-green-200"
                    />
                  </div>
                  
                  {/* Medium Questions */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Medium Questions</span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.medium.completed} / {progressByDifficulty.medium.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.medium.total > 0 
                        ? (progressByDifficulty.medium.completed / progressByDifficulty.medium.total) * 100 
                        : 0} 
                      className="h-2 bg-yellow-200"
                    />
                  </div>
                  
                  {/* Hard Questions */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Hard Questions</span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.hard.completed} / {progressByDifficulty.hard.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.hard.total > 0 
                        ? (progressByDifficulty.hard.completed / progressByDifficulty.hard.total) * 100 
                        : 0} 
                      className="h-2 bg-red-200"
                    />
                  </div>
                  
                  {/* Theory Questions */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Theory Questions</span>
                      <span className="text-sm text-gray-500">
                        {progressByDifficulty.theory.completed} / {progressByDifficulty.theory.total}
                      </span>
                    </div>
                    <Progress 
                      value={progressByDifficulty.theory.total > 0 
                        ? (progressByDifficulty.theory.completed / progressByDifficulty.theory.total) * 100 
                        : 0} 
                      className="h-2 bg-blue-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          
            {/* Work Experience */}
            {workExperience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workExperience.map((work) => (
                      <div key={work.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold">{work.position} at {work.company}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(work.start_date)} - {work.end_date ? formatDate(work.end_date) : 'Present'}
                          {work.location && ` • ${work.location}`}
                        </p>
                        <p className="mt-2">{work.description}</p>
                        {work.technologies && work.technologies.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {work.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline">{tech}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Projects */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Ongoing'}
                          </p>
                        </div>
                        <p className="mt-2">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline">{tech}</Badge>
                            ))}
                          </div>
                        )}
                        {project.project_url && (
                          <div className="mt-2">
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline text-sm">
                               View Project
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Publications */}
            {publications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Publications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {publications.map((publication) => (
                      <div key={publication.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-semibold">{publication.title}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(publication.publication_date)} • {publication.publication_name}
                        </p>
                        <p className="mt-1">Authors: {publication.authors.join(', ')}</p>
                        {publication.doi && (
                          <p className="text-sm mt-1">DOI: {publication.doi}</p>
                        )}
                        {publication.url && (
                          <div className="mt-1">
                            <a href={publication.url} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline text-sm">
                               View Publication
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">{skill.skill_name}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Training */}
            {trainings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trainings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trainings.map((training) => (
                      <div key={training.id}>
                        <h4 className="font-medium">{training.title}</h4>
                        <p className="text-sm text-gray-500">{training.organization}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(training.start_date)} - {training.end_date ? formatDate(training.end_date) : 'Ongoing'}
                        </p>
                        {training.description && (
                          <p className="text-sm mt-1">{training.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assessments - Separated from Certificates */}
            {assessments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessments.map((assessment) => (
                      <div key={assessment.id}>
                        <h4 className="font-medium">{assessment.title}</h4>
                        <p className="text-sm text-gray-500">{assessment.provider}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(assessment.assessment_date)}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Score: {assessment.score}/{assessment.max_score}
                        </p>
                        {assessment.certificate_url && (
                          <a href={assessment.certificate_url} target="_blank" rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline text-xs block mt-1">
                            View Certificate
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certificates - Separated from Assessments */}
            {certificates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certificates.map((certificate) => (
                      <div key={certificate.id}>
                        <h4 className="font-medium">{certificate.title}</h4>
                        <p className="text-sm text-gray-500">{certificate.issuer}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(certificate.issue_date)}
                          {certificate.expiry_date && ` - Expires: ${formatDate(certificate.expiry_date)}`}
                        </p>
                        {certificate.credential_url && (
                          <a href={certificate.credential_url} target="_blank" rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline text-xs block mt-1">
                            View Certificate
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badges */}
            {userBadges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {userBadges.map((userBadge) => {
                      const badge = badgeTypes.find(b => b.id === userBadge.badge_id);
                      if (!badge) return null;
                      
                      return (
                        <div 
                          key={userBadge.id} 
                          className="flex flex-col items-center p-3 rounded-lg"
                          style={{
                            backgroundColor: badge.background_color,
                            color: badge.text_color
                          }}
                        >
                          {/* Use icon based on icon_name */}
                          {badge.icon_name === 'book' && <Book className="h-6 w-6 mb-2" />}
                          {badge.icon_name === 'book-open' && <BookOpen className="h-6 w-6 mb-2" />}
                          {badge.icon_name === 'award' && <Award className="h-6 w-6 mb-2" />}
                          {badge.icon_name === 'star' && <Star className="h-6 w-6 mb-2" />}
                          
                          <span className="text-xs font-medium text-center">{badge.name}</span>
                          <span className="text-[10px] mt-1">
                            {formatDate(userBadge.earned_at)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Social Links */}
            {profile.linkedin_url || profile.github_url || profile.leetcode_url || profile.hackerrank_url || profile.gfg_url ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline block">
                        LinkedIn
                      </a>
                    )}
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline block">
                        GitHub
                      </a>
                    )}
                    {profile.leetcode_url && (
                      <a href={profile.leetcode_url} target="_blank" rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline block">
                        LeetCode
                      </a>
                    )}
                    {profile.hackerrank_url && (
                      <a href={profile.hackerrank_url} target="_blank" rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline block">
                        HackerRank
                      </a>
                    )}
                    {profile.gfg_url && (
                      <a href={profile.gfg_url} target="_blank" rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline block">
                        GeeksforGeeks
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetail;
