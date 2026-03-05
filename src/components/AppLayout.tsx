import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

const AppLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-10 flex items-center border-b border-border px-2 shrink-0">
          <SidebarTrigger className="text-muted-foreground hover:text-primary" />
          <div className="ml-auto flex items-center gap-3">
            <span className="status-online" />
            <span className="text-[10px] font-mono text-muted-foreground">SYSTEM OPERATIONAL</span>
            <span className="text-[10px] font-mono text-accent">14:23:17 UTC</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AppLayout;
