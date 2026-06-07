import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/stores/settings";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Smartphone, Keyboard } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Aurabrown" }] }),
  component: Settings,
});

function Settings() {
  const { theme, toggleTheme, gestureEnabled, setGestureEnabled } = useSettings();

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl space-y-6">
      <h1 className="font-display text-3xl md:text-4xl font-bold">Settings</h1>

      <Row
        icon={theme === "dark" ? Moon : Sun}
        title="Theme"
        description={`Currently ${theme}. Switch between dark and light brown aesthetics.`}
      >
        <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
      </Row>

      <Row
        icon={Smartphone}
        title="Gesture control"
        description="Flip your phone face-down to automatically pause playback."
      >
        <Switch checked={gestureEnabled} onCheckedChange={setGestureEnabled} />
      </Row>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Keyboard className="w-5 h-5 text-brand" />
          <h2 className="font-semibold">Keyboard shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <Shortcut keys="Space" label="Play / pause" />
          <Shortcut keys="Shift + →" label="Next track" />
          <Shortcut keys="Shift + ←" label="Previous track" />
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Moon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center text-brand">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      {children}
    </div>
  );
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-accent/30">
      <span className="text-muted-foreground">{label}</span>
      <kbd className="px-2 py-1 rounded bg-card text-xs font-mono">{keys}</kbd>
    </div>
  );
}
