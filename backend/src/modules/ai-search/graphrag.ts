import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as loadEnv } from "dotenv";

loadEnv();

const { GEMINI_API_KEY, LLM_MODEL } = process.env;

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const MODEL = LLM_MODEL || "gemini-1.5-flash";

export const getGenerativeModel = () =>
  genAI.getGenerativeModel({ model: MODEL });
