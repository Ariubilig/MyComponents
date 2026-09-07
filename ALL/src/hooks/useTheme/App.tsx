import "./theme.css";
import "./App.css";
import { useEffect, useState } from "react";
import useTheme from "./useTheme";
import type { Theme } from "./useTheme";

const THEMES: Theme[] = ["light", "dark", "system"];

const TOKENS = [
  "--color-bg",
  "--textDefault",
  "--textL",
  "--textM",
  "--textS",
  "--btn-bg",
  "--btn-text",
  "--btn-hover",
  "--link-color",
  "--link-hover",
  "--divider",
];

/**
 * Mirrors the `data-theme` attribute `useTheme` writes to `<html>`.
 *
 * A MutationObserver rather than a copy of the hook's own resolution logic:
 * the point of the readout is to show what actually landed on the element,
 * so re-deriving it here would report success even if the write were broken.
 */
function useAppliedTheme(): string | undefined {
  const [applied, setApplied] = useState(
    () => document.documentElement.dataset.theme,
  );

  useEffect(() => {
    const el = document.documentElement;
    const read = () => setApplied(el.dataset.theme);
    read();

    const observer = new MutationObserver(read);
    observer.observe(el, { attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return applied;
}

/**
 * Things worth checking here:
 *
 * - `toggle` from `system` resolves the OS value first, so the first press
 *   always lands on an explicit preference rather than a no-op.
 * - The choice survives a reload (localStorage) — reload on this route.
 * - On `system`, changing the OS appearance repaints live; on `light`/`dark`
 *   it must not, because the matchMedia listener is torn down.
 * - `data-theme` is written to `<html>`, so it persists across routes.
 */
export default function App() {
  const { theme, setTheme, toggle } = useTheme();
  const applied = useAppliedTheme();

  return (
    <div className="theme-demo">
      <h1>useTheme</h1>

      <p className="theme-demo__state">
        preference <code>{theme}</code> · applied <code>{applied}</code>
      </p>

      <div className="theme-demo__controls">
        <button onClick={toggle}>Toggle</button>
        {THEMES.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            aria-pressed={theme === t}
            className={theme === t ? "is-active" : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Every token, so a mistake in either block of `theme.css` is visible. */}
      <ul className="theme-demo__tokens">
        {TOKENS.map((token) => (
          <li key={token}>
            <span
              className="theme-demo__swatch"
              style={{ background: `var(${token})` }}
            />
            <code>{token}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
