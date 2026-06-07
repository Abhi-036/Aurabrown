export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  preview: string;
  duration: number;
  genre?: string;
}

function mapTrack(track: any): Song {
  return {
    id: String(track.id),
    title: track.title,
    artist: track.user?.name || "Unknown Artist",
    album: track.genre || "Audius",
    artwork:
      track.artwork?.["480x480"] ||
      track.artwork?.["1000x1000"] ||
      "",
    preview: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream`,
    duration: Math.floor((track.duration || 0) / 1000),
    genre: track.genre,
  };
}

export async function searchSongs(term: string): Promise<Song[]> {
  const res = await fetch(
    `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(term)}`
  );

  if (!res.ok) throw new Error("Search failed");

  const data = await res.json();

  return (data.data || []).map(mapTrack);
}

export async function getTrending(): Promise<Song[]> {
  const res = await fetch(
    "https://discoveryprovider.audius.co/v1/tracks/trending"
  );

  if (!res.ok) throw new Error("Failed to load trending tracks");

  const data = await res.json();

  return (data.data || []).slice(0, 12).map(mapTrack);
}

export async function getByGenre(
  genre: string,
  limit = 12
): Promise<Song[]> {
  const songs = await searchSongs(genre);
  return songs.slice(0, limit);
}

export async function getFeaturedRows() {
  const genres = [
    "electronic",
    "hip hop",
    "rock",
    "pop",
  ];

  return Promise.all(
    genres.map(async (g) => ({
      title: g.charAt(0).toUpperCase() + g.slice(1),
      songs: await getByGenre(g, 10),
    }))
  );
}