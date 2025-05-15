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
    // Querying profiles table directly instead of the view
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    
    // Get additional user data
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, username, email, prn, grad_year, department, course');
    
    if (usersError) throw usersError;
    
    // Combine data from both tables
    const combinedData: Profile[] = profilesData.map(profile => {
      const userData = usersData.find(user => user.id === profile.id);
      return {
        ...profile,
        username: userData?.username || '',
        email: userData?.email || '',
        prn: userData?.prn || '',
        grad_year: userData?.grad_year || null,
        department: userData?.department || null,
        course: userData?.course || null
      } as Profile;
    });
    
    return combinedData;
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
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (profileError) throw profileError;
    
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username, email, prn, grad_year, department, course')
      .eq('id', id)
      .single();
    
    if (userError) throw userError;
    
    // Combine the data
    return { ...profile, ...userData } as Profile;
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
    grad_year: profile.grad_year,
    department: profile.department || "",
    course: profile.course || "",
    avatar: profile.profile_picture_url || `https://i.pravatar.cc/150?u=${profile.id}`,
    joinDate: profile.created_at,
    bio: profile.bio || "",
    location: profile.location || "",
  };
}

export async function mapProfilesToUsers(profiles: Profile[]): Promise<User[]> {
  return Promise.all(profiles.map(mapProfileToUser));
}

// Modified function to segregate assessments and certifications
export async function getUserAssessmentsAndCertificates(userId: string): Promise<{
  assessments: Assessment[];
  certificates: Certificate[];
}> {
  try {
    // Get assessments
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId);
    
    if (assessmentsError) throw assessmentsError;
    
    // Get certificates
    const { data: certificates, error: certificatesError } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId);
    
    if (certificatesError) throw certificatesError;
    
    return {
      assessments: assessments || [],
      certificates: certificates || []
    };
  } catch (error) {
    console.error('Error fetching assessments and certificates:', error);
    return { assessments: [], certificates: [] };
  }
}

// Helper to calculate learning progress broken down by difficulty
export async function getLearningProgressByDifficulty(userId: string): Promise<{
  easy: { completed: number, total: number },
  medium: { completed: number, total: number },
  hard: { completed: number, total: number },
  theory: { completed: number, total: number }
}> {
  try {
    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    // Get all questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');
    
    if (questionsError) throw questionsError;
    
    // Initialize counters
    const result = {
      easy: { completed: 0, total: 0 },
      medium: { completed: 0, total: 0 },
      hard: { completed: 0, total: 0 },
      theory: { completed: 0, total: 0 }
    };
    
    // Count questions by difficulty
    questions.forEach(question => {
      const difficulty = question.difficulty.toLowerCase();
      if (difficulty === 'easy') result.easy.total++;
      else if (difficulty === 'medium') result.medium.total++;
      else if (difficulty === 'hard') result.hard.total++;
      else if (difficulty === 'theory') result.theory.total++;
    });
    
    // Count completed questions by difficulty
    if (progress) {
      progress.filter(p => p.is_completed).forEach(p => {
        const question = questions.find(q => q.id === p.question_id);
        if (question) {
          const difficulty = question.difficulty.toLowerCase();
          if (difficulty === 'easy') result.easy.completed++;
          else if (difficulty === 'medium') result.medium.completed++;
          else if (difficulty === 'hard') result.hard.completed++;
          else if (difficulty === 'theory') result.theory.completed++;
        }
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error calculating learning progress:', error);
    return {
      easy: { completed: 0, total: 0 },
      medium: { completed: 0, total: 0 },
      hard: { completed: 0, total: 0 },
      theory: { completed: 0, total: 0 }
    };
  }
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

// New function to fetch learning paths progress for a user
export async function getUserLearningPathsProgress(userId: string): Promise<{
  pathId: string;
  title: string;
  description: string;
  difficulty: string;
  completed: number;
  total: number;
  percentComplete: number;
}[]> {
  try {
    // Get user data to check assigned learning paths
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('assigned_learning_paths')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;

    // Get all learning paths
    const { data: learningPaths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*');
    
    if (pathsError) throw pathsError;
    
    // Filter paths if user has assigned ones, otherwise use all
    const relevantPaths = userData.assigned_learning_paths?.length
      ? learningPaths.filter(path => userData.assigned_learning_paths.includes(path.id))
      : learningPaths;

    // Get all topics to map to learning paths
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, learning_path_id');
    
    if (topicsError) throw topicsError;
    
    // Get questions to map to topics
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, topic_id');
    
    if (questionsError) throw questionsError;
    
    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('question_id, is_completed')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    // Calculate progress for each learning path
    return relevantPaths.map(path => {
      // Get topics for this learning path
      const pathTopics = topics.filter(topic => topic.learning_path_id === path.id);
      const topicIds = pathTopics.map(topic => topic.id);
      
      // Get questions for these topics
      const pathQuestions = questions.filter(q => topicIds.includes(q.topic_id));
      const questionIds = pathQuestions.map(q => q.id);
      
      // Count completed questions
      const completedQuestions = progress
        ? progress.filter(p => questionIds.includes(p.question_id) && p.is_completed).length
        : 0;
        
      const totalQuestions = pathQuestions.length;
      const percentComplete = totalQuestions > 0 
        ? Math.round((completedQuestions / totalQuestions) * 100) 
        : 0;
      
      return {
        pathId: path.id,
        title: path.title,
        description: path.description,
        difficulty: path.difficulty,
        completed: completedQuestions,
        total: totalQuestions,
        percentComplete
      };
    });
  } catch (error) {
    console.error('Error fetching learning paths progress:', error);
    return [];
  }
}
