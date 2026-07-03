"use server";

import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import { auth } from "@/app/(auth)/auth";
import { getTitleModel } from "@/lib/ai/providers";
import { titlePrompt } from "@/lib/ai/prompts";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  try {
    // Extract text from message safely
    let messageText = "";

    // Try content first (for simple messages)
    if (message.content && typeof message.content === "string") {
      messageText = message.content;
    } 
    // Try parts (for complex messages)
    else if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        // Check if this is a text part with text property
        if (part && typeof part === "object" && "type" in part && part.type === "text") {
          const textPart = part as { type: "text"; text: string };
          if (textPart.text) {
            messageText = textPart.text;
            break;
          }
        }
      }
    }

    // Fallback if no text found
    if (!messageText) {
      messageText = "New chat";
    }

    const { text } = await generateText({
      model: getTitleModel(),
      system: titlePrompt,
      prompt: messageText,
    });

    return text
      .replace(/^[#*"\s]+/, "")
      .replace(/["]+$/, "")
      .trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Chat";
  }
}