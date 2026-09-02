import { graph } from "../../config/falkordb.js";

export const getUserById = async (userId: string) => {
  return graph.query(
    `
    MATCH (u:User {id:$userId})
    RETURN u
    `,
    { params: { userId } }
  );
};

export const getRecommendedUsers = async (userId: string) => {
  return graph.query(
    `
    MATCH (u:User {id:$userId})-[:HAS_SKILL]->(s:Skill)
    MATCH (other:User)-[:HAS_SKILL]->(s)
    WHERE other.id <> $userId
    RETURN
      other.id AS userId,
      other.name AS name,
      COUNT(DISTINCT s) AS score,
      COLLECT(DISTINCT s.name) AS commonSkills
    ORDER BY score DESC
    LIMIT 10
    `,
    { params: { userId } }
  );
};
