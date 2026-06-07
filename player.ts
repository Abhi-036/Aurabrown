import { create } from "zustand";
import type { Song } from "@/lib/audius";

type RepeatMode = "off" | "all" | "one";

interface PlayerState {
  queue: Song[];
  index: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: RepeatMode;
  current: () => Song | null;
  playQueue: (songs: Song[], startIndex?: number) => void;
  playSong: (song: Song) => void;
  toggle: () => void;
  setPlaying: (v: boolean) => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  setProgress: (v: number) => void;
  setDuration: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  index: 0,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: "off",
  current: () => get().queue[get().index] ?? null,
  playQueue: (songs, startIndex = 0) =>
    set({ queue: songs, index: startIndex, isPlaying: true, progress: 0 }),
  playSong: (song) => set({ queue: [song], index: 0, isPlaying: true, progress: 0 }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  next: () => {
    const { queue, index, shuffle, repeat } = get();
    if (!queue.length) return;
    if (repeat === "one") {
      set({ progress: 0, isPlaying: true });
      return;
    }
    let nextIndex = shuffle
      ? Math.floor(Math.random() * queue.length)
      : index + 1;
    if (nextIndex >= queue.length) {
      if (repeat === "all") nextIndex = 0;
      else {
        set({ isPlaying: false });
        return;
      }
    }
    set({ index: nextIndex, progress: 0, isPlaying: true });
  },
  prev: () => {
    const { queue, index, progress } = get();
    if (!queue.length) return;
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    set({ index: Math.max(0, index - 1), progress: 0, isPlaying: true });
  },
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  cycleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    })),
}));
