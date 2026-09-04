import { graph } from "../../config/falkordb.js";

export const relateSkills = async (
  sourceSkill: string,
  targetSkill: string
) => {
  const query = `
    MATCH (s1:Skill {name:$sourceSkill})
    MATCH (s2:Skill {name:$targetSkill})
    MERGE (s1)-[:RELATED_TO]->(s2)
    MERGE (s2)-[:RELATED_TO]->(s1)
    RETURN s1, s2
  `;

  const result = await graph.query(query, { params: { sourceSkill, targetSkill } });

  return result.data;
};

export const getRelatedSkills = async (skillName: string) => {
  const query = `
    MATCH (s:Skill {name:$skillName})-[:RELATED_TO]->(related:Skill)
    RETURN related.name AS name
    ORDER BY name
  `;

  const result = await graph.query(query, { params: { skillName } });

  return result.data;
};
