import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "@/lib/audius";
import { SongRow } from "@/components/SongRow";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/_app/search")({
  head: () => ({ meta: [{ title: "Search — Aurabrown" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term), 350);
    return () => clearTimeout(t);
  }, [term]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchSongs(debounced, 30),
    enabled: debounced.length > 1,
  });

  const suggestions = ["Lo-fi", "Workout", "Indie", "Jazz", "Hip Hop", "Acoustic"];

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-6">
      <div className="relative max-w-xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Songs, artists, albums..."
          className="w-full pl-11 pr-4 py-3 rounded-full bg-input/30 border border-border focus:border-brand focus:outline-none transition"
        />
      </div>

      {!debounced && (
        <div>
          <h2 className="font-display text-xl font-bold mb-3">Try a mood</h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setTerm(s)}
                className="px-4 py-2 rounded-full glass text-sm hover:bg-accent transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
          ))}
        </div>
      )}

      {data && data.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-3">Results</h2>
          <div className="space-y-1">
            {data.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queue={data} />
            ))}
          </div>
        </div>
      )}

      {data && data.length === 0 && (
        <p className="text-muted-foreground">No results for "{debounced}"</p>
      )}
    </div>
  );
}
