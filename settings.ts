import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  theme: "dark" | "light";
  gestureEnabled: boolean;
  setTheme: (t: "dark" | "light") => void;
  toggleTheme: () => void;
  setGestureEnabled: (v: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      gestureEnabled: true,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setGestureEnabled: (gestureEnabled) => set({ gestureEnabled }),
    }),
    { name: "aurabrown-settings" },
  ),
);
