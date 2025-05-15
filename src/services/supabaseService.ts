
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { 
  Profile, 
  Training, 
  Assessment, 
  WorkExperience, 
  Project, 
  Certificate,
  Publication,
  UserSkill,
  UserBadge,
  BadgeType,
  UserProgress,
  LearningPath,
  Topic,
  Question,
  User
} from "@/types/supabaseTypes";

export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching profiles:', error);
    toast({
      title: "Error",
      description: "Failed to fetch user profiles",
      variant: "destructive",
    });
    return [];
  }
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    // First try to get from user_profiles view
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // If view doesn't work, try to get data by joining manually
      const profileResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      const userResult = await supabase
        .from('users')
        .select('username, email, prn, grad_year, department, course')
        .eq('id', id)
        .single();
      
      if (profileResult.error || userResult.error) {
        throw profileResult.error || userResult.error;
      }
      
      return { ...profileResult.data, ...userResult.data } as Profile;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    toast({
      title: "Error",
      description: "Failed to fetch user profile",
      variant: "destructive",
    });
    return null;
  }
}

export async function getUserTrainings(userId: string): Promise<Training[]> {
  try {
    const { data, error } = await supabase
      .from('trainings')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return [];
  }
}

export async function getUserAssessments(userId: string): Promise<Assessment[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
}

export async function getUserWorkExperience(userId: string): Promise<WorkExperience[]> {
  try {
    const { data, error } = await supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching work experience:', error);
    return [];
  }
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}

export async function getUserPublications(userId: string): Promise<Publication[]> {
  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function getUserBadges(userId: string): Promise<{userBadges: UserBadge[], badgeTypes: BadgeType[]}> {
  try {
    const { data: userBadges, error: badgesError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);
    
    if (badgesError) throw badgesError;
    
    // Get all badge types
    const { data: badgeTypes, error: typesError } = await supabase
      .from('badge_types')
      .select('*');
    
    if (typesError) throw typesError;
    
    return {
      userBadges: userBadges || [],
      badgeTypes: badgeTypes || []
    };
  } catch (error) {
    console.error('Error fetching badges:', error);
    return { userBadges: [], badgeTypes: [] };
  }
}

export async function getUserProgress(userId: string): Promise<{
  progress: UserProgress[],
  learningPaths: LearningPath[],
  topics: Topic[],
  questions: Question[]
}> {
  try {
    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    // Get all learning paths
    const { data: learningPaths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*');
    
    if (pathsError) throw pathsError;
    
    // Get all topics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*');
    
    if (topicsError) throw topicsError;
    
    // Get all questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');
    
    if (questionsError) throw questionsError;
    
    return {
      progress: progress || [],
      learningPaths: learningPaths || [],
      topics: topics || [],
      questions: questions || []
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return {
      progress: [],
      learningPaths: [],
      topics: [],
      questions: []
    };
  }
}

export async function mapProfileToUser(profile: Profile): Promise<User> {
  // Map the Profile data to the User interface
  return {
    id: profile.id,
    name: profile.real_name || profile.username,
    email: profile.email,
    avatar: profile.profile_picture_url || `https://i.pravatar.cc/150?u=${profile.id}`,
    role: "User", // Default role, could be fetched from a roles table if available
    status: "Active", // Default status
    lastActive: profile.updated_at,
    phone: "", // Not available in the profile data
    location: profile.location || "",
    bio: profile.bio || "",
    joinDate: profile.created_at,
    department: profile.department || "",
  };
}

export async function mapProfilesToUsers(profiles: Profile[]): Promise<User[]> {
  return Promise.all(profiles.map(mapProfileToUser));
}

// Helper to calculate learning progress statistics
export function calculateLearningProgress(
  progress: UserProgress[],
  questions: Question[],
  topics: Topic[],
  learningPaths: LearningPath[]
): {
  completedCount: number,
  totalCount: number,
  completedByDifficulty: Record<string, {completed: number, total: number}>,
  completedByLearningPath: Record<string, {completed: number, total: number, name: string}>
} {
  const completedCount = progress.filter(p => p.is_completed).length;
  const totalCount = questions.length;
  
  // Initialize difficulty counters
  const completedByDifficulty: Record<string, {completed: number, total: number}> = {
    'Easy': {completed: 0, total: 0},
    'Medium': {completed: 0, total: 0},
    'Hard': {completed: 0, total: 0}
  };
  
  // Initialize learning path counters
  const completedByLearningPath: Record<string, {completed: number, total: number, name: string}> = {};
  learningPaths.forEach(path => {
    completedByLearningPath[path.id] = {
      completed: 0,
      total: 0,
      name: path.title
    };
  });
  
  // Count questions by difficulty and learning path
  questions.forEach(question => {
    // Count by difficulty
    const difficulty = question.difficulty;
    if (completedByDifficulty[difficulty]) {
      completedByDifficulty[difficulty].total++;
    }
    
    // Find topic and learning path for this question
    const topic = topics.find(t => t.id === question.topic_id);
    if (topic) {
      const learningPathId = topic.learning_path_id;
      if (completedByLearningPath[learningPathId]) {
        completedByLearningPath[learningPathId].total++;
      }
    }
  });
  
  // Count completed questions
  progress.filter(p => p.is_completed).forEach(p => {
    // Find the question
    const question = questions.find(q => q.id === p.question_id);
    if (question) {
      // Count by difficulty
      const difficulty = question.difficulty;
      if (completedByDifficulty[difficulty]) {
        completedByDifficulty[difficulty].completed++;
      }
      
      // Find topic and learning path
      const topic = topics.find(t => t.id === question.topic_id);
      if (topic) {
        const learningPathId = topic.learning_path_id;
        if (completedByLearningPath[learningPathId]) {
          completedByLearningPath[learningPathId].completed++;
        }
      }
    }
  });
  
  return {
    completedCount,
    totalCount,
    completedByDifficulty,
    completedByLearningPath
  };
}
