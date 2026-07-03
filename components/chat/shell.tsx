"use client";

import { SimpleChat } from "./simple-chat";

export function ChatShell() {
  return (
    <div className="flex h-full flex-col">
      <SimpleChat />
    </div>
  );
}