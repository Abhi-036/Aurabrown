import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Music2, Headphones, Sparkles, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/stores/auth";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Aurabrown — Luxury Music Streaming" },
      {
        name: "description",
        content:
          "A premium music streaming experience cast in dark brown and gold. Stream, search and curate playlists with elegance.",
      },
      { property: "og:title", content: "Aurabrown — Luxury Music Streaming" },
      {
        property: "og:description",
        content: "Premium Spotify-style music streaming with a luxe dark-brown aesthetic.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate({ to: "/home", replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,oklch(0.72_0.09_65/0.3),transparent_50%),radial-gradient(circle_at_80%_70%,oklch(0.55_0.08_50/0.25),transparent_55%)]" />

      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand">
            <Music2 className="w-5 h-5 text-brand-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">Aurabrown</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            to="/auth"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="px-5 py-2 rounded-full bg-gradient-brand text-brand-foreground text-sm font-semibold shadow-brand hover:scale-105 transition"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 glass px-3 py-1 rounded-full text-xs text-brand mb-6">
            <Sparkles className="w-3 h-3" /> Premium sonic experience
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            Listen in <span className="text-gradient-brand">amber</span>.
            <br />
            Feel every note.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Aurabrown reimagines music streaming with a luxe dark-brown aesthetic, intuitive controls and
            intelligent recommendations.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="px-7 py-3 rounded-full bg-gradient-brand text-brand-foreground font-semibold shadow-brand hover:scale-105 transition"
            >
              Start listening free
            </Link>
            <Link
              to="/auth"
              search={{ mode: "demo" }}
              className="px-7 py-3 rounded-full glass font-semibold hover:bg-accent transition"
            >
              Try the demo
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            { icon: Headphones, title: "Studio-grade previews", body: "Lossless artwork, crisp 30-second previews from a global catalog." },
            { icon: Sparkles, title: "Curated for you", body: "Smart recommendations built from your listening history." },
            { icon: Smartphone, title: "Gesture aware", body: "Flip your phone face-down to pause — magic, no buttons required." },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand mb-4">
                <f.icon className="w-5 h-5 text-brand-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
