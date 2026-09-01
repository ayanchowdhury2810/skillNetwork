import { graph } from "../../config/falkordb.js";

export const getCandidateProfile = async (userId: string) => {
  return graph.query(
    `
    MATCH (u:User {id:$userId})-[:HAS_SKILL]->(s:Skill)
    RETURN u, COLLECT(s.name) AS skills
  `,
    { params: { userId } }
  );
};

export const getActiveJobs = async () => {
  return graph.query(
    `
    MATCH (j:Job)-[:REQUIRES_SKILL]->(s:Skill)
    WHERE j.status = 'active'
    RETURN j, COLLECT(s.name) AS requiredSkills
  `
  );
};

export const getAppliedJobIds = async (userId: string) => {
  return graph.query(
    `
    MATCH (u:User {id:$userId})-[:APPLIED_TO]->(j:Job)
    RETURN j.id AS jobId
  `,
    { params: { userId } }
  );
};

export const getRecommendedJobsGraph = async (userId: string, limit: number) => {
  return graph.query(
    `
    MATCH (u:User {id:$userId})-[:HAS_SKILL]->(s:Skill)
          <-[:REQUIRES_SKILL]-(j:Job)
    WHERE j.status = 'active'
      AND NOT (u)-[:APPLIED_TO]->(j)
    RETURN j, COUNT(s) AS matchedSkills
    ORDER BY matchedSkills DESC
    LIMIT $limit
  `,
    { params: { userId, limit } }
  );
};
