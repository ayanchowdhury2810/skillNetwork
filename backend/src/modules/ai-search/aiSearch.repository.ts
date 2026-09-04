import { graph } from "../../config/falkordb.js";
import type {
  GraphUser,
  GraphDomain,
  GraphSkillRelation,
} from "./aiSearch.types.js";

export const fetchAllUsers = async (): Promise<GraphUser[]> => {
  const result = await graph.query(`
    MATCH (u:User)
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (u)-[:INTERESTED_IN]->(d:Domain)
    RETURN
      u.id AS id,
      u.name AS name,
      COLLECT(DISTINCT s.name) AS skills,
      COLLECT(DISTINCT d.name) AS interests
  `);

  return (result.data || []).map((row) => {
    const record = row as Record<string, unknown>;
    return {
      id: record["id"] as string,
      name: record["name"] as string,
      skills: record["skills"] as string[],
      interests: record["interests"] as string[],
    };
  });
};

export const fetchAllDomains = async (): Promise<GraphDomain[]> => {
  const result = await graph.query(`
    MATCH (d:Domain)-[:CONTAINS]->(s:Skill)
    RETURN
      d.name AS domain,
      COLLECT(s.name) AS skills
  `);

  return (result.data || []).map((row) => {
    const record = row as Record<string, unknown>;
    return {
      domain: record["domain"] as string,
      skills: record["skills"] as string[],
    };
  });
};

export const fetchSkillRelations = async (): Promise<GraphSkillRelation[]> => {
  const result = await graph.query(`
    MATCH (s:Skill)-[:RELATED_TO]->(r:Skill)
    RETURN
      s.name AS skill,
      COLLECT(DISTINCT r.name) AS relatedSkills
  `);

  return (result.data || []).map((row) => {
    const record = row as Record<string, unknown>;
    return {
      skill: record["skill"] as string,
      relatedSkills: record["relatedSkills"] as string[],
    };
  });
};
