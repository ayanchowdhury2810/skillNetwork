import { graph } from "../../config/falkordb.js";
import { randomUUID } from "crypto";

export const createUser = async (name: string, skills: string[]) => {
  const id = randomUUID();

  const createUserQuery = `
    CREATE (u:User {id: $id, name: $name})
    RETURN u
  `;

  await graph.query(createUserQuery, { params: { id, name } });

  const skillNames: string[] = [];
  for (const skill of skills) {
    const trimmed = skill.trim();
    if (!trimmed) continue;

    const skillQuery = `
      MATCH (u:User {id: $id})
      MERGE (s:Skill {name: $skillName})
      MERGE (u)-[:HAS_SKILL]->(s)
      RETURN s.name AS name
    `;

    const result = await graph.query(skillQuery, {
      params: { id, skillName: trimmed },
    });

    if (result.data && result.data.length > 0) {
      const row = result.data[0] as Record<string, unknown>;
      skillNames.push(row["name"] as string);
    }
  }

  return { id, name, skills: skillNames };
};

export const getAllUsers = async () => {
  const result = await graph.query(`
    MATCH (u:User)
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
    RETURN u, collect(s.name) AS skills
  `);
  return result.data;
};

export const getUserById = async (id: string) => {
  const result = await graph.query(`
    MATCH (u:User) WHERE u.id = $id
    RETURN u
  `, { params: { id } });
  return result.data;
};

export const addUserInterest = async (userId: string, domain: string) => {
  const query = `
    MATCH (u:User {id:$userId})
    MATCH (d:Domain {name:$domain})
    MERGE (u)-[:INTERESTED_IN]->(d)
    RETURN u, d
  `;

  const result = await graph.query(query, { params: { userId, domain } });

  return result.data;
};

export const getUserInterests = async (userId: string) => {
  const query = `
    MATCH (u:User {id:$userId})-[:INTERESTED_IN]->(d:Domain)
    RETURN d.name AS name
    ORDER BY name
  `;

  const result = await graph.query(query, { params: { userId } });

  return result.data;
};

export const deleteUserById = async (id: string) => {
  const query = `
    MATCH (u:User {id: $id})
    DETACH DELETE u
    RETURN count(u) AS deleted
  `;

  const result = await graph.query(query, { params: { id } });

  return result.data;
};

export const deleteAllUsers = async () => {
  const query = `
    MATCH (u:User)
    DETACH DELETE u
    RETURN count(u) AS deleted
  `;

  const result = await graph.query(query);

  return result.data;
};
