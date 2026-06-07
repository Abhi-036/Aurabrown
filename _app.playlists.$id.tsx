import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useLibrary } from "@/stores/library";
import { SongRow } from "@/components/SongRow";
import { usePlayer } from "@/stores/player";
import { ListMusic, Play, Trash2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_app/playlists/$id")({
  head: () => ({ meta: [{ title: "Playlist — Aurabrown" }] }),
  component: PlaylistDetail,
});

function PlaylistDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const playlist = useLibrary((s) => s.playlists.find((p) => p.id === id));
  const removeFromPlaylist = useLibrary((s) => s.removeFromPlaylist);
  const deletePlaylist = useLibrary((s) => s.deletePlaylist);
  const playQueue = usePlayer((s) => s.playQueue);

  if (!playlist) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Playlist not found.</p>
        <Link to="/playlists" className="text-brand hover:underline mt-2 inline-block">
          Back to playlists
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-hero px-4 md:px-8 py-10 md:py-16 border-b border-border/60">
        <Link
          to="/playlists"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Playlists
        </Link>
        <div className="flex items-end gap-6">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand overflow-hidden">
            {playlist.songs[0]?.artwork ? (
              <img src={playlist.songs[0].artwork} alt="" className="w-full h-full object-cover" />
            ) : (
              <ListMusic className="w-14 h-14 text-brand-foreground" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Playlist</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-1">{playlist.name}</h1>
            <p className="text-sm text-muted-foreground mt-3">{playlist.songs.length} songs</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          {playlist.songs.length > 0 && (
            <button
              onClick={() => playQueue(playlist.songs, 0)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-brand text-brand-foreground font-semibold shadow-brand hover:scale-105 transition"
            >
              <Play className="w-4 h-4 fill-current" /> Play
            </button>
          )}
          <button
            onClick={() => {
              deletePlaylist(playlist.id);
              navigate({ to: "/playlists" });
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-destructive hover:text-destructive-foreground transition"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6">
        {playlist.songs.length === 0 ? (
          <p className="text-muted-foreground">
            This playlist is empty. Search for songs and add them via the menu.
          </p>
        ) : (
          <div className="space-y-1">
            {playlist.songs.map((s, i) => (
              <SongRow
                key={s.id}
                song={s}
                index={i}
                queue={playlist.songs}
                onRemove={() => removeFromPlaylist(playlist.id, s.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
