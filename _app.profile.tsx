import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/stores/auth";
import { useLibrary } from "@/stores/library";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — Aurabrown" }] }),
  component: Profile,
});

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const liked = useLibrary((s) => s.liked.length);
  const playlists = useLibrary((s) => s.playlists.length);
  const recents = useLibrary((s) => s.recents.length);
  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const navigate = useNavigate();

  const save = () => {
    updateProfile({ name, avatar });
    toast.success("Profile updated");
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl space-y-8">
      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center shadow-brand overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-10 h-10 text-brand-foreground" />
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          ["Liked", liked],
          ["Playlists", playlists],
          ["Recents", recents],
        ].map(([label, value]) => (
          <div key={label} className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient-brand">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-display text-xl font-bold">Account</h2>
        <div>
          <label className="text-xs text-muted-foreground">Display name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2.5 rounded-lg bg-input/30 border border-border focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Avatar URL</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full px-4 py-2.5 rounded-lg bg-input/30 border border-border focus:border-brand focus:outline-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={save}
            className="px-5 py-2.5 rounded-lg bg-gradient-brand text-brand-foreground font-semibold shadow-brand hover:scale-105 transition"
          >
            Save changes
          </button>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="px-5 py-2.5 rounded-lg glass hover:bg-destructive hover:text-destructive-foreground transition inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
