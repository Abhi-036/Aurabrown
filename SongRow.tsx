import { Play, Heart, MoreHorizontal, Trash2 } from "lucide-react";
import type { Song } from "@/lib/audius";
import { usePlayer } from "@/stores/player";
import { useLibrary } from "@/stores/library";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function SongRow({
  song,
  index,
  queue,
  onRemove,
}: {
  song: Song;
  index: number;
  queue?: Song[];
  onRemove?: () => void;
}) {
  const playQueue = usePlayer((s) => s.playQueue);
  const playSong = usePlayer((s) => s.playSong);
  const toggleLike = useLibrary((s) => s.toggleLike);
  const isLiked = useLibrary((s) => s.isLiked(song.id));
  const playlists = useLibrary((s) => s.playlists);
  const addToPlaylist = useLibrary((s) => s.addToPlaylist);

  const onPlay = () =>
    queue ? playQueue(queue, queue.findIndex((s) => s.id === song.id)) : playSong(song);

  return (
    <div className="group grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_1fr_auto_auto] gap-3 items-center px-3 py-2 rounded-lg hover:bg-accent/50 transition">
      <div className="text-sm text-muted-foreground w-6 text-center">
        <span className="group-hover:hidden">{index + 1}</span>
        <button onClick={onPlay} className="hidden group-hover:inline" aria-label="Play">
          <Play className="w-4 h-4" />
        </button>
      </div>
      <button onClick={onPlay} className="flex items-center gap-3 min-w-0 text-left">
        <img src={song.artwork} alt="" className="w-10 h-10 rounded object-cover" />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{song.title}</div>
          <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
        </div>
      </button>
      <div className="hidden md:block text-sm text-muted-foreground truncate">{song.album}</div>
      <button
        onClick={() => toggleLike(song)}
        aria-label="Like"
        className="p-2 rounded-full hover:bg-accent transition opacity-0 group-hover:opacity-100"
      >
        <Heart className={`w-4 h-4 ${isLiked ? "fill-brand text-brand opacity-100" : ""}`} />
      </button>
      <div className="flex items-center gap-2">
        <span className="hidden md:inline text-xs text-muted-foreground">{fmt(song.duration)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-accent" aria-label="More">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleLike(song)}>
              {isLiked ? "Remove from Liked" : "Like song"}
            </DropdownMenuItem>
            {playlists.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
                {playlists.map((p) => (
                  <DropdownMenuItem key={p.id} onClick={() => addToPlaylist(p.id, song)}>
                    {p.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            {onRemove && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRemove} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Remove
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
