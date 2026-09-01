import { graph } from "../../config/falkordb.js";
import { randomUUID } from "crypto";

export const createUser = async (name: string) => {
  const id = randomUUID();

  const query = `
      CREATE (u:User {
          id: $id,
          name: $name
      })
      RETURN u
  `;

  const result = await graph.query(query, {
    params: {
      id,
      name,
    },
  });

  return result;
};

export const getAllUsers = async () => {
  return graph.query(`
    MATCH (u:User)
    RETURN u
  `);
};

export const getUserById = async (id: string) => {
  return graph.query(`
    MATCH (u:User) WHERE u.id = $id
    RETURN u
  `, { params: { id } });
};
