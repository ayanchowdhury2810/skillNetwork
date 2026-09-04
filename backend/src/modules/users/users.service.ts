import { graph } from "../../config/falkordb.js";
import { randomUUID } from "crypto";

export const createUser = async (name: string, skill: string) => {
  const id = randomUUID();

  const query = `
      CREATE (u:User {
          id: $id,
          name: $name
      })
      WITH u
      MERGE (s:Skill {name: $skill})
      CREATE (u)-[:HAS_SKILL]->(s)
      RETURN u, collect(s.name) AS skills
  `;

  const result = await graph.query(query, {
    params: {
      id,
      name,
      skill,
    },
  });

  return result.data;
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
