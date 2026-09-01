import { graph } from "../config/falkordb.js";
import { randomUUID } from "crypto";

export const createUser = async (name: string) => {
  const id = randomUUID();

  const query = `\n      CREATE (u:User {
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
  return graph.query(`\n    MATCH (u:User)\n    RETURN u\n  `);
};

export const getUserById = async (id: string) => {
  return graph.query(`\n    MATCH (u:User) WHERE u.id = $id\n    RETURN u\n  `, { params: { id } });
};