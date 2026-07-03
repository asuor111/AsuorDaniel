"use client";

import { useChat } from "@ai-sdk/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

interface ChatContextType {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  messages: any[];
  setMessages: (messages: any) => void;
  status: string;
  stop: () => void;
  sendMessage: (message: any) => void;
  attachments: any[];
  setAttachments: (attachments: any) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ActiveChatProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const chatId = pathname?.split("/").pop() || "new-chat";
  
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  
  const chat = useChat({
    id: chatId,
    api: "/api/chat",
  });

  const value = useMemo((): ChatContextType => ({
    input,
    setInput,
    messages: chat.messages || [],
    setMessages: (msgs: any) => chat.setMessages(msgs),
    status: chat.status || "ready",
    stop: () => chat.stop(),
    sendMessage: (msg: any) => chat.sendMessage(msg),
    attachments,
    setAttachments: (value: any) => setAttachments(value),
  }), [input, chat.messages, chat.status, chat.stop, chat.sendMessage, attachments]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useActiveChat() {
  const context = useContext(ChatContext);
  if (!context) {
    return {
      input: "",
      setInput: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
      messages: [],
      setMessages: () => {},
      status: "ready",
      stop: () => {},
      sendMessage: () => {},
      attachments: [],
      setAttachments: () => {},
    };
  }
  return context;
}