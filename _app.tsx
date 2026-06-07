import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/stores/auth";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { Player } from "@/components/Player";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate({ to: "/auth", replace: true });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-40 md:pb-28">
        <Outlet />
      </main>
      <MobileNav />
      <Player />
    </div>
  );
}
