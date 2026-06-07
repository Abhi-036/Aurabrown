import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedRows, getTrending } from "@/lib/audius";
import { SongCard, SongCardSkeleton } from "@/components/SongCard";
import { useAuth } from "@/stores/auth";
import { useLibrary } from "@/stores/library";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/home")({
  head: () => ({ meta: [{ title: "Home — Aurabrown" }] }),
  component: Home,
});

function Home() {
  const user = useAuth((s) => s.user);
  const recents = useLibrary((s) => s.recents);
  const trending = useQuery({ queryKey: ["trending"], queryFn: getTrending });
  const featured = useQuery({ queryKey: ["featured"], queryFn: getFeaturedRows });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-hero rounded-2xl p-6 md:p-10 border border-border/60"
      >
        <p className="text-sm text-brand font-medium">{greeting}</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold mt-1">
          {user?.name?.split(" ")[0] ?? "Listener"}
        </h1>
        <p className="text-muted-foreground mt-2">Your daily mix is waiting.</p>
      </motion.div>

      {recents.length > 0 && (
        <Section title="Recently played">
          <Grid>
            {recents.slice(0, 6).map((s) => (
              <SongCard key={s.id} song={s} queue={recents} />
            ))}
          </Grid>
        </Section>
      )}

      <Section title="Trending now">
        {trending.isLoading ? (
          <Grid>
            {Array.from({ length: 6 }).map((_, i) => (
              <SongCardSkeleton key={i} />
            ))}
          </Grid>
        ) : (
          <Grid>
            {trending.data?.slice(0, 12).map((s) => (
              <SongCard key={s.id} song={s} queue={trending.data} />
            ))}
          </Grid>
        )}
      </Section>

      {featured.data?.map((row) => (
        <Section key={row.title} title={row.title}>
          <Grid>
            {row.songs.map((s) => (
              <SongCard key={s.id} song={s} queue={row.songs} />
            ))}
          </Grid>
        </Section>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {children}
    </div>
  );
}
