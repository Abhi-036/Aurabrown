import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/stores/auth";
import { Music2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Search = { mode?: "signin" | "signup" | "demo" };

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: (s.mode as Search["mode"]) ?? "signin",
  }),
  head: () => ({ meta: [{ title: "Sign in — Aurabrown" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const { user, login, signup, demoLogin } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(
    initialMode === "signup" ? "signup" : "signin",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialMode === "demo") {
      demoLogin();
      toast.success("Welcome to the Aurabrown demo");
      navigate({ to: "/home", replace: true });
    }
  }, [initialMode, demoLogin, navigate]);

  useEffect(() => {
    if (user) navigate({ to: "/home", replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") await signup(name || email.split("@")[0], email, password);
      else await login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/home", replace: true });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 shadow-brand"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand">
            <Music2 className="w-5 h-5 text-brand-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">Aurabrown</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-center">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-1">
          {mode === "signup" ? "Start your sonic journey" : "Sign in to continue listening"}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-input/30 border border-border focus:border-brand focus:outline-none transition"
            />
          )}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-input/30 border border-border focus:border-brand focus:outline-none transition"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={4}
            className="w-full px-4 py-3 rounded-lg bg-input/30 border border-border focus:border-brand focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-lg bg-gradient-brand text-brand-foreground font-semibold shadow-brand hover:scale-[1.02] transition disabled:opacity-50"
          >
            {busy ? "..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
        </div>
        <button
          onClick={() => {
            demoLogin();
            toast.success("Welcome to the Aurabrown demo");
            navigate({ to: "/home", replace: true });
          }}
          className="w-full py-3 rounded-lg glass font-semibold hover:bg-accent transition"
        >
          Continue as demo user
        </button>
        <p className="text-sm text-muted-foreground text-center mt-6">
          {mode === "signup" ? "Already have an account?" : "New to Aurabrown?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="text-brand font-semibold hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
