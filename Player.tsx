import { useEffect, useRef } from "react";
import { usePlayer } from "@/stores/player";
import { useLibrary } from "@/stores/library";
import { useSettings } from "@/stores/settings";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    queue,
    index,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    toggle,
    next,
    prev,
    setProgress,
    setDuration,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    setPlaying,
  } = usePlayer();
  const current = queue[index];
  const { toggleLike, isLiked } = useLibrary();
  const pushRecent = useLibrary((s) => s.pushRecent);
  const gestureEnabled = useSettings((s) => s.gestureEnabled);

  // Load + auto-play on track change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = current.preview;
    audio.load();
    if (isPlaying) audio.play().catch(() => setPlaying(false));
    pushRecent(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Gesture control: phone flipped face-down -> pause
  useEffect(() => {
    if (!gestureEnabled) return;
    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // face down when |gamma| < 30 and beta near 180/-180 (device upside down)
      const faceDown = Math.abs(e.beta) > 150;
      if (faceDown && usePlayer.getState().isPlaying) {
        setPlaying(false);
        toast("Playback paused by gesture control.");
      }
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [gestureEnabled, setPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "ArrowRight" && e.shiftKey) next();
      else if (e.code === "ArrowLeft" && e.shiftKey) prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/60">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => next()}
      />
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="mx-auto max-w-screen-2xl px-3 md:px-6 py-2 md:py-3 flex items-center gap-3 md:gap-6"
          >
            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0 w-1/3">
              <img
                src={current.artwork}
                alt={current.album}
                className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover shadow-brand"
              />
              <div className="min-w-0 hidden sm:block">
                <div className="truncate text-sm font-semibold">{current.title}</div>
                <div className="truncate text-xs text-muted-foreground">{current.artist}</div>
              </div>
              <button
                onClick={() => toggleLike(current)}
                aria-label="Like"
                className="hidden sm:inline-flex p-2 rounded-full hover:bg-accent transition"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked(current.id) ? "fill-brand text-brand" : "text-muted-foreground"}`}
                />
              </button>
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={toggleShuffle}
                  aria-label="Shuffle"
                  className={`hidden md:inline p-2 rounded-full hover:bg-accent transition ${shuffle ? "text-brand" : "text-muted-foreground"}`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="p-2 rounded-full hover:bg-accent transition"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={toggle}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="bg-gradient-brand text-brand-foreground p-3 rounded-full shadow-brand hover:scale-105 transition"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="p-2 rounded-full hover:bg-accent transition"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={cycleRepeat}
                  aria-label="Repeat"
                  className={`hidden md:inline p-2 rounded-full hover:bg-accent transition ${repeat !== "off" ? "text-brand" : "text-muted-foreground"}`}
                >
                  {repeat === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>
              </div>
              <div className="hidden md:flex items-center gap-2 w-full max-w-xl">
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {fmt(progress)}
                </span>
                <Slider
                  value={[progress]}
                  max={duration || 30}
                  step={0.1}
                  onValueChange={(v) => {
                    if (audioRef.current) audioRef.current.currentTime = v[0];
                    setProgress(v[0]);
                  }}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10">{fmt(duration)}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="hidden md:flex items-center gap-2 w-1/4 justify-end">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                aria-label="Mute"
                className="p-2 rounded-full hover:bg-accent transition"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <Slider
                value={[volume * 100]}
                max={100}
                onValueChange={(v) => setVolume(v[0] / 100)}
                className="w-28"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
