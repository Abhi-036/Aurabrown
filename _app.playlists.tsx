import { createFileRoute, Link } from "@tanstack/react-router";
import { useLibrary } from "@/stores/library";
import { useState } from "react";
import { ListMusic, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/playlists")({
  head: () => ({ meta: [{ title: "Playlists — Aurabrown" }] }),
  component: Playlists,
});

function Playlists() {
  const { playlists, createPlaylist, deletePlaylist } = useLibrary();
  const [name, setName] = useState("");

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name.trim());
    setName("");
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold">Playlists</h1>

      <form onSubmit={onCreate} className="flex gap-2 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 px-4 py-3 rounded-lg bg-input/30 border border-border focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-lg bg-gradient-brand text-brand-foreground font-semibold shadow-brand hover:scale-105 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      </form>

      {playlists.length === 0 ? (
        <p className="text-muted-foreground">No playlists yet — create your first above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              className="glass rounded-xl p-4 group relative"
            >
              <Link to="/playlists/$id" params={{ id: p.id }} className="block">
                <div className="aspect-square rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand overflow-hidden">
                  {p.songs[0]?.artwork ? (
                    <img src={p.songs[0].artwork} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ListMusic className="w-12 h-12 text-brand-foreground" />
                  )}
                </div>
                <div className="mt-3">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.songs.length} songs</div>
                </div>
              </Link>
              <button
                onClick={() => deletePlaylist(p.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-card/80 opacity-0 group-hover:opacity-100 transition hover:bg-destructive hover:text-destructive-foreground"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
