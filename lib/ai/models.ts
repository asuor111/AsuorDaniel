export const DEFAULT_CHAT_MODEL = "llama-3.3-70b-versatile";
export const isDemo = false;

export const titleModel = {
  id: "llama-3.3-70b-versatile",
  name: "Llama 3.3 70B",
  provider: "groq",
  description: "Fast model for title generation",
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
    description: "Fast and capable Groq model",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    provider: "groq",
    description: "Fast and lightweight Groq model",
  },
];

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);

export async function getCapabilities(): Promise<Record<string, ModelCapabilities>> {
  const capabilities: Record<string, ModelCapabilities> = {};
  
  chatModels.forEach(model => {
    capabilities[model.id] = {
      tools: true,
      vision: false,
      reasoning: true,
    };
  });
  
  return capabilities;
}