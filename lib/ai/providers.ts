import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export function getLanguageModel(modelId: string) {
  return groq(modelId);
}

export function getTitleModel() {
  return groq("llama-3.3-70b-versatile");
}