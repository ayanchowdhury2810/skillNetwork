export interface RecommendedUser {
  userId: string;
  name: string;
  score: number;
  commonSkills: string[];
}

export interface RecommendationResponse {
  success: boolean;
  data: RecommendedUser[];
}
