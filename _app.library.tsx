import { createFileRoute, Link } from "@tanstack/react-router";
import { useLibrary } from "@/stores/library";
import { Heart, ListMusic, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/library")({
  head: () => ({ meta: [{ title: "Library — Aurabrown" }] }),
  component: Library,
});

function Library() {
  const liked = useLibrary((s) => s.liked);
  const playlists = useLibrary((s) => s.playlists);
  const recents = useLibrary((s) => s.recents);

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Your Library</h1>
        <Link
          to="/playlists"
          className="px-4 py-2 rounded-full bg-gradient-brand text-brand-foreground text-sm font-semibold hover:scale-105 transition"
        >
          New playlist
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/liked"
          className="glass rounded-xl p-4 flex items-center gap-4 hover:shadow-brand transition"
        >
          <div className="w-16 h-16 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Heart className="w-6 h-6 text-brand-foreground fill-current" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold">Liked Songs</div>
            <div className="text-xs text-muted-foreground">{liked.length} songs</div>
          </div>
        </Link>
        {playlists.map((p) => (
          <Link
            key={p.id}
            to="/playlists/$id"
            params={{ id: p.id }}
            className="glass rounded-xl p-4 flex items-center gap-4 hover:shadow-brand transition"
          >
            <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center overflow-hidden">
              {p.songs[0]?.artwork ? (
                <img src={p.songs[0].artwork} alt="" className="w-full h-full object-cover" />
              ) : (
                <ListMusic className="w-6 h-6 text-brand" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.songs.length} songs</div>
            </div>
          </Link>
        ))}
      </div>

      {recents.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Recently played
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {recents.slice(0, 12).map((s) => (
              <div key={s.id} className="glass rounded-lg p-2">
                <img src={s.artwork} alt="" className="w-full aspect-square rounded object-cover" />
                <div className="text-xs font-medium truncate mt-2">{s.title}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
