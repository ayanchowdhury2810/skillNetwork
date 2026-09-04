import OpenAI from "openai";
import { config as loadEnv } from "dotenv";

loadEnv();

const { OPENAI_API_KEY, LLM_MODEL } = process.env;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in .env");
}

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const MODEL = LLM_MODEL || "gpt-4o-mini";
