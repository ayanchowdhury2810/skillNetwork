import type { RecommendedUser } from "./recommendations.types.js";
import * as repository from "./recommendations.repository.js";

export const getRecommendations = async (
  userId: string
): Promise<{ found: boolean; data: RecommendedUser[] }> => {
  const userResult = await repository.getUserById(userId);

  if (!userResult.data || userResult.data.length === 0) {
    return { found: false, data: [] };
  }

  const result = await repository.getRecommendedUsers(userId);

  if (!result.data) {
    return { found: true, data: [] };
  }

  const recommendations: RecommendedUser[] = result.data.map(
    (row) => {
      const record = row as Record<string, unknown>;
      return {
        userId: record["userId"] as string,
        name: record["name"] as string,
        score: record["score"] as number,
        commonSkills: record["commonSkills"] as string[],
      };
    }
  );

  return { found: true, data: recommendations };
};
