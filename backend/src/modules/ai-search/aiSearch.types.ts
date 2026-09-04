export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  success: boolean;
  answer: string;
}

export interface GraphUser {
  id: string;
  name: string;
  skills: string[];
  interests: string[];
}

export interface GraphDomain {
  domain: string;
  skills: string[];
}

export interface GraphSkillRelation {
  skill: string;
  relatedSkills: string[];
}
