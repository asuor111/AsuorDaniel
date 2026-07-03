"use server";

import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import { auth } from "@/app/(auth)/auth";
import { getTitleModel } from "@/lib/ai/providers";
import { titlePrompt } from "@/lib/ai/prompts";
import type { VisibilityType } from "@/components/chat/visibility-selector";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getChatById,
  getMessageById,
  updateChatVisibilityById,
} from "@/lib/db/queries";

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
    let messageText = "";

    if (message.content && typeof message.content === "string") {
      messageText = message.content;
    } else if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        if (part && typeof part === "object" && "type" in part && part.type === "text") {
          const textPart = part as { type: "text"; text: string };
          if (textPart.text) {
            messageText = textPart.text;
            break;
          }
        }
      }
    }

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

export async function deleteTrailingMessages({ id }: { id: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const messageResult = await getMessageById({ id });
  if (!messageResult) {
    throw new Error("Message not found");
  }

  const message = Array.isArray(messageResult) ? messageResult[0] : messageResult;
  if (!message || !message.chatId) {
    throw new Error("Message not found");
  }

  const chat = await getChatById({ id: message.chatId });
  if (!chat || chat.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt || new Date(),
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const chat = await getChatById({ id: chatId });
  if (!chat || chat.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await updateChatVisibilityById({ chatId, visibility });
}