import { getLanguageModel } from "@/lib/ai/providers";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    const lastMessage = messages[messages.length - 1];
    
    let userMessage = "";
    if (lastMessage.content) {
      userMessage = lastMessage.content;
    } else if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
      const textPart = lastMessage.parts.find(
        (part: any) => part.type === "text" && part.text
      );
      if (textPart) {
        userMessage = textPart.text;
      }
    }
    
    if (!userMessage) {
      userMessage = "Hello";
    }
    
    const modelId = "llama-3.3-70b-versatile";
    
    const { text } = await generateText({
      model: getLanguageModel(modelId),
      prompt: userMessage,
      system: "You are a helpful AI assistant. Answer the user's question concisely.",
    });

    console.log("AI response:", text);

    // Return simple JSON response
    return NextResponse.json({ 
      content: text,
      role: "assistant" 
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}