import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song } from "@/lib/audius";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: number;
}

interface LibraryState {
  liked: Song[];
  playlists: Playlist[];
  recents: Song[];
  toggleLike: (song: Song) => void;
  isLiked: (id: string) => boolean;
  pushRecent: (song: Song) => void;
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string, description?: string) => void;
  addToPlaylist: (id: string, song: Song) => void;
  removeFromPlaylist: (id: string, songId: string) => void;
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      liked: [],
      playlists: [],
      recents: [],
      toggleLike: (song) =>
        set((s) => ({
          liked: s.liked.some((x) => x.id === song.id)
            ? s.liked.filter((x) => x.id !== song.id)
            : [song, ...s.liked],
        })),
      isLiked: (id) => get().liked.some((s) => s.id === id),
      pushRecent: (song) =>
        set((s) => ({
          recents: [song, ...s.recents.filter((x) => x.id !== song.id)].slice(0, 20),
        })),
      createPlaylist: (name, description) => {
        const pl: Playlist = {
          id: crypto.randomUUID(),
          name,
          description,
          songs: [],
          createdAt: Date.now(),
        };
        set((s) => ({ playlists: [pl, ...s.playlists] }));
        return pl;
      },
      deletePlaylist: (id) =>
        set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),
      renamePlaylist: (id, name, description) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id ? { ...p, name, description } : p,
          ),
        })),
      addToPlaylist: (id, song) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id && !p.songs.some((x) => x.id === song.id)
              ? { ...p, songs: [...p.songs, song] }
              : p,
          ),
        })),
      removeFromPlaylist: (id, songId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id ? { ...p, songs: p.songs.filter((x) => x.id !== songId) } : p,
          ),
        })),
    }),
    { name: "aurabrown-library" },
  ),
);
