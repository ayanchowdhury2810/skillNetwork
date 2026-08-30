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

// Parse host and port from FALKORDB_HOST if it includes ":port"
let host: string = FALKORDB_HOST!;
let port: number = parseInt(FALKORDB_PORT!, 10);
if (FALKORDB_HOST!.includes(":")) {
  const parts = FALKORDB_HOST!.split(":");
  host = parts[0] as string;
  if (parts[1]) {
    port = parseInt(parts[1], 10);
  }
}

const options: FalkorDBOptions = {
  host: host as string,
  port,
  username: FALKORDB_USERNAME as string,
  password: FALKORDB_PASSWORD as string,
};

try {
  const client = await FalkorDB.connect(options);

  const graphs = await client.list();
  console.log("Connected! Available graphs:", graphs);

  const graph = client.selectGraph(FALKORDB_GRAPH);
  const result = await graph.query("RETURN 1 AS ping");
  console.log("Query result:", result);

  const info = await client.info();
  console.log("Server info:", info);

  await client.close();
} catch (err) {
  console.error("Connection failed:", (err as Error).message);
  process.exit(1);
}