import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Library, Heart, ListMusic, Settings, User, Music2 } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/library", label: "Library", icon: Library },
  { to: "/liked", label: "Liked Songs", icon: Heart },
  { to: "/playlists", label: "Playlists", icon: ListMusic },
] as const;

const bottom = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-sidebar border-r border-border/60 px-4 py-6">
      <Link to="/home" className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand">
          <Music2 className="w-5 h-5 text-brand-foreground" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight">Aurabrown</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = path === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1">
        {bottom.map((item) => {
          const active = path === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = [...items.slice(0, 3), bottom[0]];
  return (
    <nav className="md:hidden fixed bottom-[64px] left-0 right-0 z-40 glass border-t border-border/60 flex items-center justify-around py-2">
      {nav.map((item) => {
        const active = path === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] ${
              active ? "text-brand" : "text-muted-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
