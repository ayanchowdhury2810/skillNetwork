import { FalkorDB, type FalkorDBOptions } from "falkordb";
import { config as loadEnv } from "dotenv";

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

let host = FALKORDB_HOST;
let port = parseInt(FALKORDB_PORT, 10);
  if (FALKORDB_HOST!.includes(":")) {
    const parts = FALKORDB_HOST!.split(":") as [string, string];
    host = parts[0];
    port = parseInt(parts[1]!, 10);
  }

const options: FalkorDBOptions = {
  host,
  port,
  username: FALKORDB_USERNAME!,
  password: FALKORDB_PASSWORD!,
};

export const client = await FalkorDB.connect(options);
export const graph = client.selectGraph(FALKORDB_GRAPH!);