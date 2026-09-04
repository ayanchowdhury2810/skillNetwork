export interface User {
  id: string;
  name: string;
}

export interface Skill {
  name: string;
}

export interface Recommendation {
  userId: string;
  name: string;
  score: number;
  commonSkills: string[];
}

export interface Domain {
  name: string;
}
