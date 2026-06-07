import { useEffect } from "react";
import { useSettings } from "@/stores/settings";

export function ThemeApplier() {
  const theme = useSettings((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [theme]);
  return null;
}
