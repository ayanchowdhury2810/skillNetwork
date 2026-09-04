import { config as loadEnv } from "dotenv";
import { FalkorDB, type FalkorDBOptions } from "falkordb";

loadEnv();

const {
  FALKORDB_HOST,
  FALKORDB_PORT,
  FALKORDB_USERNAME,
  FALKORDB_PASSWORD,
  FALKORDB_GRAPH,
} = process.env;

if (
  !FALKORDB_HOST ||
  !FALKORDB_PORT ||
  !FALKORDB_USERNAME ||
  !FALKORDB_PASSWORD ||
  !FALKORDB_GRAPH
) {
  throw new Error("Missing FalkorDB credentials in .env");
}

let host: string = FALKORDB_HOST;
let port: number = parseInt(FALKORDB_PORT, 10);
if (FALKORDB_HOST.includes(":")) {
  const parts = FALKORDB_HOST.split(":") as [string, string];
  host = parts[0]!;
  port = parseInt(parts[1]!, 10);
}

const options: FalkorDBOptions = {
  host,
  port,
  username: FALKORDB_USERNAME,
  password: FALKORDB_PASSWORD,
};

const client = await FalkorDB.connect(options);
const graph = client.selectGraph(FALKORDB_GRAPH);

const domains = ["Frontend", "Backend", "Mobile", "DevOps", "AI"];

const domainSkills: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "TypeScript", "Redux"],
  Backend: ["Node.js", "Express", "PostgreSQL", "Prisma"],
  Mobile: ["Flutter", "Dart", "Kotlin", "Jetpack Compose"],
  DevOps: ["Docker", "Kubernetes", "AWS"],
  AI: ["Python", "LangChain", "GraphRAG", "Vector DB"],
};

const relatedSkills: [string, string][] = [
  ["React", "Next.js"],
  ["React", "Redux"],
  ["Node.js", "Express"],
  ["PostgreSQL", "Prisma"],
  ["Flutter", "Dart"],
  ["Kotlin", "Jetpack Compose"],
  ["Docker", "Kubernetes"],
  ["Python", "LangChain"],
];

async function seed() {
  console.log("Seeding domains...");
  for (const domain of domains) {
    await graph.query(`MERGE (d:Domain {name:$name})`, {
      params: { name: domain },
    });
    console.log(`  Created domain: ${domain}`);
  }

  console.log("\nSeeding skills and domain relationships...");
  for (const [domain, skills] of Object.entries(domainSkills)) {
    for (const skill of skills) {
      await graph.query(
        `
        MERGE (s:Skill {name:$skill})
        WITH s
        MATCH (d:Domain {name:$domain})
        MERGE (d)-[:CONTAINS]->(s)
        `,
        { params: { skill, domain } }
      );
      console.log(`  ${domain} -> ${skill}`);
    }
  }

  console.log("\nSeeding skill relations...");
  for (const [source, target] of relatedSkills) {
    await graph.query(
      `
      MATCH (s1:Skill {name:$source})
      MATCH (s2:Skill {name:$target})
      MERGE (s1)-[:RELATED_TO]->(s2)
      MERGE (s2)-[:RELATED_TO]->(s1)
      `,
      { params: { source, target } }
    );
    console.log(`  ${source} <-> ${target}`);
  }

  console.log("\nSeed complete!");

  const domainCount = await graph.query(`MATCH (d:Domain) RETURN count(d) AS count`);
  const skillCount = await graph.query(`MATCH (s:Skill) RETURN count(s) AS count`);
  const relCount = await graph.query(`MATCH ()-[r:RELATED_TO]->() RETURN count(r) AS count`);
  const containsCount = await graph.query(`MATCH ()-[r:CONTAINS]->() RETURN count(r) AS count`);

  console.log(`\nGraph stats:`);
  console.log(`  Domains: ${JSON.stringify(domainCount.data)}`);
  console.log(`  Skills: ${JSON.stringify(skillCount.data)}`);
  console.log(`  RELATED_TO relationships: ${JSON.stringify(relCount.data)}`);
  console.log(`  CONTAINS relationships: ${JSON.stringify(containsCount.data)}`);

  await client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
