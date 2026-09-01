import { graph } from "../../config/falkordb.js";

export const addSkillToUser = async (
  userId: string,
  skillName: string
) => {
  return graph.query(`
    MATCH (u:User {id:$userId})

    MERGE (s:Skill {
      name: $skillName
    })

    MERGE (u)-[:HAS_SKILL]->(s)

    RETURN u, s
  `, {
    params: {
      userId,
      skillName
    }
  });
};

export const getUserSkills = async (
  userId: string
) => {
  return graph.query(`
    MATCH (u:User {id:$userId})
          -[:HAS_SKILL]->
          (s:Skill)

    RETURN s
  `, {
    params: {
      userId
    }
  });
};
