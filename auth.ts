import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email) => {
        set({
          user: {
            id: crypto.randomUUID(),
            name: email.split("@")[0],
            email,
          },
        });
      },
      signup: async (name, email) => {
        set({ user: { id: crypto.randomUUID(), name, email } });
      },
      demoLogin: () =>
        set({
          user: {
            id: "demo-user",
            name: "Demo Listener",
            email: "demo@aurabrown.fm",
            avatar: undefined,
          },
        }),
      logout: () => set({ user: null }),
      updateProfile: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    { name: "aurabrown-auth" },
  ),
);
