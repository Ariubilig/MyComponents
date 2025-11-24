import { useEffect, useState } from "react";


export default function useTheme() {

  
  const getSystem = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem("theme") || "system";
  });

  // Apply theme whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applied =
      theme === "system" ? getSystem() : theme;

    document.documentElement.setAttribute("data-theme", applied);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // System theme auto-sync when theme="system"
  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      document.documentElement.setAttribute(
        "data-theme",
        mq.matches ? "dark" : "light"
      );
    };

    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [theme]);

  return {
    theme,
    setTheme, // you can call setTheme("light" | "dark" | "system")
    toggle: () =>
      setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

}