import { graph } from "../../config/falkordb.js";

export const createDomain = async (name: string) => {
  const query = `
    MERGE (d:Domain {name:$name})
    RETURN d
  `;

  await graph.query(query, { params: { name } });

  return {
    success: true,
  };
};

export const getDomains = async () => {
  const query = `
    MATCH (d:Domain)
    RETURN d.name AS name
    ORDER BY name
  `;

  const result = await graph.query(query);

  return result.data;
};

export const addSkillToDomain = async (
  domainName: string,
  skillName: string
) => {
  const query = `
    MATCH (d:Domain {name:$domainName})
    MERGE (s:Skill {name:$skillName})
    MERGE (d)-[:CONTAINS]->(s)
    RETURN d, s
  `;

  const result = await graph.query(query, { params: { domainName, skillName } });

  return result.data;
};

export const getDomainSkills = async (domainName: string) => {
  const query = `
    MATCH (d:Domain {name:$domainName})-[:CONTAINS]->(s:Skill)
    RETURN s.name AS name
    ORDER BY name
  `;

  const result = await graph.query(query, { params: { domainName } });

  return result.data;
};
