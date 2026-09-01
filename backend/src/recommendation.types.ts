export interface RecommendationJob {
  jobId: string;
  title: string;
  company: string;
  score: number;
}

export interface RecommendationResponse {
  success: boolean;
  data: RecommendationJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CandidateProfile {
  skills: string[];
  experience: number;
  preferredLocation: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  requiredSkills: string[];
  requiredExperience: number;
  location: string;
  isRemote: boolean;
  status: "active" | "closed";
}

export interface ScoreBreakdown {
  skillsScore: number;
  experienceScore: number;
  locationScore: number;
  total: number;
}
