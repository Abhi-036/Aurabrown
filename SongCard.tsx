import { Play } from "lucide-react";
import type { Song } from "@/lib/audius";
import { usePlayer } from "@/stores/player";
import { motion } from "framer-motion";

export function SongCard({ song, queue }: { song: Song; queue?: Song[] }) {
  const playQueue = usePlayer((s) => s.playQueue);
  const playSong = usePlayer((s) => s.playSong);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative glass rounded-xl p-3 cursor-pointer transition-all hover:shadow-brand"
      onClick={() => (queue ? playQueue(queue, queue.findIndex((s) => s.id === song.id)) : playSong(song))}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={song.artwork}
          alt={song.album}
          loading="lazy"
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <button
          aria-label={`Play ${song.title}`}
          className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center shadow-brand opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
        >
          <Play className="w-4 h-4 text-brand-foreground fill-current ml-0.5" />
        </button>
      </div>
      <div className="mt-3 px-1">
        <div className="text-sm font-semibold truncate">{song.title}</div>
        <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
      </div>
    </motion.div>
  );
}

export function SongCardSkeleton() {
  return (
    <div className="glass rounded-xl p-3 animate-pulse">
      <div className="aspect-square bg-muted/40 rounded-lg" />
      <div className="mt-3 h-3 bg-muted/40 rounded w-3/4" />
      <div className="mt-2 h-2 bg-muted/40 rounded w-1/2" />
    </div>
  );
}
