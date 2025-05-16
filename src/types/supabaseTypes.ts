
export interface Profile {
  id: string;
  real_name: string;
  bio: string | null;
  college_name: string | null;
  location: string | null;
  profile_picture_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  leetcode_url: string | null;
  hackerrank_url: string | null;
  gfg_url: string | null;
  cgpa: number | null;
  created_at: string;
  updated_at: string;
  username: string;
  email: string;
  prn: string;
  grad_year: number | null;
  department: string | null;
  course: string | null;
  active: boolean | null;
}

export interface Training {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  title: string;
  organization: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  assessment_date: string;
  user_id: string;
  title: string;
  provider: string;
  score: string;
  max_score: string;
  certificate_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  company: string;
  position: string;
  location: string | null;
  description: string;
  technologies: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  title: string;
  description: string;
  technologies: string[] | null;
  project_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  issue_date: string;
  expiry_date: string | null;
  title: string;
  issuer: string;
  credential_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  user_id: string;
  publication_date: string;
  title: string;
  authors: string[];
  publication_name: string;
  doi: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface BadgeType {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  background_color: string;
  text_color: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  is_completed: boolean;
  is_marked_for_revision: boolean;
  created_at: string;
  updated_at: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  sr: number | null;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  learning_path_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  topic_id: string;
  title: string;
  difficulty: string;
  solution_link: string | null;
  practice_link: string | null;
  created_at: string;
  updated_at: string;
  questionid: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grad_year?: number | null;
  department?: string;
  course?: string;
  joinDate: string;
  location?: string;
  bio?: string;
}
