import { createContext, VNode } from "preact";
import { useEffect, useState } from "preact/hooks";

export enum Theme {
  dark = "dark",
  light = "light",
}

export const ThemeContext = createContext(Theme.dark);
export const ThemeProvider = ({ children }: { children: VNode }) => {
  let initialTheme = Theme.light;
  if (typeof window !== "undefined") {
    initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.dark
      : Theme.light;
  }
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => {
    const darkThemeListener = (e) => e.matches && setTheme(Theme.dark);
    const lightThemeListener = (e) => e.matches && setTheme(Theme.light);
    const mdark = window.matchMedia("(prefers-color-scheme: dark)");
    const mlight = window.matchMedia("(prefers-color-scheme: light)");
    mdark.addEventListener("change", darkThemeListener);
    mlight.addEventListener("change", lightThemeListener);
    return () => {
      // cleanup event listeners
      mdark.removeEventListener("change", darkThemeListener);
      mlight.removeEventListener("change", lightThemeListener);
    };
  }, []);
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
