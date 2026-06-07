import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getSession } from "@/lib/auth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const session = getSession();

  useEffect(() => {
    if (!session) {
      navigate("/auth", { replace: true });
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b bg-card px-4">
            <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Bienvenido, {session.nombre}
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
