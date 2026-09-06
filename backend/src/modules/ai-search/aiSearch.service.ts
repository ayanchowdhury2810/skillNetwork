import * as repository from "./aiSearch.repository.js";
import { getGenerativeModel } from "./graphrag.js";
import type { SearchResponse } from "./aiSearch.types.js";

const buildGraphContext = async (): Promise<string> => {
  const [users, domains, relations] = await Promise.all([
    repository.fetchAllUsers(),
    repository.fetchAllDomains(),
    repository.fetchSkillRelations(),
  ]);

  let context = "Users:\n\n";
  for (const user of users) {
    context += `${user.name}\n`;
    context += `  Skills: ${user.skills.join(", ") || "none"}\n`;
    context += `  Interests: ${user.interests.join(", ") || "none"}\n\n`;
  }

  context += "Domains:\n\n";
  for (const domain of domains) {
    context += `${domain.domain}: ${domain.skills.join(", ")}\n`;
  }

  context += "\nSkill Relationships:\n\n";
  for (const rel of relations) {
    context += `${rel.skill} -> ${rel.relatedSkills.join(", ")}\n`;
  }

  return context;
};

const SYSTEM_PROMPT = `You are an expert developer network assistant for Skill Network, a graph-based developer recommendation platform.

Use only the provided graph data to answer questions. Do not invent users, skills, or relationships that are not in the data.

When recommending users:
1. Explain your reasoning based on their skills and interests
2. Mention specific skills and domain interests
3. If a user has related skills, mention those connections
4. Be concise but helpful`;

export const search = async (query: string): Promise<SearchResponse> => {
  const graphContext = await buildGraphContext();

  const userPrompt = `Question: ${query}

Graph Context:
${graphContext}

Instructions:
1. Answer using only the graph data above.
2. Recommend relevant users if the question asks for developers.
3. Explain your reasoning based on skills, interests, and relationships.
4. Do not invent users or data not present in the graph context.`;

  const model = getGenerativeModel();

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT + "\n\n" + userPrompt },
  ]);

  const answer =
    result.response.text() || "No answer generated.";

  return {
    success: true,
    answer,
  };
};
