import { Suspense } from "react";
import { DataStreamProvider } from "@/components/chat/data-stream-provider";
import { AppSidebar } from "@/components/chat/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { ActiveChatProvider } from "@/hooks/use-active-chat";
import { auth } from "@/app/(auth)/auth";

// Separate component that uses auth
async function ChatLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <SidebarProvider defaultOpen={true}>
      <DataStreamProvider>
        <ActiveChatProvider>
          <div className="flex h-dvh w-full flex-col bg-background">
            {/* Brand Header */}
            <header className="flex h-16 items-center border-b border-border/30 bg-card/70 px-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                  <span className="text-lg font-bold text-white">O</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    Orphentis
                  </h1>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    AI Assistant
                  </p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Online
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar user={user} />
              <SidebarInset>
                <div className="flex h-full flex-col">{children}</div>
              </SidebarInset>
            </div>
          </div>
          <Toaster position="top-center" theme="system" />
        </ActiveChatProvider>
      </DataStreamProvider>
    </SidebarProvider>
  );
}

// Main layout with Suspense boundary
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <ChatLayoutContent children={children} />
    </Suspense>
  );
}