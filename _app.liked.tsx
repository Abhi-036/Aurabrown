import { createFileRoute } from "@tanstack/react-router";
import { useLibrary } from "@/stores/library";
import { SongRow } from "@/components/SongRow";
import { usePlayer } from "@/stores/player";
import { Heart, Play } from "lucide-react";

export const Route = createFileRoute("/_app/liked")({
  head: () => ({ meta: [{ title: "Liked Songs — Aurabrown" }] }),
  component: Liked,
});

function Liked() {
  const liked = useLibrary((s) => s.liked);
  const playQueue = usePlayer((s) => s.playQueue);

  return (
    <div>
      <div className="bg-gradient-hero px-4 md:px-8 py-10 md:py-16 border-b border-border/60">
        <div className="flex items-end gap-6">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
            <Heart className="w-14 h-14 text-brand-foreground fill-current" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Playlist</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-1">Liked Songs</h1>
            <p className="text-sm text-muted-foreground mt-3">{liked.length} songs</p>
          </div>
        </div>
        {liked.length > 0 && (
          <button
            onClick={() => playQueue(liked, 0)}
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-brand text-brand-foreground font-semibold shadow-brand hover:scale-105 transition"
          >
            <Play className="w-4 h-4 fill-current" /> Play
          </button>
        )}
      </div>

      <div className="px-4 md:px-8 py-6">
        {liked.length === 0 ? (
          <p className="text-muted-foreground">Songs you like will appear here.</p>
        ) : (
          <div className="space-y-1">
            {liked.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queue={liked} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
