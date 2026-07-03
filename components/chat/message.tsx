"use client";

import { useActiveChat } from "@/hooks/use-active-chat";

export function Messages() {
  const { messages } = useActiveChat();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {!messages || messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Start a new conversation
        </div>
      ) : (
        messages.map((msg: any, idx: number) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-muted text-foreground mr-auto"
            }`}
          >
            {msg.content || msg.parts?.[0]?.text || "..."}
          </div>
        ))
      )}
    </div>
  );
}